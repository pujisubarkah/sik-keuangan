import { parseRkaklExcel } from "./server/api/utils/parserRkakl";
import type { ParsedRow } from "./server/api/utils/parserRkakl";
import path from "path";

async function runTest() {
  console.log("🚀 Starting RKAKL Parser Test...\n");
  
  const filePath = path.resolve(__dirname, "public", "RINCIAN KERTAS KERJA SATKER (12).xlsx");
  
  try {
    // Parse dengan debug mode
    const result = await parseRkaklExcel(filePath, { debug: true });
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 HASIL PARSING");
    console.log("=".repeat(60));
    console.log(`✅ Total rows parsed: ${result.length}`);
    
    // ─────────────────────────────────
    // TEST 1: Master Records
    // ─────────────────────────────────
    console.log("\n🔍 TEST 1: Master Hierarchy Records");
    console.log("-".repeat(40));
    
    const masters = result.filter((r: ParsedRow) => r.isHeader === true);
    console.log(`📋 Master records found: ${masters.length}`);
    
    // Cek Program 086.01.CO
    const program = masters.find((r: ParsedRow) => r.kode_program === "086.01.CO");
    console.log(`\n📌 Program 086.01.CO:`);
    console.log(`   Nama: ${program?.nama_program}`);
    console.log(`   Total Excel: Rp 11.498.813.000`);
    console.log(`   Total Parser: Rp ${program?.total?.toLocaleString("id-ID")}`);
    console.log(`   ✅ Match: ${program?.total === 11498813000 ? "YES" : "NO ❌"}`);
    
    // Cek Kegiatan 7913
    const kegiatan = masters.find((r: ParsedRow) => r.kode_kegiatan === "7913");
    console.log(`\n📌 Kegiatan 7913:`);
    console.log(`   Nama: ${kegiatan?.nama_kegiatan?.substring(0, 50)}...`);
    console.log(`   Total Excel: Rp 1.347.726.000`);
    console.log(`   Total Parser: Rp ${kegiatan?.total?.toLocaleString("id-ID")}`);
    console.log(`   ✅ Match: ${kegiatan?.total === 1347726000 ? "YES" : "NO ❌"}`);
    
    // Cek Output 7913.ADI
    const output = masters.find((r: ParsedRow) => r.kode_output === "7913.ADI");
    console.log(`\n📌 Output 7913.ADI:`);
    console.log(`   Nama: ${output?.nama_output}`);
    console.log(`   Total Excel: Rp 1.076.950.000`);
    console.log(`   Total Parser: Rp ${output?.total?.toLocaleString("id-ID")}`);
    console.log(`   ✅ Match: ${output?.total === 1076950000 ? "YES" : "NO ❌"}`);
    
    // ─────────────────────────────────
    // TEST 2: Detail Records
    // ─────────────────────────────────
    console.log("\n🔍 TEST 2: Detail Belanja Records");
    console.log("-".repeat(40));
    
    const details = result.filter((r: ParsedRow) => !r.isHeader);
    console.log(`📋 Detail records found: ${details.length}`);
    
    // Sample: Cek detail dengan akun 521211
    const sampleDetail = details.find((r: ParsedRow) => r.kode_akun === "521211");
    if (sampleDetail) {
      console.log(`\n📌 Sample Detail (Akun 521211):`);
      console.log(`   Uraian: ${sampleDetail.uraian}`);
      console.log(`   Volume: ${sampleDetail.volume} ${sampleDetail.satuan}`);
      console.log(`   Harga: Rp ${sampleDetail.harga_satuan?.toLocaleString("id-ID")}`);
      console.log(`   Total: Rp ${sampleDetail.total?.toLocaleString("id-ID")}`);
    }
    
    // ─────────────────────────────────
    // TEST 3: Agregasi Total
    // ─────────────────────────────────
    console.log("\n🔍 TEST 3: Agregasi Nilai");
    console.log("-".repeat(40));
    
    const totalDetail = details.reduce((sum, r) => sum + r.total, 0);
    const totalMaster = masters.reduce((sum, r) => sum + r.total, 0);
    
    console.log(`💰 Total Detail Belanja: Rp ${totalDetail.toLocaleString("id-ID")}`);
    console.log(`💰 Total Master Records: Rp ${totalMaster.toLocaleString("id-ID")}`);
    
    // ─────────────────────────────────
    // TEST 4: Validasi Struktur
    // ─────────────────────────────────
    console.log("\n🔍 TEST 4: Validasi Struktur Data");
    console.log("-".repeat(40));
    
    const errors: string[] = [];
    
    // Cek semua detail punya hierarchy lengkap
    details.forEach((r: ParsedRow) => {
      if (!r.kode_program) errors.push(`Row ${r.rowNumber}: Missing program`);
      if (!r.kode_kegiatan) errors.push(`Row ${r.rowNumber}: Missing kegiatan`);
      if (!r.kode_output) errors.push(`Row ${r.rowNumber}: Missing output`);
      if (!r.kode_komponen) errors.push(`Row ${r.rowNumber}: Missing komponen`);
      if (!r.kode_akun) errors.push(`Row ${r.rowNumber}: Missing akun`);
    });
    
    if (errors.length === 0) {
      console.log(`✅ Semua detail memiliki hierarchy lengkap`);
    } else {
      console.log(`❌ Ditemukan ${errors.length} error:`);
      errors.slice(0, 5).forEach(e => console.log(`   - ${e}`));
    }
    
    // ─────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────
    console.log("\n" + "=".repeat(60));
    console.log("🎯 SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Parsing: SUCCESS`);
    console.log(`✅ Master records: ${masters.length}`);
    console.log(`✅ Detail records: ${details.length}`);
    console.log(`✅ Struktur valid: ${errors.length === 0 ? "YES" : "NO"}`);
    
    // Export ke JSON untuk inspeksi manual
    // await Bun.write("output-parsed.json", JSON.stringify(result, null, 2));
    // console.log(`💾 Output saved to output-parsed.json`);
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    console.error(error.stack);
  }
}

runTest();
