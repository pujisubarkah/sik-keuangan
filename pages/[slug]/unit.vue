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

      <table class="table-auto w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-center border border-gray-300">No</th>
            <th class="p-2 text-left border border-gray-300">Nama</th>
            <th class="p-2 text-left border border-gray-300">Kode</th>
            <th class="p-2 text-center border border-gray-300">Satker</th>
            <th class="p-2 text-center border border-gray-300">Alias</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(unit, index) in paginatedUnits" :key="unit.id">
            <td class="text-center p-2 border border-gray-300">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="p-2 border border-gray-300">{{ unit.name }}</td>
            <td class="p-2 border border-gray-300">{{ unit.kode || '-' }}</td>
            <td class="text-center p-2 border border-gray-300">{{ getSatkerName(unit.satker_id) }}</td>
            <td class="text-center p-2 border border-gray-300">{{ unit.alias || '-' }}</td>
          </tr>
          <tr v-if="paginatedUnits.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-500 border border-gray-300">Tidak ada data ditemukan</td>
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