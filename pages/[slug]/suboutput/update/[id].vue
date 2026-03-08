<template>
  <div class="content-wrapper min-h-screen font-sans pt-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <SuboutputAlert :showAlert="true" />

    <section class="content-header">
      <h1 class="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow">Sunting Suboutput</h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-blue-500">
        <li><NuxtLink to="/index.php?r=/site/index"><i class="fa fa-dashboard"></i></NuxtLink></li>
        <li><span>Suboutput</span></li>
        <li><span>Sunting</span></li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content">
      <form class="form-horizontal" id="pekerjaan-form" @submit.prevent="handleSubmit">
        <div class="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden mt-8">
          <div class="px-8 pt-10 pb-5 border-b border-blue-100 text-center bg-gradient-to-r from-blue-100 to-blue-50">
            <Icon icon="mdi:clipboard-edit-outline" class="w-12 h-12 text-blue-500 mb-3 drop-shadow" />
            <h2 class="text-2xl font-bold text-blue-800 mb-1 tracking-tight">Form Sunting Suboutput</h2>
            <p class="text-blue-500 text-sm">Silakan ubah data suboutput sesuai kebutuhan.</p>
          </div>
          <div class="px-8 py-10 grid grid-cols-1 gap-6">
            <!-- Satker -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="satker">Satker</label>
              <select v-model="form.satker" class="form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="satker">
                <option value="">- Pilih Satker -</option>
                <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.label }}</option>
              </select>
            </div>
            <!-- Output -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="output">Output <span class="text-red-500">*</span></label>
              <select v-model="form.output" class="form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="output">
                <option value="">- Pilih Output -</option>
                <option v-for="output in outputOptions" :key="output.value" :value="output.value">{{ output.label }}</option>
              </select>
            </div>
            <!-- Suboutput -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="suboutput">Suboutput <span class="text-red-500">*</span></label>
              <textarea v-model="form.suboutput" rows="3" class="form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="suboutput" placeholder="Suboutput"></textarea>
            </div>
            <!-- Kode -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="kode">Kode <span class="text-red-500">*</span></label>
              <input v-model="form.kode" class="form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="kode" type="text" maxlength="255" placeholder="Kode" />
            </div>
            <!-- Unit -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="unit">Unit</label>
              <select v-model="form.unit" class="form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="unit" placeholder="Unit">
                <option value="">- Pilih Unit -</option>
                <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
              </select>
            </div>
            <!-- Tahun -->
            <div>
              <label class="block font-semibold text-blue-700 mb-1" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <input v-model="form.tahun" readonly class="form-control w-full rounded-xl border-blue-200 bg-blue-50 text-blue-700" id="tahun" type="text" placeholder="Tahun" />
            </div>
          </div>
          <div class="px-8 pb-10 flex justify-end bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-100">
            <Button type="success" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
            </Button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NuxtLink } from '#components';
import Icon from '~/components/Icon.vue';
import { useRoute } from 'vue-router';
import { $fetch } from 'ofetch';
import SuboutputAlert from '@/components/SuboutputAlert.vue';

const router = useRouter();
const route = useRoute();

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
  satker: '',
  output: '',
  suboutput: '',
  kode: '',
  unit: '',
  tahun: ''
});

import { onMounted } from 'vue';
onMounted(async () => {
  const suboutputId = route.params.id;
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const data = await $fetch(`/api/anggaran_suboutput/${suboutputId}`, { headers });
    // Isi form dari hasil API
    form.value.satker = data.anggaranSuboutput?.satker_id?.toString() || '';
    form.value.output = data.nama_output || '';
    form.value.suboutput = data.nama_suboutput || '';
    form.value.kode = data.kode || '';
    form.value.unit = data.nama_unit || '';
    form.value.tahun = data.tahun?.toString() || '';
  } catch (err) {
    // fallback: kosongkan form
  }
});

async function handleSubmit() {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // Siapkan payload sesuai field yang ingin diupdate
    const payload = {
      // contoh: anggaran: form.value.anggaran,
      // tambahkan field lain sesuai kebutuhan
      // contoh:
      // satker_id: form.value.satker,
      // output_id: form.value.output,
      // suboutput: form.value.suboutput,
      // kode: form.value.kode,
      // unit_id: form.value.unit,
      // tahun: form.value.tahun,
    };
    // Hanya kirim field yang ingin diupdate
    // Gunakan id suboutput yang benar
    const suboutputId = form.value.kode || route.params.id;
    const res = await $fetch(`/api/anggaran_suboutput/${suboutputId}`, {
      method: 'PUT',
      body: payload,
      headers
    });
    alert('Data berhasil disimpan!');
    // router.push('/ke halaman lain jika perlu');
  } catch (err) {
    alert('Gagal menyimpan data!');
  }
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
