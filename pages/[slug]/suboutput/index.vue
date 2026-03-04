<template>
  <div class="pt-14 px-1 md:px-2">
    <!-- Alert -->
    <div v-if="showAlert" class="alert shadow-lg mb-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
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
      <span>Suboutput</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar</span>
    </div>

    <h1 class="text-2xl md:text-3xl font-bold text-blue-700 mb-4">Daftar Suboutput Tahun 2026</h1>

    <!-- Main content -->
    <Card class="bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <template #default>
        <div class="mb-4 flex gap-2">
          <NuxtLink to="/admin/suboutput/create" class="btn btn-primary btn-sm">
            <Icon icon="mdi:plus" class="w-4 h-4 mr-1" /> Tambah Suboutput
          </NuxtLink>
          <NuxtLink to="/admin/suboutput/export" class="btn btn-success btn-sm">
            <Icon icon="mdi:download" class="w-4 h-4 mr-1" /> Export ke Excel
          </NuxtLink>
        </div>
        <div class="mb-2 text-blue-700 font-semibold text-sm">
          Menampilkan <span class="font-bold">{{ suboutputData.length }}</span> hasil.
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden suboutput-table">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center">No</th>
                <th class="text-center">Kode</th>
                <th>Suboutput</th>
                <th class="text-center">Tahun</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center">Unit</th>
                <th class="text-center">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td><TextField v-model="filterForm.kode" type="text" size="sm" class="w-full" maxlength="255" placeholder="Kode" /></td>
                <td><TextField v-model="filterForm.nama" type="text" size="sm" class="w-full" maxlength="255" placeholder="Suboutput" /></td>
                <td><TextField v-model="filterForm.tahun" type="text" size="sm" class="w-full" maxlength="4" placeholder="Tahun" /></td>
                <td><TextField v-model="filterForm.jumlah" type="text" size="sm" class="w-full" maxlength="20" placeholder="Jumlah" /></td>
                <td><select v-model="filterForm.unit" class="select select-bordered select-xs w-full">
                  <option value="">- Semua Unit -</option>
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
                </select></td>
                <td class="text-center">
                  <Button @click="filterData" type="success" size="sm" class="px-4">
                    <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="text-center font-semibold text-blue-600">{{ item.kode }}</td>
                <td class="text-blue-700 font-semibold">{{ item.nama }}</td>
                <td class="text-center text-blue-700 font-semibold">{{ item.tahun }}</td>
                <td class="suboutput-jumlah-cell">
                  <span class="text-green-700" style="float:left;">Rp</span>
                  <span style="float:right;">{{ Number(item.anggaran).toLocaleString('id-ID') }}</span>
                </td>
                <td class="text-center">{{ item.unit }}</td>
                <td class="text-center">
                  <div class="flex gap-2 justify-center">
                    <NuxtLink :to="`/pekerjaan/view?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="View">
                      <Icon icon="tabler:eye" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/pekerjaan/update?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Update">
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
      </template>
    </Card>
    <!-- Pagination navigation -->
    <div class="flex justify-center items-center gap-2 mt-4">
      <Button size="sm" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</Button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <Button size="sm" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</Button>
    </div>
  </div>
</template>

<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { NuxtLink } from '#components'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'default' })
const showAlert = ref(true)
const filterForm = ref({ kode: '', nama: '', tahun: '', jumlah: '', unit: '' })
const unitOptions = ref([
  { text: 'Poksi Keuangan', value: '1' },
  { text: 'Poksi SDM', value: '3' },
  { text: 'Bagian Barjas dan BMN', value: '4' },
  { text: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal', value: '5' },
  { text: 'Poksi Humas dan Protokol', value: '6' },
  { text: 'Poksi Hukum dan Organisasi', value: '7' },
  { text: 'Poksi Arsip dan Dokumentasi', value: '8' },
  { text: 'Inspektorat', value: '11' },
  { text: 'Pusat Pelatihan dan Pengembangan dan Pemetaan Kompetensi Aparatur Sipil Negara (Puslatbang PKASN)', value: '12' },
  { text: 'Pusat Pelatihan dan Pengembangan dan Kajian Manajemen Pemerintahan (Puslatbang KMP)', value: '13' },
  { text: 'Pusat Pelatihan dan Pengembangan dan Kajian Desentralisasi dan Otonomi Daerah (Puslatbang KDOD)', value: '14' },
  { text: 'Pusat Pelatihan dan Pengembangan dan Kajian Hukum Administrasi Negara (Puslatbang KHAN)', value: '15' },
  { text: 'STIA LAN Jakarta', value: '16' },
  { text: 'STIA LAN Bandung', value: '17' },
  { text: 'STIA LAN Makassar', value: '18' },
  { text: 'Balai Bahasa', value: '21' },
  { text: 'Pemkom Puslatbang PKASN', value: '24' },
  { text: 'Latbang Puslatbang PKASN', value: '26' },
  { text: 'Administrasi Puslatbang PKASN', value: '27' },
  { text: 'Administrasi Puslatbang KDOD', value: '31' },
  { text: 'Latbang Puslatbang KDOD', value: '32' },
  { text: 'Pelatihan dan Pengembangan Puslatbang KHAN', value: '36' },
  { text: 'Kajian Hukum Administrasi Negara Puslatbang KHAN', value: '37' },
  { text: 'Administrasi Puslatbang KHAN', value: '38' },
  { text: 'Kajian Puslatbang KDOD', value: '39' },
  { text: 'Pusat Pembinaan Analis Kebijakan (Pusaka)', value: '43' },
  { text: 'Pusat Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara (Pusbangkom Pimnas & Manajerial ASN)', value: '44' },
  { text: 'Pusat Inovasi Adminsitrasi Negara (PIAN)', value: '45' },
  { text: 'Pusat Kajian Kebijakan Administrasi Negara (PK2AN)', value: '46' },
  { text: 'Pusat Kajian Manajemen Aparatur Sipil Negara (PKMASN)', value: '47' },
  { text: 'Pusat Inovasi Manajemen Pengembangan Kompetensi Aparatur Sipil Negara (PIM Bangkom ASN)', value: '48' },
  { text: 'Pusat Teknologi Pengembangan Kompetensi (Pustek Bangkom)', value: '49' },
  { text: 'Pusat Pembinaan Program dan Kebijakan Pengembangan Kompetensi Aparatur Sipil Negara (P3K Bangkom ASN)', value: '50' },
  { text: 'Pusat Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Pegawai Aparatur Sipil Negara (Pusbin JF Bangkom ASN)', value: '52' },
  { text: 'Pusat Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara (Pusbangkom TSK ASN)', value: '54' },
  { text: 'Pusat Pengembangan Kader Aparatur Sipil Negara (Pusbang Kader ASN)', value: '55' },
  { text: 'Pusat Data dan Sistem Informasi (Pusdatin)', value: '56' },
  { text: 'Bagian Umum dan Layanan Pengadaan Barjas', value: '62' },
  { text: 'Biro Hukum, Organisasi dan Sumber Daya Manusia', value: '63' },
  { text: 'Biro Umum, Kerjasama dan Hubungan Masyarakat', value: '64' },
  { text: 'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara', value: '65' },
  { text: 'Direktorat Advokasi dan Pengembangan Kinerja Kebijakan', value: '66' },
  { text: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN', value: '67' },
  { text: 'Direktorat Pembelajaran Sistem Terintegrasi', value: '68' },
  { text: 'Direktorat Teknologi dan Digitalisasi Pembelajaran', value: '69' },
  { text: 'Direktorat Ekosistem Pembejalaran ASN', value: '70' },
  { text: 'Direktorat Pembelajaran Manajerial Kepemimpinan', value: '71' },
  { text: 'Direktorat Pembelajaran Karakter dan Sosial Kultural', value: '72' },
  { text: 'Direktorat Pembalajaran Teknis dan Fungsional', value: '73' },
  { text: 'Direktorat Penjaminan Mutu Pengembangan Kapasitas', value: '74' },
  { text: 'Direktorat Penjaminan Mutu Pembelajaran', value: '75' },
  { text: 'Biro Perencanaan dan Keuangan', value: '76' }
])
const suboutputData = ref([])
const satkers = ref([])
const units = ref([])
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    // Fetch suboutput
    const suboutputRes = await $fetch('/api/suboutput', { headers })
    console.log('suboutputRes:', suboutputRes)
    // Fetch satker
    satkers.value = await $fetch('/api/satker', { headers })
    console.log('satkers:', satkers.value)
    // Fetch unit
    units.value = await $fetch('/api/unit_kerja', { headers })
    console.log('units:', units.value)
    // Map suboutput agar satker dan unit berupa nama
    suboutputData.value = suboutputRes.map(item => {
      const satker = satkers.value.find(s => s.id === item.satker_id)
      const unit = units.value.find(u => u.id === item.unit_id)
      return {
        ...item,
        satker: satker ? satker.name : '',
        unit: unit ? unit.name : ''
      }
    })
    console.log('suboutputData mapped:', suboutputData.value)
  } catch (err) {
    // Handle error
    console.error('Error fetching suboutput:', err)
  }
})

const filteredData = computed(() => {
  return suboutputData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaMatch = filterForm.value.nama === '' || item.nama.toLowerCase().includes(filterForm.value.nama.toLowerCase())
    const tahunMatch = filterForm.value.tahun === '' || String(item.tahun).includes(filterForm.value.tahun)
    const jumlahMatch = filterForm.value.jumlah === '' || String(item.jumlah).includes(filterForm.value.jumlah)
    const unitMatch = filterForm.value.unit === '' || item.unit === unitOptions.value.find(u => u.value === filterForm.value.unit)?.text
    return kodeMatch && namaMatch && tahunMatch && jumlahMatch && unitMatch
  })
})
const filterData = () => { /* Filtering is reactive */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic */ } }
</script>

<style scoped>
.suboutput-table {
  table-layout: fixed;
  width: 100%;
}
.suboutput-table th:nth-child(1) { width: 40px; }
.suboutput-table th:nth-child(2) { width: 100px; }
.suboutput-table th:nth-child(3) { width: 320px; }
.suboutput-table th:nth-child(4) { width: 80px; }
.suboutput-table th:nth-child(5),
.suboutput-table td.suboutput-jumlah-cell {
  text-align: left !important;
}
.suboutput-jumlah-cell {
  font-size: 1rem !important;
  font-weight: 700;
  white-space: nowrap;
  position: relative;
}
.suboutput-jumlah-cell span {
  display: inline-block;
}
@media (max-width: 1024px) {
  .suboutput-table th:nth-child(3) { width: 180px; }
  .suboutput-table th:nth-child(6) { width: 120px; }
}
</style>
