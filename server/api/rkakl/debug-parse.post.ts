import { parseRkaklExcel } from "../utils/parserRkakl";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const file = form?.find(f => f.name === "file");
  if (!file?.data) return { error: "No file" };

  const tempPath = path.join(process.cwd(), "uploads", `debug_${Date.now()}.xlsx`);
  fs.writeFileSync(tempPath, file.data);

  try {
    const rows = await parseRkaklExcel(tempPath, { debug: true });

    return {
      success: true,
      totalParsed: rows.length,
      sample: rows.slice(0, 5).map(r => ({
        uraian: r.uraian,
        volume: r.volume,
        satuan: r.satuan,
        harga_satuan: r.harga_satuan,
        jumlah: r.jumlah,
        total: r.total,
        akun: `${r.kode_akun} - ${r.nama_akun}`
      })),
      stats: {
        withVolume: rows.filter(r => r.volume > 0).length,
        withHarga: rows.filter(r => r.harga_satuan > 0).length,
        withTotal: rows.filter(r => r.total > 0).length
      }
    };
  } finally {
    fs.unlinkSync(tempPath);
  }
});
