<template>
  <div class="pt-14 px-1 md:px-2">
    <!-- Alert -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-4">
      Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
      <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
      untuk memperbaiki.
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <Icon icon="mdi:home" class="w-4 h-4 inline" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>Output</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar</span>
    </div>

    <h1 class="text-2xl md:text-3xl font-bold text-blue-700 mb-4">Daftar Output Tahun 2026</h1>

    <!-- Main content -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="mb-2 text-blue-700 font-semibold text-sm">
          Menampilkan <span class="font-bold">{{ outputData.length }}</span> hasil.
        </div>
        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/output/create"
            class="btn btn-success"
          >
            <i class="fa fa-plus mr-2"></i>
            Tambah Output
          </NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden output-table">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center">No</th>
                <th class="text-center">Kode</th>
                <th>Nama</th>
                <th class="text-center">Tahun</th>
                <th class="text-center">Sub Output</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td><input v-model="filterForm.kode" type="text" class="input input-bordered input-xs w-full" maxlength="255" placeholder="Kode" /></td>
                <td><input v-model="filterForm.nama" type="text" class="input input-bordered input-xs w-full" maxlength="255" placeholder="Nama" /></td>
                <td><input v-model="filterForm.tahun" type="text" class="input input-bordered input-xs w-full" maxlength="4" placeholder="Tahun" /></td>
                <td></td>
                <td><input v-model="filterForm.jumlah" type="text" class="input input-bordered input-xs w-full" maxlength="20" placeholder="Jumlah" /></td>
                <td class="text-center">
                  <button @click="filterData" type="button" class="btn btn-success btn-xs px-4">
                    <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                    Filter
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ index + 1 }}</td>
                <td class="text-center font-semibold text-blue-600">{{ item.kode }}</td>
                <td class="text-blue-700 font-semibold">{{ item.nama }}</td>
                <td class="text-center text-blue-700 font-semibold">{{ item.tahun }}</td>
                <td class="text-center"><span class="badge badge-warning badge-lg text-white font-bold">{{ item.suboutput }}</span></td>
                <td class="text-right text-green-700 font-bold output-jumlah-cell">{{ formatCurrency(item.jumlah) }}</td>
                <td class="text-center">
                  <div class="flex gap-1 justify-center">
                    <NuxtLink :to="`/output/view?id=${item.id}`" class="btn btn-xs btn-circle btn-info tooltip" data-tip="View">
                      <Icon icon="tabler:eye" class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/output/update?id=${item.id}`" class="btn btn-xs btn-circle btn-warning tooltip" data-tip="Update">
                      <Icon icon="tabler:pencil" class="w-5 h-5" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="btn btn-xs btn-circle btn-error tooltip text-white" data-tip="Delete">
                      <Icon icon="tabler:trash" class="w-5 h-5" />
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

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { NuxtLink } from '#components'

const showAlert = ref(true)
const filterForm = ref({ kode: '', nama: '', tahun: '', jumlah: '' })
const outputData = ref([
  { id: 2243, kode: '7913.ADI', nama: 'Sertifikasi Profesi dan SDM[Base Line]', tahun: 2026, suboutput: 1, jumlah: 1076950000 },
  { id: 2244, kode: '7913.FAE', nama: 'Pemantauan dan Evaluasi serta Pelaporan[Base Line]', tahun: 2026, suboutput: 1, jumlah: 270776000 },
  { id: 2245, kode: '7914.FAE', nama: 'Pemantauan dan Evaluasi serta Pelaporan[Base Line]', tahun: 2026, suboutput: 1, jumlah: 123703000 },
  { id: 2246, kode: '7915.ABQ', nama: 'Kebijakan Bidang Aparatur[Base Line]', tahun: 2026, suboutput: 2, jumlah: 200101000 },
  { id: 2247, kode: '7915.FAN', nama: 'Pemenuhan Prioritas Direktif Presiden[Base Line]', tahun: 2026, suboutput: 1, jumlah: 1367623000 },
  { id: 2248, kode: '7916.FAC', nama: 'Peningkatan Kapasitas Aparatur Negara[Base Line]', tahun: 2026, suboutput: 4, jumlah: 7436380000 },
  { id: 2249, kode: '7917.ADE', nama: 'Akreditasi Lembaga[Base Line]', tahun: 2026, suboutput: 1, jumlah: 1272228000 },
  { id: 2250, kode: '7918.EBA', nama: 'Layanan Dukungan Manajemen Internal[Base Line]', tahun: 2026, suboutput: 5, jumlah: 116167623000 },
  { id: 2251, kode: '3611.ABH', nama: 'Kebijakan Bidang IPTEK, Pendidikan dan Kebudayaan[Base Line]', tahun: 2026, suboutput: 2, jumlah: 935240000 },
  { id: 2252, kode: '3611.BDD', nama: 'Fasilitasi dan Pembinaan Kelompok Masyarakat[Base Line]', tahun: 2026, suboutput: 1, jumlah: 299705000 }
])

const filteredData = computed(() => {
  return outputData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaMatch = filterForm.value.nama === '' || item.nama.toLowerCase().includes(filterForm.value.nama.toLowerCase())
    const tahunMatch = filterForm.value.tahun === '' || String(item.tahun).includes(filterForm.value.tahun)
    const jumlahMatch = filterForm.value.jumlah === '' || String(item.jumlah).includes(filterForm.value.jumlah)
    return kodeMatch && namaMatch && tahunMatch && jumlahMatch
  })
})

const filterData = () => { /* Filtering is reactive */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic */ } }
</script>

<style scoped>
.output-table {
  table-layout: fixed;
  width: 100%;
}
.output-table th:nth-child(1) { width: 40px; }
.output-table th:nth-child(2) { width: 100px; }
.output-table th:nth-child(3) { width: 320px; }
.output-table th:nth-child(4) { width: 80px; }
.output-table th:nth-child(5) { width: 100px; }
.output-table th:nth-child(6) { width: 160px; }
.output-table th:nth-child(7) { width: 120px; }
.output-jumlah-cell {
  font-size: 1.15rem !important;
  font-weight: 700;
  white-space: nowrap;
}
@media (max-width: 1024px) {
  .output-table th:nth-child(3) { width: 180px; }
  .output-table th:nth-child(6) { width: 120px; }
}
</style>
