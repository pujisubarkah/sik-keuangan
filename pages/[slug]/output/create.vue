<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const showAlert = ref(true)
const kegiatan = ref('')
const satker = ref('1')
const kode = ref('')
const nama = ref('')
const tahun = ref('2026')

import { onMounted } from 'vue'
const kegiatanList = ref([{ value: '', label: '- Pilih Kegiatan -' }])
const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])

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
  } catch (e) {
    // fallback: tidak update list
  }
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
  } catch (e) {
    // fallback: tidak update list
  }
})

const showToast = ref(false)

async function submitForm() {
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
      // label: "7913 - Nama Kegiatan", ambil sebelum ' - '
      kodeKegiatan = selectedKegiatan.label.split(' - ')[0]
    }
    const kodeOutputGabungan = kodeKegiatan && kode.value ? `${kodeKegiatan}.${kode.value}` : kode.value

    const res = await fetch('/api/output', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        kode_output: kodeOutputGabungan,
        nama_output: nama.value,
        kegiatan_id: kegiatan.value,
        satker_id: satker.value,
        total: null, // atau tambahkan field jika ada input jumlah/total
      })
    })
    const json = await res.json()
    if (json.success) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 2000)
      // reset form jika perlu
      kode.value = ''
      nama.value = ''
      kegiatan.value = ''
      // tahun dan satker tidak dikirim ke backend output
    } else {
      alert(json.message || 'Gagal menyimpan output!')
    }
  } catch (e) {
    alert('Gagal menyimpan output!')
  }
}
</script>

<template>
  <div class="pt-14">
    <transition name="fade-toast">
      <div v-if="showToast" class="fixed top-8 right-8 z-[9999] bg-green-600 text-white px-7 py-4 rounded-2xl shadow-2xl shadow-green-400/40 flex items-center gap-3 animate-fadein-toast border-2 border-green-300/60">
          <Icon icon="mdi:check-circle" class="w-7 h-7 text-white drop-shadow" />
        <span class="font-semibold text-lg tracking-wide">Data berhasil disimpan!</span>
      </div>
    </transition>
    <SuboutputAlert class="mb-6" :showAlert="true" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/output" class="hover:text-blue-700">Outputs</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Create</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      SIK - Create Output
    </h1>

    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-blue-500">
      <div class="px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Tambah Output</h1>
        <p class="text-gray-500 text-sm mt-1">Lengkapi detail output di bawah ini.</p>
      </div>
      <form class="px-8 py-8" @submit.prevent="submitForm">
        <div class="space-y-6">
          <!-- Kegiatan -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="kegiatan">Kegiatan</label>
            <div class="col-span-9">
              <select v-model="kegiatan" id="kegiatan" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="k in kegiatanList" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
            </div>
          </div>
          <!-- Satker -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="satker">Satker</label>
            <div class="col-span-9">
              <select v-model="satker" id="satker" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
          <!-- Kode -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="kode">Kode</label>
            <div class="col-span-9">
              <input v-model="kode" id="kode" type="text" maxlength="255" placeholder="Kode" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
          <!-- Nama -->
          <div class="grid grid-cols-12 items-start gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="nama">Nama</label>
            <div class="col-span-9">
              <textarea v-model="nama" id="nama" maxlength="255" placeholder="Nama" rows="2" class="form-control w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm min-h-[48px] max-h-40 resize-y break-words"></textarea>
            </div>
          </div>
          <!-- Tahun -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="tahun">Tahun</label>
            <div class="col-span-9">
              <input v-model="tahun" id="tahun" type="text" maxlength="4" placeholder="Tahun" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-10">
          <Button type="success" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-8 py-3 font-semibold text-lg bg-gradient-to-tr from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800" native-type="submit">
            <Icon icon="mdi:check" class="w-6 h-6 mr-2" /> Simpan
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input.form-control, select.form-control, textarea.form-control {
  border: 1.5px solid #cbd5e1;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: transparent;
  font-size: 1.08rem;
  padding: 0.7rem 1.1rem;
}
input.form-control:focus, select.form-control:focus, textarea.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #bfdbfe66;
  background: #f0f9ff;
}
</style>
<style scoped>
.fade-toast-enter-active, .fade-toast-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-toast-enter-from, .fade-toast-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
.fade-toast-enter-to, .fade-toast-leave-from {
  opacity: 1;
  transform: none;
}
.animate-fadein-toast {
  animation: fadein-toast 0.7s;
}
@keyframes fadein-toast {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
</style>
