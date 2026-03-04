<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

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

/* PAGINATION (dummy) */
const currentPage = ref(1)
const totalPage = ref(2)
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink to="/admin/suboutput" class="link link-hover underline ml-1">
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

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

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Nama</th>
                <th class="text-center">Username</th>
                <th class="text-center">Role</th>
                <th class="text-center">Satker</th>
                <th class="text-center">Terakhir Login</th>
                <th class="text-center">Password</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>

              <!-- FILTER -->
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <TextField v-model="filter.nama" placeholder="Nama" size="sm" />
                </td>
                <td>
                  <TextField v-model="filter.username" placeholder="Username" size="sm" />
                </td>
                <td>
                  <select v-model="filter.role" class="select select-bordered select-xs w-full">
                    <option value="">Semua</option>
                    <option v-for="r in roles" :key="r">{{ r }}</option>
                  </select>
                </td>
                <td>
                  <select v-model="filter.satker" class="select select-bordered select-xs w-full">
                    <option value="">Semua</option>
                    <option v-for="s in satkers" :key="s">{{ s }}</option>
                  </select>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(u, i) in users"
                :key="u.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="font-semibold text-blue-700">{{ u.nama }}</td>
                <td class="text-center">{{ u.username }}</td>
                <td class="text-center">
                  <span
                    class="font-bold px-2 py-1 rounded-lg align-middle"
                    :class="u.role === 'Admin Satker' ? 'bg-yellow-400 text-black border border-yellow-600' : 'badge-warning text-white'"
                    style="font-size:0.95em; min-width:fit-content; display:inline-block;"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="text-center">{{ u.satker }}</td>
                <td class="text-center text-sm">{{ u.lastLogin }}</td>

                <!-- SET PASSWORD -->
                <td class="text-center">
                  <NuxtLink
                    :to="`/admin/user/set-password/${u.id}`"
                    data-tip="Set Password"
                  >
                    <Button type="warning" size="sm" circle>
                      <Icon icon="mdi:lock-reset" class="w-4 h-4" />
                    </Button>
                  </NuxtLink>
                </td>

                <!-- ACTION -->
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/user/view/${u.id}`"
                      data-tip="View"
                    >
                      <Button type="info" size="sm" circle>
                        <Icon icon="tabler:eye" class="w-4 h-4" />
                      </Button>
                    </NuxtLink>

                    <NuxtLink
                      :to="`/admin/user/update/${u.id}`"
                      data-tip="Update"
                    >
                      <Button type="warning" size="sm" circle>
                        <Icon icon="tabler:pencil" class="w-4 h-4" />
                      </Button>
                    </NuxtLink>

                    <Button
                      type="error"
                      size="sm"
                      circle
                      data-tip="Delete"
                      @click="confirm('Yakin hapus user ini?')"
                    >
                      <Icon icon="tabler:trash" class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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