<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

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

definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
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
          <NuxtLink
            to="/admin/user/create?role=admin"
          >
            <Button type="success">
              <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
              Tambah Admin
            </Button>
          </NuxtLink>
        </div>

        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ users.length }}</b> data
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
                  <TextField
                    v-model="filter.nama"
                    placeholder="Nama"
                    size="sm"
                  />
                </td>
                <td>
                  <TextField
                    v-model="filter.username"
                    placeholder="Username"
                    size="sm"
                  />
                </td>
                <td>
                  <select
                    v-model="filter.role"
                    class="select select-bordered select-xs w-full"
                  >
                    <option value="">Semua</option>
                    <option
                      v-for="r in roles"
                      :key="r.id"
                      :value="r.name"
                    >
                      {{ r.name }}
                    </option>
                  </select>
                </td>
                <td>
                  <select
                    v-model="filter.satker"
                    class="select select-bordered select-xs w-full"
                  >
                    <option value="">Semua</option>
                    <option
                      v-for="s in satkers"
                      :key="s.id"
                      :value="s.name"
                    >
                      {{ s.name }}
                    </option>
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
                <td class="text-center font-bold text-blue-700">
                  {{ i + 1 }}
                </td>
                <td class="font-semibold text-blue-700">{{ u.nama }}</td>
                <td class="text-center">{{ u.username }}</td>
                <td class="text-center">
                  <span class="badge badge-primary text-white font-bold">
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
                      <Icon icon="tabler:lock" class="w-5 h-5" />
                    </Button>
                  </NuxtLink>
                </td>

                <!-- ACTION -->
                <td class="text-center">
                  <div class="flex justify-center gap-2">
                    <NuxtLink
                      :to="`/admin/user/view/${u.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="View"
                    >
                      <Icon icon="tabler:eye" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>

                    <NuxtLink
                      :to="`/admin/user/update/${u.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Update"
                    >
                      <Icon icon="tabler:pencil" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>

                    <button
                      class="hover:text-red-600 transition tooltip" data-tip="Delete"
                      @click="confirm('Yakin hapus user ini?')"
                      style="background:none;border:none;padding:0;"
                    >
                      <Icon icon="tabler:trash" class="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    </Card>
  </div>
</template>