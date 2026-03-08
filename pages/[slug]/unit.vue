<template>
  <div class="content-wrapper p-6">

   
      <!-- Alert -->
    <v-alert v-if="showAlert" type="danger" class="mb-6">
      <template #default>
        Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
        <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
        untuk memperbaiki.
      </template>
    </v-alert>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Daftar Unit</h1>

      <ul class="breadcrumb flex gap-2 text-sm text-gray-500">
        <li><a href="/">Dashboard</a></li>
        <li>/</li>
        <li><a href="#">Units</a></li>
        <li>/</li>
        <li>Daftar</li>
      </ul>
    </div>

    <!-- Warning -->
    <v-alert type="warning" class="mb-4">
      <template #default>
        Untuk tambah/ubah/hapus unit dilakukan melalui aplikasi Sireva
      </template>
    </v-alert>

    <!-- Loading -->
    <div v-if="pending" class="text-center py-8 bg-white shadow rounded-lg">
      <p class="text-gray-600">Loading...</p>
    </div>

    <!-- Error -->
    <v-alert v-else-if="error" type="danger" class="mb-4">
      <template #default>
        Error: {{ error.message }}
      </template>
    </v-alert>

    <!-- Table -->
    <div v-else class="bg-white shadow rounded-lg p-4">
      <div class="mb-3 text-sm text-gray-600">
        Menampilkan <b>{{ units?.length || 0 }}</b> data
      </div>

      <table class="min-w-full divide-y divide-gray-200 text-sm rounded-xl overflow-hidden border border-blue-100 shadow-lg bg-white">
        <thead class="bg-blue-100">
          <tr>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
            <th class="px-3 py-2 text-left font-semibold text-blue-700 align-middle">Nama</th>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Kode</th>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Satker</th>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Alias</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(unit, index) in paginatedUnits" :key="unit.id" class="hover:bg-yellow-50 align-middle transition">
            <td class="px-3 py-2 text-center align-middle font-bold text-blue-700">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="px-3 py-2 text-left align-middle">
              <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ unit.name }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ unit.kode || '-' }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ getSatkerName(unit.satker_id) }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ unit.alias || '-' }}</span>
            </td>
          </tr>
          <tr v-if="paginatedUnits.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-500 border border-blue-100">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="units && units.length > pageSize" class="flex items-center justify-between mt-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Previous</button>
        <span class="text-sm">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const units = ref([])
const satkers = ref([])
const pending = ref(true)
const error = ref(null)

// Pagination state
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(units.value.length / pageSize))
const paginatedUnits = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return units.value.slice(start, start + pageSize)
})
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const unitRes = await $fetch('/api/unit_kerja', { headers })
    units.value = Array.isArray(unitRes) ? unitRes : []
    const satkerRes = await $fetch('/api/satker', { headers })
    satkers.value = Array.isArray(satkerRes) ? satkerRes : []
    pending.value = false
  } catch (err) {
    error.value = err
    pending.value = false
  }
})

// Helper function to get satker name by ID
const getSatkerName = (satkerId) => {
  if (!satkers.value) return '-'
  const satker = satkers.value.find(s => s.id === satkerId)
  return satker ? satker.name : '-'
}

// Redirect to login if error 401 (invalid token)
import { useRouter } from 'vue-router'
const router = useRouter()
watch(
  () => error.value,
  (err) => {
    if (err && err.status === 401) {
      router.push('/login')
    }
  }
)
</script>

<style scoped>
</style>