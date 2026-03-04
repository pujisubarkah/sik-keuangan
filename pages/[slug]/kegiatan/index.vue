definePageMeta({ layout: 'default' });
<template>
  <div class="pt-14">
    <!-- Alert -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 1 Sub Output yang belum ditentukan unitnya. Silahkan
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
      <span>Kegiatan</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Kegiatan Tahun 2026</h1>

    <!-- Data Table -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ tableData.length }}</span> hasil.
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden kegiatan-table">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">Kode</th>
                <th>Nama</th>
                <th class="text-center">Tahun</th>
                <th class="text-center">Output</th>
                <th class="text-center">Sub Output</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input v-model="filterForm.kode" type="text" class="input input-bordered input-xs w-full" maxlength="255" placeholder="Kode" />
                </td>
                <td>
                  <input v-model="filterForm.nama" type="text" class="input input-bordered input-xs w-full" maxlength="255" placeholder="Nama" />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
                <td class="text-center"><span class="badge badge-success badge-lg text-white font-bold">{{ item.output }}</span></td>
                <td class="text-center"><span class="badge badge-warning badge-lg text-white font-bold">{{ item.suboutput }}</span></td>
                <td class="text-right text-green-700 font-bold kegiatan-jumlah-cell">{{ formatCurrency(item.jumlah) }}</td>
                <td class="text-center">
                  <div class="flex gap-2 justify-center">
                    <NuxtLink :to="`/${$route.params.slug}/kegiatan/view/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="View">
                      <Icon icon="tabler:eye" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/kegiatan/update/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Update">
                      <Icon icon="tabler:pencil" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="hover:text-red-600 transition tooltip" data-tip="Delete" style="background:none;border:none;padding:0;">
                      <Icon icon="tabler:trash" class="w-5 h-5 text-red-500 hover:text-red-700" />
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

definePageMeta({ layout: 'default' })

const showAlert = ref(true)
const filterForm = ref({ kode: '', nama: '' })

const tableData = ref([
  { id: 659, kode: '7913', nama: 'Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara', tahun: 2026, output: 2, suboutput: 2, jumlah: 1347726000 },
  { id: 660, kode: '7914', nama: 'Peningkatan Kualitas Kebijakan Administrasi Negara', tahun: 2026, output: 2, suboutput: 2, jumlah: 123703000 },
  { id: 661, kode: '7915', nama: 'Transformasi Pembelajaran Aparatur Sipil Negara', tahun: 2026, output: 2, suboutput: 3, jumlah: 1492724000 },
  { id: 662, kode: '7916', nama: 'Penyelenggaraan Pengembangan Kapasitas Aparatur Sipil Negara', tahun: 2026, output: 1, suboutput: 4, jumlah: 7262432000 },
  { id: 663, kode: '7917', nama: 'Penjaminan Mutu Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara', tahun: 2026, output: 2, suboutput: 2, jumlah: 1272228000 },
  { id: 664, kode: '7918', nama: 'Peningkatan Kualitas Layanan Umum, Kerja Sama, Hubungan Masyarakat, dan Sistem Informasi', tahun: 2026, output: 2, suboutput: 10, jumlah: 115972623000 },
  { id: 681, kode: '3579', nama: 'Pengawasan Resiko, Pengendalian, dan Pengawasan Internal', tahun: 2026, output: 1, suboutput: 1, jumlah: 0 },
  { id: 682, kode: '4821', nama: 'Peningkatan Koordinasi Perencanaan dan Keuangan', tahun: 2026, output: 2, suboutput: 3, jumlah: 0 },
  { id: 683, kode: '7919', nama: 'Peningkatan Kualitas Layanan Hukum, Organisasi, dan Sumber Daya Manusia Internal', tahun: 2026, output: 2, suboutput: 1, jumlah: 0 }
])

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaMatch = filterForm.value.nama === '' || item.nama.toLowerCase().includes(filterForm.value.nama.toLowerCase())
    return kodeMatch && namaMatch
  })
})

const filterData = () => { /* Filtering is reactive */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic */ } }
</script>

<style scoped>
.table th {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e7ff;
}

.table td {
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.kegiatan-table {
  table-layout: fixed;
  width: 100%;
}

.kegiatan-table th:nth-child(1) { width: 40px; }
.kegiatan-table th:nth-child(2) { width: 100px; }
.kegiatan-table th:nth-child(3) { width: 320px; }
.kegiatan-table th:nth-child(4) { width: 80px; }
.kegiatan-table th:nth-child(5), .kegiatan-table th:nth-child(6) { width: 100px; }
.kegiatan-table th:nth-child(7) { width: 160px; }
.kegiatan-table th:nth-child(8) { width: 120px; }
.kegiatan-jumlah-cell {
  font-size: 1.15rem !important;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .kegiatan-table th:nth-child(3) { width: 180px; }
  .kegiatan-table th:nth-child(7) { width: 120px; }
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

.badge-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}

.badge-warning {
  background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
}
</style>
