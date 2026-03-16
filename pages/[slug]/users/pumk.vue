<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'
import { Button, TextField, Card } from '@idds/vue'
import { IconLock, IconEye, IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import VButton from '~/components/UI/v-button.vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showResetPasswordModal = ref(false)
const resetPasswordUser = ref(null)

async function resetPassword(user) {
  if (!confirm(`Reset password user ${user.nama} ke 12345678?`)) return
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  try {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ password: '12345678' })
    })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    if (res.ok) {
      resetPasswordUser.value = user
      showResetPasswordModal.value = true
    } else {
      alert('Gagal reset password')
    }
  } catch (e) {
    alert('Gagal reset password')
  }
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
async function confirmDeleteUser() {
  if (!userToDelete.value) return
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers
    })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    if (res.ok) {
      users.value = users.value.filter(u => u.id !== userToDelete.value.id)
      closeDeleteModal()
    } else {
      alert('Gagal menghapus user')
    }
  } catch (e) {
    alert('Gagal menghapus user')
  }
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

function closeEditModal() {
  showEditModal.value = false
  // Optional: reset editUser jika ingin
}


async function openViewModal(user) {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/users/${user.id}`, { headers })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    const data = await res.json()
    selectedUser.value = {
      ...data,
      role: data.role_name || data.role || 'Admin',
      lastLogin: data.last_login
        ? new Date(data.last_login).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: undefined, hour12: false, timeZone: 'Asia/Jakarta' }) + ' WIB'
        : '-'
    }
    showViewModal.value = true
  } catch (e) {
    selectedUser.value = { ...user }
    showViewModal.value = true
  }
}

function closeViewModal() {
  showViewModal.value = false
}

async function openEditModal(user) {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/users/${user.id}`, { headers })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    const data = await res.json()
    editUser.value = { ...data }
    showEditModal.value = true
  } catch (e) {
    editUser.value = { ...user }
    showEditModal.value = true
  }
}

async function submitEditUser() {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  try {
    const res = await fetch(`/api/users/${editUser.value.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(editUser.value)
    })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    if (res.ok) {
      // Update data di tabel
      const updated = await res.json()
      users.value = users.value.map(u => u.id === updated.id ? {
        ...u,
        ...updated,
        role: updated.role_name || 'Admin',
        satker: updated.satker_name,
        lastLogin: updated.last_login ? new Date(updated.last_login).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: undefined, hour12: false, timeZone: 'Asia/Jakarta' }) + ' WIB' : '-'
      } : u)
      closeEditModal()
    } else {
      alert('Gagal update user')
    }
  } catch (e) {
    alert('Gagal update user')
  }
}

const showAddModal = ref(false)
const newAdmin = ref({
  nama: '',
  namaPegawai: '',
  nip: '',
  username: '',
  password: '',
  satker_id: ''
})

const satkerList = ref([])

async function fetchSatker() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch('/api/satker', { headers })
    if (res.status === 401) return
    const data = await res.json()
    satkerList.value = data
  } catch (e) {
    satkerList.value = []
  }
}

onMounted(() => {
  fetchSatker()
})

function openAddModal() {
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
}
async function submitAddAdmin() {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(newAdmin.value)
    })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    if (res.ok) {
      const inserted = await res.json()
      // inserted bisa array (returning) atau object
      const newUser = Array.isArray(inserted) ? inserted[0] : inserted
      users.value = users.value.concat({
        id: newUser.id,
        nama: newUser.nama,
        username: newUser.username,
        role: newUser.role_name || 'Admin',
        satker: newUser.satker_name,
        lastLogin: newUser.last_login ? new Date(newUser.last_login).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: undefined, hour12: false, timeZone: 'Asia/Jakarta' }) + ' WIB' : '-'
      })
      // Reset form
      newAdmin.value = { nama: '', namaPegawai: '', nip: '', username: '', password: '', satker_id: '' }
      closeAddModal()
    } else {
      alert('Gagal menambahkan admin')
    }
  } catch (e) {
    alert('Gagal menambahkan admin')
  }
}

const showAlert = ref(true)

const filter = ref({
  nama: '',
  username: '',
  role: '',
  satker: ''
})

const users = ref([])
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch('/api/users', { headers })
    if (res.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser && userStore.clearUser()
      await router.push('/login')
      return
    }
    const data = await res.json()
    // Filter hanya role_id 1 (Admin)
    users.value = data
      .filter(u => u.role_id === 3)
      .map(u => ({
        id: u.id,
        nama: u.nama,
        username: u.username,
        role: u.role_name || 'Admin',
        satker: u.satker_name,
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: undefined, hour12: false, timeZone: 'Asia/Jakarta' }) + ' WIB' : '-'
      }))
  } catch (e) {
    users.value = []
  }
})

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
    <h1 class="text-3xl font-bold text-blue-700 mb-6 text-center">
      Daftar PUMK
    </h1>

    <!-- CARD -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-blue-700">Daftar Admin</h2>
      </template>

      <!-- ACTION -->
      <div class="mb-6">
        <button class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg" @click="openAddModal">
          <IconPlus class="w-4 h-4" />
          Tambah PUMK
        </button>
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
          <span class="text-center">{{ item.role }}</span>
        </template>
        <template #satker="{ item }">
          <span class="text-center">{{ item.satker }}</span>
        </template>
        <template #lastLogin="{ item }">
          <span class="text-center text-sm">{{ item.lastLogin }}</span>
        </template>
        <template #password="{ item }">
          <button @click="resetPassword(item)" data-tip="Reset Password" style="background:none;border:none;padding:0;">
            <Button type="warning" size="sm" circle>
              <IconLock class="w-5 h-5" />
            </Button>
          </button>
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
          </div>
        </template>
        <template #empty>
          <span class="text-gray-400">Tidak ada data</span>
        </template>
      </VTable>
    </Card>

    <!-- Modal Reset Password Berhasil -->
    <div v-if="showResetPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative animate-fade-in">
        <button @click="showResetPasswordModal = false" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold text-green-700 mb-6 text-center">Password Telah Direset</h3>
        <div class="text-center text-gray-700 mb-6">
          Password user <span class="font-bold">{{ resetPasswordUser?.nama }}</span> telah direset ke <span class="font-mono">12345678</span>.
        </div>
        <div class="flex justify-end">
          <VButton type="button" variant="success" @click="showResetPasswordModal = false">Tutup</VButton>
        </div>
      </div>
    </div>

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
              <label for="satker" class="w-40 font-semibold text-gray-700">Satker</label>
              <select v-model="newAdmin.satker_id" id="satker" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required>
                <option value="" disabled>Pilih Satker</option>
                <option v-for="s in satkerList" :key="s.id" :value="s.id">{{ s.name }}</option>
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
          <div class="flex items-center"><span class="w-40 font-semibold text-gray-700">Username</span><span class="flex-1">{{ selectedUser.username }}</span></div>
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
              <label for="edit-satker" class="w-40 font-semibold text-gray-700">Satker</label>
              <select v-model="editUser.satker_id" id="edit-satker" class="flex-1 border rounded-lg px-3 py-2 focus:ring focus:border-blue-400" required>
                <option value="" disabled>Pilih Satker</option>
                <option v-for="s in satkerList" :key="s.id" :value="s.id">{{ s.name }}</option>
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