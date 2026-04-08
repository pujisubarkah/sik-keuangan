<script setup>

import { ref, computed } from 'vue'
import { IconAlertCircle, IconHome, IconPlus, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import VButton from '~/components/UI/v-button.vue'
import VTable from '~/components/UI/v-table.vue'

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

const headers = [
  { text: 'No', value: 'no', center: true },
  { text: 'Judul', value: 'judul', center: true },
  { text: 'Berkas', value: 'berkas', center: true },
  { text: 'User Pembuat', value: 'user_pembuat', center: true },
  { text: 'Waktu Dibuat', value: 'waktu_dibuat', center: true },
  { text: 'Pilihan', value: 'aksi', center: true }
]

const filteredLaporanList = computed(() =>
  laporanList.value
    .filter(l =>
      l.judul.toLowerCase().includes(filter.value.judul.toLowerCase()) &&
      l.berkas.toLowerCase().includes(filter.value.berkas.toLowerCase()) &&
      l.user_pembuat.toLowerCase().includes(filter.value.user_pembuat.toLowerCase()) &&
      l.waktu_dibuat.toLowerCase().includes(filter.value.waktu_dibuat.toLowerCase())
    )
    .map((l, i) => ({ ...l, no: i + 1 }))
)
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <span class="font-medium">Beranda</span>
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/berkas-laporan" class="hover:text-blue-700">Berkas Laporan</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Kelola</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Berkas Laporan
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mt-6 mb-6 ml-4">
          <NuxtLink to="/admin/berkas-laporan/create">
            <VButton
              variant="primary"
              size="md"
              :prependIcon="IconPlus"
              class="w-fit"
            >
              Tambah Berkas Laporan
            </VButton>
          </NuxtLink>
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
        <div class="text-sm mb-4 text-blue-700 font-semibold ml-4">
          Menampilkan <b>{{ laporanList.length }}</b> data
        </div>
        <!-- TABLE: VTable -->
        <VTable :headers="headers" :items="filteredLaporanList">
          <template #judul="{ item }">
            <span class="font-semibold text-blue-700">{{ item.judul }}</span>
          </template>
          <template #berkas="{ item }">
            <span>{{ item.berkas }}</span>
          </template>
          <template #user_pembuat="{ item }">
            <span>{{ item.user_pembuat }}</span>
          </template>
          <template #waktu_dibuat="{ item }">
            <span>{{ item.waktu_dibuat }}</span>
          </template>
          <template #aksi="{ item }">
            <div class="flex justify-center gap-2">
              <NuxtLink :to="`/admin/berkas-laporan/view/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="View">
                <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </NuxtLink>
              <NuxtLink :to="`/admin/berkas-laporan/update/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Update">
                <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </NuxtLink>
              <button class="hover:text-red-600 transition tooltip" data-tip="Delete" @click="confirm('Yakin hapus berkas laporan ini?')" style="background:none;border:none;padding:0;">
                <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </template>
          <template #no="{ index }">
            <span class="text-center font-bold text-blue-700">{{ index + 1 }}</span>
          </template>
          <template #empty>
            <span class="text-gray-400">Tidak ada data</span>
          </template>
          <!-- Filter Row -->
          <template #thead>
            <tr class="bg-blue-50">
              <td></td>
              <td>
                <input v-model="filter.value.judul" class="input input-bordered input-xs w-full text-center" placeholder="Judul" />
              </td>
              <td>
                <input v-model="filter.value.berkas" class="input input-bordered input-xs w-full text-center" placeholder="Berkas" />
              </td>
              <td>
                <input v-model="filter.value.user_pembuat" class="input input-bordered input-xs w-full text-center" placeholder="User Pembuat" />
              </td>
              <td>
                <input v-model="filter.value.waktu_dibuat" class="input input-bordered input-xs w-full text-center" placeholder="Waktu Dibuat" />
              </td>
              <td></td>
            </tr>
          </template>
        </VTable>
      </div>
    </div>
  </div>
  </div>
</template>
