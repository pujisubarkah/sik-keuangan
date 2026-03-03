<template>
  <div class="content-wrapper bg-gray-100 min-h-screen font-sans pt-24">
    <section class="content-header">
      <div class="alert alert-error shadow-lg mb-6 flex items-center gap-3">
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/index.php?r=pekerjaan/admin&id_unit=null" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </section>

    <section class="content-header">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Sunting Suboutput</h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index"><i class="fa fa-dashboard"></i></NuxtLink></li>
        <li><span>Suboutput</span></li>
        <li><span>Sunting</span></li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content">
      <form class="form-horizontal" id="pekerjaan-form" @submit.prevent="handleSubmit">
        <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 pt-8 pb-4 border-b border-gray-100 text-center">
            <Icon icon="mdi:clipboard-edit-outline" class="w-10 h-10 text-blue-500 mb-2" />
            <h2 class="text-xl font-bold text-gray-800 mb-1">Form Sunting Suboutput</h2>
            <p class="text-gray-500 text-sm">Silakan ubah data suboutput sesuai kebutuhan.</p>
          </div>
          <div class="px-6 py-8">
            <!-- Satker -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="satker">Satker</label>
              <select v-model="form.satker" class="form-control w-full rounded-lg border-gray-300" id="satker">
                <option value="">- Pilih Satker -</option>
                <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.label }}</option>
              </select>
            </div>
            <!-- Output -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="output">Output <span class="text-red-500">*</span></label>
              <select v-model="form.output" class="form-control w-full rounded-lg border-gray-300" id="output">
                <option value="">- Pilih Output -</option>
                <option v-for="output in outputOptions" :key="output.value" :value="output.value">{{ output.label }}</option>
              </select>
            </div>
            <!-- Suboutput -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="suboutput">Suboutput <span class="text-red-500">*</span></label>
              <textarea v-model="form.suboutput" rows="3" class="form-control w-full rounded-lg border-gray-300" id="suboutput" placeholder="Suboutput"></textarea>
            </div>
            <!-- Kode -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="kode">Kode <span class="text-red-500">*</span></label>
              <input v-model="form.kode" class="form-control w-full rounded-lg border-gray-300" id="kode" type="text" maxlength="255" placeholder="Kode" />
            </div>
            <!-- Unit -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="unit">Unit</label>
              <select v-model="form.unit" class="form-control w-full rounded-lg border-gray-300" id="unit" placeholder="Unit">
                <option value="">- Pilih Unit -</option>
                <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
              </select>
            </div>
            <!-- Tahun -->
            <div class="mb-5">
              <label class="block font-medium text-gray-700 mb-1" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <input v-model="form.tahun" readonly class="form-control w-full rounded-lg border-gray-300" id="tahun" type="text" placeholder="Tahun" />
            </div>
          </div>
          <div class="px-6 pb-8 flex justify-end bg-gray-50 border-t border-gray-100">
            <button class="btn btn-success btn-flat rounded-lg shadow-md hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-6 py-2 text-white font-semibold" type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NuxtLink } from '#components';
import { Icon } from '@iconify/vue';

const router = useRouter();

const satkerOptions = [
  { value: '', label: '- Pilih Satker -' },
  { value: '1', label: 'LAN JAKARTA' },
  { value: '2', label: 'PUSJAR SKTASN NAS' },
  { value: '3', label: 'PUSJAR SKMP' },
  { value: '4', label: 'PUSJAR SKPP' },
  { value: '5', label: 'PUSJAR SKMK' },
  { value: '6', label: 'STIA LAN BANDUNG' },
  { value: '7', label: 'STIA LAN JAKARTA' },
  { value: '8', label: 'STIA MAKASSAR' },
];

const outputOptions = [
  { value: '', label: '- Pilih Output -' },
  { value: '2243', label: '7913.ADI - Sertifikasi Profesi dan SDM[Base Line]' },
  { value: '2244', label: '7913.FAE - Pemantauan dan Evaluasi serta Pelaporan[Base Line]' },
  // ...tambahkan sesuai kebutuhan
];

const unitOptions = [
  { value: '', label: '- Pilih Unit -' },
  { value: '1', label: 'Poksi Keuangan' },
  { value: '3', label: 'Poksi SDM' },
  { value: '4', label: 'Bagian Barjas dan BMN' },
  { value: '5', label: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal' },
  { value: '6', label: 'Poksi Humas dan Protokol' },
  { value: '7', label: 'Poksi Hukum dan Organisasi' },
  { value: '8', label: 'Poksi Arsip dan Dokumentasi' },
  { value: '11', label: 'Inspektorat' },
  // ...tambahkan sesuai kebutuhan
  { value: '67', label: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN' },
];

const form = ref({
  satker: '1',
  output: '2243',
  suboutput: 'Seleksi dan Uji Kompetensi Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN',
  kode: '7913.ADI.001',
  unit: '67',
  tahun: '2026',
});

function handleSubmit() {
  // Simpan data, bisa diganti dengan API call
  alert('Data berhasil disimpan!');
  // router.push('/ke halaman lain jika perlu');
}
</script>

<style scoped>
/* Utility tambahan jika ingin override atau menambah style custom */
input.form-control,
select.form-control,
textarea.form-control {
  border: 1.5px solid #cbd5e1;
  outline: none;
  transition: border-color 0.2s;
}
input.form-control:focus,
select.form-control:focus,
textarea.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}
</style>
