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
          <h1 class="text-3xl font-bold text-blue-700 mb-1">Update Kegiatan</h1>
          <p class="text-gray-500 text-base">Perbarui data kegiatan sesuai kebutuhan Anda.</p>
        </div>
      </div>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=kegiatan/index">Kegiatans</NuxtLink></li>
        <li>/</li>
        <li>Kegiatan</li>
        <li>/</li>
        <li>Update</li>
        <li>/</li>
        <li class="font-medium text-slate-700">{{ form.nama }}</li>
      </ul>
    </section>

    <section class="content">
      <div class="max-w-2xl mx-auto rounded-3xl shadow-2xl border border-blue-200 overflow-hidden animate-fadein glass-card relative">
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <div class="bg-gradient-to-tr from-blue-400 to-blue-600 p-2 rounded-full shadow-lg border-4 border-white">
            <Icon icon="mdi:star-circle" class="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </div>
        <div class="px-12 pt-20 pb-5 border-b border-blue-100 text-center bg-gradient-to-r from-blue-50/80 to-blue-100/80 backdrop-blur-md">
          <h2 class="text-2xl font-extrabold text-blue-700 mb-1 flex items-center justify-center gap-2 tracking-tight">
            <Icon icon="mdi:clipboard-edit-outline" class="w-8 h-8 text-blue-500" />
            Formulir Update Kegiatan
          </h2>
          <p class="text-gray-500 text-sm">Fields with <span class="text-red-500">*</span> are required.</p>
        </div>
        <form class="px-12 py-10" @submit.prevent="handleSubmit">
          <div class="mb-7 flex items-center gap-4">
            <label class="block font-semibold text-blue-700 w-32 text-right pr-2" for="tahun">Tahun</label>
            <input v-model="form.tahun" class="form-control flex-1 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white/70 shadow-inner placeholder:text-blue-300" id="tahun" type="text" maxlength="4" placeholder="Tahun" />
          </div>
          <div class="mb-7 flex items-center gap-4">
            <label class="block font-semibold text-blue-700 w-32 text-right pr-2" for="kode">Kode</label>
            <input v-model="form.kode" class="form-control flex-1 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white/70 shadow-inner placeholder:text-blue-300" id="kode" type="text" maxlength="255" placeholder="Kode" />
          </div>
          <div class="mb-7 flex items-start gap-4">
            <label class="block font-semibold text-blue-700 w-32 text-right pr-2 pt-2" for="nama">Nama</label>
            <textarea v-model="form.nama" class="form-control flex-1 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white/70 shadow-inner placeholder:text-blue-300 min-h-[48px] max-h-40 resize-y break-words" id="nama" maxlength="255" placeholder="Nama" rows="2"></textarea>
          </div>
          <div class="mb-7 flex items-center gap-4">
            <label class="block font-semibold text-blue-700 w-32 text-right pr-2" for="jumlah">Jumlah</label>
            <input v-model="form.jumlah" class="form-control flex-1 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white/70 shadow-inner placeholder:text-blue-300" id="jumlah" type="text" maxlength="20" placeholder="Jumlah" />
          </div>
          <div class="flex justify-end bg-gradient-to-r from-blue-50/80 to-blue-100/80 border-t border-blue-100 pt-7 pb-3 rounded-b-3xl">
            <Button type="success" class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-150 flex items-center gap-2 px-8 py-3 font-semibold text-lg bg-gradient-to-tr from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800" native-type="submit">
              <Icon icon="mdi:check" class="w-6 h-6 mr-2" /> Update
            </Button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Button } from '@idds/vue'
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

async function fetchKegiatan() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const id = route.params.id
  try {
    const res = await fetch(`/api/anggaran_kegiatan/by-kegiatan/${id}`, { headers })
    const json = await res.json()
    if (json.success) {
      form.value = {
        tahun: json.tahun_anggaran || '',
        kode: json.kegiatan_kode || '',
        nama: json.kegiatan_nama || '',
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
    const res = await fetch(`/api/anggaran_kegiatan/by-kegiatan/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        program_nama: form.value.nama,
        program_kode: form.value.kode,
        tahun_anggaran: form.value.tahun
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

onMounted(fetchKegiatan)
</script>

<style scoped>
input.form-control {
  border: 1.5px solid #cbd5e1;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: transparent;
  font-size: 1.08rem;
  padding: 0.7rem 1.1rem;
}
input.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #bfdbfe66;
  background: #f0f9ff;
}
.glass-card {
  background: linear-gradient(120deg, #f0f9ffcc 60%, #e0e7efcc 100%);
  backdrop-filter: blur(8px) saturate(1.2);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  border-top: 5px solid #3b82f6;
  border-bottom: none;
  position: relative;
}
.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 2rem;
  pointer-events: none;
  box-shadow: 0 2px 24px 0 rgba(59,130,246,0.08);
}
.breadcrumb {
  background: #fff;
  padding: 10px;
  list-style: none;
  border-radius: 4px;
  margin-bottom: 20px;
}
.breadcrumb li { display: inline; }
.animate-fadein { animation: fadein 0.7s; }
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
</style>