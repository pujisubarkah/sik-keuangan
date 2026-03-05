<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'
import * as XLSX from 'xlsx'

const showAlert = ref(true)
const tahun = ref('')
const unit = ref('')

const unitList = [
  { value: '', label: '-- Semua Unit --' },
  { value: '1', label: 'Poksi Keuangan' },
  { value: '3', label: 'Poksi SDM' },
  { value: '4', label: 'Bagian Barjas dan BMN' },
  { value: '5', label: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal' },
  { value: '6', label: 'Poksi Humas dan Protokol' },
  { value: '7', label: 'Poksi Hukum dan Organisasi' },
  { value: '8', label: 'Poksi Arsip dan Dokumentasi' },
  { value: '11', label: 'Inspektorat' },
  { value: '12', label: 'Pusat Pelatihan dan Pengembangan dan Pemetaan Kompetensi Aparatur Sipil Negara (Puslatbang PKASN)' },
  { value: '13', label: 'Pusat Pelatihan dan Pengembangan dan Kajian Manajemen Pemerintahan (Puslatbang KMP)' },
  { value: '14', label: 'Pusat Pelatihan dan Pengembangan dan Kajian Desentralisasi dan Otonomi Daerah (Puslatbang KDOD)' },
  { value: '15', label: 'Pusat Pelatihan dan Pengembangan dan Kajian Hukum Administrasi Negara (Puslatbang KHAN)' },
  { value: '16', label: 'STIA LAN Jakarta' },
  { value: '17', label: 'STIA LAN Bandung' },
  { value: '18', label: 'STIA LAN Makassar' },
  { value: '21', label: 'Balai Bahasa' },
  { value: '24', label: 'Pemkom Puslatbang PKASN' },
  { value: '26', label: 'Latbang Puslatbang PKASN' },
  { value: '27', label: 'Administrasi Puslatbang PKASN' },
  { value: '31', label: 'Administrasi Puslatbang KDOD' },
  { value: '32', label: 'Latbang Puslatbang KDOD' },
  { value: '36', label: 'Pelatihan dan Pengembangan Puslatbang KHAN' },
  { value: '37', label: 'Kajian Hukum Administrasi Negara Puslatbang KHAN' },
  { value: '38', label: 'Administrasi Puslatbang KHAN' },
  { value: '39', label: 'Kajian Puslatbang KDOD' },
  { value: '43', label: 'Pusat Pembinaan Analis Kebijakan (Pusaka)' },
  { value: '44', label: 'Pusat Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara (Pusbangkom Pimnas & Manajerial ASN)' },
  { value: '45', label: 'Pusat Inovasi Adminsitrasi Negara (PIAN)' },
  { value: '46', label: 'Pusat Kajian Kebijakan Administrasi Negara (PK2AN)' },
  { value: '47', label: 'Pusat Kajian Manajemen Aparatur Sipil Negara (PKMASN)' },
  { value: '48', label: 'Pusat Inovasi Manajemen Pengembangan Kompetensi Aparatur Sipil Negara (PIM Bangkom ASN)' },
  { value: '49', label: 'Pusat Teknologi Pengembangan Kompetensi (Pustek Bangkom)' },
  { value: '50', label: 'Pusat Pembinaan Program dan Kebijakan Pengembangan Kompetensi Aparatur Sipil Negara (P3K Bangkom ASN)' },
  { value: '52', label: 'Pusat Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Pegawai Aparatur Sipil Negara (Pusbin JF Bangkom ASN)' },
  { value: '54', label: 'Pusat Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara (Pusbangkom TSK ASN)' },
  { value: '55', label: 'Pusat Pengembangan Kader Aparatur Sipil Negara (Pusbang Kader ASN)' },
  { value: '56', label: 'Pusat Data dan Sistem Informasi (Pusdatin)' },
  { value: '62', label: 'Bagian Umum dan Layanan Pengadaan Barjas' },
  { value: '63', label: 'Biro Hukum, Organisasi dan Sumber Daya Manusia' },
  { value: '64', label: 'Biro Umum, Kerjasama dan Hubungan Masyarakat' },
  { value: '65', label: 'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara' },
  { value: '66', label: 'Direktorat Advokasi dan Pengembangan Kinerja Kebijakan' },
  { value: '67', label: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN' },
  { value: '68', label: 'Direktorat Pembelajaran Sistem Terintegrasi' },
  { value: '69', label: 'Direktorat Teknologi dan Digitalisasi Pembelajaran' },
  { value: '70', label: 'Direktorat Ekosistem Pembejalaran ASN' },
  { value: '71', label: 'Direktorat Pembelajaran Manajerial Kepemimpinan' },
  { value: '72', label: 'Direktorat Pembelajaran Karakter dan Sosial Kultural' },
  { value: '73', label: 'Direktorat Pembalajaran Teknis dan Fungsional' },
  { value: '74', label: 'Direktorat Penjaminan Mutu Pengembangan Kapasitas' },
  { value: '75', label: 'Direktorat Penjaminan Mutu Pembelajaran' },
  { value: '76', label: 'Biro Perencanaan dan Keuangan' },
]

function submitForm() {
  // Data dummy, ganti dengan data asli dari filter
  const data = [
    ['Tahun', 'Unit'],
    [tahun.value, unitList.find(u => u.value === unit.value)?.label || '']
  ]
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, 'export-suboutput.xlsx')
}
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Export Pekerjaan</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      SIK - Export Pekerjaan
    </h1>

    <!-- CARD -->
    <Card class="bg-white shadow-xl rounded-xl border border-blue-100">
      <template #default>
        <h3 class="text-xl font-bold mb-6">Filter Pekerjaan</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1" for="tahun">Tahun</label>
              <TextField v-model="tahun" id="tahun" type="text" class="w-full" placeholder="Tahun, misal: 2015" />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="unit">Unit</label>
              <select v-model="unit" id="unit" class="select select-bordered w-full">
                <option v-for="u in unitList" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
          </div>
          <div class="mt-6">
            <Button type="primary" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Proses
            </Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
