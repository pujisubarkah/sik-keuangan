<script setup>
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
          <NuxtLink to="/admin/user/create?role=admin">
            <VButton variant="success">
              <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
              Tambah Admin
            </VButton>
          </NuxtLink>
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
              <NuxtLink :to="`/admin/user/view/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="View">
                <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </NuxtLink>
              <NuxtLink :to="`/admin/user/update/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Update">
                <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </NuxtLink>
              <button class="hover:text-red-600 transition tooltip" data-tip="Delete" @click="confirm('Yakin hapus user ini?')" style="background:none;border:none;padding:0;">
                <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </template>
          <template #empty>
            <span class="text-gray-400">Tidak ada data</span>
          </template>
        </VTable>

    </Card>
  </div>
</template>