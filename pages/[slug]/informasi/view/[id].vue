<script setup>
import { Card, Button } from '@idds/vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { navigateTo } from '#app'
import { 
  IconArrowLeft, 
  IconPencil, 
  IconPlus, 
  IconList, 
  IconFileText,
  IconCalendar,
  IconUser
} from '@tabler/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)
const informasi = ref(null)
const userStore = useUserStore()

// Data dummy (nanti diganti dengan fetch API)
onMounted(async () => {
  // Simulasi fetch data dari API
  await fetchInformasi()
  loading.value = false
})

const fetchInformasi = async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const response = await fetch(`/api/informasi/${route.params.id}`, { headers })
    if (response.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser()
      await navigateTo('/login')
      return
    }
    if (!response.ok) throw new Error('Gagal mengambil data')
    informasi.value = await response.json()
  } catch (e) {
    informasi.value = null
    alert('Gagal mengambil data informasi')
  }
}

// Format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format deskripsi (convert newline ke paragraph)
const formatDeskripsi = (text) => {
  if (!text) return '-'
  return text.split('\n\n').map((paragraph, index) => ({
    id: index,
    content: paragraph
  }))
}
</script>

<template>
  <div class="pt-14 px-4 md:px-8 pb-8">
    
    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink 
        to="/" 
        class="hover:text-blue-700 transition"
      >
        <span class="font-medium">Beranda</span>
      </NuxtLink>
      <span class="text-gray-300">/</span>
      <NuxtLink 
        to="/admin/informasi" 
        class="hover:text-blue-700 transition"
      >
        Informasi
      </NuxtLink>
      <span class="text-gray-300">/</span>
      <span class="font-bold text-blue-700">Detail</span>
    </div>

    <!-- HEADER SECTION -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-blue-700">
          Detail Informasi
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Lihat detail informasi dan persyaratan dokumen
        </p>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          :to="`/admin/informasi/update/${informasi?.id}`"
          class="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          <IconPencil class="h-4 w-4" />
          <span>Edit</span>
        </NuxtLink>
        <!-- Button Tambah Informasi, Kelola Informasi, dan Kembali dihapus sesuai permintaan -->
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>

    <!-- DETAIL CARD -->
    <Card v-else-if="informasi" class="shadow-md border border-gray-100">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-blue-700">
            {{ informasi.judul }}
          </h2>
          <span 
            :class="informasi.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ informasi.is_active ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
      </template>

      <div class="p-6">
        <!-- INFO META -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <IconCalendar class="w-5 h-5 text-blue-600" />
            <div>
              <span class="font-semibold">Dibuat:</span>
              <span class="ml-2">{{ formatDate(informasi.created_at) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <IconUser class="w-5 h-5 text-blue-600" />
            <div>
              <span class="font-semibold">Diperbarui:</span>
              <span class="ml-2">{{ formatDate(informasi.updated_at) }}</span>
            </div>
          </div>
        </div>

        <!-- DESKRIPSI / ISI -->
        <div>
          <h3 class="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <IconFileText class="w-5 h-5" />
            Isi / Deskripsi
          </h3>
          
          <div class="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div class="prose prose-blue max-w-none">
              <div 
                v-for="paragraph in formatDeskripsi(informasi.deskripsi)" 
                :key="paragraph.id"
                class="mb-4 last:mb-0 text-gray-700 leading-relaxed whitespace-pre-line"
              >
                {{ paragraph.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- INFO ID (Optional) -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="text-xs text-gray-400 text-center">
            ID Informasi: <span class="font-mono">{{ informasi.id }}</span>
          </div>
        </div>
      </div>
    </Card>

    <!-- EMPTY STATE -->
    <Card v-else class="shadow-md border border-gray-100">
      <div class="p-12 text-center">
        <IconFileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-600 mb-2">Informasi Tidak Ditemukan</h3>
        <p class="text-gray-500 mb-6">Data yang Anda cari tidak tersedia atau telah dihapus.</p>
        <NuxtLink
          to="/admin/informasi"
          class="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700"
        >
          <IconArrowLeft class="h-4 w-4" />
          <span>Kembali ke Daftar</span>
        </NuxtLink>
      </div>
    </Card>

  </div>
</template>

<style scoped>
/* Optional: Custom prose styling for description */
.prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.prose li {
  margin: 0.5rem 0;
}

.prose p {
  margin: 1rem 0;
}
</style>