
<template>
  <div class="pt-14 min-h-screen font-poppins">
    <div class="mb-4">
      <button class="text-blue-700 flex items-center mb-2 hover:text-blue-900" @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Kembali
      </button>
      <SuboutputAlert :showAlert="true" />
    </div>
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18" /></svg>
        Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/anggaran" class="hover:text-blue-700">Anggaran</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Tambah</span>
    </div>
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Tambah Anggaran</h1>
    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-blue-500">
      <div class="px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Form Anggaran</h1>
        <p class="text-gray-500 text-sm mt-1">Isi detail anggaran di bawah ini.</p>
      </div>
      <form class="px-8 py-8" @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="komponen">Komponen</label>
            <div class="col-span-9">
              <select v-model="form.komponen" id="komponen" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option value="">-- Pilih Komponen --</option>
                <option v-for="opt in komponenOptions" :key="opt.kode_komponen" :value="opt.kode_komponen">{{ opt.nama_komponen }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="subkomponen">Sub Komponen</label>
            <div class="col-span-9">
              <select v-model="form.subkomponen" id="subkomponen" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" :disabled="!form.komponen">
                <option value="">-- Pilih Sub Komponen --</option>
                <option v-for="opt in filteredSubkomponenOptions" :key="opt.kode_subkomponen" :value="opt.kode_subkomponen">{{ opt.nama_subkomponen }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="akun">Akun</label>
            <div class="col-span-9">
              <select v-model="form.akun" id="akun" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" :disabled="!form.subkomponen">
                <option value="">-- Pilih Akun --</option>
                <option v-for="opt in filteredAkunOptions" :key="opt.kode_akun" :value="opt.kode_akun">{{ opt.kode_akun }} - {{ opt.nama_akun }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_uraian">Uraian</label>
            <div class="col-span-9">
              <textarea v-model="form.uraian" id="Anggaran_uraian" maxlength="255" placeholder="Uraian" rows="2" class="block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm min-h-[48px] max-h-40 resize-y break-words"></textarea>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_kode">Kode</label>
            <div class="col-span-9">
              <input v-model="form.kode" id="Anggaran_kode" type="text" maxlength="255" placeholder="Kode" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_revisi">Revisi</label>
            <div class="col-span-9">
              <select v-model="form.revisi" id="Anggaran_revisi" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option value="tidak">Tidak</option>
                <option value="ya">Ya</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_volume">Volume</label>
            <div class="col-span-9">
              <input v-model="form.volume" id="Anggaran_volume" type="text" placeholder="Volume" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_satuan">Satuan</label>
            <div class="col-span-9">
              <input v-model="form.satuan" id="Anggaran_satuan" type="text" maxlength="255" placeholder="Satuan" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" />
            </div>
          </div>
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="Anggaran_harga_satuan">Harga Satuan</label>
            <div class="col-span-9">
              <input :value="computedHargaSatuan" id="Anggaran_harga_satuan" type="text" readonly placeholder="Harga Satuan" class="block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition bg-gray-100" />
            </div>
          </div>
          <input type="hidden" v-model="form.referrer" />
        </div>
        <div class="flex justify-end mt-10 gap-4">
          <button type="submit" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-8 py-3 font-semibold text-lg bg-gradient-to-tr from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800">
            <span class="mdi mdi-check"></span> Simpan
          </button>
          <button type="button" @click="$router.back()" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-8 py-3 font-semibold text-lg bg-gradient-to-tr from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800">
            <span class="mdi mdi-close"></span> Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SuboutputAlert from '@/components/SuboutputAlert.vue';

const route = useRoute();
const router = useRouter();



const form = ref({
  id_pekerjaan: '4725',
  komponen: '',
  subkomponen: '',
  akun: '',
  uraian: '',
  kode: '',
  revisi: 'tidak',
  volume: '',
  satuan: '',
  referrer: 'https://sik-keuangan.lan.go.id/index.php?r=pekerjaan/perencanaan&id=4725',
});

import { computed } from 'vue'
const computedHargaSatuan = computed(() => {
  const v = parseFloat(form.value.volume)
  const s = parseFloat(form.value.satuan)
  if (!isNaN(v) && !isNaN(s)) {
    return v * s
  }
  return ''
})

// Dummy data, ganti dengan API jika ada
const komponenOptions = [
  { kode_komponen: 'K001', nama_komponen: 'Komponen A', subkomponen: [
    { kode_subkomponen: 'SK001', nama_subkomponen: 'Sub Komp A1', akun: [
      { kode_akun: 'A001', nama_akun: 'Akun 1' },
      { kode_akun: 'A002', nama_akun: 'Akun 2' },
    ] },
    { kode_subkomponen: 'SK002', nama_subkomponen: 'Sub Komp A2', akun: [
      { kode_akun: 'A003', nama_akun: 'Akun 3' },
    ] },
  ] },
  { kode_komponen: 'K002', nama_komponen: 'Komponen B', subkomponen: [
    { kode_subkomponen: 'SK003', nama_subkomponen: 'Sub Komp B1', akun: [
      { kode_akun: 'A004', nama_akun: 'Akun 4' },
    ] },
  ] },
];

const filteredSubkomponenOptions = computed(() => {
  const komp = komponenOptions.find(k => k.kode_komponen === form.value.komponen)
  return komp ? komp.subkomponen : []
})

const filteredAkunOptions = computed(() => {
  const komp = komponenOptions.find(k => k.kode_komponen === form.value.komponen)
  const subkomp = komp?.subkomponen.find(s => s.kode_subkomponen === form.value.subkomponen)
  return subkomp ? subkomp.akun : []
})

const cancelUrl = '/index.php?r=pekerjaan/view&id=4725';

function handleSubmit() {
  // Simulasi submit, bisa diganti dengan API call
  alert('Anggaran berhasil disimpan!');
  router.push(form.value.referrer);
}
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.breadcrumb {
  background: #fff;
  padding: 10px;
  list-style: none;
  border-radius: 4px;
  margin-bottom: 20px;
}
.breadcrumb li {
  display: inline;
}
.box {
  background: #fff;
  border-top: 3px solid #3c8dbc;
  margin-bottom: 20px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  border-radius: 3px;
}
.box-header {
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
  color: #444;
}
.box-body {
  padding: 10px;
}
.box-footer {
  border-top: 1px solid #f4f4f4;
  padding: 10px;
  background: #fff;
}
.form-group label {
  margin-bottom: 0;
}
.form-control {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 15px;
}
.btn {
  display: inline-block;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.42857;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-flat {
  border-radius: 0;
  box-shadow: none;
  border-width: 1px;
}
.btn-primary {
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
}
.btn-danger {
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a;
}
.btn-primary:hover {
  background-color: #286090;
}
.btn-danger:hover {
  background-color: #c9302c;
}
.alert {
  border-radius: 6px;
  padding: 12px 18px;
  font-size: 15px;
}
.alert-danger {
  background: #f2dede;
  color: #a94442;
  border: 1px solid #ebccd1;
}
</style>
