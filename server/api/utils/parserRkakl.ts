// utils/parserRkakl.ts
import ExcelJS from "exceljs";

// ─────────────────────────────────
// TIPE DATA
// ─────────────────────────────────
interface HierarchyState {
  program: string | null;
  program_nama: string | null;
  kegiatan: string | null;
  kegiatan_nama: string | null;
  output: string | null;
  output_nama: string | null;
  suboutput: string | null;
  suboutput_nama: string | null;
  komponen: string | null;
  komponen_nama: string | null;
  subkomponen: string | null;
  subkomponen_nama: string | null;
  akun: string | null;
  akun_nama: string | null;
}

export interface ParsedRow {
  kode_program: string;
  nama_program: string;
  kode_kegiatan: string;
  nama_kegiatan: string;
  kode_output: string;
  nama_output: string;
  kode_suboutput: string;
  nama_suboutput: string;
  kode_komponen: string;
  nama_komponen: string;
  kode_subkomponen: string;
  nama_subkomponen: string;
  kode_akun: string;
  nama_akun: string;
  uraian: string;
  uraian_lengkap?: string;
  indent_level?: number;
  volume: number;
  satuan: string;
  harga_satuan: number;
  jumlah: number;
  total: number;
  rowNumber: number;
  isHeader?: boolean;
  headerTotal?: number;
}

// ─────────────────────────────────
// UTILS
// ─────────────────────────────────
function cleanString(str: any): string {
  if (str == null) return "";
  return String(str)
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cellNumber(cell: any): number {
  if (cell == null) return 0;
  if (typeof cell === "number") return cell;
  
  let str = String(cell).trim();
  if (!str) return 0;
  
  // Handle Indonesian number format: 1.234.567,89
  if (str.includes(',') && str.includes('.')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    str = str.replace(',', '.');
  } else if (str.includes('.')) {
    const parts = str.split('.');
    if (
      parts.length > 2 ||
      (parts.length === 2 &&
        typeof parts[1] === 'string' &&
        parts[1].length === 3 &&
        /^\d+$/.test(parts[1] ?? ''))
    ) {
      str = str.replace(/\./g, '');
    }
  }
  
  str = str.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

function cellValue(cell: any): string {
  if (cell == null) return "";
  if (typeof cell === "object" && cell.text) return cleanString(cell.text);
  if (typeof cell === "object" && cell.richText && Array.isArray(cell.richText)) {
    return cleanString(cell.richText.map((t: any) => t.text).join(""));
  }
  return cleanString(cell);
}

export function parseVolumeWithUnit(raw: any): { volume: number; satuan: string } {
  if (raw == null) return { volume: 0, satuan: "" };
  
  const str = cleanString(raw);
  if (!str) return { volume: 0, satuan: "" };
  
  const match = str.match(/^([\d.,]+)\s*([A-Za-z\s\[\]\(\)]+)?$/);
  
  if (match?.[1]) {
    let volStr = match[1];
    
    if (volStr.includes('.') && volStr.includes(',')) {
      volStr = volStr.replace(/\./g, '').replace(',', '.');
    } else if (volStr.includes(',')) {
      volStr = volStr.replace(',', '.');
    } else if (volStr.includes('.')) {
      const parts = volStr.split('.');
      if (
        parts.length > 2 ||
        (parts.length === 2 &&
          typeof parts[1] === 'string' &&
          parts[1].length === 3 &&
          /^\d+$/.test(parts[1] ?? ''))
      ) {
        volStr = volStr.replace(/\./g, '');
      }
    }
    
    const volume = parseFloat(volStr);
    return {
      volume: isNaN(volume) ? 0 : volume,
      satuan: cleanString(match[2] || "")
    };
  }
  
  return { volume: 0, satuan: "" };
}

// ─────────────────────────────────
// DETEKSI HIERARCHY LEVEL - FIXED
// ─────────────────────────────────
function detectHierarchyLevel(kode: string): { type: string | null; value: string | null } {
  const cleanKode = cleanString(kode);
  if (!cleanKode) return { type: null, value: null };
  
  // Program: 086.01.CO atau 086.01.WA
  if (/^\d{3}\.\d{2}\.[A-Z]{2,3}$/.test(cleanKode)) 
    return { type: "program", value: cleanKode };
  
  // Kegiatan: 4 digit angka (7913, 7914, dll)
  if (/^\d{4}$/.test(cleanKode)) 
    return { type: "kegiatan", value: cleanKode };
  
  // Output: 4 digit + titik + 3 huruf (7913.ADI)
  if (/^\d{4}\.[A-Z]{3}$/.test(cleanKode)) 
    return { type: "output", value: cleanKode };
  
  // ✅ SUBOUTPUT: support alphanumeric di suffix (7915.FAN.ZZ1, 7913.ADI.001)
  if (/^\d{4}\.[A-Z]{3}\.[A-Z0-9]{3}$/.test(cleanKode)) 
    return { type: "suboutput", value: cleanKode };
  
  // ✅ KOMPONEN: support 3 digit ATAU 3 alphanumeric (051, ZZ1, dll)
  if (/^[A-Z0-9]{3}$/.test(cleanKode)) 
    return { type: "komponen", value: cleanKode };
  
  // Subkomponen: 1 huruf kapital
  if (/^[A-Z]$/.test(cleanKode)) 
    return { type: "subkomponen", value: cleanKode };
  
  // Akun: 6 digit angka
  if (/^\d{6}$/.test(cleanKode)) 
    return { type: "akun", value: cleanKode };
  
  return { type: null, value: null };
}

// ─────────────────────────────────
// UPDATE HIERARCHY
// ─────────────────────────────────
function updateHierarchy(
  hierarchy: HierarchyState, 
  level: { type: string | null; value: string | null }, 
  hierarchyName: string
): HierarchyState {
  const newHierarchy = { ...hierarchy };
  switch (level.type) {
    case "program":
      return {
        program: level.value,
        program_nama: hierarchyName,
        kegiatan: null, kegiatan_nama: null,
        output: null, output_nama: null,
        suboutput: null, suboutput_nama: null,
        komponen: null, komponen_nama: null,
        subkomponen: null, subkomponen_nama: null,
        akun: null, akun_nama: null
      };
    case "kegiatan":
      newHierarchy.kegiatan = level.value;
      newHierarchy.kegiatan_nama = hierarchyName;
      newHierarchy.output = null; newHierarchy.output_nama = null;
      newHierarchy.suboutput = null; newHierarchy.suboutput_nama = null;
      newHierarchy.komponen = null; newHierarchy.komponen_nama = null;
      newHierarchy.subkomponen = null; newHierarchy.subkomponen_nama = null;
      newHierarchy.akun = null; newHierarchy.akun_nama = null;
      break;
    case "output":
      newHierarchy.output = level.value;
      newHierarchy.output_nama = hierarchyName;
      newHierarchy.suboutput = null; newHierarchy.suboutput_nama = null;
      newHierarchy.komponen = null; newHierarchy.komponen_nama = null;
      newHierarchy.subkomponen = null; newHierarchy.subkomponen_nama = null;
      newHierarchy.akun = null; newHierarchy.akun_nama = null;
      break;
    case "suboutput":
      newHierarchy.suboutput = level.value;
      newHierarchy.suboutput_nama = hierarchyName;
      newHierarchy.komponen = null; newHierarchy.komponen_nama = null;
      newHierarchy.subkomponen = null; newHierarchy.subkomponen_nama = null;
      newHierarchy.akun = null; newHierarchy.akun_nama = null;
      break;
    case "komponen":
      newHierarchy.komponen = level.value;
      newHierarchy.komponen_nama = hierarchyName;
      newHierarchy.subkomponen = null; newHierarchy.subkomponen_nama = null;
      newHierarchy.akun = null; newHierarchy.akun_nama = null;
      break;
    case "subkomponen":
      newHierarchy.subkomponen = level.value;
      newHierarchy.subkomponen_nama = hierarchyName;
      newHierarchy.akun = null; newHierarchy.akun_nama = null;
      break;
    case "akun":
      newHierarchy.akun = level.value;
      newHierarchy.akun_nama = hierarchyName;
      break;
  }
  return newHierarchy;
}

// ─────────────────────────────────
// VALIDASI HIERARCHY - SUBOUTPUT OPTIONAL (FIXED)
// ─────────────────────────────────
function isValidForDetailFlexible(hierarchy: HierarchyState): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  // Wajib: program, kegiatan, output, komponen, akun
  if (!hierarchy.program) missing.push('program');
  if (!hierarchy.kegiatan) missing.push('kegiatan');
  if (!hierarchy.output) missing.push('output');
  if (!hierarchy.komponen) missing.push('komponen');
  if (!hierarchy.akun) missing.push('akun');
  
  // ✅ suboutput TIDAK wajib - ada kasus komponen langsung ke akun
  // ✅ subkomponen juga tidak wajib
  
  return { valid: missing.length === 0, missing };
}

// ─────────────────────────────────
// EXTRACT ITEM NAME
// ─────────────────────────────────
function extractItemName(
  colD: string, 
  colE: string, 
  colF: string
): { name: string; indent: number; isHeader: boolean } | null {
  const d = cleanString(colD);
  const e = cleanString(colE);
  const f = cleanString(colF);

  // Skip jika ada marker header group
  if (d === ">" || d === ">>" || d.startsWith("> ") || d.startsWith(">> ")) {
    return { name: e || f || "", indent: d.startsWith(">>") ? 2 : 1, isHeader: true };
  }

  // Detail item: marker "-" atau tanpa marker, dan bukan baris lokasi/kppn
  if (
    d === "-" ||
    d.startsWith("- ") ||
    d === "" ||
    d === null ||
    (d && !["lokasi", "kppn"].some(k => d.toLowerCase().includes(k)))
  ) {
    const itemName = e || f || d;
    if (!itemName) return null;
    const indent = d && d.startsWith("-") ? 2 : (d ? 1 : 0);
    return { name: itemName, indent, isHeader: false };
  }

  return null;
}

// ─────────────────────────────────
// DETEKSI DETAIL BELANJA
// ─────────────────────────────────
function isBelanjaDetail(
  volume: number,
  harga: number,
  jumlah: number,
  total: number,
  akunKode: string | null
): boolean {
  if (total > 0) return true;
  if (!akunKode) return false;
  return volume > 0 || harga > 0 || jumlah > 0;
}

// ─────────────────────────────────
// MAIN PARSER - FIXED
// ─────────────────────────────────
export async function parseRkaklExcel(
  filePath: string,
  options?: { debug?: boolean; startRow?: number }
): Promise<ParsedRow[]> {
  const { debug = false, startRow = 1 } = options || {};
  const rows: ParsedRow[] = [];
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error("Worksheet tidak ditemukan");
  
  let hierarchy: HierarchyState = {
    program: null, program_nama: null,
    kegiatan: null, kegiatan_nama: null,
    output: null, output_nama: null,
    suboutput: null, suboutput_nama: null,
    komponen: null, komponen_nama: null,
    subkomponen: null, subkomponen_nama: null,
    akun: null, akun_nama: null
  };
  
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < startRow) return;
    try {
      // KOLOM A: KODE
      const kode = cleanString(cellValue(row.getCell(1).value));
      // KOLOM D, E, F: URAIAN & NAMA
      const colD = cellValue(row.getCell(4).value);
      const colE = cellValue(row.getCell(5).value);
      const colF = cellValue(row.getCell(6).value);
      
      // Skip baris benar-benar kosong
      if (!kode && !colD && !colE && !colF) return;
      
      // KOLOM G, H, J: NUMERIC
      const volumeRaw = cellValue(row.getCell(7).value);
      const hargaRaw = cellValue(row.getCell(8).value);
      const totalRaw = cellValue(row.getCell(10).value);
      
      // Parse values
      const { volume, satuan } = parseVolumeWithUnit(volumeRaw);
      const harga = cellNumber(hargaRaw);
      const calculatedJumlah = volume * harga;
      const totalFromExcel = cellNumber(totalRaw);
      const finalTotal = totalFromExcel > 0 ? totalFromExcel : calculatedJumlah;
      
      // DETEKSI LEVEL HIERARCHY
      const level = detectHierarchyLevel(kode);
      const hierarchyName = colE || colF || colD;
      
      // Skip baris metadata (Lokasi/KPPN) TANPA mereset hierarchy
      const lowerName = hierarchyName.toLowerCase();
      if (lowerName.includes("lokasi") || lowerName.includes("kppn")) {
        return; // Jangan update hierarchy, jangan reset state!
      }
      
      // UPDATE HIERARCHY jika ada level yang terdeteksi
      if (level.type && hierarchyName) {
        // ✅ CAPTURE MASTER TOTAL untuk hierarchy row dari kolom J (index 10)
        const masterTotal = cellNumber(cellValue(row.getCell(10).value));

        if (debug) {
          console.log(`[ROW ${rowNumber}] Detected: ${level.type} = ${level.value} - ${hierarchyName} | Master Total: ${masterTotal}`);
          console.log(`  Before: prog=${hierarchy.program}, subout=${hierarchy.suboutput}, komp=${hierarchy.komponen}`);
        }

        // Update hierarchy state
        hierarchy = updateHierarchy(hierarchy, level, hierarchyName);

        // ✅ Jika ada total di kolom J, simpan sebagai master record
        if (masterTotal > 0) {
          rows.push({
            kode_program: hierarchy.program || "",
            nama_program: hierarchy.program_nama || "",
            kode_kegiatan: hierarchy.kegiatan || "",
            nama_kegiatan: hierarchy.kegiatan_nama || "",
            kode_output: hierarchy.output || "",
            nama_output: hierarchy.output_nama || "",
            kode_suboutput: hierarchy.suboutput || "",
            nama_suboutput: hierarchy.suboutput_nama || "",
            kode_komponen: hierarchy.komponen || "",
            nama_komponen: hierarchy.komponen_nama || "",
            kode_subkomponen: hierarchy.subkomponen || "",
            nama_subkomponen: hierarchy.subkomponen_nama || "",
            kode_akun: hierarchy.akun || "",
            nama_akun: hierarchy.akun_nama || "",
            uraian: hierarchyName,
            uraian_lengkap: colD || colE,
            indent_level: 0,
            volume: 0,
            satuan: "",
            harga_satuan: 0,
            jumlah: 0,
            total: masterTotal,  // ✅ Gunakan total dari kolom J
            rowNumber,
            isHeader: true,     // ✅ Flag sebagai master record
            headerTotal: masterTotal
          });
        }

        if (debug) {
          console.log(`  After:  prog=${hierarchy.program}, subout=${hierarchy.suboutput}, komp=${hierarchy.komponen}`);
        }
        return; // Baris hierarchy bukan detail belanja
      }
      
      // DETEKSI DETAIL BELANJA
      const itemExtract = extractItemName(colD, colE, colF);
      if (!itemExtract || itemExtract.isHeader) return;
      
      // Validasi hierarchy flexible (suboutput optional)
      const { valid, missing } = isValidForDetailFlexible(hierarchy);
      if (!valid) {
        if (debug && finalTotal > 0) {
          console.log(`[DETAIL SKIPPED] Row ${rowNumber}: Missing: ${missing.join(', ')}`);
          console.log(`  Item: ${itemExtract.name} | Hierarchy:`, {
            program: hierarchy.program,
            kegiatan: hierarchy.kegiatan,
            output: hierarchy.output,
            suboutput: hierarchy.suboutput,
            komponen: hierarchy.komponen,
            akun: hierarchy.akun
          });
        }
        return;
      }

      // Fallback: jika suboutput kosong/null, gunakan output sebagai kode_suboutput
      let kode_suboutput = hierarchy.suboutput || hierarchy.output || "";
      let nama_suboutput = hierarchy.suboutput_nama || hierarchy.output_nama || "";
      if (!hierarchy.suboutput && debug) {
        console.warn(`[WARNING] Row ${rowNumber}: suboutput kosong, fallback ke output (${kode_suboutput})`);
      }

      // VALIDASI NILAI: harus ada nilai yang berarti
      if (finalTotal <= 0 && volume <= 0 && harga <= 0) return;

      // BUAT ROW DETAIL
      rows.push({
        kode_program: hierarchy.program || "",
        nama_program: hierarchy.program_nama || "",
        kode_kegiatan: hierarchy.kegiatan || "",
        nama_kegiatan: hierarchy.kegiatan_nama || "",
        kode_output: hierarchy.output || "",
        nama_output: hierarchy.output_nama || "",
        kode_suboutput,
        nama_suboutput,
        kode_komponen: hierarchy.komponen || "",
        nama_komponen: hierarchy.komponen_nama || "",
        kode_subkomponen: hierarchy.subkomponen || "",
        nama_subkomponen: hierarchy.subkomponen_nama || "",
        kode_akun: hierarchy.akun || "",
        nama_akun: hierarchy.akun_nama || "",
        uraian: itemExtract.name,
        uraian_lengkap: colD || colE,
        indent_level: itemExtract.indent,
        volume,
        satuan,
        harga_satuan: harga,
        jumlah: calculatedJumlah,
        total: finalTotal,
        rowNumber
      });

      if (debug && rows.length % 50 === 1) {
        console.log(`[PARSED] Row ${rowNumber}: ${hierarchy.akun} | "${itemExtract.name.substring(0, 30)}..." | Rp ${finalTotal.toLocaleString()}`);
      }
    } catch (error: any) {
      if (debug) console.error(`[ERROR] Row ${rowNumber}:`, error?.message || error);
    }
  });
  
  if (debug) {
    console.log(`\n✅ Parsing complete: ${rows.length} rows parsed`);
  }
  
  return rows;
}