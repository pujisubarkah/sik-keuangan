<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import Icon from '~/components/Icon.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)
const tahun = ref(2026)
const satker = ref('1')
const file = ref(null)
const excelData = ref([])
const isLoading = ref(false)
const isDragging = ref(false)
const uploadStatus = ref(null) // 'success' | 'error' | null


const satkers = ref([])

async function fetchSatkers() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await $fetch('/api/satker', { headers })
    console.log('API /api/satker response:', res)
    // Jika response berbentuk { success, data }, ambil data-nya
    if (res && typeof res === 'object' && 'data' in res) {
      satkers.value = Array.isArray(res.data) ? res.data : []
    } else {
      satkers.value = Array.isArray(res) ? res : []
    }
  } catch (err) {
    console.error('Error fetching satkers:', err)
    satkers.value = []
  }
}

fetchSatkers()

const previewData = computed(() => excelData.value.slice(0, 5))
const totalRows = computed(() => excelData.value.length)
const columns = computed(() => excelData.value[0] ? Object.keys(excelData.value[0]) : [])

function handleFileChange(e) {
  const selectedFile = e.target.files?.[0]
  if (selectedFile) processFile(selectedFile)
}

function processFile(selectedFile) {
  file.value = selectedFile
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      excelData.value = XLSX.utils.sheet_to_json(firstSheet)
      uploadStatus.value = 'success'
    } catch (err) {
      console.error('Error parsing file:', err)
      uploadStatus.value = 'error'
      excelData.value = []
    }
  }
  reader.readAsArrayBuffer(selectedFile)
}

// Drag & Drop handlers
function onDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}
function onDragLeave(e) {
  e.preventDefault()
  isDragging.value = false
}
function onDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const droppedFile = e.dataTransfer.files?.[0]
  if (droppedFile?.name?.endsWith('.xlsx') || droppedFile?.name?.endsWith('.xls')) {
    processFile(droppedFile)
  } else {
    alert('Mohon upload file Excel (.xlsx / .xls)')
  }
}

function clearFile() {
  file.value = null
  excelData.value = []
  uploadStatus.value = null
  const input = document.getElementById('file')
  if (input) input.value = ''
}

async function submitForm() {
  if (!file.value) {
    alert('File Excel belum dipilih!')
    return
  }
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Anda belum login atau token tidak ditemukan!')
    return
  }
  isLoading.value = true
  uploadStatus.value = null
  
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('tahun', tahun.value)
  formData.append('satker', satker.value)
  
  try {
    const res = await fetch('/api/rkakl/import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const result = await res.json()

    if (!res.ok || !result.success || !result.inserted) {
      uploadStatus.value = 'error'
      console.error('❌ Backend error:', result)
      alert('❌ Impor gagal: ' + (result?.error || (result?.errors?.[0]?.message ?? 'Tidak ada data yang berhasil diimpor')))
      return
    }
    uploadStatus.value = 'success'
    alert(`✅ Impor berhasil! ${result.inserted} data RKAKL tersimpan.`)
    clearFile()
  } catch (err) {
    console.error('Import error:', err)
    uploadStatus.value = 'error'
    alert('❌ Impor gagal: ' + err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-12 px-4">
    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="max-w-6xl mx-auto mb-6">
      <nav class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-blue-600 transition-colors flex items-center gap-1.5 group">
          <Icon icon="mdi:home" class="w-4 h-4 group-hover:scale-110 transition-transform" /> 
          <span class="font-medium">Dashboard</span>
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-300" />
        <span class="font-semibold text-blue-700">Import RKAKL</span>
      </nav>
    </div>

    <!-- HEADER SECTION -->
    <div class="max-w-6xl mx-auto text-center mb-10">
      <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
        <Icon icon="mdi:upload" class="w-4 h-4" />
        Upload Data RKAKL
      </div>
      <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3">
        Import RKAKL
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Upload file Excel RKAKL Anda untuk diproses ke dalam sistem. 
        Pastikan data telah sesuai dengan template yang ditentukan.
      </p>
    </div>

    <!-- MAIN CARD -->
    <Card class="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-blue-100 overflow-hidden">
      <div class="p-6 md:p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          
          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Tahun -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700" for="tahun">
                Tahun Anggaran <span class="text-red-500">*</span>
              </label>
              <TextField 
                v-model="tahun" 
                id="tahun" 
                type="number" 
                class="w-full transition-all focus:ring-2 focus:ring-blue-200" 
                placeholder="2026" 
                required 
              />
            </div>
            
            <!-- Satker -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700" for="satker">
                Satuan Kerja
              </label>
              <select 
                v-model="satker" 
                id="satker" 
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-700"
              >
                <option v-for="s in satkers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            
          </div>

          <!-- File Upload Zone -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              File Excel <span class="text-red-500">*</span>
            </label>
            <div
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
              :class="[
                'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer',
                isDragging 
                  ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                  : uploadStatus === 'success'
                    ? 'border-green-300 bg-green-50'
                    : uploadStatus === 'error'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              ]"
              @click="$refs.fileInput.click()"
            >
              <input 
                ref="fileInput"
                id="file" 
                type="file" 
                accept=".xlsx,.xls" 
                class="hidden" 
                @change="handleFileChange" 
              />
              
              <!-- Upload States -->
              <div v-if="!file" class="space-y-3">
                <div class="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Icon icon="mdi:file-excel" class="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p class="font-semibold text-gray-700">Drag & drop file Excel di sini</p>
                  <p class="text-sm text-gray-500 mt-1">atau <span class="text-blue-600 font-medium">klik untuk browse</span></p>
                </div>
                <p class="text-xs text-gray-400">Format: .xlsx, .xls • Maksimal 25MB</p>
              </div>
              
              <div v-else class="space-y-3">
                <div class="flex items-center justify-center gap-3">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:file-check" class="w-6 h-6 text-green-600" />
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-medium text-gray-700 truncate max-w-xs">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">{{ (file.size / 1024).toFixed(1) }} KB</p>
                  </div>
                  <button 
                    type="button"
                    @click.stop="clearFile"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                  >
                    <Icon icon="mdi:close" class="w-5 h-5" />
                  </button>
                </div>
                
                <!-- Success/Error Badge -->
                <div v-if="uploadStatus === 'success'" class="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                  <Icon icon="mdi:check-circle" class="w-4 h-4" />
                  File valid • {{ totalRows }} baris terdeteksi
                </div>
                <div v-if="uploadStatus === 'error'" class="inline-flex items-center gap-1.5 text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
                  <Icon icon="mdi:alert-circle" class="w-4 h-4" />
                  Format file tidak valid
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-gray-100">
            <Button 
              type="success" 
              native-type="submit" 
              :disabled="isLoading || !file"
              class="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/70"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Memproses...
              </span>
              <span v-else class="flex items-center gap-2">
                <Icon icon="mdi:cloud-upload" class="w-5 h-5" />
                Proses Impor Data
              </span>
            </Button>
            
            <button
              type="button"
              @click="clearFile"
              :disabled="!file || isLoading"
              class="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reset Form
            </button>
          </div>
          
          <!-- Loading Status -->
          <div v-if="isLoading" class="flex items-center gap-3 text-blue-600 text-sm justify-center animate-pulse">
            <Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
            <span>File sedang diupload dan diproses...</span>
          </div>
        </form>

        <!-- Data Preview Section -->
        <div v-if="previewData.length" class="mt-10 pt-8 border-t border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Icon icon="mdi:table-eye" class="w-5 h-5 text-blue-600" />
              Preview Data
            </h4>
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Menampilkan {{ previewData.length }} dari {{ totalRows }} baris
            </span>
          </div>
          
          <div class="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th 
                      v-for="(col, idx) in columns" 
                      :key="idx"
                      class="px-4 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider whitespace-nowrap"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-50">
                  <tr 
                    v-for="(row, rowIdx) in previewData" 
                    :key="rowIdx" 
                    class="hover:bg-blue-50/60 transition-colors group"
                  >
                    <td 
                      v-for="(val, colKey) in row" 
                      :key="colKey"
                      class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap group-hover:text-blue-700 transition-colors"
                    >
                      {{ val ?? '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Preview Helper -->
          <div class="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <Icon icon="mdi:information" class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>Preview hanya menampilkan 5 baris pertama. Data lengkap akan diproses sesuai rentang baris yang Anda tentukan.</span>
          </div>
        </div>

        <!-- Empty State for Preview -->
        <div v-else-if="file && !excelData.length && uploadStatus !== 'error'" class="mt-8 text-center py-8 text-gray-400">
          <Icon icon="mdi:file-table" class="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p class="text-sm">Memproses file...</p>
        </div>

      </div>
    </Card>

    <!-- Helper Footer -->
    <div class="max-w-6xl mx-auto mt-8 text-center">
      <p class="text-sm text-gray-500">
        Butuh bantuan? 
        <a href="#" class="text-blue-600 hover:underline font-medium">Lihat panduan import RKAKL</a>
        atau hubungi <span class="font-medium">helpdesk@lan.go.id</span>
      </p>
    </div>
  </div>
</template>

<style scoped>

/* Custom scrollbar for preview table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 9999px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Glow effect on focus for inputs */
input:focus, select:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}
</style>