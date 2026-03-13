<template>
  <div class="pt-14 max-w-3xl mx-auto">
    <!-- Box Satker Detail -->
    <div class="bg-white rounded-xl shadow mb-8 border border-gray-200">
      <div class="border-b px-8 py-5">
        <h3 class="text-2xl font-bold text-blue-700 text-center tracking-tight">LAN JAKARTA</h3>
      </div>
      <div class="px-8 py-5">
        <table class="w-full text-sm mb-0">
          <tbody>
            <tr>
              <th class="text-left w-32 py-2 text-gray-600 font-semibold">Nama</th>
              <td class="py-2 text-gray-900 font-medium">LAN JAKARTA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="border-t px-8 py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
        <NuxtLink to="/index.php?r=satker/update&id=1">
          <button class="btn btn-success flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-sm">
            <span class="icon-[mdi--pencil] w-4 h-4"></span>
            Sunting Satker
          </button>
        </NuxtLink>
        <NuxtLink to="/index.php?r=satker/admin&id=1">
          <button class="btn btn-warning flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-sm">
            <span class="icon-[mdi--list] w-4 h-4"></span>
            Daftar Satker
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Box Daftar Unit -->
    <div class="bg-white rounded-xl shadow border border-gray-200">
      <div class="border-b px-8 py-5">
        <h3 class="text-2xl font-bold text-blue-700 text-center tracking-tight">Daftar Unit</h3>
      </div>
      <div class="px-8 py-5">
        <table class="w-full table-auto text-sm">
          <thead>
            <tr>
              <th class="text-center w-12 text-gray-600 font-semibold">No</th>
              <th class="text-left text-gray-600 font-semibold">Nama Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(unit, idx) in units" :key="unit" class="hover:bg-blue-50 transition">
              <td class="text-center font-bold text-blue-700">{{ idx + 1 }}</td>
              <td class="text-gray-900">{{ unit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
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
