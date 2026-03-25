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

    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
      <div class="px-8 py-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-blue-100 rounded-xl">
            <Icon icon="mdi:file-document-plus-outline" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-800">Detail Output</h2>
            <p class="text-sm text-slate-500">Field dengan <span class="text-rose-500">*</span> wajib diisi</p>
          </div>
        </div>
      </div>
      <form class="px-8 py-8" @submit.prevent="submitForm">
        <div class="space-y-7">
          <!-- Kegiatan -->
          <div class="flex items-center gap-4">
            <label for="kegiatan" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
              <Icon icon="mdi:format-list-bulleted" class="w-4 h-4 text-slate-400" />
              Kegiatan
            </label>
            <div class="relative flex-1">
              <select v-model="kegiatan" id="kegiatan" class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 cursor-pointer">
                <option v-for="k in kegiatanList" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
              <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <!-- Satker -->
          <div class="flex items-center gap-4">
            <label for="satker" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
              <Icon icon="mdi:office-building-outline" class="w-4 h-4 text-slate-400" />
              Satker
            </label>
            <div class="relative flex-1">
              <select v-model="satker" id="satker" class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 cursor-pointer">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
              <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <!-- Kode -->
          <div class="flex items-center gap-4">
            <label for="kode" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
              <Icon icon="mdi:code-tags" class="w-4 h-4 text-slate-400" />
              Kode
            </label>
            <input v-model="kode" id="kode" type="text" maxlength="255" placeholder="Kode" class="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200" />
          </div>
          <!-- Nama -->
          <div class="flex items-center gap-4">
            <label for="nama" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
              <Icon icon="mdi:text-box-edit-outline" class="w-4 h-4 text-slate-400" />
              Nama
            </label>
            <textarea v-model="nama" id="nama" maxlength="255" placeholder="Nama" rows="2" class="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 min-h-[48px] max-h-40 resize-y break-words"></textarea>
          </div>
          <!-- Tahun -->
          <div class="flex items-center gap-4">
            <label for="tahun" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
              <Icon icon="mdi:calendar-clock" class="w-4 h-4 text-slate-400" />
              Tahun
            </label>
            <input v-model="tahun" id="tahun" type="text" maxlength="4" placeholder="Tahun" class="flex-1 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-slate-600 cursor-not-allowed transition-all duration-200" readonly />
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
