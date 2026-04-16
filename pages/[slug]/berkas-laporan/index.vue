<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconPlus, IconSearch, IconEye, IconPencil, IconTrash, IconFile, IconDownload } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import VDialog from '~/components/UI/v-dialog.vue'
import DeleteModal from '~/components/UI/DeleteModal.vue'

definePageMeta({ layout: 'default' })

const showAlert = ref(true)
const loading = ref(true)
const berkasList = ref([
  { id: 1, nama: 'Laporan Keuangan Q1.pdf', tipe: 'PDF', tanggal: '2026-03-01', ukuran: '2.5 MB', pengunggah: 'Admin' },
  { id: 2, nama: 'Bukti Bayar Listrik.jpg', tipe: 'Image', tanggal: '2026-03-10', ukuran: '1.2 MB', pengunggah: 'Bendahara' }
])

const filterForm = ref({ nama: '', tipe: '' })
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

const filteredBerkas = computed(() => {
  return berkasList.value.filter(b => {
    return b.nama.toLowerCase().includes(filterForm.value.nama.toLowerCase()) &&
           (!filterForm.value.tipe || b.tipe === filterForm.value.tipe)
  })
})

const selectedFile = ref(null)
const uploadKeterangan = ref('')
const uploading = ref(false)

const openAddModal = () => {
  showAddModal.value = true
}

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Pilih file terlebih dahulu')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('keterangan', uploadKeterangan.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Success simulation
    const newBerkas = {
      id: Date.now(),
      nama: selectedFile.value.name,
      tipe: selectedFile.value.name.split('.').pop().toUpperCase(),
      tanggal: new Date().toISOString().split('T')[0],
      ukuran: (selectedFile.value.size / (1024 * 1024)).toFixed(2) + ' MB',
      pengunggah: 'User'
    }
    
    berkasList.value.unshift(newBerkas)
    showAddModal.value = false
    selectedFile.value = null
    uploadKeterangan.value = ''
    alert('Berkas berhasil diunggah')
  } catch (e) {
    alert('Terjadi kesalahan saat upload: ' + e.message)
  } finally {
    uploading.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const doDelete = async () => {
  deleteLoading.value = true
  // Simulate API
  setTimeout(() => {
    berkasList.value = berkasList.value.filter(b => b.id !== itemToDelete.value.id)
    deleteSuccess.value = true
    setTimeout(() => {
      showDeleteModal.value = false
      itemToDelete.value = null
      deleteLoading.value = false
      deleteSuccess.value = false
    }, 1000)
  }, 1000)
}

onMounted(() => {
  setTimeout(() => { loading.value = false }, 500)
})

const formatSize = (size) => size
</script>

<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" />

    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">
        <Icon icon="mdi:home" class="w-4 h-4 inline" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Berkas Laporan</span>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-blue-700">Manajemen Berkas Laporan</h1>
      <button @click="openAddModal" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
        <IconPlus class="w-4 h-4" />
        Tambah Berkas
      </button>
    </div>

    <!-- Filter Card -->
    <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Cari Nama Berkas</label>
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="filterForm.nama" type="text" class="input input-bordered w-full pl-10" placeholder="Ketik nama berkas..." />
        </div>
      </div>
      <div class="w-48">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tipe Berkas</label>
        <select v-model="filterForm.tipe" class="select select-bordered w-full text-gray-700">
          <option value="">Semua Tipe</option>
          <option value="PDF">PDF</option>
          <option value="Image">Image</option>
          <option value="Excel">Excel</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <table class="table table-zebra w-full">
        <thead class="bg-blue-50 text-blue-700">
          <tr>
            <th class="w-16 text-center">No</th>
            <th>Nama Berkas</th>
            <th class="text-center">Tipe</th>
            <th class="text-center">Tanggal</th>
            <th class="text-center">Ukuran</th>
            <th class="text-center">Pengunggah</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" v-for="i in 3" :key="'loader-'+i">
            <td colspan="7"><div class="h-8 bg-gray-100 animate-pulse rounded"></div></td>
          </tr>
          <tr v-else v-for="(item, index) in filteredBerkas" :key="item.id">
            <td class="text-center font-bold text-gray-400">{{ index + 1 }}</td>
            <td>
              <div class="flex items-center gap-3">
                <IconFile class="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                <span class="font-semibold text-gray-700">{{ item.nama }}</span>
              </div>
            </td>
            <td class="text-center">
              <span class="badge badge-outline font-bold" :class="item.tipe === 'PDF' ? 'badge-error' : 'badge-info'">{{ item.tipe }}</span>
            </td>
            <td class="text-center text-gray-500">{{ item.tanggal }}</td>
            <td class="text-center text-gray-500">{{ formatSize(item.ukuran) }}</td>
            <td class="text-center">
              <span class="badge badge-ghost">{{ item.pengunggah }}</span>
            </td>
            <td class="text-center">
              <div class="flex justify-center gap-2">
                <button class="btn btn-ghost btn-xs text-blue-600 tooltip" data-tip="Lihat">
                  <IconEye class="w-4 h-4" />
                </button>
                <button class="btn btn-ghost btn-xs text-green-600 tooltip" data-tip="Unduh">
                  <IconDownload class="w-4 h-4" />
                </button>
                <button @click="confirmDelete(item)" class="btn btn-ghost btn-xs text-red-600 tooltip" data-tip="Hapus">
                  <IconTrash class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && filteredBerkas.length === 0">
            <td colspan="7" class="text-center py-12 text-gray-400">
              <IconFile class="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Tidak ada berkas yang ditemukan.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <VDialog v-model="showAddModal" title="Tambah Berkas Laporan" confirmText="Unggah" :loading="uploading" @confirm="uploadFile">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Pilih File</label>
          <input type="file" @change="onFileChange" class="file-input file-input-bordered w-full" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Keterangan</label>
          <textarea v-model="uploadKeterangan" class="textarea textarea-bordered w-full" placeholder="Tambahkan keterangan berkas..."></textarea>
        </div>
      </div>
    </VDialog>

    <DeleteModal 
      :show-delete-modal="showDeleteModal"
      :delete-loading="deleteLoading"
      :delete-error="deleteError"
      :delete-success="deleteSuccess"
      @close="showDeleteModal = false"
      @confirm="doDelete"
    />
  </div>
</template>
