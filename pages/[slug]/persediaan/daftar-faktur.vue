<script setup>
import { ref } from 'vue'

const filterForm = ref({
  nama_perusahaan: '',
  nomor_faktur: '',
  tanggal_faktur: '',
  nomor_spm: '',
  akun: ''
})

// Mock Data (Diambil dari struktur HTML asli)
const tableData = ref([
  { 
    id: 2628, 
    no: 1, 
    perusahaan: 'Pridea', 
    nomor_faktur: '-', 
    tanggal_faktur: '2026-02-20', 
    nomor_spm: '', 
    akun: '521811', 
    jumlah: 400000,
    pengeluaran_id: 183390
  }
])

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const filterData = () => {
  console.log('Filtering with:', filterForm.value)
  // Implement logic to fetch data based on filters
}
</script>

<template>
  <div class="pt-14">
    <!-- Alert -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Kelola</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Faktur Barang</h1>

    <!-- Data Table Card -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <!-- Header Row -->
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle rounded-tl-xl bg-blue-100">No</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Perusahaan</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Nomor Faktur</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Tanggal Faktur</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Nomor SPM</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Akun</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Jumlah</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle bg-blue-100">Aksi</th>
              </tr>
              <!-- Filter Row -->
              <tr class="bg-white border-b border-blue-100">
                <td><div class="filter-container">&nbsp;</div></td>
                <td>
                  <input v-model="filterForm.nama_perusahaan" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Perusahaan" />
                </td>
                <td>
                  <input v-model="filterForm.nomor_faktur" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="No Faktur" />
                </td>
                <td>
                  <input v-model="filterForm.tanggal_faktur" type="date" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </td>
                <td>
                  <input v-model="filterForm.nomor_spm" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="No SPM" />
                </td>
                <td>
                  <input v-model="filterForm.akun" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Akun" />
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="item.id">
                <td class="text-center font-bold text-blue-700">{{ item.no }}</td>
                <td class="text-blue-700 font-semibold">{{ item.perusahaan }}</td>
                <td class="text-center">{{ item.nomor_faktur }}</td>
                <td class="text-center">{{ formatDate(item.tanggal_faktur) }}</td>
                <td class="text-center">{{ item.nomor_spm || '-' }}</td>
                <td class="text-center"><span class="badge badge-outline badge-sm">{{ item.akun }}</span></td>
                <td class="text-right text-green-700 font-bold">{{ formatCurrency(item.jumlah) }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/${$route.params.slug}/persediaan/daftar-faktur/view/${item.id}`"
                      class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="View"
                    >
                      <Icon icon="mdi:eye" class="w-5 h-5 text-blue-600" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/index.php?r=persediaanFaktur/exportPdf&id=${item.id}`"
                      class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="Cetak"
                    >
                      <Icon icon="mdi:printer" class="w-5 h-5 text-blue-600" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/${$route.params.slug}/persediaan/daftar-faktur/edit/${item.id}`"
                      class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" data-tip="Edit"
                    >
                      <Icon icon="mdi:pencil" class="w-5 h-5 text-yellow-600" />
                    </NuxtLink>
                    <button
                      class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" data-tip="Delete"
                      @click="confirm('Yakin hapus faktur ini?')"
                      style="border:none;padding:0;"
                    >
                      <Icon icon="mdi:trash-can" class="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Meniru style adminlte/table modern */
.table th {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e7ff;
  padding: 12px 8px;
}
.table td {
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
}
.btn-circle {
  border-radius: 9999px !important;
}
.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
}
.btn-ghost:hover {
  background-color: #f3f4f6;
}
</style>