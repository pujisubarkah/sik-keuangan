<script setup>
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
    role: 'Bendahara Penerima',
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
      <h1 class="text-3xl font-bold text-blue-700 text-center">Daftar Bendahara Penerima</h1>
    </div>
    <div class="mb-6">
      <Button type="primary" size="md" class="w-fit flex items-center gap-2">
        <IconPlus class="w-5 h-5" />
        Tambah Bendahara Penerima
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
          <Button type="info" size="sm" circle>
            <IconEye class="w-5 h-5" />
          </Button>
          <Button type="warning" size="sm" circle>
            <IconPencil class="w-5 h-5" />
          </Button>
          <Button type="error" size="sm" circle>
            <IconTrash class="w-5 h-5" />
          </Button>
        </div>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </VTable>
  </div>
</template>
