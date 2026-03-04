<template>
  <div class="pt-14">
    <!-- Alert -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
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
      <span>Program</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar</span>
    </div>
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Program Tahun 2026</h1>
    <!-- Data Table -->
    <Card class="bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <template #default>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ tableData.length }}</span> hasil.
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">Kode</th>
                <th>Nama</th>
                <th class="text-center">Tahun</th>
                <th class="text-center">Kegiatan</th>
                <th class="text-center">Output</th>
                <th class="text-center">Sub Output</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <TextField v-model="filterForm.kode" type="text" size="sm" class="w-full" maxlength="255" placeholder="Kode" />
                </td>
                <td>
                  <TextField v-model="filterForm.nama" type="text" size="sm" class="w-full" maxlength="255" placeholder="Nama" />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="text-center">
                  <Button @click="filterData" type="success" size="sm" class="px-4">
                    <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ index + 1 }}</td>
                <td class="text-center font-semibold text-blue-600">{{ item.kode }}</td>
                <td class="text-blue-700 font-semibold">{{ item.nama }}</td>
                <td class="text-center text-blue-700 font-semibold">{{ item.tahun }}</td>
                <td class="text-center"><span class="badge badge-primary badge-lg text-white font-bold">{{ item.kegiatan }}</span></td>
                <td class="text-center"><span class="badge badge-success badge-lg text-white font-bold">{{ item.output }}</span></td>
                <td class="text-center"><span class="badge badge-warning badge-lg text-white font-bold">{{ item.suboutput }}</span></td>
                <td class="text-right text-green-700 font-bold">{{ formatCurrency(item.jumlah) }}</td>
                <td class="text-center">
                  <div class="flex gap-1 justify-center">
                    <NuxtLink :to="`/${$route.params.slug}/program/view/${item.id}`" class="btn btn-xs btn-circle btn-info tooltip" data-tip="View">
                      <Icon icon="tabler:eye" class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/program/update?id=${item.id}`" class="btn btn-xs btn-circle btn-warning tooltip" data-tip="Update">
                      <Icon icon="tabler:pencil" class="w-5 h-5" />
                    </NuxtLink>
                    <Button @click="confirmDelete(item.id)" size="sm" circle class="btn-error tooltip text-white" data-tip="Delete">
                      <Icon icon="tabler:trash" class="w-5 h-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'default' })
const drawerOpen = ref(false)
const sidebarRail = ref(false)
const showAlert = ref(true)
const filterForm = ref({ kode: '', nama: '' })
const tableData = ref([
  { id: 242, kode: '086.01.CO', nama: 'Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN', tahun: 2026, kegiatan: 5, output: 7, suboutput: 11, jumlah: 11498813000 },
  { id: 243, kode: '086.01.WA', nama: 'Program Dukungan Manajemen', tahun: 2026, kegiatan: 1, output: 1, suboutput: 5, jumlah: 115972623000 },
  { id: 244, kode: '086.01.CO', nama: 'Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN', tahun: 2026, kegiatan: 2, output: 6, suboutput: 8, jumlah: 5804767000 },
  { id: 245, kode: '086.01.WA', nama: 'Program Dukungan Manajemen', tahun: 2026, kegiatan: 8, output: 14, suboutput: 13, jumlah: 22976766000 },
  { id: 246, kode: '086.01.CO', nama: 'Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN', tahun: 2026, kegiatan: 2, output: 2, suboutput: 4, jumlah: 5663074000 },
  { id: 247, kode: '086.01.WA', nama: 'Program Dukungan Manajemen', tahun: 2026, kegiatan: 1, output: 2, suboutput: 3, jumlah: 14265949000 },
  { id: 248, kode: '086.01.CO', nama: 'Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN', tahun: 2026, kegiatan: 2, output: 2, suboutput: 4, jumlah: 10220978000 },
  { id: 249, kode: '086.01.WA', nama: 'Program Dukungan Manajemen', tahun: 2026, kegiatan: 1, output: 1, suboutput: 2, jumlah: 21665486000 }
])
const toggleSidebar = () => { sidebarRail.value = !sidebarRail.value }
const filterData = () => { /* Implement filter logic if needed */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic if needed */ } }
</script>
<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding-top: 64px;
  padding-left: 256px;
  transition: padding-left 0.3s ease;
}
.dashboard-page.sidebar-rail {
  padding-left: 72px;
}
@media (max-width: 768px) {
  .dashboard-page {
    padding-left: 0 !important;
    padding: 64px 8px 16px 8px;
  }
}
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
.badge-warning {
  background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
}
</style>
