<template>
  <div class="pt-14">
    <!-- Alert -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
      <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
      untuk memperbaiki.
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <Icon icon="mdi:home" class="w-4 h-4 inline" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/pengeluaran" class="hover:text-blue-700">Pengeluarans</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Manage</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Pengeluaran Tahun 2026</h1>

    <!-- Filter Form -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <h2 class="card-title text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
          <Icon icon="mdi:magnify" class="w-6 h-6 text-blue-500" />
          Filter Data
        </h2>
        <form @submit.prevent="filterData">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="form-control md:col-span-4">
              <label class="label">
                <span class="label-text">Status Data Dukung</span>
              </label>
              <select v-model="filterForm.status_berkas" class="select select-bordered w-full">
                <option value="">Semua Status</option>
                <option value="1">Lengkap</option>
                <option value="0">Belum Lengkap</option>
              </select>
            </div>
            <div class="form-control md:col-span-3">
              <label class="label">
                <span class="label-text">Tanggal Pengajuan Awal</span>
              </label>
              <input v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="Tanggal Awal" class="input input-bordered w-full" />
            </div>
            <div class="form-control md:col-span-1 flex items-end justify-center">
              <span class="pb-3">s/d</span>
            </div>
            <div class="form-control md:col-span-3">
              <label class="label">
                <span class="label-text">Tanggal Pengajuan Akhir</span>
              </label>
              <input v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="Tanggal Akhir" class="input input-bordered w-full" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Status Data</span>
              </label>
              <select v-model="filterForm.status_verifikator" class="select select-bordered w-full">
                <option value="">Semua Data</option>
                <option value="0">Hanya Pengeluaran Baru</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" class="btn btn-success w-auto px-6">
              <Icon icon="mdi:magnify" class="w-4 h-4 mr-2" />
              Filter Data
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="mb-2 text-blue-700 font-semibold text-sm">
          Menampilkan {{ filteredData.length }} hasil.
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden pengeluaran-table">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center">No</th>
                <th class="text-center">Kode Suboutput</th>
                <th>Suboutput</th>
                <th class="text-center">Komp</th>
                <th class="text-center">Sub<br>Komp</th>
                <th class="text-center">Akun</th>
                <th>Uraian</th>
                <th class="text-right">Jumlah</th>
                <th class="text-center">Tanggal<br>Pengajuan</th>
                <th class="text-center">Pencairan<br>Bendahara</th>
                <th class="text-center">Status PJ</th>
                <th class="text-center">SP2D</th>
                <th>Ket</th>
                <th class="text-center">Jumlah Data Dukung</th>
                <th class="text-center">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td><input v-model="filterForm.id_pekerjaan_kode" type="text" class="input input-bordered input-xs w-full" placeholder="Kode" /></td>
                <td><input v-model="filterForm.id_pekerjaan_nama" type="text" class="input input-bordered input-xs w-full" placeholder="Suboutput" /></td>
                <td><input v-model="filterForm.kode_komponen" type="text" class="input input-bordered input-xs w-full" placeholder="Komp" /></td>
                <td><input v-model="filterForm.kode_subkomponen" type="text" class="input input-bordered input-xs w-full" placeholder="Sub Komp" /></td>
                <td><input v-model="filterForm.kode_akun" type="text" class="input input-bordered input-xs w-full" placeholder="Akun" /></td>
                <td><input v-model="filterForm.id_anggaran" type="text" class="input input-bordered input-xs w-full" placeholder="Uraian" /></td>
                <td><input v-model="filterForm.jumlah" type="text" class="input input-bordered input-xs w-full" placeholder="Jumlah" /></td>
                <td><input v-model="filterForm.tanggal_pengajuan" type="date" class="input input-bordered input-xs w-full" /></td>
                <td><input v-model="filterForm.tanggal" type="date" class="input input-bordered input-xs w-full" /></td>
                <td><input v-model="filterForm.status_pertanggungjawaban" type="text" class="input input-bordered input-xs w-full" placeholder="Status PJ" /></td>
                <td><input v-model="filterForm.status_sp2d" type="text" class="input input-bordered input-xs w-full" placeholder="SP2D" /></td>
                <td><input v-model="filterForm.keterangan" type="text" class="input input-bordered input-xs w-full" placeholder="Ket" /></td>
                <td></td>
                <td class="text-center">
                  <button @click="filterData" type="button" class="btn btn-success btn-xs px-4">
                    <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                    Filter
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center font-semibold text-blue-600">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="link link-primary">{{ item.id_pekerjaan_kode }}</NuxtLink>
                </td>
                <td class="text-blue-700 font-semibold">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="link link-primary">{{ item.id_pekerjaan_nama }}</NuxtLink>
                </td>
                <td class="text-center">{{ item.kode_komponen }}</td>
                <td class="text-center">{{ item.kode_subkomponen }}</td>
                <td class="text-center">{{ item.kode_akun }}</td>
                <td>{{ item.id_anggaran }}</td>
                <td class="text-right text-green-700 font-bold pengeluaran-jumlah-cell">{{ formatCurrency(item.jumlah) }}</td>
                <td class="text-center">{{ formatDate(item.tanggal_pengajuan) }}</td>
                <td class="text-center">{{ formatDate(item.tanggal) }}</td>
                <td class="text-center">
                  <span class="badge badge-success" v-if="item.status_pertanggungjawaban">{{ formatDate(item.status_pertanggungjawaban) }}</span>
                </td>
                <td class="text-center">
                  <span class="badge badge-success" v-if="item.status_sp2d">{{ formatDate(item.status_sp2d) }}</span>
                </td>
                <td>{{ item.keterangan }}</td>
                <td class="text-center">
                  <span class="badge badge-success">{{ item.jumlah_data_dukung }}</span>
                </td>
                <td class="text-center">
                  <div class="flex gap-1 justify-center">
                    <NuxtLink :to="`/pengeluaran/view?id=${item.id}`" class="btn btn-xs btn-circle btn-info tooltip" data-tip="Lihat Berkas">
                      <Icon icon="tabler:eye" class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/update?id=${item.id}`" class="btn btn-xs btn-circle btn-warning tooltip" data-tip="Sunting">
                      <Icon icon="tabler:pencil" class="w-5 h-5" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="btn btn-xs btn-circle btn-error tooltip text-white" data-tip="Hapus">
                      <Icon icon="tabler:trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-4">
          <div class="btn-group">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-sm">«</button>
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['btn btn-sm', { 'btn-active': page === currentPage }]">{{ page }}</button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-sm">»</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rekap Data -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <h3 class="text-lg font-bold text-blue-700 mb-4">Rekap Data Pengeluaran</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div class="card-body">
              <div class="flex items-center gap-3">
                <Icon icon="fa:file" class="w-10 h-10 opacity-80" />
                <div>
                  <p class="text-blue-100">Jumlah Pengeluaran</p>
                  <h3 class="text-2xl font-bold">{{ totalPengeluaran }} Pengeluaran</h3>
                </div>
              </div>
            </div>
            <div class="card-footer bg-blue-600">
              <NuxtLink to="/pengeluaran/admin?export=1&exportFormat=1" class="link link-primary text-blue-100 hover:text-white flex items-center">
                <Icon icon="fa:download" class="w-4 h-4 mr-1" /> Unduh Rincian
              </NuxtLink>
            </div>
          </div>
          <div class="card bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div class="card-body">
              <div class="flex items-center gap-3">
                <Icon icon="fa:money" class="w-10 h-10 opacity-80" />
                <div>
                  <p class="text-green-100">Jumlah Dana</p>
                  <h3 class="text-2xl font-bold">{{ formatCurrency(totalDana) }}</h3>
                </div>
              </div>
            </div>
            <div class="card-footer bg-green-600">
              <NuxtLink to="/pengeluaran/admin?export=1&exportFormat=1" class="link link-primary text-green-100 hover:text-white flex items-center">
                <Icon icon="fa:download" class="w-4 h-4 mr-1" /> Unduh Rincian
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { NuxtLink } from '#components'

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
const months = ref([
  { value: '1', text: 'Jan' },
  { value: '2', text: 'Feb' },
  { value: '3', text: 'Mar' },
  { value: '4', text: 'Apr' },
  { value: '5', text: 'Mei' },
  { value: '6', text: 'Jun' },
  { value: '7', text: 'Jul' },
  { value: '8', text: 'Agt' },
  { value: '9', text: 'Sep' },
  { value: '10', text: 'Okt' },
  { value: '11', text: 'Nov' },
  { value: '12', text: 'Des' }
])
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
    // Implement filtering logic based on filterForm
    return true // Placeholder, implement actual filters
  })
})
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const totalPengeluaran = computed(() => filteredData.value.length)
const totalDana = computed(() => filteredData.value.reduce((sum, item) => sum + item.jumlah, 0))
const filterData = () => { /* Filtering is reactive */ }
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : ''
const confirmDelete = (id) => { if (confirm('Yakin akan menghapus data?')) { /* Implement delete logic */ } }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { currentPage.value = page }
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
