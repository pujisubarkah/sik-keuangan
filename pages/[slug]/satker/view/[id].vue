<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Box Satker Detail -->
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="border-b border-gray-200 px-8 py-5">
          <div class="flex items-center justify-center gap-3">
            <span class="icon-[mdi--office-building] w-7 h-7 text-blue-700"></span>
            <h3 class="text-2xl font-bold text-blue-700 text-center tracking-tight">LAN JAKARTA</h3>
          </div>
        </div>
        <div class="flow-root px-8 py-5">
          <dl class="-my-3 divide-y divide-gray-200 text-sm">
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-semibold text-gray-600">Nama</dt>
              <dd class="text-black font-medium sm:col-span-2">LAN JAKARTA</dd>
            </div>
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-semibold text-gray-600">Kode Satker</dt>
              <dd class="text-black font-medium sm:col-span-2">425113</dd>
            </div>
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-semibold text-gray-600">Pagu</dt>
              <dd class="font-bold text-black sm:col-span-2">Rp. 89.233.124.000</dd>
            </div>
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-semibold text-gray-600">Realisasi</dt>
              <dd class="font-bold text-black sm:col-span-2">Rp. 2.931.239.129</dd>
            </div>
          </dl>
        </div>
        <div class="border-t border-gray-200 px-8 py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <div class="flex justify-start w-full">
            <NuxtLink to="/index.php?r=satker/update&id=1">
              <button class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-sm transition-colors">
                <Icon icon="tabler:pencil" class="w-4 h-4" />
                Edit Satker
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Box Daftar Unit -->
      <div class="bg-white rounded-xl shadow-lg">
        <div class="border-b border-gray-200 px-8 py-5">
          <div class="flex items-center justify-center gap-3">
            <span class="icon-[mdi--format-list-bulleted] w-7 h-7 text-blue-700"></span>
            <h3 class="text-2xl font-bold text-blue-700 text-center tracking-tight">Daftar Unit</h3>
          </div>
        </div>
        <div class="px-8 py-5">
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full table-auto text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Unit</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(unit, idx) in units" :key="unit" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-center font-bold text-blue-700">{{ idx + 1 }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from '~/components/Icon.vue'
const units = [
  'Poksi Keuangan',
  'Poksi SDM',
  'Bagian Barjas dan BMN',
  'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal',
  'Poksi Humas dan Protokol',
  'Poksi Hukum dan Organisasi',
  'Poksi Arsip dan Dokumentasi',
  'Inspektorat',
  'Balai Bahasa',
  'Pusat Pembinaan Analis Kebijakan (Pusaka)',
  'Pusat Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara (Pusbangkom Pimnas & Manajerial ASN)',
  'Pusat Inovasi Adminsitrasi Negara (PIAN)',
  'Pusat Kajian Kebijakan Administrasi Negara (PK2AN)',
  'Pusat Kajian Manajemen Aparatur Sipil Negara (PKMASN)',
  'Pusat Inovasi Manajemen Pengembangan Kompetensi Aparatur Sipil Negara (PIM Bangkom ASN)',
  'Pusat Teknologi Pengembangan Kompetensi (Pustek Bangkom)',
  'Pusat Pembinaan Program dan Kebijakan Pengembangan Kompetensi Aparatur Sipil Negara (P3K Bangkom ASN)',
  'Pusat Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Pegawai Aparatur Sipil Negara (Pusbin JF Bangkom ASN)',
  'Pusat Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara (Pusbangkom TSK ASN)',
  'Pusat Pengembangan Kader Aparatur Sipil Negara (Pusbang Kader ASN)',
  'Pusat Data dan Sistem Informasi (Pusdatin)',
  'Bagian Umum dan Layanan Pengadaan Barjas',
  'Biro Hukum, Organisasi dan Sumber Daya Manusia',
  'Biro Umum, Kerjasama dan Hubungan Masyarakat',
  'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara',
  'Direktorat Advokasi dan Pengembangan Kinerja Kebijakan',
  'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN',
  'Direktorat Pembelajaran Sistem Terintegrasi',
  'Direktorat Teknologi dan Digitalisasi Pembelajaran',
  'Direktorat Ekosistem Pembejalaran ASN',
  'Direktorat Pembelajaran Manajerial Kepemimpinan',
  'Direktorat Pembelajaran Karakter dan Sosial Kultural',
  'Direktorat Pembalajaran Teknis dan Fungsional',
  'Direktorat Penjaminan Mutu Pengembangan Kapasitas',
  'Direktorat Penjaminan Mutu Pembelajaran',
  'Biro Perencanaan dan Keuangan',
]
</script>
