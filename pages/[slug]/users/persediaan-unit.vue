<script setup>
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)
const editUser = ref({
  nama: '',
  username: '',
  role: '',
  satker: '',
  lastLogin: ''
})
function openViewModal(user) {
  selectedUser.value = { ...user }
  showViewModal.value = true
}
function closeViewModal() {
  showViewModal.value = false
}
function openEditModal(user) {
  editUser.value = { ...user }
  showEditModal.value = true
}
function closeEditModal() {
  showEditModal.value = false
}
function submitEditUser() {
  // TODO: Implement update logic
  alert('User diupdate: ' + JSON.stringify(editUser.value))
  closeEditModal()
}
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
    role: 'Persediaan Unit',
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
      <h1 class="text-3xl font-bold text-blue-700 text-center">Daftar Persediaan Unit</h1>
    </div>
    <div class="mb-6">
      <Button type="primary" size="md" class="w-fit flex items-center gap-2">
        <IconPlus class="w-5 h-5" />
        Tambah Persediaan Unit
      </Button>
    </div>
    <VTable :headers="userHeaders" :items="usersWithNo">
      <template #nama="{ item }">
        <span class="font-semibold text-blue-700">{{ item.nama }}</span>
      </template>
      <template #username="{ item }">
        <span class="text-center">{{ item.username }}</span>
      </template>
      <template #role="{ item }">
        <span class="badge badge-primary text-white font-bold">{{ item.role }}</span>
      </template>
      <template #satker="{ item }">
        <span class="text-center">{{ item.satker }}</span>
      </template>
      <template #lastLogin="{ item }">
        <span class="text-center text-sm">{{ item.lastLogin }}</span>
      </template>
      <template #password="{ item }">
        <Button type="warning" size="sm" circle>
          <IconLock class="w-5 h-5" />
        </Button>
      </template>
      <template #aksi="{ item }">
        <div class="flex justify-center gap-2">
          <Button type="info" size="sm" circle @click="openViewModal(item)">
            <IconEye class="w-5 h-5" />
          </Button>
          <Button type="warning" size="sm" circle @click="openEditModal(item)">
            <IconPencil class="w-5 h-5" />
          </Button>
              <!-- Modal View User -->
              <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
                <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative animate-fade-in">
                  <button @click="closeViewModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
                  <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Detail Persediaan Unit</h3>
                  <div v-if="selectedUser" class="space-y-4">
                    <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Nama</span><span class="flex-1">{{ selectedUser.nama }}</span></div>
                    <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Username</span><span class="flex-1">{{ selectedUser.username }}</span></div>
                    <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Role</span><span class="flex-1">{{ selectedUser.role }}</span></div>
                    <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Satker</span><span class="flex-1">{{ selectedUser.satker }}</span></div>
                    <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Terakhir Login</span><span class="flex-1">{{ selectedUser.lastLogin }}</span></div>
                  </div>
                  <div class="flex justify-end mt-8">
                    <Button type="secondary" @click="closeViewModal">Tutup</Button>
                  </div>
                </div>
              </div>

              <!-- Modal Edit User -->
              <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
                <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative animate-fade-in">
                  <button @click="closeEditModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
                  <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Edit Persediaan Unit</h3>
                  <form @submit.prevent="submitEditUser">
                    <div class="space-y-4">
                      <div class="flex items-center">
                        <label for="edit-nama" class="w-40 font-semibold text-gray-700">Nama</label>
                        <input v-model="editUser.nama" id="edit-nama" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
                      </div>
                      <div class="flex items-center">
                        <label for="edit-username" class="w-40 font-semibold text-gray-700">Username</label>
                        <input v-model="editUser.username" id="edit-username" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
                      </div>
                      <div class="flex items-center">
                        <label for="edit-role" class="w-40 font-semibold text-gray-700">Role</label>
                        <input v-model="editUser.role" id="edit-role" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
                      </div>
                      <div class="flex items-center">
                        <label for="edit-satker" class="w-40 font-semibold text-gray-700">Satker</label>
                        <input v-model="editUser.satker" id="edit-satker" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
                      </div>
                      <div class="flex items-center">
                        <label for="edit-lastLogin" class="w-40 font-semibold text-gray-700">Terakhir Login</label>
                        <input v-model="editUser.lastLogin" id="edit-lastLogin" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" />
                      </div>
                    </div>
                    <div class="flex justify-end mt-8 gap-2">
                      <Button type="secondary" @click="closeEditModal">Batal</Button>
                      <Button type="success" native-type="submit">Simpan</Button>
                    </div>
                  </form>
                </div>
              </div>
          <Button type="error" size="sm" circle @click="openDeleteModal(item)">
            <IconTrash class="w-5 h-5" />
          </Button>
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
