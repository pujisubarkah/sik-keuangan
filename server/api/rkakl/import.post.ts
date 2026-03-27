// server/api/import-rkakl.post.ts
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
import { anggaranSuboutput } from "@/server/database/schema/anggaran_suboutput"
import { tahunAnggaran } from "@/server/database/schema/tahun_anggaran"
import { eq, and } from "drizzle-orm"
import fs from "fs"
import path from "path"

export default defineEventHandler(async (event) => {
  let importId: number | undefined = undefined;
  let rows: any[] | undefined = undefined;
  let filePath: string | undefined = undefined;
  try {
    const form = await readMultipartFormData(event)
    const file = form?.find(f => f.name === "file")
    const tahunField = form?.find(f => f.name === "tahun")
    const satkerField = form?.find(f => f.name === "satker")

    if (!file || !file.filename) {
      return { success: false, message: "File tidak ditemukan" }
    }

    const tahun = Number(tahunField?.data?.toString() || new Date().getFullYear())
    const satkerId = satkerField ? Number(satkerField.data?.toString()) : null

    // Setup uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
    filePath = path.join(uploadsDir, file.filename)
    fs.writeFileSync(filePath, file.data)

    // Parse Excel
    const rowsRaw = await parseRkaklExcel(filePath, { debug: true })
    rows = rowsRaw.filter(r => 
      r.kode_suboutput || r.kode_komponen || r.kode_subkomponen || r.kode_akun
    )

    // Create import log
    const importLog = await db.insert(rkaklImportLog)
      .values({
        fileName: file.filename,
        tahun,
        totalRow: rows.length,
        successRow: 0,
        failedRow: 0,
        uploadedBy: 1, // TODO: replace with actual user
        uploadedAt: new Date(),
      })
      .returning()
    
    const importId = importLog[0]?.id
    if (!importId) {
      return { success: false, message: 'Gagal membuat log import.' }
    }

    // ─────────────────────────────────────────────────────────────
    // PHASE 0: Fetch & Build Initial Maps
    // ─────────────────────────────────────────────────────────────
    const [programs, kegiatans, outputs, suboutputs, komponens, subkomponens, akuns] = await Promise.all([
      db.select().from(masterProgram),
      db.select().from(masterKegiatan),
      db.select().from(masterOutput),
      db.select().from(masterSuboutput),
      db.select().from(masterKomponen),
      db.select().from(masterSubkomponen),
      db.select().from(masterAkun),
    ])

    // Simple maps by code
    const maps = {
      program: createMap(programs, "kode_program"),
      kegiatan: createMap(kegiatans, "kode_kegiatan"),
      output: createMap(outputs, "kode_output"),
      suboutput: createMap(suboutputs, "kode_suboutput"),
      komponen: createMap(komponens, "kode_komponen"),
      subkomponen: createMap(subkomponens, "kode_subkomponen"),
      akun: createMap(akuns, "kode_akun")
    }

    // Composite maps for hierarchical validation
    const komponenMap = new Map<string, number>() // `${kode_komponen}_${suboutput_id}` → id
    const subkomponenMap = new Map<string, number>() // `${kode_subkomponen}_${komponen_id}` → id
    const akunMap = new Map<string, number>() // `${kode_akun}_${subkomponen_id}` → id

    for (const k of komponens) {
      if (k.kode_komponen && k.suboutput_id) {
        komponenMap.set(`${k.kode_komponen}_${k.suboutput_id}`, k.id)
      }
    }
    for (const s of subkomponens) {
      if (s.kode_subkomponen && s.komponen_id) {
        subkomponenMap.set(`${s.kode_subkomponen}_${s.komponen_id}`, s.id)
      }
    }
    for (const a of akuns) {
      if (a.kode_akun && a.subkomponen_id) {
        akunMap.set(`${a.kode_akun}_${a.subkomponen_id}`, a.id)
      }
    }

    // Cache for program lookups
    const programCache = new Map<string, number>()

    // Data containers
    const dataInsert: any[] = []
    const errors: any[] = []
    const suboutputBudgets = new Map<string, {
      suboutput_id: number
      satker_id: number
      unit_id: number
      tahun_anggaran_id: number
      anggaran: string
    }>()

    // Get tahun_anggaran_id
    const tahunAnggaranRow = await db.select().from(tahunAnggaran)
      .where(eq(tahunAnggaran.tahun, tahun))
    const tahunAnggaranId = tahunAnggaranRow[0]?.id || 0

    // ─────────────────────────────────────────────────────────────
    // PHASE 1: Auto-Insert Master Data & Build Data for Insert
    // ─────────────────────────────────────────────────────────────
    for (const r of rows) {
      // Skip rows without any meaningful code
      if (!r.kode_program && !r.kode_kegiatan && !r.kode_output && 
          !r.kode_suboutput && !r.kode_komponen && !r.kode_akun) {
        continue
      }

      // ── Resolve Program ──
      let programId = maps.program[r.kode_program]
      if (!programId && r.kode_program) {
        if (!programCache.has(r.kode_program)) {
          const found = await db.select().from(masterProgram)
            .where(eq(masterProgram.kode_program, r.kode_program)).limit(1)
          if (found[0]) {
            programCache.set(r.kode_program, found[0].id)
            programId = found[0].id
          }
        } else {
          programId = programCache.get(r.kode_program)!
        }
      }
      if (!programId && r.kode_program) {
        const inserted = await db.insert(masterProgram)
          .values({
            kode_program: r.kode_program,
            nama_program: r.nama_program || r.kode_program,
            created_at: new Date(),
            updated_at: new Date(),
            ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
          })
          .onConflictDoNothing()
          .returning()
        programId = inserted[0]?.id || 
          (await db.select().from(masterProgram)
            .where(eq(masterProgram.kode_program, r.kode_program)).limit(1))[0]?.id
        if (programId) {
          maps.program[r.kode_program] = programId
          programCache.set(r.kode_program, programId)
        }
      }

      // ── Resolve Kegiatan ──
      let kegiatanId = maps.kegiatan[r.kode_kegiatan]
      if (!kegiatanId && r.kode_kegiatan) {
        const inserted = await db.insert(masterKegiatan)
          .values({
            kode_kegiatan: r.kode_kegiatan,
            nama_kegiatan: r.nama_kegiatan || r.kode_kegiatan,
            program_id: programId || null,
            created_at: new Date(),
            updated_at: new Date(),
            ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
          })
          .onConflictDoNothing()
          .returning()
        kegiatanId = inserted[0]?.id || 
          (await db.select().from(masterKegiatan)
            .where(eq(masterKegiatan.kode_kegiatan, r.kode_kegiatan)).limit(1))[0]?.id
        if (kegiatanId) maps.kegiatan[r.kode_kegiatan] = kegiatanId
      }

      // ── Resolve Output ──
      let outputId = maps.output[r.kode_output]
      if (!outputId && r.kode_output) {
        const inserted = await db.insert(masterOutput)
          .values({
            kode_output: r.kode_output,
            nama_output: r.nama_output || r.kode_output,
            kegiatan_id: kegiatanId || null,
            created_at: new Date(),
            updated_at: new Date(),
            satker_id: satkerId,
            ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
          })
          .onConflictDoNothing()
          .returning()
        outputId = inserted[0]?.id || 
          (await db.select().from(masterOutput)
            .where(eq(masterOutput.kode_output, r.kode_output)).limit(1))[0]?.id
        if (outputId) maps.output[r.kode_output] = outputId
      }

      // ── Resolve Suboutput ──
      let suboutputId = maps.suboutput[r.kode_suboutput]
      if (!suboutputId && r.kode_suboutput) {
        const inserted = await db.insert(masterSuboutput)
          .values({
            kode_suboutput: r.kode_suboutput,
            nama_suboutput: r.nama_suboutput || r.kode_suboutput,
            output_id: outputId || null,
            ...(r.isHeader && { total: r.headerTotal != null ? String(r.headerTotal) : (r.total != null ? String(r.total) : "0") })
          })
          .onConflictDoNothing()
          .returning()
        suboutputId = inserted[0]?.id || 
          (await db.select().from(masterSuboutput)
            .where(eq(masterSuboutput.kode_suboutput, r.kode_suboutput)).limit(1))[0]?.id
        if (suboutputId) maps.suboutput[r.kode_suboutput] = suboutputId
      }

      // ── Resolve Komponen (child of Suboutput) ──
      let komponenId = null
      if (r.kode_komponen && suboutputId) {
        // Try composite map first
        komponenId = komponenMap.get(`${r.kode_komponen}_${suboutputId}`)
        
        if (!komponenId) {
          const inserted = await db.insert(masterKomponen)
            .values({
              kode_komponen: r.kode_komponen,
              nama_komponen: r.nama_komponen || r.kode_komponen,
              suboutput_id: suboutputId,
              ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
            })
            .onConflictDoNothing()
            .returning()
          komponenId = inserted[0]?.id || 
            (await db.select().from(masterKomponen)
              .where(and(
                eq(masterKomponen.kode_komponen, r.kode_komponen),
                eq(masterKomponen.suboutput_id, suboutputId)
              )).limit(1))[0]?.id
          
          if (komponenId) {
            // ✅ CRITICAL: Update composite map after insert
            komponenMap.set(`${r.kode_komponen}_${suboutputId}`, komponenId)
            maps.komponen[r.kode_komponen] = komponenId // fallback simple map
          }
        }
      }

      // ── Resolve Subkomponen (child of Komponen) ──
      let subkomponenId = null
      if (r.kode_subkomponen && komponenId) {
        subkomponenId = subkomponenMap.get(`${r.kode_subkomponen}_${komponenId}`)
        
        if (!subkomponenId) {
          const inserted = await db.insert(masterSubkomponen)
            .values({
              kode_subkomponen: r.kode_subkomponen,
              nama_subkomponen: r.nama_subkomponen || r.kode_subkomponen,
              komponen_id: komponenId,
              ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
            })
            .onConflictDoNothing()
            .returning()
          subkomponenId = inserted[0]?.id || 
            (await db.select().from(masterSubkomponen)
              .where(and(
                eq(masterSubkomponen.kode_subkomponen, r.kode_subkomponen),
                eq(masterSubkomponen.komponen_id, komponenId)
              )).limit(1))[0]?.id
          
          if (subkomponenId) {
            // ✅ CRITICAL: Update composite map after insert
            subkomponenMap.set(`${r.kode_subkomponen}_${komponenId}`, subkomponenId)
            maps.subkomponen[r.kode_subkomponen] = subkomponenId
          }
        }
      }

      // ── AUTO-INSERT MASTER AKUN ──
      let akunId = null
      if (r.kode_akun) {
        // Akun bisa langsung di bawah komponen (tanpa subkomponen)
        const inserted = await db.insert(masterAkun)
          .values({
            kode_akun: r.kode_akun,
            nama_akun: r.nama_akun || r.kode_akun,
            subkomponen_id: subkomponenId || null, // ✅ Boleh null
            ...(r.isHeader && { total: r.total != null ? String(r.total) : "0" })
          })
          .onConflictDoNothing()
          .returning()
        akunId = inserted[0]?.id || 
          (await db.select().from(masterAkun)
            .where(eq(masterAkun.kode_akun, r.kode_akun)).limit(1))[0]?.id
        if (akunId) {
          maps.akun[r.kode_akun] = akunId
          if (subkomponenId) {
            akunMap.set(`${r.kode_akun}_${subkomponenId}`, akunId)
          }
        }
      }

      // ── Validation: Required hierarchy must exist ──
      const missingMasters = []
      if (r.kode_program && !programId) missingMasters.push('program')
      if (r.kode_kegiatan && !kegiatanId) missingMasters.push('kegiatan')
      if (r.kode_output && !outputId) missingMasters.push('output')
      // suboutput is optional, komponen requires suboutput, etc.

      if (missingMasters.length > 0) {
        errors.push({
          rowNumber: r.rowNumber,
          message: `Master hierarchy tidak lengkap: ${missingMasters.join(', ')}`,
          codes: { program: r.kode_program, kegiatan: r.kode_kegiatan, output: r.kode_output }
        })
        continue
      }

      // ── Push to insert batch ──
      dataInsert.push({
        sub_komponen_id: subkomponenId || null,
        akun_id: akunId || null,
        volume: r.volume,
        satuan: r.satuan,
        harga_satuan: r.harga_satuan,
        jumlah: r.jumlah,
        tahun,
        created_at: new Date(),
        program_id: programId || null,
        kegiatan_id: kegiatanId || null,
        output_id: outputId || null,
        suboutput_id: suboutputId || null, // nullable per schema
        komponen_id: komponenId || null,
        import_id: importId,
        status: "aktif",
        updated_at: new Date(),
        satker_id: satkerId,
        uraian: r.uraian,
      })

      // Collect unique suboutput budgets
      if (suboutputId && satkerId) {
        const key = `${suboutputId}_${satkerId}`
        if (!suboutputBudgets.has(key)) {
          suboutputBudgets.set(key, {
            suboutput_id: suboutputId,
            satker_id: satkerId,
            unit_id: 0,
            tahun_anggaran_id: tahunAnggaranId,
            anggaran: r.total != null ? String(r.total) : "0"
          })
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // PHASE 2: Post-Insert Validation (Composite Key Consistency)
    // ─────────────────────────────────────────────────────────────
    const mappingErrors: any[] = []
    
    for (const r of rows) {
      if (!r.kode_akun) continue // Skip header/summary rows

      const suboutputId = r.kode_suboutput ? maps.suboutput[r.kode_suboutput] : null
      const komponenId = (r.kode_komponen && suboutputId) 
        ? komponenMap.get(`${r.kode_komponen}_${suboutputId}`) || maps.komponen[r.kode_komponen]
        : null
      const subkomponenId = (r.kode_subkomponen && komponenId)
        ? subkomponenMap.get(`${r.kode_subkomponen}_${komponenId}`) || maps.subkomponen[r.kode_subkomponen]
        : null
      const akunId = (r.kode_akun && subkomponenId)
        ? akunMap.get(`${r.kode_akun}_${subkomponenId}`) || maps.akun[r.kode_akun]
        : null

      if (r.kode_suboutput && !suboutputId) {
        mappingErrors.push({ rowNumber: r.rowNumber, type: 'suboutput', kode: r.kode_suboutput, message: 'Suboutput tidak ditemukan' })
      }
      if (r.kode_komponen && !komponenId) {
        mappingErrors.push({ rowNumber: r.rowNumber, type: 'komponen', kode: r.kode_komponen, message: 'Komponen tidak ditemukan untuk suboutput ini' })
      }
      if (r.kode_subkomponen && !subkomponenId) {
        mappingErrors.push({ rowNumber: r.rowNumber, type: 'subkomponen', kode: r.kode_subkomponen, message: 'Subkomponen tidak ditemukan untuk komponen ini' })
      }
      if (r.kode_akun && !akunId) {
        mappingErrors.push({ rowNumber: r.rowNumber, type: 'akun', kode: r.kode_akun, message: 'Akun tidak ditemukan untuk subkomponen ini' })
      }
    }

    if (mappingErrors.length > 0) {
      await db.update(rkaklImportLog)
        .set({ failedRow: mappingErrors.length })
        .where(eq(rkaklImportLog.id, importId))
      
      return {
        success: false,
        message: 'Terdapat mapping master yang tidak konsisten',
        mappingErrors: mappingErrors.slice(0, 50), // Limit errors sent to frontend
        totalErrors: mappingErrors.length
      }
    }

    // ─────────────────────────────────────────────────────────────
    // PHASE 3: Batch Insert Details
    // ─────────────────────────────────────────────────────────────
    const batchSize = 500
    let successCount = 0
    
    for (let i = 0; i < dataInsert.length; i += batchSize) {
      const batch = dataInsert.slice(i, i + batchSize)
      if (batch.length === 0) continue
      
      const inserted = await db.insert(rkaklDetail)
        .values(batch)
        .returning()
      successCount += inserted.length
    }

    // Insert unique suboutput budgets
    if (suboutputBudgets.size > 0) {
      await db.insert(anggaranSuboutput)
        .values(Array.from(suboutputBudgets.values()))
        .onConflictDoNothing()
    }

    // Update import log
    await db.update(rkaklImportLog)
      .set({
        successRow: successCount,
        failedRow: rows.length - successCount
      })
      .where(eq(rkaklImportLog.id, importId))

    // Safe cleanup uploaded file with retry (fixes EBUSY Windows lock)

    const safeUnlink = async (filePath: string, maxRetries = 10): Promise<boolean> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log(`✅ File cleanup success: ${filePath} (attempt ${attempt})`)
            return true
          }
          return true
        } catch (unlinkErr: any) {
          console.warn(`⚠️ File cleanup attempt ${attempt}/${maxRetries} failed: ${unlinkErr.message} (${filePath})`)
          if (attempt === maxRetries) {
            console.error(`❌ Final cleanup failed after ${maxRetries} attempts: ${filePath}`)
            return false
          }
          // Exponential backoff: 100ms → 900ms
          await new Promise(resolve => setTimeout(resolve, attempt * 100))
        }
      }
      return false
    }

    const cleanupSuccess = await safeUnlink(filePath)
    if (!cleanupSuccess) {
      console.warn('⚠️ Temporary upload file may remain: ', filePath)
    }

    return {
      success: true,
      inserted: successCount,
      total: rows.length,
      errors: errors.length > 0 ? errors.slice(0, 20) : [],
      importId,
      cleanupWarning: !cleanupSuccess ? 'Temporary file may remain locked' : undefined
    }

  } catch (err: any) {
    console.error('❌ Import error:', err)
    
    // Safe cleanup even on error (scoped function)
    const safeUnlinkError = (filePath: string): boolean => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`✅ Error cleanup success: ${filePath}`)
          return true
        }
        return true
      } catch {
        return false
      }
    }
    
    if (typeof filePath !== 'undefined' && filePath && fs.existsSync(filePath)) {
      safeUnlinkError(filePath)
    }
    
    // Update log with error if importId exists
    if (importId) {
      await db.update(rkaklImportLog)
        .set({ failedRow: rows?.length || 0 })
        .where(eq(rkaklImportLog.id, importId))
    }

    return {
      success: false,
      message: err.message || 'Terjadi kesalahan saat import',
      error: process.env.NODE_ENV === 'development' ? err : undefined
    }
  }
})
