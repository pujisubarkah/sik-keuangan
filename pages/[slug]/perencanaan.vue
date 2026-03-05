<!-- filepath: c:\Users\user\Documents\sik-keuangan\pages\admin\perencanaan.vue -->
<template>
  <div class="pt-14 px-1 md:px-2">
    <div class="w-full max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">Perencanaan LAN JAKARTA Tahun 2026</h1>
      <!-- Filter Form: Konsisten dengan DashboardFilter.vue -->
      <div class="filter-card bg-gradient-to-br from-white to-blue-50/30 shadow-xl mb-6 rounded-2xl border border-blue-200/60 backdrop-blur-sm overflow-hidden animate-fade-in-up">
        <div class="h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500" />
        <div class="p-5 md:p-6">
          <div class="flex items-center justify-between mb-5 pb-4 border-b border-blue-100">
            <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2.5">
              <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <IconFilter class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <span>Filter Data</span>
            </h2>
            <button v-if="hasActiveFilters" @click="resetFilters" class="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50" title="Reset semua filter">
              <IconRefresh class="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
          <form @submit.prevent="filterData" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <!-- 🏢 Satker Select -->
              <div class="md:col-span-4">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <IconBuilding class="w-4 h-4 text-blue-500" />
                  <span>Satker</span>
                  <span v-if="filterForm.id_satker" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
                </label>
                <div class="relative">
                  <select v-model="filterForm.id_satker" @change="loadUnitList" class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer" name="PerencanaanForm[id_satker]" :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.id_satker }">
                    <option value="" disabled selected>Pilih Satker...</option>
                    <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.text }}</option>
                  </select>
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconBuilding class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconChevronDown class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <!-- 🏭 Unit Select -->
              <div class="md:col-span-4">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <IconSitemap class="w-4 h-4 text-blue-500" />
                  <span>Unit</span>
                  <span v-if="filterForm.id_unit" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
                </label>
                <div class="relative">
                  <select v-model="filterForm.id_unit" class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed" name="PerencanaanForm[id_unit]" :disabled="!filterForm.id_satker" :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.id_unit }">
                    <option value="" disabled selected>{{ filterForm.id_satker ? 'Pilih Unit...' : 'Pilih Satker dulu' }}</option>
                    <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
                  </select>
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconUsersGroup class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconChevronDown class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <p v-if="!filterForm.id_satker" class="text-xs text-gray-400 mt-1 ml-1">
                  <IconInfoCircle class="w-3 h-3 inline mr-0.5" />
                  Pilih satker untuk menampilkan unit
                </p>
              </div>
              <!-- 📅 Year Input -->
              <div class="md:col-span-2">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <IconCalendar class="w-4 h-4 text-blue-500" />
                  <span>Tahun</span>
                </label>
                <div class="relative">
                  <input v-model.number="filterForm.tahun" type="number" min="2000" max="2100" placeholder="2026" class="input input-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 text-center font-mono" />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconCalendarTime class="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <!-- 🔍 Submit Button -->
              <div class="md:col-span-2 flex items-end">
                <button type="submit" class="btn btn-gradient w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group">
                  <IconSearch class="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Tampilkan</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <StatBox title="Pagu Anggaran" :value="formatCurrency(totalStats.pagu)" color="blue" />
        <StatBox title="Perencanaan" :value="formatCurrency(totalStats.perencanaan)" color="green" link="/admin/perencanaan" />
        <StatBox title="Selisih" :value="formatCurrency(totalStats.selisih)" color="red" />
      </div>
      <!-- Data Table -->
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100">
        <div class="card-body p-3 md:p-4">
          <h2 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Icon icon="mdi:view-list" class="w-5 h-5 text-blue-500" />
            Perencanaan
          </h2>
          <div class="w-full">
            <table class="table table-sm w-full rounded-xl overflow-hidden compact-table">
              <thead>
                <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                  <th class="text-center rounded-tl-xl" style="width: 50px;">No</th>
                  <th class="text-center" style="width: 120px;">Kode</th>
                  <th style="width: auto;">Suboutput</th>
                  <th class="text-right" style="width: 140px;">Pagu</th>
                  <th class="text-right" style="width: 140px;">Perencanaan</th>
                  <th class="text-right rounded-tr-xl" style="width: 140px;">Selisih</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                  <td class="text-center font-bold text-blue-700">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="text-center font-semibold text-blue-600 text-sm">{{ item.kode }}</td>
                  <td class="text-blue-700 font-semibold truncate-cell">
                    <NuxtLink :to="`/${$route.params.slug}/suboutput/${item.id}`" class="link link-primary font-semibold">{{ item.suboutput }}</NuxtLink>
                  </td>
                  <td class="text-right text-green-700 font-bold pagu-cell"><span class="badge badge-primary" style="font-size:inherit">{{ formatCurrency(item.pagu) }}</span></td>
                  <td class="text-right text-blue-700 font-bold perencanaan-cell"><NuxtLink :to="`/${$route.params.slug}/suboutput/${item.id}`" class="badge badge-success" style="font-size:inherit">{{ formatCurrency(item.perencanaan) }}</NuxtLink></td>
                  <td class="text-right text-red-700 font-bold selisih-cell"><span class="badge badge-error" style="font-size:inherit">{{ formatCurrency(item.selisih) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="flex justify-center mt-4">
            <div class="btn-group">
              <button class="btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">«</button>
              <button class="btn btn-sm">Page {{ currentPage }} of {{ totalPages }}</button>
              <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconFilter, IconRefresh, IconBuilding, IconChevronDown, IconSitemap, IconUsersGroup, IconInfoCircle, IconCalendar, IconCalendarTime, IconSearch } from '@tabler/icons-vue';
import StatBox from '~/components/UI/StatBox.vue'
import { NuxtLink } from '#components'

// Reactive data
const drawerOpen = ref(false)
const sidebarRail = ref(false)
const filterForm = ref({
  id_satker: '1', // LAN JAKARTA selected by default
  id_unit: '',
  tahun: '2026'
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const satkerOptions = ref([])

const unitOptions = ref([{ text: '- Semua Unit -', value: '' }])

const suboutputData = ref([])

const totalStats = ref({ pagu: 0, perencanaan: 0, selisih: 0 })

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return suboutputData.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(suboutputData.value.length / itemsPerPage))

// Methods
const toggleSidebar = () => {
  sidebarRail.value = !sidebarRail.value
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
    unitOptions.value = [{ text: '- Semua Unit -', value: '' }, ...unitRes.map(item => ({ text: item.name, value: item.id }))]
  } catch (err) {
    console.error('Error fetching unit_kerja by satker:', err)
    unitOptions.value = [{ text: '- Semua Unit -', value: '' }]
  }
}

const filterData = async () => {
  currentPage.value = 1
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const params = []
  if (filterForm.value.id_satker) params.push(`satker_id=${filterForm.value.id_satker}`)
  if (filterForm.value.id_unit) params.push(`unit_id=${filterForm.value.id_unit}`)
  if (filterForm.value.tahun) params.push(`tahun=${filterForm.value.tahun}`)
  const query = params.length ? `?${params.join('&')}` : ''
  try {
    const res = await $fetch(`/api/suboutput${query}`, { headers })
    suboutputData.value = res.map(item => {
      const pagu = Number(item.anggaran)
      const perencanaan = 0
      const selisih = pagu - perencanaan
      return {
        id: item.id,
        kode: item.kode,
        suboutput: item.nama,
        pagu,
        perencanaan,
        selisih
      }
    })
    totalStats.value.pagu = suboutputData.value.reduce((a, b) => a + b.pagu, 0)
    totalStats.value.perencanaan = suboutputData.value.reduce((a, b) => a + b.perencanaan, 0)
    totalStats.value.selisih = suboutputData.value.reduce((a, b) => a + b.selisih, 0)
  } catch (err) {
    console.error('Error fetching perencanaan:', err)
    suboutputData.value = []
    totalStats.value.pagu = 0
    totalStats.value.perencanaan = 0
    totalStats.value.selisih = 0
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Lifecycle
onMounted(async () => {
  // Get token and headers
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  // Fetch satker options
  try {
    const satkerRes = await $fetch('/api/satker', { headers })
    satkerOptions.value = satkerRes.map(item => ({ text: item.name, value: item.id }))
  } catch (err) {
    console.error('Error fetching satker:', err)
  }
  // Fetch initial unit options for default satker
  await loadUnitList()
  // Fetch suboutput data with filter
  await filterData()
})
</script>

<style scoped>
/* Kompres layout agar pas tanpa scroll horizontal dengan text yang readable */
.card-body {
  overflow: visible;
}
.compact-table {
  table-layout: fixed;
  width: 100%;
  font-size: 1rem;
}
.table th, .table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.7rem 0.4rem;
  font-size: 1rem;
}
.table th {
  font-size: 1.05rem;
  font-weight: 700;
}
.pagu-cell, .perencanaan-cell, .selisih-cell {
  font-size: 1.25rem !important;
  font-weight: 700;
}
.badge {
  font-size: 13px !important;
  padding: 6px 10px !important;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .compact-table {
    font-size: 0.9rem;
  }
  .table th, .table td {
    padding: 0.5rem 0.2rem;
    font-size: 0.9rem;
  }
  .table th {
    font-size: 0.95rem;
  }
  .badge {
    font-size: 12px !important;
    padding: 5px 8px !important;
  }
}
.btn-circle {
  border-radius: 9999px !important;
}
.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
}
.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
}
.btn-warning {
  background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
  border: none;
}
.btn-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
  border: none;
}
.badge-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
}
.badge-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}
.badge-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
}
</style>
