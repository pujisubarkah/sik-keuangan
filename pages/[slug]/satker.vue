<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Alert Section -->
      <div v-if="showAlert" class="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Tabler Icon: Alert Triangle -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Perhatian: Data Belum Lengkap
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>
                Terdapat <span class="font-bold">41 Sub Output</span> yang belum ditentukan unitnya.
                <a href="/pekerjaan?id_unit=null" class="font-medium underline hover:text-red-900">
                  Klik di sini untuk memperbaiki
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Header Section -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Daftar Satker
          </h2>
        </div>
      </div>

      <!-- Content Card -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        
        <!-- Summary -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span class="text-sm text-gray-500 font-medium">
            Menampilkan {{ satkers.length }} hasil
          </span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm rounded-xl overflow-hidden border border-blue-100 shadow-lg bg-white">
            <thead class="bg-blue-100">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle w-16">No</th>
                <th class="px-3 py-2 text-left font-semibold text-blue-700 align-middle">Nama Satker</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Jumlah Unit</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex justify-center items-center">
                    <!-- Tabler Icon: Loader (Animated) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="ml-2 text-sm">Memuat data...</span>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(satker, index) in satkers" :key="satker.id" class="hover:bg-yellow-50 align-middle transition">
                <td class="px-3 py-2 text-center align-middle font-bold text-blue-700">{{ index + 1 }}</td>
                <td class="px-3 py-2 text-left align-middle">
                  <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ satker.name }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ satker.unitCount }} Unit</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <div class="flex justify-center gap-1">
                    
                    <!-- View Button (Tabler: Eye) -->
                    <button @click="viewSatker(satker.id)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors tooltip" data-tip="Lihat Detail">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <!-- Edit Button (Tabler: Pencil) -->
                    <button @click="editSatker(satker.id)" class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors tooltip" data-tip="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Delete Button (Tabler: Trash) -->
                    <button @click="deleteSatker(satker.id)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors tooltip" data-tip="Hapus">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && satkers.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                  Tidak ada data satker ditemukan.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const satkers = ref([])
const loading = ref(true)
const showAlert = ref(true)


const fetchSatker = async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch('/api/satker/unit_count', { headers })
    let data = []
    if(res.ok) {
      data = await res.json()
    }
    satkers.value = data
  } catch (error) {
    console.error("Gagal mengambil data", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSatker)

const viewSatker = (id) => {
  window.location.href = `/satker/${id}`
}

const editSatker = (id) => {
  window.location.href = `/satker/edit/${id}`
}

const deleteSatker = (id) => {
  if(confirm('Apakah Anda yakin ingin menghapus satker ini?')){
    console.log('Menghapus ID:', id)
  }
}
</script>