
<template>
  <div class="pt-14">
    <transition name="fade-toast">
      <div v-if="showToast" class="fixed top-8 right-8 z-[9999] bg-green-600 text-white px-7 py-4 rounded-2xl shadow-2xl shadow-green-400/40 flex items-center gap-3 animate-fadein-toast border-2 border-green-300/60">
        <Icon icon="mdi:check-circle" class="w-7 h-7 text-white drop-shadow" />
        <span class="font-semibold text-lg tracking-wide">Data berhasil disimpan!</span>
      </div>
    </transition>
    <SuboutputAlert class="mb-6" :showAlert="true" />
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/output" class="hover:text-blue-700">Outputs</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Update</span>
    </div>
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      SIK - Update Output
    </h1>
    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-[#D69009]">
      <div class="px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Edit Output</h1>
        <p class="text-gray-500 text-sm mt-1">Ubah detail output di bawah ini.</p>
      </div>
      <form class="px-8 py-8" @submit.prevent="submitForm">
        <div class="space-y-6">
          <!-- Kegiatan -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="kegiatan">Kegiatan</label>
            <div class="col-span-9">
              <select v-model="kegiatan" id="kegiatan" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="k in kegiatanList" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
            </div>
          </div>
          <!-- Satker -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="satker">Satker</label>
            <div class="col-span-9">
              <select v-model="satker" id="satker" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
          <!-- Kode -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="kode">Kode</label>
            <div class="col-span-9">
              <input v-model="kode" id="kode" type="text" maxlength="255" placeholder="Kode" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
          <!-- Nama -->
          <div class="grid grid-cols-12 items-start gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="nama">Nama</label>
            <div class="col-span-9">
              <textarea v-model="nama" id="nama" maxlength="255" placeholder="Nama" rows="2" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition min-h-[48px] max-h-40 resize-y break-words"></textarea>
            </div>
          </div>
          <!-- Tahun -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="tahun">Tahun</label>
            <div class="col-span-9">
              <input v-model="tahun" id="tahun" type="text" maxlength="4" placeholder="Tahun" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-8">
          <button type="submit" class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2663A3] rounded-lg shadow-sm hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Icon from '~/components/Icon.vue'
import SuboutputAlert from '@/components/SuboutputAlert.vue'


const showToast = ref(false)
const kegiatan = ref('')
const satker = ref('1')
const kode = ref('')
const nama = ref('')
const tahun = ref('2026')
const total = ref(null)
const kegiatanList = ref([{ value: '', label: '- Pilih Kegiatan -' }])
const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])

// State untuk data asli hasil GET by id
const originalData = ref(null)
// Ambil data output by id saat halaman dibuka
onMounted(async () => {
  // Fetch kegiatan
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch('/api/kegiatan', { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      kegiatanList.value = [
        { value: '', label: '- Pilih Kegiatan -' },
        ...json.data.map(item => ({
          value: item.id,
          label: `${item.kode_kegiatan} - ${item.nama_kegiatan}`
        }))
      ]
    }
  } catch (e) {}
  // Fetch satker
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch('/api/satker', { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      satkerList.value = [
        { value: '', label: '- Pilih Satker -' },
        ...json.data.map(item => ({
          value: item.id,
          label: item.name
        }))
      ]
    }
  } catch (e) {}

  // Fetch data output by id
  try {
    const id = window.location.pathname.split('/').pop()
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`/api/output/${id}`, { headers })
    const json = await res.json()
    if (json.success && json.data) {
      originalData.value = json.data
      // Isi field form dari data output
      kode.value = json.data.kode_output || ''
      nama.value = json.data.nama_output || ''
      tahun.value = json.data.tahun_anggaran || ''
      kegiatan.value = json.data.kegiatan_id ? String(json.data.kegiatan_id) : ''
      satker.value = json.data.satker_id ? String(json.data.satker_id) : ''
      total.value = json.data.total ?? null
    }
  } catch (e) {}
})



async function submitForm() {
  // Simpan data ke backend (PUT)
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  try {
    // Cari kode_kegiatan dari kegiatan terpilih
    const selectedKegiatan = kegiatanList.value.find(k => k.value == kegiatan.value)
    let kodeKegiatan = ''
    if (selectedKegiatan && selectedKegiatan.label) {
      kodeKegiatan = selectedKegiatan.label.split(' - ')[0]
    }
    // Pastikan kode_output hanya 7918.EBA (kode_kegiatan.kode_input), bukan 7918.EBA.EBA
    let kodeInput = kode.value
    // Jika kode.value sudah mengandung titik dan kode_kegiatan, ambil hanya bagian setelah titik terakhir
    if (kodeInput.includes('.')) {
      const parts = kodeInput.split('.')
      kodeInput = parts[parts.length - 1]
    }
    const kodeOutputGabungan = kodeKegiatan && kodeInput ? `${kodeKegiatan}.${kodeInput}` : kodeInput
    // Ambil id dari URL
    const id = window.location.pathname.split('/').pop()
    // Gabungkan data hasil GET by id dengan perubahan form
    const updatePayload = {
      ...originalData.value,
      kode_output: kodeOutputGabungan,
      nama_output: nama.value,
      kegiatan_id: kegiatan.value,
      satker_id: satker.value,
      total: total.value
    }
    // Hapus field yang tidak boleh dikirim (id, created_at, updated_at, tahun_anggaran, program, kegiatan, satker, tahun_anggaran_id, dst)
    delete updatePayload.id
    delete updatePayload.created_at
    delete updatePayload.updated_at
    delete updatePayload.program
    delete updatePayload.kegiatan
    delete updatePayload.satker
    delete updatePayload.tahun_anggaran
    delete updatePayload.tahun_anggaran_id
    // Kirim PUT
    const res = await fetch(`/api/output/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatePayload)
    })
    const json = await res.json()
    if (json.success) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 2000)
    } else {
      alert(json.message || 'Gagal menyimpan output!')
    }
  } catch (e) {
    alert('Gagal menyimpan output!')
  }
}
</script>
