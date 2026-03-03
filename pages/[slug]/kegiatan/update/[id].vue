<template>
  <div class="content-wrapper min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
    <!-- Alert -->
    <section v-if="unassignedCount > 0" class="mb-6">
      <div class="alert alert-error shadow-lg animate-fade-in">
        <div class="flex items-center gap-3">
          <Icon icon="tabler:alert-circle" class="w-6 h-6 text-red-500" />
          <span>
            Terdapat {{ unassignedCount }} Sub Output yang belum ditentukan unitnya.
            Silahkan
            <NuxtLink to="/index.php?r=pekerjaan/admin&id_unit=null" class="link link-hover underline font-semibold">klik di sini</NuxtLink>
            untuk memperbaiki.
          </span>
        </div>
      </div>
    </section>

    <!-- Header & Breadcrumb -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <Icon icon="tabler:edit" class="w-7 h-7 text-blue-500" />
          SIK - Update Kegiatan
        </h1>
      </div>
      <ul class="breadcrumb bg-white shadow rounded-lg px-4 py-2 flex gap-2 items-center">
        <li>
          <NuxtLink to="/index.php?r=/site/index">
            <Icon icon="tabler:home" class="w-5 h-5 text-gray-500" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/index.php?r=kegiatan/index" class="text-blue-600 hover:underline">Kegiatans</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/kegiatan/view/${id}`" class="text-blue-600 hover:underline">{{ id }}</NuxtLink>
        </li>
        <li><span class="text-gray-700 font-semibold">Update</span></li>
      </ul>
    </section>

    <!-- Main Content -->
    <section>
      <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
        <h2 class="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <Icon icon="tabler:edit-circle" class="w-6 h-6 text-blue-400" />
          Update Kegiatan <span class="font-mono text-blue-600">#{{ id }}</span>
        </h2>
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <p class="help-block text-gray-500 mb-2">Fields with <span class="required">*</span> are required.</p>
          <div class="form-group">
            <label class="block font-semibold mb-1" for="tahun">Tahun <span class="required">*</span></label>
            <input v-model="form.tahun" class="input input-bordered w-full" maxlength="4" placeholder="Tahun" id="tahun" type="text" required />
          </div>
          <div class="form-group">
            <label class="block font-semibold mb-1" for="id_program">Id Program <span class="required">*</span></label>
            <input v-model="form.id_program" class="input input-bordered w-full" placeholder="Id Program" id="id_program" type="text" required />
          </div>
          <div class="form-group">
            <label class="block font-semibold mb-1" for="kode">Kode <span class="required">*</span></label>
            <input v-model="form.kode" class="input input-bordered w-full" maxlength="255" placeholder="Kode" id="kode" type="text" required />
          </div>
          <div class="form-group">
            <label class="block font-semibold mb-1" for="nama">Nama <span class="required">*</span></label>
            <input v-model="form.nama" class="input input-bordered w-full" maxlength="255" placeholder="Nama" id="nama" type="text" required />
          </div>
          <div class="form-group">
            <label class="block font-semibold mb-1" for="jumlah">Jumlah <span class="required">*</span></label>
            <input v-model="form.jumlah" class="input input-bordered w-full" maxlength="20" placeholder="Jumlah" id="jumlah" type="text" required />
          </div>
          <div class="form-actions flex justify-end gap-2 mt-6">
            <button class="btn btn-primary px-6 py-2 rounded-lg shadow" type="submit">
              <Icon icon="tabler:device-floppy" class="w-5 h-5 mr-2" />
              Simpan
            </button>
            <NuxtLink :to="`/${$route.params.slug}/kegiatan/view/${id}`" class="btn btn-ghost px-6 py-2 rounded-lg">
              <Icon icon="tabler:arrow-back-up" class="w-5 h-5 mr-2" />
              Batal
            </NuxtLink>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const unassignedCount = 41

const form = ref({
  tahun: '2026',
  id_program: '242',
  kode: '7917',
  nama: 'Penjaminan Mutu Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara',
  jumlah: '1272228000'
})

function handleSubmit() {
  alert('Data berhasil disimpan:\n' + JSON.stringify(form.value, null, 2))
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in { animation: fade-in 0.5s ease-out; }
.required { color: #e53e3e; }
.input { border-radius: 0.5rem; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; }
.input:focus { border-color: #3b82f6; outline: none; }
.btn-primary { background: linear-gradient(90deg,#2563eb,#1e40af); color: #fff; }
.btn-ghost { background: #f3f4f6; color: #374151; }
.breadcrumb { font-size: 0.95rem; }
</style>