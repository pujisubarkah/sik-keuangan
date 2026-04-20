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
    nama: 'Admin Persediaan Pusat',
    username: 'admin_persediaan',
    role: 'Admin Persediaan',
    satker: 'LAN JAKARTA',
    lastLogin: '2026-03-10'
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

const showAddModal = ref(false)
const newAdmin = ref({
  nama: '',
  username: '',
  password: '',
  namaPegawai: '',
  nip: '',
  satker: 'LAN JAKARTA'
})
const satkerOptions = ['LAN JAKARTA', 'LAN SURABAYA', 'LAN BALI']

function openAddModal() {
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  resetNewAdmin()
}

function resetNewAdmin() {
  newAdmin.value = {
    nama: '',
    username: '',
    password: '',
    namaPegawai: '',
    nip: '',
    satker: 'LAN JAKARTA'
  }
}

function submitAddAdmin() {
  if (!newAdmin.value.nama || !newAdmin.value.username || !newAdmin.value.password) {
    return
  }
  const nextId = users.value.length ? Math.max(...users.value.map(u => u.id)) + 1 : 1
  users.value.push({
    id: nextId,
    nama: newAdmin.value.nama,
    username: newAdmin.value.username,
    role: 'Admin Persediaan',
    satker: newAdmin.value.satker,
    lastLogin: '-'
  })
  closeAddModal()
}

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
      <h1 class="text-3xl font-bold text-blue-700">Manajemen Admin Persediaan</h1>
      <button @click="openAddModal" class="inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700">
        <IconPlus class="w-4 h-4" />
        Tambah Admin
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

    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
        <button @click="closeAddModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Tambah Admin Persediaan</h3>
        <form @submit.prevent="submitAddAdmin">
          <div class="space-y-4">
            <div class="flex items-center">
              <label for="nama" class="w-40 font-semibold text-gray-700">Nama</label>
              <input v-model="newAdmin.nama" id="nama" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" placeholder="Nama" required />
            </div>
            <div class="flex items-center">
              <label for="username" class="w-40 font-semibold text-gray-700">Username</label>
              <input v-model="newAdmin.username" id="username" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400 bg-gray-50" placeholder="Username" required />
            </div>
            <div class="flex items-center">
              <label for="password" class="w-40 font-semibold text-gray-700">Password</label>
              <input v-model="newAdmin.password" id="password" type="password" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400 bg-gray-50" placeholder="Password" required />
            </div>
            <div class="flex items-center">
              <label for="namaPegawai" class="w-40 font-semibold text-gray-700">Nama Pegawai</label>
              <input v-model="newAdmin.namaPegawai" id="namaPegawai" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" placeholder="Nama Pegawai" />
            </div>
            <div class="flex items-center">
              <label for="nip" class="w-40 font-semibold text-gray-700">NIP</label>
              <input v-model="newAdmin.nip" id="nip" type="text" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" placeholder="NIP" />
            </div>
            <div class="flex items-center">
              <label for="satker" class="w-40 font-semibold text-gray-700">Satker</label>
              <select v-model="newAdmin.satker" id="satker" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400 bg-white">
                <option v-for="satker in satkerOptions" :key="satker" :value="satker">{{ satker }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end mt-8 gap-2">
            <button type="button" @click="closeAddModal" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-100">
              Batal
            </button>
            <button type="submit" class="inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

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
