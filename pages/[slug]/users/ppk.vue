<script setup>
import { ref, computed } from 'vue'
import { IconLock, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import VTable from '~/components/UI/v-table.vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)
const users = ref([
  {
    id: 1,
    nama: 'Asep Saepuloh',
    username: 'asep_ppk',
    role: 'PPK',
    satker: 'LAN JAKARTA',
    lastLogin: '2026-04-10 14:20'
  }
])
import { IconPlus } from '@tabler/icons-vue'
const showAddModal = ref(false)
function openAddModal() { showAddModal.value = true }
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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Daftar Pejabat Pembuat Komitmen (PPK)</h1>
      <button @click="openAddModal" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
        <IconPlus class="w-4 h-4" />
        Tambah PPK
      </button>
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
        <button class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors" title="Reset Password">
          <IconLock class="h-4 w-4" />
        </button>
      </template>
      <template #aksi="{ item }">
        <div class="flex justify-center gap-2">
          <button class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="Lihat Detail" style="border:none;padding:0;">
            <IconEye class="w-5 h-5 text-blue-600" />
          </button>
          <button class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" data-tip="Edit" style="border:none;padding:0;">
            <IconPencil class="w-5 h-5 text-yellow-600" />
          </button>
          <button class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" data-tip="Hapus" style="border:none;padding:0;">
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
