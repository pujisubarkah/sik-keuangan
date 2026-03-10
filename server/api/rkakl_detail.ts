import * as XLSX from 'xlsx/xlsx.mjs'
import { db } from "../database"
import { rkakl_detail } from "../database/schema/rkakl_detail"

export default defineEventHandler(async (event) => {
  // Cek token Authorization
  const authHeader = event.node.req.headers['authorization'] || event.node.req.headers['Authorization'];
  let token = null;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Contoh validasi token sederhana, sesuaikan dengan logic Anda
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // GET: return dummy data (atau data dari DB jika sudah ada)
  if (event.node.req.method === 'GET') {
    // Contoh: ambil data dari DB jika sudah ada
    // const data = await db.select().from(rkakl_detail);
    // return data;
    return { message: 'GET rkakl_detail success (dummy)', data: [] };
  }

  // POST: import excel (seperti sebelumnya)
  if (event.node.req.method === 'POST') {
    const form = await readMultipartFormData(event)
    const file = form?.find(f => f.name === "file")

    if (!file) {
      throw createError({ statusCode: 400, statusMessage: "File tidak ditemukan" })
    }

    const workbook = XLSX.read(file.data, { type: "buffer" })

    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      throw createError({ statusCode: 400, statusMessage: "Sheet tidak ditemukan" })
    }

    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      throw createError({ statusCode: 400, statusMessage: "Sheet kosong" })
    }

    // pastikan tipe array 2 dimensi
    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 })

    // state hierarki
    let program: string | null = null
    let kegiatan: string | null = null
    let output: string | null = null
    let suboutput: string | null = null
    let komponen: string | null = null
    let subkomponen: string | null = null

    const results: any[] = []

    for (const row of rows) {

      const cell = row?.[0]

      if (!cell) continue

      const value = cell.toString().trim()

      // PROGRAM
      if (/^\d{3}\.\d{2}\.[A-Z]{2}$/.test(value)) {
        program = value
        continue
      }

      // KEGIATAN
      if (/^\d{4}$/.test(value)) {
        kegiatan = value
        continue
      }

      // OUTPUT
      if (/^\d{4}\.[A-Z]{3}$/.test(value)) {
        output = value
        continue
      }

      // SUBOUTPUT
      if (/^\d{4}\.[A-Z]{3}\.\d{3}$/.test(value)) {
        suboutput = value
        continue
      }

      // KOMPONEN
      if (/^\d{3}$/.test(value)) {
        komponen = value
        continue
      }

      // SUBKOMPONEN
      if (/^[A-Z]$/.test(value)) {
        subkomponen = value
        continue
      }

      // AKUN
      if (/^\d{6}$/.test(value)) {

        const volume = row?.[4]
        const satuan = row?.[5]
        const harga = row?.[6]
        const jumlah = row?.[7]

        results.push({
          program_kode: program,
          kegiatan_kode: kegiatan,
          output_kode: output,
          suboutput_kode: suboutput,
          komponen_kode: komponen,
          subkomponen_kode: subkomponen,
          akun_kode: value,
          volume,
          satuan,
          harga_satuan: harga,
          jumlah
        })

      }

    }

    return {
      total: results.length,
      data: results.slice(0, 10)
    }
  }

  // Jika method tidak didukung
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
})
