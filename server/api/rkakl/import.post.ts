import { parseRkaklExcel } from "../utils/parserRkakl"
import { createMap } from "../utils/createMap"

import { db } from "@/server/database"

import { rkaklDetail } from "@/server/database/schema/rkakl_detail"
import { rkaklImportLog } from "@/server/database/schema/rkakl_import_log"

import { masterProgram } from "@/server/database/schema/master_program"
import { masterKegiatan } from "@/server/database/schema/master_kegiatan"
import { masterOutput } from "@/server/database/schema/master_output"
import { masterSuboutput } from "@/server/database/schema/master_suboutput"
import { masterKomponen } from "@/server/database/schema/master_komponen"
import { masterSubkomponen } from "@/server/database/schema/master_subkomponen"
import { masterAkun } from "@/server/database/schema/master_akun"

import { eq } from "drizzle-orm"

import fs from "fs"
import path from "path"
import { anggaranSuboutput } from "@/server/database/schema/anggaran_suboutput"
import { tahunAnggaran } from "@/server/database/schema/tahun_anggaran"

export default defineEventHandler(async (event) => {

  try {

    const form = await readMultipartFormData(event)

    const file = form?.find(f => f.name === "file")
    const tahunField = form?.find(f => f.name === "tahun")

    if (!file || !file.filename) {
      return { success:false, message:"File tidak ditemukan" }
    }

    const tahun = Number(tahunField?.data?.toString() || new Date().getFullYear())

    // Ambil id tahun_anggaran dari tabel tahun_anggaran
    const tahunAnggaranRow = await db.select().from(tahunAnggaran).where(eq(tahunAnggaran.tahun, tahun));
    const tahunAnggaranId = tahunAnggaranRow[0]?.id || 0;
    const satkerField = form?.find(f => f.name === "satker")
    const satkerId = satkerField ? Number(satkerField.data?.toString()) : null

    const uploadsDir = path.join(process.cwd(),"uploads")

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir)
    }

    const filePath = path.join(uploadsDir,file.filename)

    fs.writeFileSync(filePath,file.data)


  // PARSE EXCEL
  const rows = await parseRkaklExcel(filePath, { debug: true })

    // Create import log entry and get importId
    const importLog = await db.insert(rkaklImportLog)
      .values({
        fileName: file.filename,
        tahun,
        totalRow: rows.length,
        successRow: 0,
        failedRow: 0,
        uploadedBy: 1, // TODO: replace with actual user ID if available
        uploadedAt: new Date(),
      })
      .returning();
    const importId = importLog[0]?.id;
    if (!importId) {
      return { success: false, message: 'Gagal membuat log import.' };
    }



    // Fetch master data for mapping
    const programs = await db.select().from(masterProgram);
    const kegiatans = await db.select().from(masterKegiatan);
    const outputs = await db.select().from(masterOutput);
    const suboutputs = await db.select().from(masterSuboutput);
    const komponens = await db.select().from(masterKomponen);
    const subkomponens = await db.select().from(masterSubkomponen);
    const akuns = await db.select().from(masterAkun);

    // Inisialisasi mapping master
    const maps = {
      program: createMap(programs,"kode_program"),
      kegiatan: createMap(kegiatans,"kode_kegiatan"),
      output: createMap(outputs,"kode_output"),
      suboutput: createMap(suboutputs,"kode_suboutput"),
      komponen: createMap(komponens,"kode_komponen"),
      subkomponen: createMap(subkomponens,"kode_subkomponen"),
      akun: createMap(akuns,"kode_akun")
    };
    // Inisialisasi cache program

    const programCache = new Map();
    // Data to be inserted in batch
    const dataInsert: any[] = [];
    // Error logs
    const errors: any[] = [];
    // Untuk batch insert anggaranSuboutput unik
    const suboutputBudgets = new Map<string, { suboutput_id: number; satker_id: number; unit_id: number; tahun_anggaran_id: number; anggaran: string }>();

    for (const r of rows) {
      let programId = maps.program[r.kode_program]
      // Cek cache programId
      if (!programCache.has(r.kode_program)) {
        const program = (await db.select().from(masterProgram).where(eq(masterProgram.kode_program, r.kode_program)))[0];
        if (program) {
          programCache.set(r.kode_program, program.id);
          programId = program.id;
        }
      } else {
        programId = programCache.get(r.kode_program);
      }
      const kegiatanId = maps.kegiatan[r.kode_kegiatan]
      const outputId = maps.output[r.kode_output]
      const suboutputId = maps.suboutput[r.kode_suboutput]
      const komponenId = maps.komponen[r.kode_komponen]
      const subkomponenId = maps.subkomponen[r.kode_subkomponen]
      const akunId = maps.akun[r.kode_akun]


      // ── AUTO-INSERT MASTER PROGRAM ──
      let programIdFixed = programId
      if (!programIdFixed && r.kode_program) {
        const values: any = {
          kode_program: r.kode_program,
          nama_program: r.nama_program || r.kode_program,
          created_at: new Date(),
          updated_at: new Date(),
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterProgram)
          .values(values)
          .onConflictDoNothing()
          .returning();
        programIdFixed = inserted[0]?.id || (await db.select().from(masterProgram).where(eq(masterProgram.kode_program, r.kode_program)))[0]?.id;
        maps.program[r.kode_program] = programIdFixed;
      }

      // ── AUTO-INSERT MASTER KEGIATAN ──
      let kegiatanIdFixed = kegiatanId
      if (!kegiatanIdFixed && r.kode_kegiatan) {
        const values: any = {
          kode_kegiatan: r.kode_kegiatan,
          nama_kegiatan: r.nama_kegiatan || r.kode_kegiatan,
          program_id: programIdFixed,
          created_at: new Date(),
          updated_at: new Date(),
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterKegiatan)
          .values(values)
          .onConflictDoNothing()
          .returning();
        kegiatanIdFixed = inserted[0]?.id || (await db.select().from(masterKegiatan).where(eq(masterKegiatan.kode_kegiatan, r.kode_kegiatan)))[0]?.id;
        maps.kegiatan[r.kode_kegiatan] = kegiatanIdFixed;
      }

      // ── AUTO-INSERT MASTER OUTPUT ──
      let outputIdFixed = outputId
      if (!outputIdFixed && r.kode_output) {
        const values: any = {
          kode_output: r.kode_output,
          nama_output: r.nama_output || r.kode_output,
          kegiatan_id: kegiatanIdFixed,
          created_at: new Date(),
          updated_at: new Date(),
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterOutput)
          .values(values)
          .onConflictDoNothing()
          .returning();
        outputIdFixed = inserted[0]?.id || (await db.select().from(masterOutput).where(eq(masterOutput.kode_output, r.kode_output)))[0]?.id;
        maps.output[r.kode_output] = outputIdFixed;
      }

      // ── AUTO-INSERT MASTER SUBOUTPUT ──
      let suboutputIdFixed = suboutputId
      if (!suboutputIdFixed && r.kode_suboutput) {
        const values: any = {
          kode_suboutput: r.kode_suboutput,
          nama_suboutput: r.nama_suboutput || r.kode_suboutput,
          output_id: outputIdFixed,
        };
        if (r.isHeader) values.total = r.headerTotal != null ? String(r.headerTotal) : (r.total != null ? String(r.total) : "0");
        const inserted = await db.insert(masterSuboutput)
          .values(values)
          .onConflictDoNothing()
          .returning();
        suboutputIdFixed = inserted[0]?.id || (await db.select().from(masterSuboutput).where(eq(masterSuboutput.kode_suboutput, r.kode_suboutput)))[0]?.id;
        maps.suboutput[r.kode_suboutput] = suboutputIdFixed;
      }

      // ── AUTO-INSERT MASTER KOMPONEN ──
      let komponenIdFixed = komponenId
      if (!komponenIdFixed && r.kode_komponen) {
        const values: any = {
          kode_komponen: r.kode_komponen,
          nama_komponen: r.nama_komponen || r.kode_komponen,
          suboutput_id: suboutputIdFixed,
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterKomponen)
          .values(values)
          .onConflictDoNothing()
          .returning();
        komponenIdFixed = inserted[0]?.id || (await db.select().from(masterKomponen).where(eq(masterKomponen.kode_komponen, r.kode_komponen)))[0]?.id;
        maps.komponen[r.kode_komponen] = komponenIdFixed;
      }

      // ── AUTO-INSERT MASTER SUBKOMPONEN ──
      let subkomponenIdFixed = subkomponenId
      if (!subkomponenIdFixed && r.kode_subkomponen) {
        const values: any = {
          kode_subkomponen: r.kode_subkomponen,
          nama_subkomponen: r.nama_subkomponen || r.kode_subkomponen,
          komponen_id: komponenIdFixed,
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterSubkomponen)
          .values(values)
          .onConflictDoNothing()
          .returning();
        subkomponenIdFixed = inserted[0]?.id || (await db.select().from(masterSubkomponen).where(eq(masterSubkomponen.kode_subkomponen, r.kode_subkomponen)))[0]?.id;
        maps.subkomponen[r.kode_subkomponen] = subkomponenIdFixed;
      }

      // ── AUTO-INSERT MASTER AKUN ──
      let akunIdFixed = akunId
      if (!akunIdFixed && r.kode_akun) {
        const values: any = {
          kode_akun: r.kode_akun,
          nama_akun: r.nama_akun || r.kode_akun,
          subkomponen_id: subkomponenIdFixed || null,
        };
        if (r.isHeader) values.total = r.total != null ? String(r.total) : "0";
        const inserted = await db.insert(masterAkun)
          .values(values)
          .onConflictDoNothing()
          .returning();
        akunIdFixed = inserted[0]?.id || (await db.select().from(masterAkun).where(eq(masterAkun.kode_akun, r.kode_akun)))[0]?.id;
        maps.akun[r.kode_akun] = akunIdFixed;
      }


      // ── VALIDASI MASTER HIERARCHY (suboutput optional, fallback ke output) ──
      const missingMasters = [];
      if (!programIdFixed) missingMasters.push('program');
      if (!kegiatanIdFixed) missingMasters.push('kegiatan');
      if (!outputIdFixed) missingMasters.push('output');
      // suboutput tidak wajib!

      // Fallback: jika suboutputIdFixed null, gunakan outputIdFixed (atau null jika tidak ada)
      let suboutputIdFinal = suboutputIdFixed || null;
      if (!suboutputIdFinal && outputIdFixed) {
        suboutputIdFinal = null; // Tidak force ke output, hanya biarkan null
        // Jika ingin fallback ke output, bisa: suboutputIdFinal = outputIdFixed;
        // Tapi biasanya suboutput_id di DB memang boleh null
      }

      if (missingMasters.length > 0) {
        errors.push({
          rowNumber: r.rowNumber,
          message: `Master hierarchy tidak lengkap: ${missingMasters.join(', ')}`,
          codes: {
            program: r.kode_program,
            kegiatan: r.kode_kegiatan,
            output: r.kode_output,
            suboutput: r.kode_suboutput
          }
        });
        continue; // Skip insert detail
      }

      // ── PUSH KE DATA INSERT (SEMUA MASTER ADA) ──
      dataInsert.push({
        id: undefined, // auto increment
        sub_komponen_id: subkomponenIdFixed || null,
        akun_id: akunIdFixed || null,
        volume: r.volume,
        satuan: r.satuan,
        harga_satuan: r.harga_satuan,
        jumlah: r.jumlah,
        tahun,
        created_at: new Date(),
        program_id: programIdFixed,
        kegiatan_id: kegiatanIdFixed,
        output_id: outputIdFixed,
        suboutput_id: suboutputIdFinal, // gunakan hasil fallback
        komponen_id: komponenIdFixed || null,
        import_id: importId,
        status: "aktif",
        updated_at: new Date(),
        satker_id: satkerId,
        uraian: r.uraian,
      });

      // Kumpulkan unique suboutput-satker-tahun
      if (suboutputIdFixed && !suboutputBudgets.has(`${suboutputIdFixed}_${satkerId}`)) {
        suboutputBudgets.set(`${suboutputIdFixed}_${satkerId}`, {
          suboutput_id: suboutputIdFixed,
          satker_id: satkerId != null ? Number(satkerId) : 0,
          unit_id: 0,
          tahun_anggaran_id: tahunAnggaranId,
          anggaran: r.total != null ? String(r.total) : "0"
        });
      }

    }
    // ...existing code...


    // INSERT BATCH
    const batchSize = 500
    let success = 0
    let result: any[] = []
    for (let i=0;i<dataInsert.length;i+=batchSize){
      const batch = dataInsert.slice(i,i+batchSize)
      const inserted = await db.insert(rkaklDetail)
        .values(batch)
        .returning()
      result = result.concat(inserted)
      success += inserted.length
    }


    // Batch insert anggaranSuboutput unik sekali di akhir
    if (suboutputBudgets.size > 0) {
      await db.insert(anggaranSuboutput)
        .values(Array.from(suboutputBudgets.values()))
        .onConflictDoNothing();
    }

    console.log('✅ Result:', result)
    console.log('❌ Errors:', errors)

    await db.update(rkaklImportLog)
      .set({
        successRow:success,
        failedRow:rows.length-success
      })
      .where(eq(rkaklImportLog.id,importId))

    return {
      success:true,
      inserted:success,
      total:rows.length,
      errors
    }

  } catch(err){

    console.error(err)

    return {
      success:false,
      error:err
    }

  }

})