<template>
  <div class="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-blue-100">
    <h1 class="text-2xl font-bold text-blue-700 mb-6">Detail Berkas Laporan</h1>
    <div v-if="laporan">
      <div class="mb-4">
        <span class="font-semibold">Judul:</span>
        <span class="ml-2">{{ laporan.judul }}</span>
      </div>
      <div class="mb-4">
        <span class="font-semibold">Berkas:</span>
        <span class="ml-2">
          <a :href="`/uploads/${laporan.berkas}`" target="_blank" class="text-blue-700 underline">{{ laporan.berkas }}</a>
        </span>
      </div>
      <div class="mb-4">
        <span class="font-semibold">User Pembuat:</span>
        <span class="ml-2">{{ laporan.user_pembuat }}</span>
      </div>
      <div class="mb-4">
        <span class="font-semibold">Waktu Dibuat:</span>
        <span class="ml-2">{{ laporan.waktu_dibuat }}</span>
      </div>
    </div>
    <div v-else class="text-gray-500">Data tidak ditemukan.</div>
    <div class="mt-8">
      <NuxtLink to="/admin/berkas-laporan" class="bg-blue-700 hover:bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">Kembali</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const laporan = ref(null)

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`/api/berkas-laporan/${id}`)
    if (res.ok) {
      laporan.value = await res.json()
    } else {
      laporan.value = null
    }
  } catch (e) {
    laporan.value = null
  }
})
</script>
