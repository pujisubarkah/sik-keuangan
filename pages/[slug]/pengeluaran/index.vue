<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SuboutputAlert :showAlert="showAlert" />

      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Daftar Pengeluaran Tahun 2026
          </h2>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-base font-semibold text-gray-900">Filter Data</h3>
        </div>
        <div class="px-6 py-5">
          <form @submit.prevent="filterData" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Status Data Dukung</label>
                <select v-model="filterForm.status_berkas" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="">Semua Status</option>
                  <option value="1">Tersedia</option>
                  <option value="0">Belum Tersedia</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Tanggal Pengajuan Awal</label>
                <input v-model="filterForm.tanggal_pengajuan_awal" type="date" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Tanggal Pengajuan Akhir</label>
                <input v-model="filterForm.tanggal_pengajuan_akhir" type="date" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Status Data</label>
                <select v-model="filterForm.status_verifikator" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="">Semua Data</option>
                  <option value="0">Hanya Pengajuan Baru</option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button type="submit" class="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                <IconSearch class="h-4 w-4" />
                <span>Filter Data</span>
              </button>
              <button type="button" @click="resetFilters" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <IconRefresh class="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm text-gray-500 font-medium">
            Menampilkan {{ paginationStart }} - {{ paginationEnd }} dari {{ filteredData.length }} hasil
          </span>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>Tampilkan</span>
            <select v-model="itemsPerPage" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>baris</span>
          </div>
        </div>

        <div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
            <thead class="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode Suboutput</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Suboutput</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Komp</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Sub Komp</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Akun</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Uraian</th>
                <th class="px-3 py-2 text-right font-semibold text-green-700 align-middle">Jumlah</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tanggal Pengajuan</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Pencairan Bendahara</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Status PJ</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">SP2D</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Ket</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Jumlah Data Dukung</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
              <tr>
                <td class="px-3 py-2 bg-white"></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.id_pekerjaan_kode" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Kode" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.id_pekerjaan_nama" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Suboutput" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.kode_komponen" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Komp" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.kode_subkomponen" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Sub Komp" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.kode_akun" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Akun" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.id_anggaran" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Uraian" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.jumlah" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Jumlah" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.tanggal_pengajuan" type="date" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.tanggal" type="date" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.status_pertanggungjawaban" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Status PJ" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.status_sp2d" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="SP2D" /></td>
                <td class="px-3 py-2 bg-white"><input v-model="filterForm.keterangan" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ket" /></td>
                <td class="px-3 py-2 bg-white"></td>
                <td class="px-3 py-2 bg-white text-right">
                  <button @click="filterData" type="button" class="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                    <span>Filter</span>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-yellow-50 align-middle">
                <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                    {{ item.id_pekerjaan_kode }}
                  </NuxtLink>
                </td>
                <td class="px-3 py-2 align-middle">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                    {{ item.id_pekerjaan_nama }}
                  </NuxtLink>
                </td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_komponen }}</td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_subkomponen }}</td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_akun }}</td>
                <td class="px-3 py-2 text-blue-700 align-middle">{{ item.id_anggaran }}</td>
                <td class="px-3 py-2 text-right align-middle">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.jumlah) }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">{{ formatDate(item.tanggal_pengajuan) }}</td>
                <td class="px-3 py-2 text-center align-middle">{{ formatDate(item.tanggal) }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span v-if="item.status_pertanggungjawaban" class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatDate(item.status_pertanggungjawaban) }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span v-if="item.status_sp2d" class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatDate(item.status_sp2d) }}</span>
                </td>
                <td class="px-3 py-2 align-middle">{{ item.keterangan }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-blue-500 text-white rounded px-2 py-1 font-bold">{{ item.jumlah_data_dukung }}</span>
                </td>
                <td class="px-3 py-2 text-right align-middle">
                  <div class="flex gap-2 justify-end">
                    <NuxtLink :to="`/pengeluaran/view?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Lihat Berkas">
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/update?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Sunting">
                      <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="hover:text-red-600 transition tooltip" data-tip="Hapus" style="background:none;border:none;padding:0;">
                      <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="paginatedData.length === 0">
                <td colspan="15" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">Tidak ada data ditemukan.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <div class="flex flex-wrap items-center gap-2 md:justify-end">
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(1)">Awal</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
            <button v-for="page in visiblePages" :key="page" type="button" class="rounded-md border px-3 py-2 text-sm transition-colors" :class="page === currentPage ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'" @click="goToPage(page)">{{ page }}</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(currentPage + 1)">Next</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(totalPages)">Akhir</button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-base font-semibold text-gray-900">Rekap Data Pengeluaran</h3>
        </div>
        <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p class="text-sm font-medium text-gray-500">Jumlah Pengeluaran</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ totalPengeluaran }} Pengeluaran</p>
            <NuxtLink to="/pengeluaran/admin?export=1&exportFormat=1" class="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Unduh Rincian
            </NuxtLink>
          </div>
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p class="text-sm font-medium text-gray-500">Jumlah Dana</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ formatCurrency(totalDana) }}</p>
            <NuxtLink to="/pengeluaran/admin?export=1&exportFormat=1" class="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Unduh Rincian
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, watch } from 'vue'
import { IconSearch, IconRefresh, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue';
import { NuxtLink } from '#components'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' })
const showAlert = ref(true)
const filterForm = ref({
  status_berkas: '',
  tanggal_pengajuan_awal: '',
  tanggal_pengajuan_akhir: '',
  bulan_pencairan_awal: '',
  tahun_pencairan_awal: '',
  bulan_pencairan_akhir: '',
  tahun_pencairan_akhir: '',
  tanggal_awal: '',
  tanggal_akhir: '',
  bulan_sp2d_awal: '',
  tahun_sp2d_awal: '',
  bulan_sp2d_akhir: '',
  tahun_sp2d_akhir: '',
  tanggal_sp2d_awal: '',
  tanggal_sp2d_akhir: '',
  id_pekerjaan_kode: '',
  id_pekerjaan_nama: '',
  kode_komponen: '',
  kode_subkomponen: '',
  kode_akun: '',
  id_anggaran: '',
  jumlah: '',
  tanggal_pengajuan: '',
  tanggal: '',
  status_pertanggungjawaban: '',
  status_sp2d: '',
  keterangan: ''
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pengeluaranData = ref([
  {
    id: 183410,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '002',
    kode_subkomponen: 'J',
    kode_akun: '521111',
    id_anggaran: 'Pengadaan Jasa Tenaga Pramubhakti Kantor LAN Jakarta',
    jumlah: 134000,
    tanggal_pengajuan: '2026-02-27',
    tanggal: '2026-03-03',
    status_pertanggungjawaban: '2026-02-26',
    status_sp2d: '2026-03-03',
    keterangan: 'SPM 00054 - LS - Lembur PPNPN BulanJanuari 2026 Sesuai Surat Perintah Kerja Lembur No.225/PPK.1.1.1/SDM.04.1 Tanggal 30 Januari 2026 an Dimas Ade P',
    jumlah_data_dukung: 0
  },
  {
    id: 183215,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511111',
    id_anggaran: 'Belanja Gaji Pokok PNS',
    jumlah: 1578564740,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183216,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511119',
    id_anggaran: 'Belanja Pembulatan Gaji PNS',
    jumlah: 20455,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183217,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511121',
    id_anggaran: 'Belanja Tunj. Suami/Istri PNS',
    jumlah: 105983886,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183218,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511122',
    id_anggaran: 'Belanja Tunj. Anak PNS',
    jumlah: 27864277,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183219,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511123',
    id_anggaran: 'Belanja Tunj. Struktural PNS',
    jumlah: 96150000,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183220,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511124',
    id_anggaran: 'Belanja Tunj. Fungsional PNS',
    jumlah: 214876000,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183221,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511125',
    id_anggaran: 'Belanja Tunj. PPh PNS',
    jumlah: 9503522,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183222,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511126',
    id_anggaran: 'Belanja Tunj. Beras PNS',
    jumlah: 76547940,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  },
  {
    id: 183223,
    id_pekerjaan: 4734,
    id_pekerjaan_kode: '7918.EBA.994',
    id_pekerjaan_nama: 'Layanan Perkantoran',
    kode_komponen: '001',
    kode_subkomponen: 'A',
    kode_akun: '511151',
    id_anggaran: 'Belanja Tunjangan Umum PNS',
    jumlah: 26290000,
    tanggal_pengajuan: '2026-02-12',
    tanggal: '2026-03-01',
    status_pertanggungjawaban: '2026-02-10',
    status_sp2d: '2026-03-01',
    keterangan: 'SPM 00029 - LS - Gaji Induk PNS Bulan Maret 2026 untuk426 Pegawai/1057 Jiwa',
    jumlah_data_dukung: 0
  }
])
const filteredData = computed(() => {
  return pengeluaranData.value.filter(item => {
    const matchesStatusBerkas = filterForm.value.status_berkas === '' || String(item.jumlah_data_dukung > 0 ? 1 : 0) === filterForm.value.status_berkas
    const matchesTanggalAwal = filterForm.value.tanggal_pengajuan_awal === '' || item.tanggal_pengajuan >= filterForm.value.tanggal_pengajuan_awal
    const matchesTanggalAkhir = filterForm.value.tanggal_pengajuan_akhir === '' || item.tanggal_pengajuan <= filterForm.value.tanggal_pengajuan_akhir
    const matchesStatusVerifikator = filterForm.value.status_verifikator === '' || filterForm.value.status_verifikator === '0'
    const matchesKode = filterForm.value.id_pekerjaan_kode === '' || item.id_pekerjaan_kode.toLowerCase().includes(filterForm.value.id_pekerjaan_kode.toLowerCase())
    const matchesNama = filterForm.value.id_pekerjaan_nama === '' || item.id_pekerjaan_nama.toLowerCase().includes(filterForm.value.id_pekerjaan_nama.toLowerCase())
    const matchesKomponen = filterForm.value.kode_komponen === '' || item.kode_komponen.toLowerCase().includes(filterForm.value.kode_komponen.toLowerCase())
    const matchesSubkomponen = filterForm.value.kode_subkomponen === '' || item.kode_subkomponen.toLowerCase().includes(filterForm.value.kode_subkomponen.toLowerCase())
    const matchesAkun = filterForm.value.kode_akun === '' || item.kode_akun.toLowerCase().includes(filterForm.value.kode_akun.toLowerCase())
    const matchesUraian = filterForm.value.id_anggaran === '' || item.id_anggaran.toLowerCase().includes(filterForm.value.id_anggaran.toLowerCase())
    const matchesJumlah = filterForm.value.jumlah === '' || String(item.jumlah).includes(filterForm.value.jumlah)
    const matchesTanggalPengajuan = filterForm.value.tanggal_pengajuan === '' || item.tanggal_pengajuan === filterForm.value.tanggal_pengajuan
    const matchesTanggal = filterForm.value.tanggal === '' || item.tanggal === filterForm.value.tanggal
    const matchesStatusPertanggungjawaban = filterForm.value.status_pertanggungjawaban === '' || (item.status_pertanggungjawaban || '').includes(filterForm.value.status_pertanggungjawaban)
    const matchesStatusSp2d = filterForm.value.status_sp2d === '' || (item.status_sp2d || '').includes(filterForm.value.status_sp2d)
    const matchesKeterangan = filterForm.value.keterangan === '' || item.keterangan.toLowerCase().includes(filterForm.value.keterangan.toLowerCase())

    return matchesStatusBerkas
      && matchesTanggalAwal
      && matchesTanggalAkhir
      && matchesStatusVerifikator
      && matchesKode
      && matchesNama
      && matchesKomponen
      && matchesSubkomponen
      && matchesAkun
      && matchesUraian
      && matchesJumlah
      && matchesTanggalPengajuan
      && matchesTanggal
      && matchesStatusPertanggungjawaban
      && matchesStatusSp2d
      && matchesKeterangan
  })
})
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage.value)))
const paginationStart = computed(() => {
  if (filteredData.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})
const paginationEnd = computed(() => {
  if (filteredData.value.length === 0) return 0
  return Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length)
})
const visiblePages = computed(() => {
  const maxVisible = 5
  const total = totalPages.value
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(total, start + maxVisible - 1)
  const adjustedStart = Math.max(1, end - maxVisible + 1)

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
})
const totalPengeluaran = computed(() => filteredData.value.length)
const totalDana = computed(() => filteredData.value.reduce((sum, item) => sum + item.jumlah, 0))
const filterData = () => { /* Filtering is reactive */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : ''
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic */ } }
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const resetFilters = () => {
  filterForm.value = {
    status_berkas: '',
    tanggal_pengajuan_awal: '',
    tanggal_pengajuan_akhir: '',
    bulan_pencairan_awal: '',
    tahun_pencairan_awal: '',
    bulan_pencairan_akhir: '',
    tahun_pencairan_akhir: '',
    tanggal_awal: '',
    tanggal_akhir: '',
    bulan_sp2d_awal: '',
    tahun_sp2d_awal: '',
    bulan_sp2d_akhir: '',
    tahun_sp2d_akhir: '',
    tanggal_sp2d_awal: '',
    tanggal_sp2d_akhir: '',
    id_pekerjaan_kode: '',
    id_pekerjaan_nama: '',
    kode_komponen: '',
    kode_subkomponen: '',
    kode_akun: '',
    id_anggaran: '',
    jumlah: '',
    tanggal_pengajuan: '',
    tanggal: '',
    status_pertanggungjawaban: '',
    status_sp2d: '',
    keterangan: '',
    status_verifikator: '',
  }
}

watch(filteredData, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  if (filteredData.value.length > 0 && currentPage.value < 1) {
    currentPage.value = 1
  }
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.pengeluaran-table {
  table-layout: fixed;
  width: 100%;
}
.pengeluaran-table th:nth-child(1) { width: 40px; }
.pengeluaran-table th:nth-child(2) { width: 120px; }
.pengeluaran-table th:nth-child(3) { width: 200px; }
.pengeluaran-table th:nth-child(4) { width: 60px; }
.pengeluaran-table th:nth-child(5) { width: 70px; }
.pengeluaran-table th:nth-child(6) { width: 80px; }
.pengeluaran-table th:nth-child(7) { width: 250px; }
.pengeluaran-table th:nth-child(8) { width: 120px; }
.pengeluaran-table th:nth-child(9) { width: 100px; }
.pengeluaran-table th:nth-child(10) { width: 100px; }
.pengeluaran-table th:nth-child(11) { width: 80px; }
.pengeluaran-table th:nth-child(12) { width: 80px; }
.pengeluaran-table th:nth-child(13) { width: 300px; }
.pengeluaran-table th:nth-child(14) { width: 100px; }
.pengeluaran-table th:nth-child(15) { width: 120px; }
.pengeluaran-jumlah-cell {
  font-size: 1rem !important;
  font-weight: 700;
  white-space: nowrap;
}
@media (max-width: 1024px) {
  .pengeluaran-table th:nth-child(7) { width: 150px; }
  .pengeluaran-table th:nth-child(13) { width: 150px; }
}
</style>
