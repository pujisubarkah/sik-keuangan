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
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)
const editUser = ref({
  nama: '',
  namaPegawai: '',
  nip: '',
  username: '',
  password: '',
  satker: ''
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
const showAddModal = ref(false)
const newAdmin = ref({
  nama: '',
  namaPegawai: '',
  nip: '',
  username: '',
  password: '',
  satker: ''
})

function openAddModal() {
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
}
function submitAddAdmin() {
  // TODO: Implement logic to add admin
  alert('Admin ditambahkan: ' + JSON.stringify(newAdmin.value))
  closeAddModal()
}
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed } from 'vue'
import { IconLock, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import VButton from '~/components/UI/v-button.vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)

const filter = ref({
  nama: '',
  username: '',
  role: '',
  satker: ''
})

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Verifikator' },
  { id: 3, name: 'PUMK' },
  { id: 8, name: 'Admin Satker' }
]

const satkers = [
  { id: 1, name: 'LAN JAKARTA' },
  { id: 2, name: 'PUSJAR SKTASN NAS' },
  { id: 3, name: 'STIA LAN BANDUNG' }
]

const users = ref([
  {
    id: 1,
    nama: 'Admin',
    username: 'admin',
    role: 'Admin',
    satker: 'LAN JAKARTA',
    lastLogin: 'Sabtu, 28 Februari 2026 19:30 WIB'
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

definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" class="mb-6" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>User</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar Admin</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Admin
    </h1>

    <!-- CARD -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-blue-700">Daftar Admin</h2>
      </template>

      <!-- ACTION -->
      <div class="mb-4">
        <VButton variant="success" @click="openAddModal">
          <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
          Tambah Admin
        </VButton>
      </div>

      <div class="text-sm mb-4 text-blue-700 font-semibold">
        Menampilkan <b>{{ users.length }}</b> data
      </div>

      <!-- TABLE: v-table -->
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
          <NuxtLink :to="`/admin/user/set-password/${item.id}`" data-tip="Set Password">
            <Button type="warning" size="sm" circle>
              <IconLock class="w-5 h-5" />
            </Button>
          </NuxtLink>
        </template>
        <template #aksi="{ item }">
          <div class="flex justify-center gap-2">
            <button @click="openViewModal(item)" class="hover:text-blue-700 transition tooltip" data-tip="View" style="background:none;border:none;padding:0;">
              <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
            </button>
            <button @click="openEditModal(item)" class="hover:text-blue-700 transition tooltip" data-tip="Update" style="background:none;border:none;padding:0;">
              <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
            </button>
            <button @click="openDeleteModal(item)" class="hover:text-red-600 transition tooltip" data-tip="Delete" style="background:none;border:none;padding:0;">
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
                    <VButton type="button" variant="secondary" @click="closeDeleteModal">Batal</VButton>
                    <VButton type="button" variant="danger" @click="confirmDeleteUser">Hapus</VButton>
                  </div>
                </div>
              </div>
          </div>
        </template>
        <template #empty>
          <span class="text-gray-400">Tidak ada data</span>
        </template>
      </VTable>
    </Card>

    <!-- Modal Tambah Admin -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
        <button @click="closeAddModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Tambah Admin</h3>
        <form @submit.prevent="submitAddAdmin">
          <div class="space-y-4">
            <div class="flex items-center">
              <label for="nama" class="w-40 font-semibold text-gray-700">Nama</label>
              <input v-model="newAdmin.nama" id="nama" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="namaPegawai" class="w-40 font-semibold text-gray-700">Nama Pegawai</label>
              <input v-model="newAdmin.namaPegawai" id="namaPegawai" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="nip" class="w-40 font-semibold text-gray-700">NIP</label>
              <input v-model="newAdmin.nip" id="nip" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="username" class="w-40 font-semibold text-gray-700">Username</label>
              <input v-model="newAdmin.username" id="username" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="password" class="w-40 font-semibold text-gray-700">Password</label>
              <input v-model="newAdmin.password" id="password" type="password" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="satker" class="w-40 font-semibold text-gray-700">Satker</label>
              <select v-model="newAdmin.satker" id="satker" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required>
                <option value="" disabled>Pilih Satker</option>
                <option v-for="s in satkers" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end mt-8 gap-2">
            <VButton type="button" variant="secondary" @click="closeAddModal">Batal</VButton>
            <VButton type="submit" variant="success">Simpan</VButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal View User -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
        <button @click="closeViewModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Detail Admin</h3>
        <div v-if="selectedUser" class="space-y-4">
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Nama</span><span class="flex-1">{{ selectedUser.nama }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Nama Pegawai</span><span class="flex-1">{{ selectedUser.namaPegawai || '-' }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">NIP</span><span class="flex-1">{{ selectedUser.nip || '-' }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Username</span><span class="flex-1">{{ selectedUser.username }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Satker</span><span class="flex-1">{{ selectedUser.satker }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Role</span><span class="flex-1">{{ selectedUser.role }}</span></div>
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Terakhir Login</span><span class="flex-1">{{ selectedUser.lastLogin || '-' }}</span></div>
        </div>
        <div class="flex justify-end mt-8">
          <VButton type="button" variant="secondary" @click="closeViewModal">Tutup</VButton>
        </div>
      </div>
    </div>

    <!-- Modal Edit User -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
        <button @click="closeEditModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Edit Admin</h3>
        <form @submit.prevent="submitEditUser">
          <div class="space-y-4">
            <div class="flex items-center">
              <label for="edit-nama" class="w-40 font-semibold text-gray-700">Nama</label>
              <input v-model="editUser.nama" id="edit-nama" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="edit-namaPegawai" class="w-40 font-semibold text-gray-700">Nama Pegawai</label>
              <input v-model="editUser.namaPegawai" id="edit-namaPegawai" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" />
            </div>
            <div class="flex items-center">
              <label for="edit-nip" class="w-40 font-semibold text-gray-700">NIP</label>
              <input v-model="editUser.nip" id="edit-nip" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" />
            </div>
            <div class="flex items-center">
              <label for="edit-username" class="w-40 font-semibold text-gray-700">Username</label>
              <input v-model="editUser.username" id="edit-username" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required />
            </div>
            <div class="flex items-center">
              <label for="edit-password" class="w-40 font-semibold text-gray-700">Password</label>
              <input v-model="editUser.password" id="edit-password" type="password" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" />
            </div>
            <div class="flex items-center">
              <label for="edit-satker" class="w-40 font-semibold text-gray-700">Satker</label>
              <select v-model="editUser.satker" id="edit-satker" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required>
                <option value="" disabled>Pilih Satker</option>
                <option v-for="s in satkers" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end mt-8 gap-2">
            <VButton type="button" variant="secondary" @click="closeEditModal">Batal</VButton>
            <VButton type="submit" variant="success">Simpan</VButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>