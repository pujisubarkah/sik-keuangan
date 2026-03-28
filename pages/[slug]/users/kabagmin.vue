<script setup>
const showDeleteModal = ref(false)
const userToDelete = ref(null)
function openDeleteModal(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}
function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
}
function confirmDeleteUser() {
  // TODO: Implement actual delete logic
  alert('User dihapus: ' + (userToDelete.value?.nama || ''))
  closeDeleteModal()
}
import { ref, computed } from 'vue'
import { Button } from '@idds/vue'
import { IconPlus } from '@tabler/icons-vue'
import { IconLock, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)
const users = ref([
  {
    id: 1,
    nama: 'Nama User',
    username: 'username',
    role: 'Kabagmin/Kabag',
    satker: 'LAN JAKARTA',
    lastLogin: 'Belum Pernah Login'
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
</script>

<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" />
    <div class="mb-2">
      <h1 class="text-3xl font-bold text-blue-700 text-center">Daftar Kabagmin/Kabag</h1>
    </div>
    <div class="mb-6">
      <button class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
        <IconPlus class="w-4 h-4" />
        Tambah Kabagmin
      </button>
    </div>
    <VTable :headers="userHeaders" :items="usersWithNo">
      <template #lastLogin="{ item }">
        <span class="text-center text-sm">{{ item.lastLogin }}</span>
      </template>
      <template #password="{ item }">
        <button @click="resetPassword(item)" class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors" title="Reset Password">
          <IconLock class="h-4 w-4" />
        </button>
      </template>
      <template #aksi="{ item }">
        <div class="flex justify-center gap-2">
          <button @click="openViewModal(item)" class="hover:text-blue-700 transition tooltip" data-tip="Lihat Detail" style="background:none;border:none;padding:0;">
            <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </button>
          <button @click="openEditModal(item)" class="hover:text-yellow-700 transition tooltip" data-tip="Edit" style="background:none;border:none;padding:0;">
            <IconPencil class="w-5 h-5 text-yellow-600 hover:text-yellow-800" />
          </button>
          <button @click="openDeleteModal(item)" class="hover:text-red-700 transition tooltip" data-tip="Hapus" style="background:none;border:none;padding:0;">
            <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
          </button>
          <!-- Modal Delete User -->
          <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative animate-fade-in">
              <button @click="closeDeleteModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
              <h3 class="text-xl font-bold text-red-700 mb-6 text-center">Konfirmasi Hapus Akun</h3>
              <div class="text-center text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus akun <span class="font-bold">{{ userToDelete?.nama }}</span>?
              </div>
              <div class="flex justify-end gap-2">
                <Button type="secondary" @click="closeDeleteModal">Batal</Button>
                <Button type="error" @click="confirmDeleteUser">Hapus</Button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </VTable>
  </div>
</template>
