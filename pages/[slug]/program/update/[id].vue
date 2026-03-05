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
      <h1 class="text-2xl font-bold text-gray-800 mb-2">SIK - Update Program</h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index"><i class="fa fa-dashboard"></i></NuxtLink></li>
        <li><NuxtLink to="/index.php?r=program/index">Programs</NuxtLink></li>
        <li><NuxtLink to="/index.php?r=program/view&id=242">0</NuxtLink></li>
        <li><span>Update</span></li>
      </ul>
    </section>

    <section class="content">
      <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 pt-8 pb-4 border-b border-gray-100 text-center">
          <Icon icon="mdi:clipboard-edit-outline" class="w-10 h-10 text-blue-500 mb-2" />
          <h2 class="text-xl font-bold text-gray-800 mb-1">Update Program 242</h2>
          <p class="text-gray-500 text-sm">Fields with <span class="text-red-500">*</span> are required.</p>
        </div>
        <form class="px-6 py-8" @submit.prevent="handleSubmit">
          <div class="mb-5">
            <label class="block font-medium text-gray-700 mb-1" for="tahun">Tahun</label>
            <input v-model="form.tahun" class="form-control w-full rounded-lg border-gray-300" id="tahun" type="text" maxlength="4" placeholder="Tahun" />
          </div>
          <div class="mb-5">
            <label class="block font-medium text-gray-700 mb-1" for="kode">Kode</label>
            <input v-model="form.kode" class="form-control w-full rounded-lg border-gray-300" id="kode" type="text" maxlength="255" placeholder="Kode" />
          </div>
          <div class="mb-5">
            <label class="block font-medium text-gray-700 mb-1" for="nama">Nama</label>
            <input v-model="form.nama" class="form-control w-full rounded-lg border-gray-300" id="nama" type="text" maxlength="255" placeholder="Nama" />
          </div>
          <div class="mb-5">
            <label class="block font-medium text-gray-700 mb-1" for="jumlah">Jumlah</label>
            <input v-model="form.jumlah" class="form-control w-full rounded-lg border-gray-300" id="jumlah" type="text" maxlength="20" placeholder="Jumlah" />
          </div>
          <div class="flex justify-end bg-gray-50 border-t border-gray-100 pt-6 pb-2">
            <Button type="success" class="rounded-lg shadow-md hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-6 py-2 font-semibold" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Save
            </Button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue';
import { NuxtLink } from '#components';
import Icon from '~/components/Icon.vue';

const form = ref({
  tahun: '2026',
  kode: '086.01.CO',
  nama: 'Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN',
  jumlah: '11498813000',
});

function handleSubmit() {
  // Simpan data, bisa diganti dengan API call
  alert('Data berhasil disimpan!');
}
</script>

<style scoped>
input.form-control {
  border: 1.5px solid #cbd5e1;
  outline: none;
  transition: border-color 0.2s;
}
input.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}
.box { background: #fff; border-top: 3px solid #3b82f6; margin-bottom: 20px; box-shadow: 0 1px 1px rgba(0,0,0,0.06); border-radius: 12px; }
.breadcrumb { background: #fff; padding: 10px; list-style: none; border-radius: 4px; margin-bottom: 20px; }
.breadcrumb li { display: inline; }
.alert-error { background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5; border-radius: 8px; padding: 12px 18px; }
</style>
