<script setup>

import { ref } from 'vue'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import VButton from '~/components/UI/v-button.vue'
import { IconPlus } from '@tabler/icons-vue'

const showAlert = ref(true)
const filter = ref({ kode_akun: '', nama_berkas: '', kata_kunci: '' })

const berkasList = ref([
  { id: 1, kode_akun: '521211', nama_berkas: 'Faktur Barang', kata_kunci: '' },
  { id: 2, kode_akun: '521211', nama_berkas: 'Daftar Hadir', kata_kunci: '' },
  { id: 3, kode_akun: '521114', nama_berkas: 'Kuitansi', kata_kunci: '' },
  { id: 4, kode_akun: '521114', nama_berkas: 'Struk Pengiriman dari Kantor Pos/TIKI/JNE', kata_kunci: '' },
  { id: 5, kode_akun: '521213', nama_berkas: 'Kuitansi Honorarium', kata_kunci: '' },
  { id: 6, kode_akun: '521213', nama_berkas: 'Daftar Hadir', kata_kunci: '' },
  { id: 7, kode_akun: '521213', nama_berkas: 'SK PPK', kata_kunci: '' },
  { id: 8, kode_akun: '521213', nama_berkas: 'Jadwal (untuk kegiatan Diklat)', kata_kunci: '' },
  { id: 9, kode_akun: '521213', nama_berkas: 'Rekap Mengajar (untuk widyaiswara dari LAN)', kata_kunci: '' },
  { id: 10, kode_akun: '522151', nama_berkas: 'Kuitansi Honorarium', kata_kunci: '' },
])
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">
        <span class="font-medium">Beranda</span>
      </NuxtLink>
      <span>/</span>
      <span>Berkas</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Kelola</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Berkas Akun
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mt-6 mb-6 ml-4">
          <NuxtLink to="/admin/berkas/create">
            <VButton
              variant="primary"
              size="md"
              :prependIcon="IconPlus"
              class="w-fit"
            >
              Tambah Berkas
            </VButton>
          </NuxtLink>
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold ml-4">
          Menampilkan <b>{{ berkasList.length }}</b> data
        </div>
        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm rounded-xl overflow-hidden border border-blue-100 shadow-lg bg-white">
            <thead class="bg-blue-100">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle" style="width:5%">No</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Kode Akun</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Nama Berkas</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Kata Kunci</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td class="px-3 py-2">
                  <input
                    v-model="filter.kode_akun"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    maxlength="255"
                    placeholder="Cari kode..."
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="filter.nama_berkas"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    maxlength="255"
                    placeholder="Cari nama berkas..."
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="filter.kata_kunci"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    maxlength="255"
                    placeholder="Cari kata kunci..."
                  />
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(b, i) in berkasList.filter(bk =>
                  bk.kode_akun.toLowerCase().includes(filter.kode_akun.toLowerCase()) &&
                  bk.nama_berkas.toLowerCase().includes(filter.nama_berkas.toLowerCase()) &&
                  bk.kata_kunci.toLowerCase().includes(filter.kata_kunci.toLowerCase())
                )"
                :key="b.id"
                class="hover:bg-yellow-50 align-middle transition"
              >
                <td class="px-3 py-2 text-center align-middle font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="font-semibold text-blue-700 bg-transparent">{{ b.kode_akun }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="font-semibold text-green-700 bg-transparent">{{ b.nama_berkas }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="font-semibold text-yellow-700 bg-transparent">{{ b.kata_kunci }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/berkas/view/${b.id}`"
                      class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="View"
                    >
                      <IconEye class="w-5 h-5 text-blue-600" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/berkas/update/${b.id}`"
                      class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" data-tip="Update"
                    >
                      <IconPencil class="w-5 h-5 text-yellow-600" />
                    </NuxtLink>
                    <button
                      class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" data-tip="Delete"
                      @click="confirm('Yakin hapus berkas ini?')"
                      style="border:none;padding:0;"
                    >
                      <IconTrash class="w-5 h-5 text-red-600" />
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
