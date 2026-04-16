<script setup>
import { ref, computed } from 'vue'
import { IconLock, IconEye, IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import DeleteModal from '~/components/UI/DeleteModal.vue'

const showAlert = ref(true)
const users = ref([
  {
    id: 1,
    nama: 'Admin Satker Persediaan',
    username: 'admin_satker_01',
    role: 'Admin Satker',
    satker: 'LAN JAKARTA',
    lastLogin: '2026-03-12'
  }
])
const userHeaders = [
  { text: 'No', value: 'no', center: true },
  { text: 'Nama', value: 'nama' },
  { text: 'Username', value: 'username', center: true },
  { text: 'Role', value: 'role', center: true },
  { text: 'Satker', value: 'satker', center: true },
  { text: 'Terakhir Login', value: 'lastLogin', center: true },
  { text: 'Password', value: 'password', center: true },
  { text: 'Aksi', value: 'aksi', center: true }
]
const usersWithNo = computed(() => users.value.map((u, i) => ({ ...u, no: i + 1 })))

const showDeleteModal = ref(false)
const userToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

function openDeleteModal(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
  deleteLoading.value = false
  deleteError.value = ''
  deleteSuccess.value = false
}

function doDelete() {
  deleteLoading.value = true
  setTimeout(() => {
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    deleteSuccess.value = true
    setTimeout(closeDeleteModal, 1000)
  }, 1000)
}
</script>

<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Manajemen Admin Satker Persediaan</h1>
      <button class="inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700">
        <IconPlus class="w-4 h-4" />
        Tambah Admin Satker
      </button>
    </div>
    <VTable :headers="userHeaders" :items="usersWithNo">
      <template #nama="{ item }">
        <span class="font-semibold text-blue-700">{{ item.nama }}</span>
      </template>
      <template #lastLogin="{ item }">
        <span class="text-center text-sm">{{ item.lastLogin }}</span>
      </template>
      <template #password="{ item }">
        <button class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors" title="Reset Password">
          <IconLock class="h-4 w-4" />
        </button>
      </template>
      <template #aksi="{ item }">
        <div class="flex justify-center gap-2">
          <button class="hover:text-blue-700 transition tooltip" data-tip="Lihat Detail">
            <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </button>
          <button class="hover:text-yellow-700 transition tooltip" data-tip="Edit">
            <IconPencil class="w-5 h-5 text-yellow-600 hover:text-yellow-800" />
          </button>
          <button @click="openDeleteModal(item)" class="hover:text-red-700 transition tooltip" data-tip="Hapus">
            <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
          </button>
        </div>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </VTable>

    <DeleteModal 
      :show-delete-modal="showDeleteModal"
      :delete-loading="deleteLoading"
      :delete-error="deleteError"
      :delete-success="deleteSuccess"
      @close="closeDeleteModal"
      @confirm="doDelete"
    />
  </div>
</template>
