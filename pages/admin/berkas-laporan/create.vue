<template>
  <div class="modern-card max-w-2xl mx-auto mt-10 p-8">
    <div class="modern-card-header mb-6">
      <h3 class="modern-card-title text-2xl font-bold">Tambah Berkas Laporan</h3>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Judul</label>
        <input v-model="form.nama" type="text" class="modern-input w-full" required />
      </div>
      <!-- Status field dihapus sesuai permintaan -->
        <div class="mb-4">
          <label class="block mb-1 font-semibold">Berkas</label>
          <input type="file" class="modern-input w-full" @change="handleFileChange" />
      </div>
      <div class="flex gap-4 mt-8">
        <button type="submit" class="modern-btn modern-btn-primary bg-[#2663A3] hover:bg-[#193454] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
          Tambah
        </button>
        <NuxtLink to="/admin/berkas-laporan" class="modern-btn modern-btn-secondary px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200">
          Batal
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  nama: '',
  file: null,
})

function handleFileChange(e) {
  form.value.file = e.target.files[0] || null;
}

async function handleSubmit() {
  if (!form.value.file) {
    alert('Silakan pilih berkas terlebih dahulu.');
    return;
  }
  const formData = new FormData();
  formData.append('nama', form.value.nama);
  formData.append('file', form.value.file);

  try {
    const res = await fetch('/api/berkas-laporan', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      alert('Berkas berhasil diupload!');
      router.push('/admin/berkas-laporan');
    } else {
      alert(data.error || 'Gagal upload berkas.');
    }
  } catch (e) {
    alert('Terjadi kesalahan saat upload.');
  }
}
</script>

<style scoped>
.modern-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08);
}
.modern-card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.modern-card-title {
  margin: 0;
}
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
