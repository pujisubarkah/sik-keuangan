<script setup>
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

definePageMeta({
  layout: 'default'
})

// State
const showAlert = ref(true)
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
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <Icon icon="mdi:home" class="w-4 h-4 inline" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/persediaanFaktur/admin" class="hover:text-blue-700">Persediaan Faktur</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Kelola</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Faktur Barang</h1>

    <!-- Data Table Card -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ tableData.length }}</span> hasil.
        </div>
        
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <!-- Header Row -->
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">Perusahaan</th>
                <th class="text-center">Nomor Faktur</th>
                <th class="text-center">Tanggal Faktur</th>
                <th class="text-center">Nomor SPM</th>
                <th class="text-center">Akun</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center">&nbsp;</th>
                <th class="text-center">&nbsp;</th>
                <th class="text-center rounded-tr-xl">Pilihan</th>
              </tr>
              <!-- Filter Row -->
              <tr class="bg-blue-50 border-b border-blue-100">
                <td><div class="filter-container">&nbsp;</div></td>
                <td>
                  <input v-model="filterForm.nama_perusahaan" type="text" class="input input-bordered input-xs w-full" placeholder="Perusahaan" />
                </td>
                <td>
                  <input v-model="filterForm.nomor_faktur" type="text" class="input input-bordered input-xs w-full" placeholder="No Faktur" />
                </td>
                <td>
                  <input v-model="filterForm.tanggal_faktur" type="date" class="input input-bordered input-xs w-full" />
                </td>
                <td>
                  <input v-model="filterForm.nomor_spm" type="text" class="input input-bordered input-xs w-full" placeholder="No SPM" />
                </td>
                <td>
                  <input v-model="filterForm.akun" type="text" class="input input-bordered input-xs w-full" placeholder="Akun" />
                </td>
                <td><div class="filter-container">&nbsp;</div></td>
                <td><div class="filter-container">&nbsp;</div></td>
                <td><div class="filter-container">&nbsp;</div></td>
                <td>&nbsp;</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ item.no }}</td>
                <td class="text-blue-700 font-semibold">{{ item.perusahaan }}</td>
                <td class="text-center">{{ item.nomor_faktur }}</td>
                <td class="text-center">{{ formatDate(item.tanggal_faktur) }}</td>
                <td class="text-center">{{ item.nomor_spm || '-' }}</td>
                <td class="text-center"><span class="badge badge-outline badge-sm">{{ item.akun }}</span></td>
                <td class="text-right text-green-700 font-bold">{{ formatCurrency(item.jumlah) }}</td>
                
                <!-- Action Icons -->
                <td class="text-center">
                  <NuxtLink :to="`/pengeluaran/view?id=${item.pengeluaran_id}`" class="hover:text-blue-700 transition tooltip" data-tip="Detail Pengeluaran">
                    <Icon icon="mdi:file-document" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </NuxtLink>
                </td>
                <td class="text-center">
                  <a :href="`/index.php?r=persediaanFaktur/exportPdf&id=${item.id}`" target="_blank" class="hover:text-blue-700 transition tooltip" data-tip="Cetak Faktur">
                    <Icon icon="mdi:printer" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </a>
                </td>
                <td class="text-center">
                  <NuxtLink :to="`/persediaanFaktur/view?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="View">
                    <Icon icon="mdi:eye" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </NuxtLink>
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