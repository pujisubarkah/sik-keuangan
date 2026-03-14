<script setup>
const showLoginHistoryModal = ref(false)
const selectedUser = ref(null)
const loginHistory = ref([])
function openLoginHistoryModal(user) {
  selectedUser.value = { ...user }
  // TODO: Replace with real login history fetch if available
  loginHistory.value = [
    { waktu: '2026-03-14 09:00', device: 'Chrome (Windows)' },
    { waktu: '2026-03-13 20:15', device: 'Mobile Safari (iOS)' }
  ]
  showLoginHistoryModal.value = true
}
function closeLoginHistoryModal() {
  showLoginHistoryModal.value = false
  selectedUser.value = null
  loginHistory.value = []
}

import { Button, TextField, Card } from '@idds/vue'
import { ref, computed } from 'vue'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' })

/* ALERT */
const showAlert = ref(true)

/* FILTER */
const filter = ref({
  nama: '',
  username: '',
  role: '',
  satker: ''
})

/* MASTER DATA (contoh, nanti dari API) */
const roles = [
  'Admin Satker'
]

const satkers = [
  'LAN JAKARTA',
  'PUSJAR SKTASN NAS',
  'PUSJAR SKMP',
  'PUSJAR SKPP',
  'PUSJAR SKMK'
]

/* TABLE DATA */
const users = ref([
  {
    id: 252,
    nama: 'Admin Persediaan',
    username: 'Admin Persediaan',
    role: 'Admin Satker',
    satker: 'PUSJAR SKPP',
    lastLogin: 'Rabu, 14 Maret 2018 01:42 WIB'
  },
  {
    id: 265,
    nama: 'Dev Puslatbang KMP',
    username: 'dev_makassar',
    role: 'Admin Satker',
    satker: 'PUSJAR SKMP',
    lastLogin: 'Senin, 8 April 2019 10:46 WIB'
  },
  {
    id: 193,
    nama: 'Dewanggi Agsha Putri',
    username: 'anggi0620',
    role: 'Admin Satker',
    satker: 'PUSJAR SKTASN NAS',
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

/* PAGINATION (dummy) */
const currentPage = ref(1)
const totalPage = ref(2)
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>User</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar Admin Satker</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Admin Satker
    </h1>

    <!-- CARD -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-blue-700">Daftar Admin Satker</h2>
      </template>

        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/user/create?role=admin_satker"
          >
            <Button type="success">
              <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
              Tambah Admin Satker
            </Button>
          </NuxtLink>
        </div>

        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>1–10</b> dari <b>14</b> data
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
            <span class="font-bold px-2 py-1 rounded-lg align-middle" :class="item.role === 'Admin Satker' ? 'bg-yellow-400 text-black border border-yellow-600' : 'badge-warning text-white'" style="font-size:0.95em; min-width:fit-content; display:inline-block;">{{ item.role }}</span>
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
                <Icon icon="mdi:lock-reset" class="w-4 h-4" />
              </Button>
            </NuxtLink>
          </template>
          <template #aksi="{ item }">
            <div class="flex justify-center gap-1">
              <Button type="info" size="sm" circle @click="openLoginHistoryModal(item)">
                <IconEye class="w-4 h-4" />
              </Button>
                  <!-- Modal Riwayat Login -->
                  <div v-if="showLoginHistoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
                    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative animate-fade-in">
                      <button @click="closeLoginHistoryModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
                      <h3 class="text-xl font-bold text-blue-700 mb-6 text-center">Riwayat Login</h3>
                      <div v-if="selectedUser" class="mb-4 text-center font-semibold text-gray-700">{{ selectedUser.nama }}</div>
                      <div v-if="loginHistory.length > 0">
                        <table class="w-full text-sm border">
                          <thead>
                            <tr class="bg-blue-50">
                              <th class="py-2 px-3 border-b text-left">Waktu</th>
                              <th class="py-2 px-3 border-b text-left">Device</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(log, idx) in loginHistory" :key="idx">
                              <td class="py-2 px-3 border-b">{{ log.waktu }}</td>
                              <td class="py-2 px-3 border-b">{{ log.device }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-else class="text-gray-400 text-center">Belum ada riwayat login.</div>
                      <div class="flex justify-end mt-8">
                        <Button type="secondary" @click="closeLoginHistoryModal">Tutup</Button>
                      </div>
                    </div>
                  </div>
              <NuxtLink :to="`/admin/user/update/${item.id}`" data-tip="Update">
                <Button type="warning" size="sm" circle>
                  <IconPencil class="w-4 h-4" />
                </Button>
              </NuxtLink>
              <Button type="error" size="sm" circle data-tip="Delete" @click="confirm('Yakin hapus user ini?')">
                <IconTrash class="w-4 h-4" />
              </Button>
            </div>
          </template>
          <template #empty>
            <span class="text-gray-400">Tidak ada data</span>
          </template>
        </VTable>

        <!-- PAGINATION -->
        <div class="flex justify-end mt-6">
          <div class="join">
            <button class="join-item btn btn-sm" :disabled="currentPage === 1">«</button>
            <button class="join-item btn btn-sm btn-active">{{ currentPage }}</button>
            <button class="join-item btn btn-sm">{{ currentPage + 1 }}</button>
            <button class="join-item btn btn-sm">»</button>
          </div>
        </div>

    </Card>
  </div>
</template>
