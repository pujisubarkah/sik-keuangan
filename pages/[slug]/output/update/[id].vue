<template>
  <section class="content">
    <SuboutputAlert :showAlert="true" />
    <form class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mt-8" @submit.prevent="handleSubmit">
      <div class="px-8 pt-8 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50">
        <h3 class="text-xl font-bold text-blue-800 mb-1">Form Output</h3>
      </div>
      <div class="px-8 py-10">
        <div class="grid grid-cols-1 gap-6">
          <!-- Kegiatan -->
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="kegiatan">Kegiatan</label>
            <select v-model="form.kegiatan" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="kegiatan">
              <option value="">- Pilih Kegiatan -</option>
              <option v-for="k in kegiatanOptions" :key="k.value" :value="k.value">{{ k.label }}</option>
            </select>
          </div>
          <!-- Id Satker -->
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="id_satker">Id Satker</label>
            <select v-model="form.id_satker" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="id_satker">
              <option value="">- Pilih Satker -</option>
              <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.label }}</option>
            </select>
          </div>
          <!-- Kode -->
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="kode">Kode</label>
            <input v-model="form.kode" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="kode" type="text" maxlength="255" placeholder="Kode" />
          </div>
          <!-- Nama -->
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="nama">Nama</label>
            <input v-model="form.nama" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="nama" type="text" maxlength="255" placeholder="Nama" />
          </div>
          <!-- Tahun -->
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-3 font-semibold text-blue-700 text-right pr-4" for="tahun">Tahun</label>
            <input v-model="form.tahun" class="col-span-9 form-control w-full rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" id="tahun" type="text" maxlength="255" placeholder="Tahun" />
          </div>
        </div>
      </div>
      <div class="flex justify-end px-8 pb-8">
        <button type="submit" class="btn btn-success rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
          <span class="glyphicon glyphicon-ok"></span> Simpan
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import { ref } from 'vue';

const kegiatanOptions = [
  { value: '109', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '110', label: '3578 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro Umum LAN' },
  { value: '111', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  // ...tambahkan semua opsi lain sesuai kebutuhan
  { value: '659', label: '7913 - Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara' },
  { value: '660', label: '7914 - Peningkatan Kualitas Kebijakan Administrasi Negara' },
  // dst.
];

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

const form = ref({
  kegiatan: '',
  id_satker: '',
  kode: '',
  nama: '',
  tahun: ''
});

function handleSubmit() {
  // Proses simpan data di sini
  alert('Data berhasil disimpan!');
}
</script>
