<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { IconEye, IconPencil, IconTrash, IconPlus, IconSearch } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import DeleteModal from '~/components/UI/DeleteModal.vue'

const route = useRoute()
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

const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const doDelete = () => {
  deleteLoading.value = true
  setTimeout(() => {
    berkasList.value = berkasList.value.filter(b => b.id !== itemToDelete.value.id)
    deleteLoading.value = false
    closeDeleteModal()
  }, 1000)
}
</script>

<template>
  <div class="pt-14 px-4">
    <SuboutputAlert :showAlert="showAlert" />

    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${route.params.slug}`" class="hover:text-blue-700 font-medium">Dashboard</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Manajemen Berkas Akun</span>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Daftar Berkas Akun</h1>
      <NuxtLink :to="`/${route.params.slug}/berkas/create`" class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
        <IconPlus class="w-4 h-4" />
        Tambah Berkas
      </NuxtLink>
    </div>

<<<<<<< HEAD
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100 overflow-hidden">
      <div class="card-body p-6">
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ berkasList.length }}</b> jenis berkas
=======
    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink :to="`/${route.params.slug}/berkas/create`">
            <VButton
              variant="primary"
              size="md"
              :prependIcon="IconPlus"
              class="w-fit"
            >
              Tambah Berkas
            </VButton>
          </NuxtLink>
>>>>>>> 73a4997 (lanjut)
        </div>

        <div class="overflow-x-auto">
          <table class="table table-md w-full">
            <thead class="bg-blue-50 text-blue-900">
              <tr>
                <th class="w-16 text-center">No</th>
                <th class="w-32 text-center">Kode Akun</th>
                <th>Nama Berkas</th>
                <th>Kata Kunci</th>
                <th class="w-40 text-center">Aksi</th>
              </tr>
              <tr class="bg-white">
                <td></td>
                <td>
                  <input v-model="filter.kode_akun" type="text" class="input input-bordered input-xs w-full" placeholder="Cari..." />
                </td>
                <td>
                  <input v-model="filter.nama_berkas" type="text" class="input input-bordered input-xs w-full" placeholder="Cari nama berkas..." />
                </td>
                <td>
                  <input v-model="filter.kata_kunci" type="text" class="input input-bordered input-xs w-full" placeholder="Cari kata kunci..." />
                </td>
                <td class="text-center">
                  <button class="btn btn-ghost btn-xs">
                    <IconSearch class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </thead>
<<<<<<< HEAD
            <tbody>
              <tr v-for="(b, i) in berkasList.filter(bk => 
                bk.kode_akun.toLowerCase().includes(filter.kode_akun.toLowerCase()) &&
                bk.nama_berkas.toLowerCase().includes(filter.nama_berkas.toLowerCase()) &&
                bk.kata_kunci.toLowerCase().includes(filter.kata_kunci.toLowerCase())
              )" :key="b.id" class="hover:bg-blue-50 transition">
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="text-center font-mono font-semibold text-blue-800">{{ b.kode_akun }}</td>
                <td class="font-medium text-gray-800">{{ b.nama_berkas }}</td>
                <td class="text-gray-500 italic">{{ b.kata_kunci || '-' }}</td>
                <td class="text-center">
                  <div class="flex justify-center gap-2">
                    <NuxtLink :to="`/${route.params.slug}/berkas/view/${b.id}`" class="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-100 transition" title="View">
                      <IconEye class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/${route.params.slug}/berkas/update/${b.id}`" class="text-yellow-600 hover:text-yellow-800 p-1 rounded-md hover:bg-yellow-100 transition" title="Edit">
                      <IconPencil class="w-5 h-5" />
=======
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
                      :to="`/${route.params.slug}/berkas/view/${b.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="View"
                    >
                      <IconEye class="w-5 h-5 text-blue-600" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/${route.params.slug}/berkas/update/${b.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Update"
                    >
                      <IconPencil class="w-5 h-5 text-yellow-600" />
>>>>>>> 73a4997 (lanjut)
                    </NuxtLink>
                    <button @click="confirmDelete(b)" class="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition" title="Delete">
                      <IconTrash class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="berkasList.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400">Tidak ada data berkas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <DeleteModal 
      :show-delete-modal="showDeleteModal"
      :delete-loading="deleteLoading"
      @close="closeDeleteModal"
      @confirm="doDelete"
    />
  </div>
</template>
