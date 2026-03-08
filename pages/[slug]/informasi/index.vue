<!-- filepath: pages/[slug]/informasi.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Alert -->
      <div
        v-if="showAlert"
        class="mb-6 rounded-md bg-red-50 p-4 border border-red-200"
      >
        <div class="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Perhatian: Data Belum Lengkap
            </h3>

            <p class="text-sm text-red-700 mt-2">
              Terdapat
              <span class="font-bold">41 Sub Output</span>
              yang belum ditentukan unitnya.
              <NuxtLink
                to="/admin/suboutput"
                class="font-medium underline hover:text-red-900"
              >
                Klik di sini untuk memperbaiki
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Daftar Informasi
        </h2>
      </div>

      <!-- Button -->
      <div class="mb-6">
        <NuxtLink
          :to="`/${route.params.slug}/informasi/create`"
          class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-800"
        >
          <IconPlus class="h-4 w-4" />
          Informasi Baru
        </NuxtLink>
      </div>

      <!-- Card -->
      <div class="bg-white shadow border border-gray-200 rounded-lg overflow-hidden">

        <!-- Summary -->
        <div class="px-6 py-4 border-b bg-gray-50">
          <span class="text-sm text-gray-500 font-medium">
            Menampilkan {{ filteredInformasis.length }} hasil
          </span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">

            <thead class="bg-blue-100">
              <tr>
                <th class="px-3 py-2 text-center w-16">No</th>
                <th class="px-3 py-2 text-left">Judul</th>
                <th class="px-3 py-2 text-right w-28">Aksi</th>
              </tr>

              <!-- Filter -->
              <tr class="bg-white border-b">
                <td></td>
                <td class="px-3 py-2">
                  <input
                    v-model="filter.judul"
                    type="text"
                    placeholder="Cari judul..."
                    class="w-full border rounded px-3 py-2 text-sm"
                  />
                </td>
                <td></td>
              </tr>
            </thead>

            <tbody>

              <tr
                v-for="(info, index) in filteredInformasis"
                :key="info.id"
                class="border-b hover:bg-yellow-50"
              >
                <td class="px-3 py-2 text-center">
                  {{ index + 1 }}
                </td>

                <td class="px-3 py-2">
                  <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                    {{ info.judul }}
                  </span>
                </td>

                <td class="px-3 py-2 text-right">
                  <div class="flex justify-end gap-2">

                    <NuxtLink
                      :to="`/${route.params.slug}/informasi/view/${info.id}`"
                      class="bg-indigo-50 p-2 rounded hover:bg-indigo-100 text-indigo-600"
                    >
                      <IconEye class="h-4 w-4"/>
                    </NuxtLink>

                    <NuxtLink
                      :to="`/${route.params.slug}/informasi/update/${info.id}`"
                      class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600"
                    >
                      <IconPencil class="h-4 w-4"/>
                    </NuxtLink>

                    <button
                      @click="handleDelete(info.id)"
                      class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600"
                    >
                      <IconTrash class="h-4 w-4"/>
                    </button>

                  </div>
                </td>
              </tr>

              <tr v-if="filteredInformasis.length === 0">
                <td colspan="3" class="text-center py-10 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>

            </tbody>

          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useUserStore } from '~/stores/user'

import {
  IconPlus,
  IconEye,
  IconPencil,
  IconTrash
} from '@tabler/icons-vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const userStore = useUserStore()

const showAlert = ref(true)

const filter = ref({
  judul: ''
})

const informasis = ref([])

const filteredInformasis = computed(() => {
  return informasis.value.filter(info =>
    (info.judul || '')
      .toLowerCase()
      .includes(filter.value.judul.toLowerCase())
  )
})

const fetchInformasi = async () => {
  try {

    const token = localStorage.getItem('token')

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    const data = await $fetch('/api/informasi', {
      headers
    })

    informasis.value = data ?? []

  } catch (error) {

    if (error?.statusCode === 401) {
      localStorage.removeItem('token')
      userStore.clearUser()
      navigateTo('/login')
    }

    console.error('Error fetch informasi', error)
    informasis.value = []
  }
}

const handleDelete = async (id) => {

  if (!confirm('Yakin ingin menghapus informasi ini?')) return

  try {

    const token = localStorage.getItem('token')

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    await $fetch(`/api/informasi/${id}`, {
      method: 'DELETE',
      headers
    })

    await fetchInformasi()

    alert('Informasi berhasil dihapus')

  } catch (error) {

    console.error('Error delete informasi', error)
    alert('Gagal menghapus informasi')

  }
}

onMounted(() => {
  fetchInformasi()
})
</script>