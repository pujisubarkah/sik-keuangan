import { defineEventHandler, getRouterParam } from 'h3'

// Dummy in-memory data (replace with DB logic as needed)
let laporanList = [
  {
    id: 1,
    judul: 'tes',
    berkas: 'Penawaran Pembuatan Aplikasi Sistem Informasi Akademik.pdf',
    user_pembuat: 'admin',
    waktu_dibuat: '2026-04-14 10:00',
  },
]

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (event.req.method === 'DELETE') {
    const idx = laporanList.findIndex(l => l.id === id)
    if (idx !== -1) {
      laporanList.splice(idx, 1)
      return { success: true }
    } else {
      event.res.statusCode = 404
      return { error: 'Data tidak ditemukan' }
    }
  }
  // GET detail
  const data = laporanList.find(l => l.id === id)
  if (!data) {
    event.res.statusCode = 404
    return { error: 'Data tidak ditemukan' }
  }
  return data
})
