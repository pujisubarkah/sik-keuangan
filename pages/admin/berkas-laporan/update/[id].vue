<template>
  <div class="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-blue-100">
    <h1 class="text-2xl font-bold text-blue-700 mb-6">Edit Berkas Laporan</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Judul</label>
        <input v-model="form.judul" type="text" class="modern-input w-full" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Berkas (PDF)</label>
        <input type="file" class="modern-input w-full" @change="handleFileChange" />
        <div v-if="form.berkas" class="mt-2 text-sm text-gray-600">
          Berkas saat ini: <a :href="`/uploads/${form.berkas}`" target="_blank" class="text-blue-700 underline">{{ form.berkas }}</a>
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-semibold">User Pembuat</label>
        <input v-model="form.user_pembuat" type="text" class="modern-input w-full" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Waktu Dibuat</label>
        <input v-model="form.waktu_dibuat" type="text" class="modern-input w-full" required />
      </div>
      <div class="flex gap-4 mt-8">
        <button type="submit" class="modern-btn modern-btn-primary bg-[#2663A3] hover:bg-[#193454] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
          Update
        </button>
        <NuxtLink to="/admin/berkas-laporan" class="modern-btn modern-btn-secondary px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200">
          Batal
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref({
  judul: '',
  berkas: '',
  user_pembuat: '',
  waktu_dibuat: '',
  file: null,
})

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`/api/berkas-laporan/${id}`)
    if (res.ok) {
      const data = await res.json()
      form.value.judul = data.judul
      form.value.berkas = data.berkas
      form.value.user_pembuat = data.user_pembuat
      form.value.waktu_dibuat = data.waktu_dibuat
    }
  } catch {}
})

function handleFileChange(e) {
  form.value.file = e.target.files[0] || null
}

async function handleSubmit() {
  const id = route.params.id
  const formData = new FormData()
  formData.append('judul', form.value.judul)
  formData.append('user_pembuat', form.value.user_pembuat)
  formData.append('waktu_dibuat', form.value.waktu_dibuat)
  if (form.value.file) {
    formData.append('file', form.value.file)
  }
  try {
    const res = await fetch(`/api/berkas-laporan/${id}`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (res.ok && !data.error) {
      alert('Berkas berhasil diupdate!')
      router.push('/admin/berkas-laporan')
    } else {
      alert(data.error || JSON.stringify(data))
    }
  } catch (e) {
    alert('Terjadi kesalahan saat update: ' + e.message)
  }
}
</script>

<style scoped>
.modern-input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.modern-input:focus {
  border-color: #0969F6;
}
</style>
