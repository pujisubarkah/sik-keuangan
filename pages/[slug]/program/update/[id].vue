<template>
  <div class="content-wrapper min-h-screen font-sans pt-24 bg-gray-100">
    <transition name="fade">
      <div v-if="showToast" class="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadein">
        <Icon icon="mdi:check-circle" class="w-6 h-6" />
        Data berhasil diupdate!
      </div>
    </transition>
    <section class="content-header">
      <div class="alert-wide-wrapper">
        <SuboutputAlert :showAlert="true" />
      </div>
    </section>

    <section class="content-header">
      <div class="flex items-center gap-4 mb-2">
        <Icon icon="mdi:clipboard-edit-outline" class="w-12 h-12 text-blue-500 bg-white rounded-full shadow p-2" />
        <div>
          <h1 class="text-3xl font-bold text-blue-700 mb-1">Update Program</h1>
          <p class="text-gray-500 text-base">Perbarui data program sesuai kebutuhan Anda.</p>
        </div>
      </div>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=program/index">Programs</NuxtLink></li>
        <li>/</li>
        <li>Program</li>
        <li>/</li>
        <li>Update</li>
        <li>/</li>
        <li class="font-medium text-slate-700">{{ form.nama }}</li>
      </ul>
    </section>

    <section class="content">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden animate-fadein">
        <div class="px-12 pt-10 pb-5 border-b border-blue-100 text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 class="text-2xl font-bold text-blue-700 mb-1 flex items-center justify-center gap-2">
            <Icon icon="mdi:clipboard-edit-outline" class="w-8 h-8 text-blue-500" />
            Formulir Update Program
          </h2>
          <p class="text-gray-500 text-sm">Fields with <span class="text-red-500">*</span> are required.</p>
        </div>
        <form class="px-12 py-10" @submit.prevent="handleSubmit">
          <div class="mb-6 flex items-center gap-4">
            <label class="block font-medium text-gray-700 w-32 text-right pr-2" for="tahun">Tahun</label>
            <input v-model="form.tahun" class="form-control flex-1 rounded-xl border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150" id="tahun" type="text" maxlength="4" placeholder="Tahun" />
          </div>
          <div class="mb-6 flex items-center gap-4">
            <label class="block font-medium text-gray-700 w-32 text-right pr-2" for="kode">Kode</label>
            <input v-model="form.kode" class="form-control flex-1 rounded-xl border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150" id="kode" type="text" maxlength="255" placeholder="Kode" />
          </div>
          <div class="mb-6 flex items-center gap-4">
            <label class="block font-medium text-gray-700 w-32 text-right pr-2" for="nama">Nama</label>
            <input v-model="form.nama" class="form-control flex-1 rounded-xl border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150" id="nama" type="text" maxlength="255" placeholder="Nama" />
          </div>
          <div class="mb-6 flex items-center gap-4">
            <label class="block font-medium text-gray-700 w-32 text-right pr-2" for="jumlah">Jumlah</label>
            <input v-model="form.jumlah" class="form-control flex-1 rounded-xl border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150" id="jumlah" type="text" maxlength="20" placeholder="Jumlah" />
          </div>
          <div class="flex justify-end bg-blue-50 border-t border-blue-100 pt-7 pb-3">
            <Button type="success" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-8 py-3 font-semibold text-lg bg-blue-500 text-white hover:bg-blue-600" native-type="submit">
              <Icon icon="mdi:check" class="w-6 h-6 mr-2" /> Update
            </Button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>




import { Button, TextField, Card } from '@idds/vue'
import { onMounted, ref } from 'vue'
import { NuxtLink } from '#components';
import Icon from '~/components/Icon.vue';
import SuboutputAlert from '~/components/SuboutputAlert.vue';
import { useRoute } from 'vue-router'

const showToast = ref(false)

const form = ref({
  tahun: '',
  kode: '',
  nama: '',
  jumlah: ''
})

const route = useRoute()

async function fetchProgram() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const id = route.params.id
  try {
    const res = await fetch(`/api/anggaran_program/by-program/${id}`, { headers })
    const json = await res.json()
    if (json.success) {
      form.value = {
        tahun: json.tahun_anggaran || '',
        kode: json.program_kode || '',
        nama: json.program_nama || '',
        jumlah: json.total_anggaran ? String(json.total_anggaran) : ''
      }
    }
  } catch (e) {}
}

async function handleSubmit() {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  const id = route.params.id
  try {
    const res = await fetch(`/api/anggaran_program/by-program/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        program_nama: form.value.nama,
        program_kode: form.value.kode,
        tahun_anggaran: form.value.tahun,
        // total_anggaran tidak diupdate via PUT, hanya info summary
      })
    })
    const json = await res.json()
    if (json.success) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 2000)
    } else {
      alert(json.message || 'Gagal menyimpan data!')
    }
  } catch (e) {
    alert('Gagal menyimpan data!')
  }
}

onMounted(fetchProgram)
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
.animate-fadein { animation: fadein 0.7s; }
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
</style>
