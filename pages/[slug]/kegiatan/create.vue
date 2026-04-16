<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const showAlert = ref(true)
const program = ref('')
const satker = ref('1')
const kode = ref('')
const nama = ref('')
const tahun = ref('2026')

import { onMounted } from 'vue'
const programList = ref([{ value: '', label: '- Pilih Program -' }])
const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])

onMounted(async () => {
  // Fetch program
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch('/api/program', { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      programList.value = [
        { value: '', label: '- Pilih Program -' },
        ...json.data.map(item => ({
          value: item.id,
          label: `${item.kode_program} - ${item.nama_program}`
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
    // Cari kode_program dari program terpilih
    const selectedProgram = programList.value.find(p => p.value == program.value)
    let kodeProgram = ''
    if (selectedProgram && selectedProgram.label) {
      // label: "001 - Nama Program", ambil sebelum ' - '
      kodeProgram = selectedProgram.label.split(' - ')[0]
    }
    // Kirim data ke endpoint kegiatan (bukan output)
    const res = await fetch('/api/kegiatan', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        kode_program: kodeProgram,
        program_id: program.value,
        satker_id: satker.value,
        kode_kegiatan: kode.value,
        nama_kegiatan: nama.value,
        tahun: tahun.value
      })
    })
    const json = await res.json()
    if (json.success) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 2000)
      // reset form jika perlu
      kode.value = ''
      nama.value = ''
      program.value = ''
    } else {
      alert(json.message || 'Gagal menyimpan kegiatan!')
    }
  } catch (e) {
    alert('Gagal menyimpan kegiatan!')
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
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700 flex items-center gap-1">
        Beranda
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/output" class="hover:text-blue-700">Output</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Input</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      SIK - Input Kegiatan
    </h1>

    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-[#D69009]">
      <div class="px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Tambah Kegiatan</h1>
        <p class="text-gray-500 text-sm mt-1">Lengkapi detail kegiatan di bawah ini.</p>
      </div>
      <form class="px-8 py-8" @submit.prevent="submitForm">
        <div class="space-y-6">
          <!-- Program -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="program">Program</label>
            <div class="col-span-9">
              <select v-model="program" id="program" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="p in programList" :key="p.value" :value="p.value">{{ p.label }}</option>
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
          <Button type="success" class="rounded-xl shadow-lg bg-green-600 hover:bg-green-700 transition-transform duration-150 px-8 py-3 font-semibold text-lg text-white" native-type="submit">
            Simpan
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
