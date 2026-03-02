<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showAlert = ref(true)
const satker = ref('')
const output = ref('')
const suboutput = ref('')
const kode = ref('')
const unit = ref('')
const tahun = ref('2026')

const satkerList = [
  { value: '', label: '- Pilih Satker -' },
  { value: '1', label: 'LAN JAKARTA' },
  { value: '2', label: 'PUSJAR SKTASN NAS' },
  { value: '3', label: 'PUSJAR SKMP' },
  { value: '4', label: 'PUSJAR SKPP' },
  { value: '5', label: 'PUSJAR SKMK' },
  { value: '6', label: 'STIA LAN BANDUNG' },
  { value: '7', label: 'STIA LAN JAKARTA' },
  { value: '8', label: 'STIA MAKASSAR' },
]

const outputList = [
  { value: '', label: '- Pilih Output -' },
  { value: '2243', label: '7913.ADI - Sertifikasi Profesi dan SDM[Base Line]' },
  { value: '2244', label: '7913.FAE - Pemantauan dan Evaluasi serta Pelaporan[Base Line]' },
  { value: '2245', label: '7914.FAE - Pemantauan dan Evaluasi serta Pelaporan[Base Line]' },
  { value: '2246', label: '7915.ABQ - Kebijakan Bidang Aparatur[Base Line]' },
  { value: '2247', label: '7915.FAN - Pemenuhan Prioritas Direktif Presiden[Base Line]' },
  { value: '2248', label: '7916.FAC - Peningkatan Kapasitas Aparatur Negara[Base Line]' },
  { value: '2249', label: '7917.ADE - Akreditasi Lembaga[Base Line]' },
  { value: '2250', label: '7918.EBA - Layanan Dukungan Manajemen Internal[Base Line]' },
  { value: '2251', label: '3611.ABH - Kebijakan Bidang IPTEK, Pendidikan dan Kebudayaan[Base Line]' },
  { value: '2252', label: '3611.BDD - Fasilitasi dan Pembinaan Kelompok Masyarakat[Base Line]' },
  { value: '2253', label: '3611.DBA - Pendidikan Tinggi[Base Line]' },
  { value: '2254', label: '3579.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2255', label: '4821.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2256', label: '7918.CCL - OP Sarana Bidang Teknologi Informasi dan Komunikasi[Base Line]' },
  { value: '2257', label: '7918.EBA - Layanan Dukungan Manajemen Internal[Base Line]' },
  { value: '2258', label: '7918.EBB - Layanan Sarana dan Prasarana Internal[Base Line]' },
  { value: '2259', label: '7918.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2260', label: '7919.EBC - Layanan Manajemen SDM Internal[Base Line]' },
  { value: '2261', label: '3611.ABH - Kebijakan Bidang IPTEK, Pendidikan dan Kebudayaan[Base Line]' },
  { value: '2262', label: '3611.BDD - Fasilitasi dan Pembinaan Kelompok Masyarakat[Base Line]' },
  { value: '2263', label: '3611.DBA - Pendidikan Tinggi[Base Line]' },
  { value: '2264', label: '3579.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2265', label: '4821.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2266', label: '7918.CCL - OP Sarana Bidang Teknologi Informasi dan Komunikasi[Base Line]' },
  { value: '2267', label: '7918.EBA - Layanan Dukungan Manajemen Internal[Base Line]' },
  { value: '2268', label: '7918.EBB - Layanan Sarana dan Prasarana Internal[Base Line]' },
  { value: '2269', label: '7918.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2270', label: '7919.EBC - Layanan Manajemen SDM Internal[Base Line]' },
  { value: '2271', label: '7913.ADI - Sertifikasi Profesi dan SDM[Base Line]' },
  { value: '2272', label: '7916.FAC - Peningkatan Kapasitas Aparatur Negara[Base Line]' },
  { value: '2273', label: '7918.EBA - Layanan Dukungan Manajemen Internal[Base Line]' },
  { value: '2274', label: '7918.EBB - Layanan Sarana dan Prasarana Internal[Base Line]' },
  { value: '2275', label: '7914.ABQ - Kebijakan Bidang Aparatur[Base Line]' },
  { value: '2276', label: '7917.FAE - Pemantauan dan Evaluasi serta Pelaporan[Base Line]' },
  { value: '2277', label: '7918.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2278', label: '7919.EBA - Layanan Dukungan Manajemen Internal' },
  { value: '2279', label: '7919.EBC - Layanan Manajemen SDM Internal[Base Line]' },
  { value: '2280', label: '3579.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2281', label: '4821.AEA - Koordinasi[Base Line]' },
  { value: '2282', label: '4821.EBD - Layanan Manajemen Kinerja Internal[Base Line]' },
  { value: '2283', label: '7913.ADI - Sertifikasi Profesi dan SDM[Base Line]' },
  { value: '2284', label: '7916.FAC - Peningkatan Kapasitas Aparatur Negara[Base Line]' },
  { value: '2285', label: '7918.EBA - Layanan Dukungan Manajemen Internal[Base Line]' },
]

const unitList = [
  { value: '', label: '- Pilih Unit -' },
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
  // Implementasi submit sesuai kebutuhan backend
  alert('Suboutput berhasil disimpan!')
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
      <NuxtLink to="/admin/suboutput" class="hover:text-blue-700">Suboutput</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Tambah</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Tambah Suboutput
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <h3 class="text-xl font-bold mb-6">Form Suboutput</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1" for="satker">Satker</label>
              <select v-model="satker" id="satker" class="select select-bordered w-full">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1" for="output">Output <span class="text-red-500">*</span></label>
              <select v-model="output" id="output" class="select select-bordered w-full" required>
                <option v-for="o in outputList" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block font-semibold mb-1" for="suboutput">Suboutput <span class="text-red-500">*</span></label>
              <textarea v-model="suboutput" id="suboutput" rows="3" class="textarea textarea-bordered w-full" placeholder="Suboutput" required></textarea>
            </div>
            <div>
              <label class="block font-semibold mb-1" for="kode">Kode <span class="text-red-500">*</span></label>
              <input v-model="kode" id="kode" type="text" class="input input-bordered w-full" placeholder="Kode" required maxlength="255" />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="unit">Unit</label>
              <select v-model="unit" id="unit" class="select select-bordered w-full">
                <option v-for="u in unitList" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <input v-model="tahun" id="tahun" type="text" class="input input-bordered w-full" placeholder="Tahun" readonly required />
            </div>
          </div>
          <div class="mt-6">
            <button type="submit" class="btn btn-success">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
