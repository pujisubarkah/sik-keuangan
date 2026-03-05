<script setup>
import { ref } from 'vue'
import { IconAlertCircle, IconHome, IconPlus, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'

const showAlert = ref(true)
const filter = ref({ judul: '', berkas: '', user_pembuat: '', waktu_dibuat: '' })

const laporanList = ref([
  {
    id: 1,
    judul: 'tes',
    berkas: 'Penawaran Pembuatan Aplikasi Sistem Informasi Akademik.pdf',
    user_pembuat: '',
    waktu_dibuat: '',
  },
])
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <IconAlertCircle class="w-6 h-6 text-blue-600" />
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
        <IconHome class="w-4 h-4 text-blue-600" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/berkas-laporan" class="hover:text-blue-700">Berkas Laporans</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Kelola</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Berkas Laporans
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/berkas-laporan/create"
            class="btn btn-primary"
          >
            <IconPlus class="w-5 h-5 mr-2 text-blue-600" />
            Tambah Berkas Laporans
          </NuxtLink>
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ laporanList.length }}</b> data
        </div>
        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">Judul</th>
                <th class="text-center">Berkas</th>
                <th class="text-center">User Pembuat</th>
                <th class="text-center">Waktu Dibuat</th>
                <th class="text-center rounded-tr-xl">Pilihan</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input
                    v-model="filter.judul"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Judul"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.berkas"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Berkas"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.user_pembuat"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="User Pembuat"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.waktu_dibuat"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Waktu Dibuat"
                  />
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(lap, i) in laporanList.filter(l =>
                  l.judul.toLowerCase().includes(filter.judul.toLowerCase()) &&
                  l.berkas.toLowerCase().includes(filter.berkas.toLowerCase()) &&
                  l.user_pembuat.toLowerCase().includes(filter.user_pembuat.toLowerCase()) &&
                  l.waktu_dibuat.toLowerCase().includes(filter.waktu_dibuat.toLowerCase())
                )"
                :key="lap.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="text-center font-semibold text-blue-700">{{ lap.judul }}</td>
                <td class="text-center">{{ lap.berkas }}</td>
                <td class="text-center">{{ lap.user_pembuat }}</td>
                <td class="text-center">{{ lap.waktu_dibuat }}</td>
                <td class="text-center">
                  <div class="flex justify-center gap-2">
                    <NuxtLink
                      :to="`/admin/berkas-laporan/view/${lap.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="View"
                    >
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/berkas-laporan/update/${lap.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Update"
                    >
                      <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button
                      class="hover:text-red-600 transition tooltip" data-tip="Delete"
                      @click="confirm('Yakin hapus berkas laporan ini?')"
                      style="background:none;border:none;padding:0;"
                    >
                      <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
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
