<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const tahun = ref(2026)
const satker = ref('1')
const file = ref(null)
const fileName = ref('')
const barisAwal = ref('')
const barisAkhir = ref('')
const loading = ref(false)
const alertMsg = ref({ show: false, type: '', text: '' })
const hasilImport = ref(null)

const satkers = [
  { id: '1', name: 'LAN JAKARTA' },
  { id: '2', name: 'PUSJAR SKTASN NAS' },
  { id: '3', name: 'PUSJAR SKMP' },
  { id: '4', name: 'PUSJAR SKPP' },
  { id: '5', name: 'PUSJAR SKMK' },
  { id: '6', name: 'STIA LAN BANDUNG' },
  { id: '7', name: 'STIA LAN JAKARTA' },
  { id: '8', name: 'STIA MAKASSAR' },
]

function handleFileChange(e) {
  const selected = e.target.files[0]
  if (selected) {
    file.value = selected
    fileName.value = selected.name
  }
}

function clearFile() {
  file.value = null
  fileName.value = ''
}

function handleDrop(e) {
  const files = e.dataTransfer?.files
  if (files?.[0]) {
    file.value = files[0]
    fileName.value = files[0].name
  }
}

function showAlertMsg(type, text) {
  alertMsg.value = { show: true, type, text }
  setTimeout(() => { alertMsg.value.show = false }, 5000)
}

async function submitForm() {
  if (!file.value) {
    showAlertMsg('error', 'File belum dipilih')
    return
  }

  loading.value = true
  hasilImport.value = null

  try {
    const formData = new FormData()
    formData.append("file", file.value)
    formData.append("tahun", tahun.value)
    formData.append("satker", satker.value)
    formData.append("barisAwal", barisAwal.value)
    formData.append("barisAkhir", barisAkhir.value)

    const res = await $fetch("/api/rkakl_detail", {
      method: "POST",
      body: formData
    })

    hasilImport.value = res
    showAlertMsg('success', `✅ Import berhasil! Total data: ${res.total_insert || res.total}`)

  } catch (err) {
    console.error("Import error:", err)
    const msg = err?.data?.statusMessage || err?.message || "Terjadi kesalahan tidak diketahui"
    showAlertMsg('error', `❌ Import gagal: ${msg}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
    
    <!-- HEADER -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 bg-blue-100 rounded-lg">
          <Icon icon="mdi:database-import" class="w-6 h-6 text-blue-600" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          Import Data RKAKL
        </h1>
      </div>
      <p class="text-gray-600 ml-11">
        Upload file Excel RKA-KL untuk diproses ke dalam sistem keuangan
      </p>
    </div>

    <!-- ALERT NOTIFICATION -->
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="alertMsg.show"
        :class="[
          'max-w-6xl mx-auto mb-6 p-4 rounded-xl border shadow-sm flex items-start gap-3',
          alertMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        ]"
      >
        <Icon 
          :icon="alertMsg.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" 
          class="w-5 h-5 mt-0.5 flex-shrink-0"
        />
        <span class="text-sm font-medium">{{ alertMsg.text }}</span>
        <button 
          @click="alertMsg.show = false"
          class="ml-auto text-gray-400 hover:text-gray-600 transition"
        >
          <Icon icon="mdi:close" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- FORM CARD -->
      <Card class="bg-white shadow-xl rounded-2xl border border-blue-100 overflow-hidden">
        <div class="p-6 md:p-8">
          
          <div class="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Icon icon="mdi:form-select" class="w-5 h-5 text-blue-600" />
            <h3 class="text-xl font-bold text-gray-800">Form Import</h3>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            
            <!-- Grid Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <!-- Tahun -->
              <div class="relative group">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <Icon icon="mdi:calendar" class="w-4 h-4 text-blue-500" />
                    Tahun Anggaran
                  </span>
                </label>
                <TextField
                  v-model="tahun"
                  type="number"
                  class="w-full transition-all focus:ring-2 focus:ring-blue-200"
                  placeholder="Contoh: 2026"
                />
                <p class="mt-1 text-xs text-gray-400">Tahun anggaran dokumen RKAKL</p>
              </div>

              <!-- Satker -->
              <div class="relative group">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <Icon icon="mdi:office-building" class="w-4 h-4 text-blue-500" />
                    Satuan Kerja
                  </span>
                </label>
                <select
                  v-model="satker"
                  class="select select-bordered w-full bg-white hover:border-blue-300 focus:border-blue-500 transition-all"
                >
                  <option disabled value="">Pilih Satker</option>
                  <option
                    v-for="s in satkers"
                    :key="s.id"
                    :value="s.id"
                  >
                    {{ s.name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-400">Unit kerja pemilik dokumen</p>
              </div>

              <!-- File Upload - Drag & Drop Style -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <Icon icon="mdi:file-excel" class="w-4 h-4 text-green-500" />
                    File Excel RKAKL
                  </span>
                </label>
                
                <!-- ✅ FIX: class dan :class dipisah, struktur div rapi -->
                <div
                  :class="[
                    'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                    'hover:border-blue-400 hover:bg-blue-50/50',
                    fileName ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-gray-50'
                  ]"
                  @click="$refs.fileInput.click()"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    class="hidden"
                    accept=".xls,.xlsx"
                    @change="handleFileChange"
                  />
                  
                  <div v-if="!fileName" class="space-y-2">
                    <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:cloud-upload" class="w-6 h-6 text-blue-600" />
                    </div>
                    <p class="text-sm font-medium text-gray-700">
                      Klik atau drag file Excel ke sini
                    </p>
                    <p class="text-xs text-gray-400">
                      Format: .xlsx atau .xls • Maksimal 50MB
                    </p>
                  </div>
                  
                  <div v-else class="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div class="flex items-center gap-3">
                      <div class="p-2 bg-green-100 rounded-lg">
                        <Icon icon="mdi:file-excel-outline" class="w-5 h-5 text-green-600" />
                      </div>
                      <div class="text-left">
                        <p class="text-sm font-medium text-gray-800 truncate max-w-xs">
                          {{ fileName }}
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ (file?.size / 1024 / 1024).toFixed(2) }} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click.stop="clearFile"
                      class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Icon icon="mdi:close" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Baris Awal & Akhir -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Baris Awal (Opsional)
                </label>
                <TextField
                  v-model="barisAwal"
                  type="number"
                  placeholder="Kosongkan untuk mulai dari awal"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Baris Akhir (Opsional)
                </label>
                <TextField
                  v-model="barisAkhir"
                  type="number"
                  placeholder="Kosongkan untuk sampai akhir"
                  class="w-full"
                />
              </div>

            </div>

            <!-- Submit Button -->
            <div class="pt-4 border-t border-gray-100">
              <Button
                type="success"
                native-type="submit"
                :disabled="loading || !file"
                class="w-full md:w-auto px-8 py-3 text-base font-semibold transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
              >
                <span class="flex items-center justify-center gap-2">
                  <Icon 
                    :icon="loading ? 'mdi:loading' : 'mdi:rocket-launch'" 
                    class="w-5 h-5"
                    :class="{ 'animate-spin': loading }"
                  />
                  {{ loading ? "Sedang Memproses..." : "🚀 Proses Impor Data" }}
                </span>
              </Button>
              <p class="mt-3 text-xs text-gray-400 text-center md:text-left">
                <Icon icon="mdi:information" class="w-3 h-3 inline mr-1" />
                Pastikan format file sesuai template RKAKL resmi
              </p>
            </div>

          </form>
        </div>
      </Card>

      <!-- PREVIEW DATA SECTION -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <Card 
          v-if="hasilImport" 
          class="bg-white shadow-xl rounded-2xl border border-green-100 overflow-hidden"
        >
          <div class="p-6 md:p-8">
            
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="p-2 bg-green-100 rounded-lg">
                  <Icon icon="mdi:table-eye" class="w-5 h-5 text-green-600" />
                </div>
                <h3 class="text-xl font-bold text-gray-800">Preview Hasil Import</h3>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {{ hasilImport.total_insert || hasilImport.total }} Data
              </span>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-blue-700">{{ hasilImport.total_insert || hasilImport.total }}</p>
                <p class="text-xs text-blue-600">Total Record</p>
              </div>
              <div class="bg-indigo-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-indigo-700">10</p>
                <p class="text-xs text-indigo-600">Preview</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-green-700">✓</p>
                <p class="text-xs text-green-600">Valid</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-gray-700">2026</p>
                <p class="text-xs text-gray-600">Tahun</p>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto rounded-xl border border-gray-200">
              <table class="table table-zebra w-full">
                <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th class="text-sm font-semibold">Program</th>
                    <th class="text-sm font-semibold">Kegiatan</th>
                    <th class="text-sm font-semibold">Output</th>
                    <th class="text-sm font-semibold">Akun</th>
                    <th class="text-sm font-semibold text-right">Volume</th>
                    <th class="text-sm font-semibold">Satuan</th>
                    <th class="text-sm font-semibold text-right">Harga</th>
                    <th class="text-sm font-semibold text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr 
                    v-for="(row, i) in (hasilImport.preview || hasilImport.data || [])" 
                    :key="i"
                    class="hover:bg-blue-50/50 transition"
                  >
                    <td class="font-mono text-xs text-gray-600">{{ row.program_kode }}</td>
                    <td class="font-mono text-xs text-gray-600">{{ row.kegiatan_kode }}</td>
                    <td class="font-mono text-xs text-gray-600">{{ row.output_kode }}</td>
                    <td class="font-mono text-xs font-semibold text-blue-600">{{ row.akun_kode }}</td>
                    <td class="text-right font-medium">{{ row.volume?.toLocaleString() }}</td>
                    <td class="text-gray-600">{{ row.satuan }}</td>
                    <td class="text-right font-medium text-gray-700">
                      {{ typeof row.harga_satuan === 'number' ? row.harga_satuan.toLocaleString('id-ID') : row.harga_satuan }}
                    </td>
                    <td class="text-right font-bold text-green-700">
                      {{ typeof row.jumlah === 'number' ? row.jumlah.toLocaleString('id-ID') : row.jumlah }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Info Footer -->
            <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p class="text-xs text-blue-700 flex items-start gap-2">
                <Icon icon="mdi:information-outline" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                Preview menampilkan 10 data pertama. Semua data telah diproses dan siap disimpan ke database.
              </p>
            </div>

          </div>
        </Card>
      </Transition>

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
