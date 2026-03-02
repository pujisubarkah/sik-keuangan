<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showAlert = ref(true)
const filter = ref({ judul: '' })

const informasis = ref([
  { id: 1, judul: 'Perjalanan Dinas' },
  { id: 2, judul: 'Pengajuan Konsumsi (Rapat/FGD/Workshop)' },
  { id: 3, judul: 'Pengajuan Konsumsi Jamuan Tamu (oleh Yuwin)' },
  { id: 4, judul: 'Pengajuan Transport Rapat (WI/Fasilitator eksternal)' },
  { id: 5, judul: 'Honor Narasumber Kegiatan' },
  { id: 6, judul: 'Honor Widyaiswara/Pengamat/Pdp WI/Fasilitator/Asessor/Pdp Asessor/Pemandu Tes' },
  { id: 7, judul: 'Honor Petugas Piket Diklat' },
  { id: 8, judul: 'Honor Moderator' },
  { id: 9, judul: 'Honor Notulensi' },
  { id: 10, judul: 'Pengadaan Barang/Jasa Nominal 2 juta < X < 10 juta' },
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
      <NuxtLink to="/admin/informasi" class="hover:text-blue-700">Informasi</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Manage</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Informasi
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/informasi/create"
            class="btn btn-success"
          >
            <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
            Informasi Baru
          </NuxtLink>
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ informasis.length }}</b> data
        </div>
        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Judul</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input
                    v-model="filter.judul"
                    class="input input-bordered input-xs w-full"
                    placeholder="Judul Informasi"
                  />
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(info, i) in informasis.filter(inf => inf.judul.toLowerCase().includes(filter.judul.toLowerCase()))"
                :key="info.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="font-semibold text-blue-700">{{ info.judul }}</td>
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/informasi/view/${info.id}`"
                      class="btn btn-xs btn-circle btn-info tooltip"
                      data-tip="View"
                    >
                      <Icon icon="tabler:eye" class="w-4 h-4" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/informasi/update/${info.id}`"
                      class="btn btn-xs btn-circle btn-warning tooltip"
                      data-tip="Update"
                    >
                      <Icon icon="tabler:pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button
                      class="btn btn-xs btn-circle btn-error tooltip text-white"
                      data-tip="Delete"
                      @click="confirm('Yakin hapus informasi ini?')"
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
