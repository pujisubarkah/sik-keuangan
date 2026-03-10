<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed, onMounted } from 'vue'

import Icon from '~/components/Icon.vue'



const tahun = ref(2026)
const satker = ref('1')
const file = ref(null)
const fileName = ref('')


// RKAKL Import Log terbaru
const latestImport = ref(null)

async function fetchLatestImport() {
  try {
    // Ganti endpoint sesuai backend, misal: /api/rkakl_import_log?limit=1&order=desc
    const res = await $fetch('/api/rkakl_import_log?limit=1&order=desc')
    latestImport.value = Array.isArray(res) && res.length > 0 ? res[0] : null
  } catch (err) {
    latestImport.value = null
  }
}

fetchLatestImport()

const satkers = ref([])

async function fetchSatkers() {
  // This function will be replaced
  // with fetchSatker that uses Authorization header
  try {
    const res = await $fetch('/api/satker')
    satkers.value = Array.isArray(res) ? res : []
  } catch (err) {
    satkers.value = []
  }
}

const fetchSatker = async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await $fetch('/api/satker', { headers })
    satkers.value = Array.isArray(res) ? res : []
  } catch (err) {
    satkers.value = []
  }
}

onMounted(() => {
  fetchSatker()
  fetchLatestImport()
})

function handleFileChange(e) {
  file.value = e.target.files[0]
}

async function submitForm() {
  try {
    const formData = new FormData()
    formData.append('tahun', tahun.value)
    formData.append('satker', satker.value)
    formData.append('file', file.value)
    // barisAwal and barisAkhir are not needed in FormData
    await $fetch('/api/rkakl/import', {
      method: 'POST',
      body: formData
    })
    alert('Impor RKAKL diproses!')
    await fetchLatestImport()
  } catch (err) {
    alert('Gagal impor RKAKL!')
  }
}
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Import RKAKL</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Import RKAKL
    </h1>

    <!-- CARD -->
    <Card class="bg-white shadow-xl rounded-xl border border-blue-100">
      <template #default>
        <h3 class="text-xl font-bold mb-6">Form Import</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <TextField v-model="tahun" id="tahun" type="number" class="w-full" placeholder="Tahun" required />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="satker">Satker</label>
              <select v-model="satker" id="satker" class="select select-bordered w-full">
                <option v-for="s in satkers" :key="s.id || s.value" :value="s.id || s.value">{{ s.name || s.text }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block font-semibold mb-1" for="file">File</label>
              <input id="file" type="file" class="file-input file-input-bordered w-full" @change="handleFileChange" />
            </div>

          </div>
          <div class="mt-6">
            <Button type="success" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Proses Impor RKAKL
            </Button>
          </div>
        </form>
      </template>
    </Card>

    <!-- DATA IMPORT TERBARU -->
    <div v-if="latestImport" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 class="font-bold text-blue-700 mb-2">Data Import RKAKL Terbaru</h3>
      <div class="text-sm text-gray-700">
        <div><b>File:</b> {{ latestImport.file_name || '-' }}</div>
        <div><b>Tanggal Import:</b> {{ latestImport.created_at ? new Date(latestImport.created_at).toLocaleString() : '-' }}</div>
        <div><b>Satker:</b> {{ latestImport.satker_name || latestImport.satker_id || '-' }}</div>
        <div><b>Tahun:</b> {{ latestImport.tahun || '-' }}</div>
        <!-- Tambahkan field lain sesuai kebutuhan -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for cards */
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<style scoped>
/* Smooth transitions for all interactive elements */
button, input, select, .border-dashed {
  transition-property: all;
  transition-duration: 200ms;
}

/* Custom scrollbar for preview table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 9999px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* bg-gray-300 */
  border-radius: 9999px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* bg-gray-400 */
}

/* Glow effect on focus for inputs */
input:focus, select:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}
</style>