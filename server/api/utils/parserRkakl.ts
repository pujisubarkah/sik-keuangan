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
// DETEKSI HIERARCHY LEVEL
// ─────────────────────────────────
function detectHierarchyLevel(kode: string): { type: string | null; value: string | null } {
  const cleanKode = cleanString(kode);
  if (!cleanKode) return { type: null, value: null };
  
  if (/^\d{3}\.\d{2}(\.[A-Z]{2,3})?$/.test(cleanKode)) return { type: "program", value: cleanKode };
  if (/^\d{4}$/.test(cleanKode)) return { type: "kegiatan", value: cleanKode };
  if (/^\d{4}\.[A-Z]{3}$/.test(cleanKode)) return { type: "output", value: cleanKode };
  if (/^\d{4}\.[A-Z]{3}\.\d{3}$/.test(cleanKode)) return { type: "suboutput", value: cleanKode };
  if (/^\d{6}$/.test(cleanKode)) return { type: "akun", value: cleanKode };
  if (/^\d{3}$/.test(cleanKode)) return { type: "komponen", value: cleanKode };
  if (/^[A-Z]$/.test(cleanKode)) return { type: "subkomponen", value: cleanKode };
  
  return { type: null, value: null };
}

// ─────────────────────────────────
// ✅ FIX: EXTRACT ITEM NAME (handle multi-column merged cells)
// ─────────────────────────────────
function extractItemName(
  colD: string, 
  colE: string, 
  colF: string
): { name: string; indent: number } | null {
  const d = cleanString(colD);
  const e = cleanString(colE);
  const f = cleanString(colF);
  
  // Cek apakah colD mengandung marker
  const hasMarker = d === ">" || d === ">>" || d === "-" || d.startsWith("> ") || d.startsWith(">> ") || d.startsWith("- ");
  
  if (hasMarker) {
    // Ambil nama dari colE (prioritas) atau colF (fallback)
    const itemName = e || f || "";
    if (!itemName) return null;
    
    // Deteksi indent level dari colD
    let indent = 0;
    if (d.startsWith(">>")) indent = 2;
    else if (d.startsWith(">") || d.startsWith("-")) indent = 1;
    
    return { name: itemName, indent };
  }
  
  // Jika colD tidak ada marker tapi ada isi, mungkin item tanpa indent
  if (d && !["lokasi", "kppn"].some(k => d.toLowerCase().includes(k))) {
    return { name: d, indent: 0 };
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
  // Prioritas: total > 0
  if (total > 0) return true;
  
  // Fallback: butuh akun + salah satu metrik
  if (!akunKode) return false;
  return volume > 0 || harga > 0 || jumlah > 0;
}

// ─────────────────────────────────
// MAIN PARSER
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
      // ── KOLOM A: KODE ──
      const kode = cleanString(cellValue(row.getCell(1).value));
      
      // ── KOLOM D, E, F: URAIAN & NAMA ──
      const colD = cellValue(row.getCell(4).value);
      const colE = cellValue(row.getCell(5).value);
      const colF = cellValue(row.getCell(6).value);
      
      const cleanD = cleanString(colD);
      const cleanE = cleanString(colE);
      const cleanF = cleanString(colF);
      
      // ── KOLOM G, H, I, J: NUMERIC ──
      const volumeRaw = cellValue(row.getCell(7).value);
      const harga = cellNumber(row.getCell(8).value);
      const jumlah = cellNumber(row.getCell(9).value);
      const total = cellNumber(row.getCell(10).value);
      
      if (!kode && !cleanD && !cleanE) return;
      
      // Debug
      if (debug && rowNumber <= 25) {
        console.log(`[ROW ${rowNumber}]`, {
          kode, colD: cleanD.substring(0, 30), colE: cleanE.substring(0, 30),
          volumeRaw, harga, jumlah, total,
          akun: hierarchy.akun
        });
      }
      
      // ── UPDATE HIERARCHY ──
      const level = detectHierarchyLevel(kode);
      const hierarchyName = cleanE || cleanF || cleanD;
      
      if (level.type && hierarchyName && !hierarchyName.toLowerCase().includes("lokasi") && !hierarchyName.includes("KPPN")) {
        switch (level.type) {
          case "program":
            hierarchy = { ...hierarchy, program: level.value, program_nama: hierarchyName, kegiatan: null, kegiatan_nama: null, output: null, output_nama: null, suboutput: null, suboutput_nama: null, komponen: null, komponen_nama: null, subkomponen: null, subkomponen_nama: null, akun: null, akun_nama: null };
            if (debug) console.log(`[PROGRAM] ${level.value} | ${hierarchyName}`);
            return;
          case "kegiatan":
            hierarchy = { ...hierarchy, kegiatan: level.value, kegiatan_nama: hierarchyName, output: null, output_nama: null, suboutput: null, suboutput_nama: null, komponen: null, komponen_nama: null, subkomponen: null, subkomponen_nama: null, akun: null, akun_nama: null };
            if (debug) console.log(`[KEGIATAN] ${level.value} | ${hierarchyName}`);
            return;
          case "output":
            hierarchy = { ...hierarchy, output: level.value, output_nama: hierarchyName, suboutput: null, suboutput_nama: null, komponen: null, komponen_nama: null, subkomponen: null, subkomponen_nama: null, akun: null, akun_nama: null };
            return;
          case "suboutput":
            hierarchy = { ...hierarchy, suboutput: level.value, suboutput_nama: hierarchyName, komponen: null, komponen_nama: null, subkomponen: null, subkomponen_nama: null, akun: null, akun_nama: null };
            return;
          case "komponen":
            hierarchy = { ...hierarchy, komponen: level.value, komponen_nama: hierarchyName, subkomponen: null, subkomponen_nama: null, akun: null, akun_nama: null };
            return;
          case "subkomponen":
            hierarchy = { ...hierarchy, subkomponen: level.value, subkomponen_nama: hierarchyName, akun: null, akun_nama: null };
            return;
          case "akun":
            hierarchy = { ...hierarchy, akun: level.value, akun_nama: hierarchyName };
            if (debug) console.log(`[AKUN] ${level.value} | ${hierarchyName}`);
            return; // ✅ Baris akun TIDAK PERNAH jadi detail
        }
      }
      
      // ── DETEKSI DETAIL BELANJA ──
      const itemExtract = extractItemName(colD, colE, colF);
      
      // Skip jika tidak ada item name (bukan detail)
      if (!itemExtract) return;
      
      const { name: itemName, indent } = itemExtract;
      const { volume, satuan } = parseVolumeWithUnit(volumeRaw);
      
      // Validasi numeric
      if (!hierarchy.akun) return;
      if (total <= 0 && volume <= 0 && harga <= 0 && jumlah <= 0) return;
      
      const calculatedJumlah = jumlah > 0 ? jumlah : (volume * harga);
      const calculatedTotal = total > 0 ? total : calculatedJumlah;
      
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
        uraian: itemName,  // ✅ Sekarang dari colE/colF, bukan colD
        uraian_lengkap: cleanD || cleanE,
        indent_level: indent,
        volume,
        satuan,
        harga_satuan: harga,
        jumlah: calculatedJumlah,
        total: calculatedTotal,
        rowNumber
      });
      
      if (debug && rows.length % 50 === 1) {
        console.log(`[PARSED] Akun: ${hierarchy.akun} | Item: "${itemName}" | Vol: ${volume} | Harga: ${harga} | Total: ${calculatedTotal}`);
      }
      
    } catch (error: any) {
      if (debug) console.error(`[ERROR] Row ${rowNumber}:`, error?.message || error);
    }
  });
  
  if (debug) {
    console.log(`✅ Parsing complete: ${rows.length} rows parsed`);
  }
  
  return rows;
}