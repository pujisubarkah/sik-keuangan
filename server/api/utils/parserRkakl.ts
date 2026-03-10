import ExcelJS from "exceljs";
import path from "path";

// ─────────────────────────────────
// DETEKSI LEVEL HIERARCHY
// ─────────────────────────────────
function detectHierarchyLevel(kode: string): { type: string | null; value: string | null } {
  const cleanKode = kode.trim();
  
  if (/^\d{3}\.\d{2}(\.[A-Z]{2,3})?$/.test(cleanKode)) {
    return { type: 'program', value: cleanKode };
  }
  if (/^\d{4}$/.test(cleanKode)) {
    return { type: 'kegiatan', value: cleanKode };
  }
  if (/^\d{4}\.[A-Z]{3}$/.test(cleanKode)) {
    return { type: 'output', value: cleanKode };
  }
  if (/^\d{4}\.[A-Z]{3}\.\d{3}$/.test(cleanKode)) {
    return { type: 'suboutput', value: cleanKode };
  }
  if (/^\d{6}$/.test(cleanKode)) {
    return { type: 'akun', value: cleanKode };
  }
  if (/^\d{3}$/.test(cleanKode)) {
    return { type: 'komponen', value: cleanKode };
  }
  if (/^[A-Z]$/.test(cleanKode)) {
    return { type: 'subkomponen', value: cleanKode };
  }
  return { type: null, value: null };
}

// ─────────────────────────────────
// CLEAN STRING
// ─────────────────────────────────
function cleanString(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────────
// HIERARCHY STATE
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

// ─────────────────────────────────
// PARSED ROW TYPE
// ─────────────────────────────────
interface ParsedRow {
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
// CELL UTILS
// ─────────────────────────────────
function cellNumber(cell: any): number {
  if (cell == null) return 0;
  if (typeof cell === "number") return cell;
  const str = String(cell).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

function cellValue(cell: any): string {
  if (cell == null) return "";
  if (typeof cell === "object" && cell.text) return String(cell.text).trim();
  if (typeof cell === "object" && cell.richText && Array.isArray(cell.richText)) {
    return cell.richText.map((t: any) => t.text).join("").trim();
  }
  return String(cell).trim();
}

// ─────────────────────────────────
// EXTRACT ITEM NAME (tanpa marker indent)
// ─────────────────────────────────
function extractItemName(uraian: string, markers: string[]): { name: string; indent: number } {
  const trimmed = uraian.trim();
  
  if (trimmed.startsWith(">>")) {
    return { name: cleanString(trimmed.substring(2)), indent: 2 };
  }
  if (trimmed.startsWith(">")) {
    return { name: cleanString(trimmed.substring(1)), indent: 1 };
  }
  if (trimmed.startsWith("-")) {
    return { name: cleanString(trimmed.substring(1)), indent: 1 };
  }
  return { name: trimmed, indent: 0 };
}

// ─────────────────────────────────
// DETEKSI APAKAH BARIS ADALAH DETAIL BELANJA
// ─────────────────────────────────
function isBelanjaDetail(
  uraian: string,
  markers: string[],
  volume: number,
  harga: number,
  jumlah: number,
  akunKode: string | null
): boolean {
  // Harus ada akun parent
  if (!akunKode) return false;
  
  // Skip jika uraian kosong atau hanya marker
  const cleaned = cleanString(uraian);
  if (!cleaned) return false;
  
  // Skip jika uraian adalah marker hierarchy
  if (markers.includes(cleaned)) return false;
  
  // Valid jika ada volume > 0 ATAU harga > 0 ATAU jumlah > 0
  return volume > 0 || harga > 0 || jumlah > 0;
}

// ─────────────────────────────────
// MAIN PARSER FUNCTION
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
  if (!worksheet) {
    throw new Error("Worksheet tidak ditemukan");
  }
  
  // Initial hierarchy state
  let hierarchy: HierarchyState = {
    program: null, program_nama: null,
    kegiatan: null, kegiatan_nama: null,
    output: null, output_nama: null,
    suboutput: null, suboutput_nama: null,
    komponen: null, komponen_nama: null,
    subkomponen: null, subkomponen_nama: null,
    akun: null, akun_nama: null
  };
  
  const markers = ['>', '>>', '-', ''];
  
  worksheet.eachRow((row, rowNumber) => {
    // Skip header rows
    if (rowNumber < startRow) return;
    
    try {
      // ── KOLOM A: KODE ──
      const kodeRaw = cellValue(row.getCell(1).value);
      const kode = cleanString(kodeRaw);
      
      // ── KOLOM D, E, F: NAMA HIERARCHY (HANDLE MERGED CELLS) ──
      const colD = cleanString(cellValue(row.getCell(4).value));
      const colE = cleanString(cellValue(row.getCell(5).value));
      const colF = cleanString(cellValue(row.getCell(6).value));
      
      // Ambil nama hierarchy: nilai pertama yang bukan marker & tidak kosong
      const namaHierarchy = [colD, colE, colF].find(v => v && !markers.includes(v)) || "";
      
      // Ambil uraian dari kolom D (bisa berupa marker + nama)
      const uraianRaw = colD;
      const uraian = cleanString(uraianRaw);
      
      // ── KOLOM G, H, I, J: VOLUME, HARGA, JUMLAH, TOTAL ──
      const volumeRaw = cellValue(row.getCell(7).value);
      const harga = cellNumber(row.getCell(8).value);
      const jumlah = cellNumber(row.getCell(9).value);
      const total = cellNumber(row.getCell(10).value);
      
      // Skip baris benar-benar kosong
      if (!kode && !uraian) return;
      
      // ── DETEKSI & UPDATE HIERARCHY ──
      const level = detectHierarchyLevel(kode);
      if (level.type && namaHierarchy) {
        switch (level.type) {
          case "program":
            hierarchy = {
              ...hierarchy,
              program: level.value,
              program_nama: namaHierarchy,
              kegiatan: null, kegiatan_nama: null,
              output: null, output_nama: null,
              suboutput: null, suboutput_nama: null,
              komponen: null, komponen_nama: null,
              subkomponen: null, subkomponen_nama: null,
              akun: null, akun_nama: null
            };
            if (debug) console.log(`[PROGRAM] ${level.value} | ${namaHierarchy}`);
            break;
            
          case "kegiatan":
            hierarchy = {
              ...hierarchy,
              kegiatan: level.value,
              kegiatan_nama: namaHierarchy,
              output: null, output_nama: null,
              suboutput: null, suboutput_nama: null,
              komponen: null, komponen_nama: null,
              subkomponen: null, subkomponen_nama: null,
              akun: null, akun_nama: null
            };
            if (debug) console.log(`[KEGIATAN] ${level.value} | ${namaHierarchy}`);
            break;
            
          case "output":
            hierarchy = {
              ...hierarchy,
              output: level.value,
              output_nama: namaHierarchy,
              suboutput: null, suboutput_nama: null,
              komponen: null, komponen_nama: null,
              subkomponen: null, subkomponen_nama: null,
              akun: null, akun_nama: null
            };
            break;
            
          case "suboutput":
            hierarchy = {
              ...hierarchy,
              suboutput: level.value,
              suboutput_nama: namaHierarchy,
              komponen: null, komponen_nama: null,
              subkomponen: null, subkomponen_nama: null,
              akun: null, akun_nama: null
            };
            break;
            
          case "komponen":
            hierarchy = {
              ...hierarchy,
              komponen: level.value,
              komponen_nama: namaHierarchy,
              subkomponen: null, subkomponen_nama: null,
              akun: null, akun_nama: null
            };
            break;
            
          case "subkomponen":
            hierarchy = {
              ...hierarchy,
              subkomponen: level.value,
              subkomponen_nama: namaHierarchy,
              akun: null, akun_nama: null
            };
            break;
            
          case "akun":
            hierarchy = {
              ...hierarchy,
              akun: level.value,
              akun_nama: namaHierarchy
            };
            if (debug) console.log(`[AKUN] ${level.value} | ${namaHierarchy}`);
            break;
        }
        return; // Skip push row untuk hierarchy level
      }
      
      // ── DETEKSI DETAIL BELANJA ──
      const volumeMatch = volumeRaw?.toString().match(/^([\d.,]+)\s*(.*)$/);
      const volume = volumeMatch ? cellNumber(volumeMatch[1]) : 0;
      const satuan = volumeMatch ? (volumeMatch[2] ?? "") : "";
      
      const { name: itemName, indent } = extractItemName(uraian, markers);
      
      const isDetail = isBelanjaDetail(uraian, markers, volume, harga, jumlah, hierarchy.akun);
      
      if (isDetail) {
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
          uraian: itemName,
          uraian_lengkap: uraian,
          indent_level: indent,
          volume,
          satuan,
          harga_satuan: harga,
          jumlah: calculatedJumlah,
          total: calculatedTotal,
          rowNumber
        });
        
        if (debug && rowNumber % 50 === 0) {
          console.log(`[ROW ${rowNumber}] Akun: ${hierarchy.akun} | Item: "${itemName}" | Total: ${calculatedTotal}`);
        }
      }
      
    } catch (error) {
      if (debug) {
        console.error(`[ERROR] Row ${rowNumber}:`, error);
      }
      // Continue parsing even if one row fails
    }
  });
  
  if (debug) {
    console.log(`✅ Parsing complete: ${rows.length} rows parsed`);
  }
  
  return rows;
}