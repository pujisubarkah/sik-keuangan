<script setup>
import { ref } from 'vue'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'

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
        <div class="mb-4">
          <NuxtLink
            to="/admin/berkas/create"
            class="btn btn-primary"
          >
            <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
            Tambah Berkas
          </NuxtLink>
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ berkasList.length }}</b> data
        </div>
        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl" style="width:5%">No</th>
                <th class="text-center">Kode Akun</th>
                <th class="text-center">Nama Berkas</th>
                <th class="text-center">Kata Kunci</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input
                    v-model="filter.kode_akun"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Kode Akun"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.nama_berkas"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Nama Berkas"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.kata_kunci"
                    class="input input-bordered input-xs w-full text-center"
                    placeholder="Kata Kunci"
                  />
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(b, i) in berkasList.filter(bk =>
                  bk.kode_akun.toLowerCase().includes(filter.kode_akun.toLowerCase()) &&
                  bk.nama_berkas.toLowerCase().includes(filter.nama_berkas.toLowerCase()) &&
                  bk.kata_kunci.toLowerCase().includes(filter.kata_kunci.toLowerCase())
                )"
                :key="b.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="text-center">{{ b.kode_akun }}</td>
                <td class="text-center font-semibold text-blue-700">{{ b.nama_berkas }}</td>
                <td class="text-center">{{ b.kata_kunci }}</td>
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/berkas/view/${b.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="View"
                    >
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/berkas/update/${b.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Update"
                    >
                      <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button
                      class="hover:text-red-600 transition tooltip" data-tip="Delete"
                      @click="confirm('Yakin hapus berkas ini?')"
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
