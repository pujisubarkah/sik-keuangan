<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Alert Suboutput Belum Lengkap -->
      <SuboutputAlert :showAlert="true" />

      <!-- Header Section -->
      <div class="mb-6 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Perencanaan {{ selectedSatkerName || 'Semua Satker' }} Tahun {{ filterForm.tahun }}
          </h2>
        </div>
      </div>

      <!-- Filter Card -->
      <div class="mb-6 overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 class="flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Data
          </h3>
          <button v-if="hasActiveFilters" @click="resetFilters"
            class="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="filterData" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
              <!-- 🏢 Satker Select -->
              <div class="md:col-span-4">
                <label class="mb-1 block text-sm font-medium text-gray-700">Satker</label>
                <div class="relative">
                  <select v-model="filterForm.id_satker" @change="onSatkerChange"
                    class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    name="PerencanaanForm[id_satker]">
                    <option value="">- Semua Satker -</option>
                    <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.text }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- 🏭 Unit Select -->
              <div class="md:col-span-4">
                <label class="mb-1 block text-sm font-medium text-gray-700">Unit</label>
                <div class="relative">
                  <select v-model="filterForm.id_unit"
                    class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                    :disabled="!filterForm.id_satker" name="PerencanaanForm[id_unit]">
                    <option value="">- Semua Unit -</option>
                    <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
                  </select>
                </div>
              </div>

              <!-- 📅 Year Input -->
              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-gray-700">Tahun</label>
                <input v-model.number="filterForm.tahun" type="number" min="2000" max="2100" placeholder="2026"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center" />
              </div>

              <!-- 🔍 Submit Button -->
              <div class="flex items-end md:col-span-2">
                <button type="submit"
                  class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                    </path>
                  </svg>
                  <span>Tampilkan</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
          <div class="px-6 py-4">
            <dt class="truncate text-sm font-medium text-gray-500">Pagu Anggaran</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">{{ formatCurrency(totalStats.pagu) }}</dd>
          </div>
        </div>
        <div class="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
          <div class="px-6 py-4">
            <dt class="truncate text-sm font-medium text-gray-500">Perencanaan</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">{{ formatCurrency(totalStats.perencanaan) }}</dd>
          </div>
        </div>
        <div class="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
          <div class="px-6 py-4">
            <dt class="truncate text-sm font-medium text-gray-500">Selisih</dt>
            <dd class="mt-1 text-2xl font-semibold" :class="totalStats.selisih >= 0 ? 'text-red-600' : 'text-green-600'">
              {{ formatCurrency(totalStats.selisih) }}
            </dd>
          </div>
        </div>
      </div>

 

      <!-- Data Table Card -->
      <div class="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">

        <!-- Summary -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <span class="text-sm font-medium text-gray-500">
            Menampilkan {{ suboutputData.length }} hasil
          </span>
          <!-- Debug info (bisa dihapus setelah fix) -->
          <span v-if="debugMode" class="text-xs text-gray-400">
            Query: {{ debugQuery }}
          </span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto bg-white p-4 shadow-lg rounded-xl">
          <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
            <thead class="sticky top-0 z-10 bg-blue-100">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Rincian Output</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Pagu</th>
                <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Perencanaan</th>
                <th class="px-3 py-2 text-center font-semibold text-red-700 align-middle">Selisih</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin text-indigo-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="ml-2 text-sm">Memuat data...</span>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(item, index) in suboutputData" :key="item.id" class="align-middle hover:bg-yellow-50">
                <td class="px-3 py-2 text-center align-middle">{{ index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ item.kode }}</td>
                <td class="px-3 py-2 align-middle">
                  <template v-if="item.suboutput_id">
                    <NuxtLink :to="`/${$route.params.slug}/suboutput/${item.suboutput_id}`"
                      class="font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 hover:underline">
                      {{ item.suboutput }}
                    </NuxtLink>
                  </template>
                  <template v-else>
                    <span class="text-gray-400">{{ item.suboutput }}</span>
                  </template>
                </td>
                <td class="px-3 py-2 text-right align-middle">
                  <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.pagu) }}</span>
                </td>
                <td class="px-3 py-2 text-right align-middle">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.perencanaan) }}</span>
                </td>
                <td class="px-3 py-2 text-right align-middle">
                  <span :class="item.selisih >= 0 ? 'inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold' : 'inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold'">
                    {{ formatCurrency(item.selisih) }}
                  </span>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && suboutputData.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mb-2 h-12 w-12 text-gray-300" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">Tidak ada data ditemukan.</p>
                    <p v-if="hasActiveFilters" class="mt-1 text-xs text-gray-400">
                      Coba reset filter atau periksa parameter pencarian.
                    </p>
                    <button v-if="hasActiveFilters" @click="resetFilters"
                      class="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                      Reset filter
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Total Row -->
      <div class="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <table class="min-w-full text-xs">
          <tbody>
            <tr class="bg-blue-50 font-bold">
              <td colspan="3" class="px-3 py-2 text-right align-middle">TOTAL</td>
              <td class="px-3 py-2 text-right align-middle">
                <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">
                  {{ formatCurrency(suboutputData.reduce((a, b) => a + (b.pagu || 0), 0)) }}
                </span>
              </td>
              <td class="px-3 py-2 text-right align-middle">
                <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">
                  {{ formatCurrency(suboutputData.reduce((a, b) => a + (b.perencanaan || 0), 0)) }}
                </span>
              </td>
              <td class="px-3 py-2 text-right align-middle">
                <span :class="(suboutputData.reduce((a, b) => a + (b.selisih || 0), 0)) >= 0 ? 'inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold' : 'inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold'">
                  {{ formatCurrency(suboutputData.reduce((a, b) => a + (b.selisih || 0), 0)) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// NuxtLink diimport otomatis dari '#imports' oleh Nuxt 3, tidak perlu import manual
import SuboutputAlert from '@/components/SuboutputAlert.vue'

// Config
const debugMode = false // Set true untuk debugging query

// Reactive data
const loading = ref(false)
const filterForm = ref({
  id_satker: '', // Empty = semua satker
  id_unit: '',
  tahun: new Date().getFullYear()
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const satkerOptions = ref([])
const unitOptions = ref([{ text: '- Semua Unit -', value: '' }])
const suboutputData = ref([])
const totalStats = ref({ pagu: 0, perencanaan: 0, selisih: 0 })

// Debug helper
const debugQuery = ref('')

// Computed
const selectedSatkerName = computed(() => {
  if (!filterForm.value.id_satker) return 'Semua Satker'
  const found = satkerOptions.value.find(s => s.value === filterForm.value.id_satker)
  return found?.text || 'Semua Satker'
})

const hasActiveFilters = computed(() => {
  return filterForm.value.id_satker || filterForm.value.id_unit || filterForm.value.tahun !== new Date().getFullYear()
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return suboutputData.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(suboutputData.value.length / itemsPerPage))

// Methods
const resetFilters = () => {
  filterForm.value = {
    id_satker: '',
    id_unit: '',
    tahun: new Date().getFullYear()
  }
  currentPage.value = 1
  unitOptions.value = [{ text: '- Semua Unit -', value: '' }]
  filterData() // Langsung fetch data setelah reset
}

const onSatkerChange = () => {
  filterForm.value.id_unit = '' // Reset unit ketika satker berubah
  loadUnitList()
  // Auto-fetch ketika satker dipilih (opsional, bisa di-comment jika ingin manual submit)
  // filterData()
}

const loadUnitList = async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const satkerId = filterForm.value.id_satker

  if (!satkerId) {
    unitOptions.value = [{ text: '- Semua Unit -', value: '' }]
    return
  }

  try {
    const unitRes = await $fetch(`/api/unit_kerja/satker/${satkerId}`, { headers })
    unitOptions.value = [
      { text: '- Semua Unit -', value: '' },
      ...unitRes.map(item => ({ text: item.name, value: item.id }))
    ]
  } catch (err) {
    console.error('Error fetching unit_kerja by satker:', err)
    unitOptions.value = [{ text: '- Semua Unit -', value: '' }]
  }
}

const buildQueryParams = () => {
  const params = new URLSearchParams()

  // Hanya tambahkan parameter jika memiliki nilai (truthy)
  if (filterForm.value.id_satker) {
    params.append('satker_id', filterForm.value.id_satker)
  }
  if (filterForm.value.id_unit) {
    params.append('unit_id', filterForm.value.id_unit)
  }
  if (filterForm.value.tahun) {
    params.append('tahun', filterForm.value.tahun)
  }

  const queryString = params.toString()

  // Debug log
  if (debugMode) {
    debugQuery.value = queryString || '(no params - fetch all)'
    console.log('[Filter Query]', queryString ? `?${queryString}` : 'no query')
  }

  // Return endpoint URL: jika ada params tambahkan ?, jika tidak return endpoint polos
  return queryString ? `/api/suboutput?${queryString}` : '/api/suboutput'
}

const filterData = async () => {
  loading.value = true
  currentPage.value = 1

  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  // Build URL dengan query params yang benar
  const endpoint = buildQueryParams()

  console.log('API endpoint:', endpoint)

  try {
    const res = await $fetch(endpoint, { headers })

    console.log('API response:', res)

    // Handle response: bisa array langsung atau object dengan data property
    const dataArray = Array.isArray(res) ? res : (res.data || res.items || [])

    // Map response sesuai struktur API
    suboutputData.value = dataArray.map(item => {
      const pagu = Number(item.total) || 0
      const perencanaan = Number(item.perencanaan) || 0 // Diambil dari API
      const selisih = pagu - perencanaan
      return {
        id: item.id,
        suboutput_id: item.suboutput_id, // <-- fix agar NuxtLink benar
        kode: item.kode_suboutput || '',
        suboutput: item.nama_suboutput || '',
        output_id: item.output_id,
        pagu,
        perencanaan,
        selisih
      }
    })

    // Calculate totals
    totalStats.value.pagu = suboutputData.value.reduce((a, b) => a + (b.pagu || 0), 0)
    totalStats.value.perencanaan = suboutputData.value.reduce((a, b) => a + (b.perencanaan || 0), 0)
    totalStats.value.selisih = suboutputData.value.reduce((a, b) => a + (b.selisih || 0), 0)

    // Debug log hasil
    if (debugMode) {
      console.log('[Fetched Data]', suboutputData.value.length, 'items')
    }

  } catch (err) {
    console.error('Error fetching perencanaan:', err)
    suboutputData.value = []
    totalStats.value = { pagu: 0, perencanaan: 0, selisih: 0 }
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    // 1. Fetch satker options
    const satkerRes = await $fetch('/api/satker', { headers })
    const satkerData = Array.isArray(satkerRes) ? satkerRes : satkerRes.data || []
    satkerOptions.value = satkerData.map(item => ({ text: item.name, value: item.id }))

    // 2. Jika hanya ada 1 satker, auto-select (opsional)
    if (satkerOptions.value.length === 1) {
      filterForm.value.id_satker = satkerOptions.value[0].value
      await loadUnitList()
    }

    // 3. Fetch data awal dengan filter saat ini (bisa kosong = semua data)
    await filterData()

  } catch (err) {
    console.error('Error on mounted:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>