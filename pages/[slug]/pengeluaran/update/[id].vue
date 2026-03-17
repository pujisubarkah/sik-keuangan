<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <!-- Alert Section -->
    <div class="max-w-3xl mx-auto mb-4">
      <div class="alert alert-danger bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative">
        Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
        <NuxtLink to="/pekerjaan/admin?id_unit=null" class="underline text-blue-700 hover:text-blue-900">klik di sini</NuxtLink>
        untuk memperbaiki.
      </div>
    </div>

    <!-- Header & Breadcrumb -->
    <div class="max-w-3xl mx-auto mb-4">
      <h1 class="text-2xl font-bold text-blue-700 mb-1 flex items-center gap-2">
        Sunting Pengeluaran : Belanja Gaji Pokok PNS
      </h1>
      <ul class="flex items-center text-sm text-gray-500 gap-2 mb-2">
        <li><NuxtLink to="/" class="hover:text-blue-700"><i class="fa fa-dashboard"></i></NuxtLink></li>
        <li>/</li>
        <li>Pengeluaran</li>
        <li>/</li>
        <li>Sunting</li>
      </ul>
    </div>

    <!-- Main Form -->
    <div class="max-w-3xl mx-auto">
      <form class="bg-white shadow-lg rounded-lg p-6" @submit.prevent>
        <div class="mb-6 border-b pb-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Form Pengeluaran / Pengajuan</h3>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input type="hidden" name="Pengeluaran[id_pekerjaan]" value="4734" />
              <input type="hidden" name="Pengeluaran[id_anggaran]" value="229353" />
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_tanggal_pengajuan">Tanggal Pengajuan</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-calendar"></i></span>
                  <input id="Pengeluaran_tanggal_pengajuan" name="Pengeluaran[tanggal_pengajuan]" type="text" class="form-input pl-10 w-full" placeholder="Tanggal Pengajuan" autocomplete="off" value="2026-03-17" />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_kode_komponen">Kode Komponen</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-tags"></i></span>
                  <input id="Pengeluaran_kode_komponen" name="Pengeluaran[kode_komponen]" type="text" maxlength="20" class="form-input pl-10 w-full" placeholder="Kode Komponen" value="001" />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_kode_subkomponen">Kode Subkomponen</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-tags"></i></span>
                  <input id="Pengeluaran_kode_subkomponen" name="Pengeluaran[kode_subkomponen]" type="text" maxlength="20" class="form-input pl-10 w-full" placeholder="Kode Subkomponen" value="A" />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_kode_akun">Kode Akun</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-tags"></i></span>
                  <input id="Pengeluaran_kode_akun" name="Pengeluaran[kode_akun]" type="text" maxlength="255" class="form-input pl-10 w-full" placeholder="Kode Akun" value="511111" />
                </div>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1 required" for="Pengeluaran_jumlah">Jumlah Pengeluaran <span class="text-red-500">*</span></label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400">Rp</span>
                  <input id="Pengeluaran_jumlah" name="Pengeluaran[jumlah]" type="text" maxlength="20" class="form-input pl-10 w-full" placeholder="Jumlah Pengeluaran" value="1.590.689.740" />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_sisa">Sisa</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400">Rp</span>
                  <input id="Pengeluaran_sisa" name="Pengeluaran[sisa]" type="text" maxlength="20" class="form-input pl-10 w-full" placeholder="Sisa" value="12.119.064.580" readonly />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_keterangan">Keterangan</label>
                <textarea id="Pengeluaran_keterangan" name="Pengeluaran[keterangan]" rows="3" class="form-input w-full" placeholder="Keterangan">SPM 00078 - LS - Gaji Induk PNS Bulan April 2026 untuk 424Pegawai/1050 Jiwa</textarea>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1 required" for="Pengeluaran_id_pengeluaran_status">Status <span class="text-red-500">*</span></label>
                <select id="Pengeluaran_id_pengeluaran_status" name="Pengeluaran[id_pengeluaran_status]" class="form-input w-full">
                  <option value="1" selected>Cair</option>
                  <option value="2">Proses</option>
                  <option value="3">Batal</option>
                </select>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_tanggal">Tanggal Cair</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-calendar"></i></span>
                  <input id="Pengeluaran_tanggal" name="Pengeluaran[tanggal]" type="text" class="form-input pl-10 w-full" placeholder="Tanggal Cair" autocomplete="off" value="2026-04-01" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_status_sp2d">SP2D</label>
                <select id="Pengeluaran_status_sp2d" name="Pengeluaran[status_sp2d]" class="form-input w-full">
                  <option value="0">Belum</option>
                  <option value="1" selected>Sudah</option>
                </select>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_tanggal_sp2d">Tanggal SP2D</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-calendar"></i></span>
                  <input id="Pengeluaran_tanggal_sp2d" name="Pengeluaran[tanggal_sp2d]" type="text" class="form-input pl-10 w-full" placeholder="Tanggal SP2D" autocomplete="off" value="2026-04-01" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_status_pertanggungjawaban">Status PJ</label>
                <select id="Pengeluaran_status_pertanggungjawaban" name="Pengeluaran[status_pertanggungjawaban]" class="form-input w-full">
                  <option value="">- Pilih Status Pertanggungjawaban -</option>
                  <option value="0">Belum</option>
                  <option value="1" selected>Sudah</option>
                </select>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="Pengeluaran_tanggal_pertanggungjawaban">Tanggal PJ</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-gray-400"><i class="fa fa-calendar"></i></span>
                  <input id="Pengeluaran_tanggal_pertanggungjawaban" name="Pengeluaran[tanggal_pertanggungjawaban]" type="text" class="form-input pl-10 w-full" placeholder="Tanggal PJ" autocomplete="off" value="2026-03-12" />
                </div>
              </div>
            </div>
          </div>
          <input type="hidden" name="referrer" value="https://sik-keuangan.lan.go.id/index.php?r=pengeluaran/view&id=183743" />
        </div>
        <div class="mt-8 flex justify-end">
          <button type="submit" class="btn btn-success flex items-center gap-2">
            <span class="glyphicon glyphicon-ok"></span> Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// NuxtLink diimport otomatis oleh Nuxt 3
</script>

<style scoped>
.form-input {
  @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full;
}
.btn {
  @apply px-4 py-2 rounded font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition;
}
.btn-success {
  @apply bg-green-600 hover:bg-green-700;
}
.alert {
  @apply mb-4;
}
</style>
