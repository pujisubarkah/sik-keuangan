<!-- filepath: c:\Users\user\Documents\sik-keuangan2\pages\[slug]\informasi\create.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Alert Section (Konsisten dengan halaman lain) -->
      <div v-if="showAlert" class="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Perhatian: Data Belum Lengkap</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>
                Terdapat <span class="font-bold">41 Sub Output</span> yang belum ditentukan unitnya.
                <NuxtLink to="/admin/suboutput" class="font-medium underline hover:text-red-900">Klik di sini untuk memperbaiki</NuxtLink>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Tambah Informasi Baru
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Buat informasi baru dengan mengisi judul dan deskripsi di bawah ini.
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-900">Formulir Informasi</h2>
        </div>

        <!-- Card Body: Form -->
        <div class="px-6 py-4">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <!-- Judul Field -->
            <div>
              <label for="judul" class="block text-sm font-medium text-gray-700 mb-1">
                Judul <span class="text-red-500">*</span>
              </label>
              <input 
                id="judul"
                v-model="form.judul"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Masukkan judul informasi"
                maxlength="255"
                :disabled="submitting"
                required
              />
              <p class="mt-1 text-xs text-gray-400">Maksimal 255 karakter</p>
            </div>

            <!-- Deskripsi Field -->
            <div>
              <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="deskripsi"
                v-model="form.deskripsi"
                rows="5"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
                placeholder="Masukkan deskripsi informasi secara lengkap"
                :disabled="submitting"
                required
              ></textarea>
              <p class="mt-1 text-xs text-gray-400">Gunakan bahasa yang jelas dan informatif</p>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                :disabled="submitting || !form.judul.trim() || !form.deskripsi.trim()"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Back Link dihapus sesuai permintaan -->

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, navigateTo } from '#app'
import { NuxtLink } from '#components'

definePageMeta({ layout: 'default' })

const route = useRoute()
const showAlert = ref(true)
const form = ref({ judul: '', deskripsi: '' })
const submitting = ref(false)

const handleSubmit = async () => {
  // Validasi client-side
  if (!form.value.judul.trim() || !form.value.deskripsi.trim()) {
    alert('Judul dan deskripsi wajib diisi!')
    return
  }
  
  submitting.value = true
  
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    
    const response = await fetch('/api/informasi', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        judul: form.value.judul,
        deskripsi: form.value.deskripsi
      })
    })
    
    if (response.status === 401) {
      localStorage.removeItem('token')
      alert('Sesi Anda telah habis, silakan login ulang.')
      await navigateTo('/login')
      return
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Gagal menambah informasi')
    }
    
    alert('Informasi berhasil ditambahkan')
    await navigateTo(`/${route.params.slug}/informasi`)
    
  } catch (error) {
    console.error('Error adding informasi:', error)
    alert('Gagal menambah informasi: ' + error.message)
  } finally {
    submitting.value = false
  }
}
</script>