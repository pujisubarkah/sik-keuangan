<!-- filepath: c:\Users\user\Documents\sik-keuangan\pages\admin\perencanaan.vue -->
<template>
  <div class="pt-14 px-1 md:px-2">
    <div class="w-full max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">Perencanaan LAN JAKARTA Tahun 2026</h1>
      <!-- Filter Form -->
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100">
        <div class="card-body p-3 md:p-4">
          <h2 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Icon icon="mdi:magnify" class="w-5 h-5 text-blue-500" />
            Filter Data
          </h2>
          <form @submit.prevent="filterData">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Satker</span>
                </label>
                <select v-model="filterForm.id_satker" class="select select-bordered w-full" @change="loadUnitList">
                  <option value="">- Semua Satker -</option>
                  <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.text }}</option>
                </select>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Unit</span>
                </label>
                <select v-model="filterForm.id_unit" class="select select-bordered w-full">
                  <option value="">- Semua Unit -</option>
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
                </select>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Tahun</span>
                </label>
                <input v-model="filterForm.tahun" type="number" placeholder="2026" class="input input-bordered w-full" />
              </div>
              <div class="form-control flex items-end justify-end h-full">
                <button type="submit" class="btn btn-success btn-sm w-full md:w-auto px-4">
                  <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                  Tampilkan
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
import { Icon } from '@iconify/vue';
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
