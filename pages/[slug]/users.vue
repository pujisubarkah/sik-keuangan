<script setup>
definePageMeta({ layout: 'default' })

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
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
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
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">

        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/user/create?role=admin"
            class="btn btn-success"
          >
            <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
            Tambah Admin
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
                  <input
                    v-model="filter.nama"
                    class="input input-bordered input-xs w-full"
                    placeholder="Nama"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.username"
                    class="input input-bordered input-xs w-full"
                    placeholder="Username"
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
                    class="btn btn-xs btn-circle btn-warning tooltip"
                    data-tip="Set Password"
                  >
                    <Icon icon="mdi:lock-reset" class="w-4 h-4" />
                  </NuxtLink>
                </td>

                <!-- ACTION -->
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/user/view/${u.id}`"
                      class="btn btn-xs btn-circle btn-info tooltip"
                      data-tip="View"
                    >
                      <Icon icon="tabler:eye" class="w-4 h-4" />
                    </NuxtLink>

                    <NuxtLink
                      :to="`/admin/user/update/${u.id}`"
                      class="btn btn-xs btn-circle btn-warning tooltip"
                      data-tip="Update"
                    >
                      <Icon icon="tabler:pencil" class="w-4 h-4" />
                    </NuxtLink>

                    <button
                      class="btn btn-xs btn-circle btn-error tooltip text-white"
                      data-tip="Delete"
                      @click="confirm('Yakin hapus user ini?')"
                    >
                      <Icon icon="tabler:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>