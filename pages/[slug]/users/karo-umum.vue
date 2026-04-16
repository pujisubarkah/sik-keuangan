<script setup>
import { ref, computed } from 'vue'
import { IconLock, IconEye, IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)

const users = ref([
  {
    id: 1,
    nama: 'Drs. H. Mulyanto',
    username: 'mulyanto_karo',
    role: 'Karo Umum',
    satker: 'LAN JAKARTA',
    lastLogin: '2026-04-11 10:00'
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

function openAddModal() { showAddModal.value = true }
function openDeleteModal(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}
function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
}
function confirmDeleteUser() {
  alert('User dihapus: ' + (userToDelete.value?.nama || ''))
  closeDeleteModal()
}
</script>

<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Daftar Karo Umum</h1>
      <button @click="openAddModal" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
        <IconPlus class="w-4 h-4" />
        Tambah Karo Umum
      </button>
    </div>
    <VTable :headers="userHeaders" :items="usersWithNo">
      <template #nama="{ item }">
        <span class="font-semibold text-blue-700">{{ item.nama }}</span>
      </template>
      <template #role="{ item }">
        <span class="badge badge-primary text-white font-bold">{{ item.role }}</span>
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
<<<<<<< HEAD
          <button class="hover:text-blue-700 transition tooltip" data-tip="Lihat Detail" style="background:none;border:none;padding:0;">
            <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </button>
          <button class="hover:text-yellow-700 transition tooltip" data-tip="Edit" style="background:none;border:none;padding:0;">
            <IconPencil class="w-5 h-5 text-yellow-600 hover:text-yellow-800" />
=======
          <button @click="openViewModal(item)" class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="Lihat Detail" style="border:none;padding:0;">
            <IconEye class="w-5 h-5 text-blue-600" />
          </button>
          <button @click="openEditModal(item)" class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" data-tip="Edit" style="border:none;padding:0;">
            <IconPencil class="w-5 h-5 text-yellow-600" />
>>>>>>> 7f81c7ed4af8c029214cd2e342963f8aed59d98e
          </button>
          <button @click="openDeleteModal(item)" class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" data-tip="Hapus" style="border:none;padding:0;">
            <IconTrash class="w-5 h-5 text-red-600" />
          </button>
        </div>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </VTable>
  </div>
</template>

