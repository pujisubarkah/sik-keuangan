<template>
  <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mt-8">
    <SuboutputAlert :showAlert="true" />
    <div class="px-8 pt-8 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50">
      <h2 class="text-xl font-bold text-blue-800 mb-1">Form Suboutput</h2>
    </div>
    <form class="px-8 py-8" @submit.prevent="handleSubmit">
      <div class="px-8 py-10 grid grid-cols-1 gap-6">
        <!-- Satker -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="satker">Satker</label>
          <select v-model="form.satker" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="satker">
            <option value="">- Pilih Satker -</option>
            <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.label }}</option>
          </select>
        </div>
        <!-- Output -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="output">Output <span class="text-red-500">*</span></label>
          <select v-model="form.output" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="output">
            <option value="">- Pilih Output -</option>
            <option v-for="output in outputOptions" :key="output.value" :value="output.value">{{ output.label }}</option>
          </select>
        </div>
        <!-- Suboutput -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="suboutput">Suboutput <span class="text-red-500">*</span></label>
          <textarea v-model="form.suboutput" rows="3" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="suboutput" placeholder="Suboutput"></textarea>
        </div>
        <!-- Kode -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="kode">Kode <span class="text-red-500">*</span></label>
          <input v-model="form.kode" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="kode" type="text" maxlength="255" placeholder="Kode" />
        </div>
        <!-- Unit -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="unit">Unit</label>
          <select v-model="form.unit" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="unit" placeholder="Unit">
            <option value="">- Pilih Unit -</option>
            <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
          </select>
        </div>
        <!-- Tahun -->
        <div class="grid grid-cols-12 items-center gap-2">
          <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="tahun">Tahun <span class="text-red-500">*</span></label>
          <input v-model="form.tahun" readonly class="col-span-9 form-control w-full rounded-xl border-blue-200 bg-blue-50 text-blue-700" id="tahun" type="text" placeholder="Tahun" />
        </div>
      </div>
      <div class="flex justify-end mt-8">
        <button type="submit" class="btn btn-success rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
          <span class="glyphicon glyphicon-ok"></span> Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import { ref } from 'vue';

const satkerOptions = [
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
  { value: '2243', label: '7913.ADI - Sertifikasi Profesi dan SDM[Base Line]' },
  { value: '2244', label: '7913.FAE - Pemantauan dan Evaluasi serta Pelaporan[Base Line]' },
  // ...tambahkan sesuai kebutuhan
];

const unitOptions = [
  { value: '1', label: 'Poksi Keuangan' },
  { value: '3', label: 'Poksi SDM' },
  { value: '4', label: 'Bagian Barjas dan BMN' },
  { value: '5', label: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal' },
  { value: '6', label: 'Poksi Humas dan Protokol' },
  { value: '7', label: 'Poksi Hukum dan Organisasi' },
  { value: '8', label: 'Poksi Arsip dan Dokumentasi' },
  { value: '11', label: 'Inspektorat' },
  { value: '67', label: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN' },
  // ...tambahkan sesuai kebutuhan
];

const form = ref({
  satker: '',
  output: '',
  suboutput: '',
  kode: '',
  unit: '',
  tahun: ''
});

function handleSubmit() {
  // Proses simpan data di sini
  alert('Data berhasil disimpan!');
}
</script>
