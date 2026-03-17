<template>
  <section class="px-8 pt-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
        Sunting Pengeluaran <span class="text-base font-normal text-slate-500">: Belanja Gaji Pokok PNS</span>
      </h1>
      <ul class="flex items-center gap-2 text-sm text-slate-500 mt-2">
        <li>
          <NuxtLink to="/" class="hover:text-blue-600"><i class="fa fa-dashboard"></i></NuxtLink>
        </li>
        <li><span class="mx-1">/</span></li>
        <li>Pengeluaran</li>
        <li><span class="mx-1">/</span></li>
        <li>Sunting</li>
      </ul>
    </div>
    <form @submit.prevent class="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-slate-800 mb-6">Detil Pengeluaran</h3>
        <div class="flex flex-col gap-6 mb-8">
          <div class="flex items-center gap-6">
            <label for="Pengeluaran_tanggal_pengajuan" class="min-w-[180px] text-blue-600 font-semibold">Tanggal Pengajuan</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" type="date" v-model="form.tanggal_pengajuan" />
          </div>
          <div class="flex items-center gap-6">
            <label for="Pengeluaran_kode_komponen" class="min-w-[180px] text-blue-600 font-semibold">Kode Komponen</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Kode Komponen" v-model="form.kode_komponen" type="text" maxlength="20" />
          </div>
          <div class="flex items-center gap-6">
            <label for="Pengeluaran_kode_subkomponen" class="min-w-[180px] text-blue-600 font-semibold">Kode Subkomponen</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Kode Subkomponen" v-model="form.kode_subkomponen" type="text" maxlength="20" />
          </div>
          <div class="flex items-center gap-6">
            <label for="Pengeluaran_kode_akun" class="min-w-[180px] text-blue-600 font-semibold">Kode Akun</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Kode Akun" v-model="form.kode_akun" type="text" />
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_jumlah">Jumlah Pengeluaran</label>
            <div class="flex flex-1 items-center gap-2">
              <span class="rounded-lg bg-slate-100 px-3 py-2 text-slate-500">Rp</span>
              <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium text-right focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="0" v-model="form.jumlah" type="text" />
            </div>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_sisa">Sisa Anggaran</label>
            <div class="flex flex-1 items-center gap-2">
              <span class="rounded-lg bg-slate-100 px-3 py-2 text-slate-500">Rp</span>
              <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium text-muted text-right bg-slate-100" readonly placeholder="Sisa" v-model="form.sisa" type="text" />
            </div>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_keterangan">Keterangan</label>
            <textarea rows="3" class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Tambahkan keterangan detail di sini..." v-model="form.keterangan"></textarea>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_id_pengeluaran_status">Status</label>
            <select class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" v-model="form.id_pengeluaran_status">
              <option value="1">Cair</option>
              <option value="2">Proses</option>
              <option value="3">Batal</option>
            </select>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_tanggal">Tanggal Cair</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" type="date" v-model="form.tanggal" />
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_status_sp2d">Status SP2D</label>
            <select class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" v-model="form.status_sp2d">
              <option value="0">Belum</option>
              <option value="1">Sudah</option>
            </select>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_tanggal_sp2d">Tanggal SP2D</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" type="date" v-model="form.tanggal_sp2d" />
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_status_pertanggungjawaban">Status PJ</label>
            <select class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" v-model="form.status_pertanggungjawaban">
              <option value="">- Pilih Status -</option>
              <option value="0">Belum</option>
              <option value="1">Sudah</option>
            </select>
          </div>
          <div class="flex items-center gap-6">
            <label class="min-w-[180px] font-semibold text-blue-600" for="Pengeluaran_tanggal_pertanggungjawaban">Tanggal PJ</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" type="date" v-model="form.tanggal_pertanggungjawaban" />
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-4 border-t border-slate-200 pt-6 mt-8">
        <NuxtLink :to="`/${slug}/pengeluaran/update/${id}`" class="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
          <i class="fa fa-edit"></i> Sunting Pengeluaran
        </NuxtLink>
        <button @click.prevent="goBack" class="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold shadow hover:bg-slate-300 transition" type="button">
          <i class="fa fa-arrow-left"></i> Kembali
        </button>
      </div>
    </form>
    <div class="flex flex-col gap-8">
      <Berkas :berkas-list="berkasList" />
      <Riwayat :riwayat-list="riwayatList" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Berkas from '@/components/berkas.vue'
import Riwayat from '@/components/riwayat.vue'

const form = ref({
  tanggal_pengajuan: '',
  kode_komponen: '',
  kode_subkomponen: '',
  kode_akun: '',
  jumlah: '',
  sisa: '',
  keterangan: '',
  id_pengeluaran_status: '',
  tanggal: '',
  status_sp2d: '',
  tanggal_sp2d: '',
  status_pertanggungjawaban: '',
  tanggal_pertanggungjawaban: '',
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const id = route.params.id

function goBack() {
  router.back()
}

const berkasList = ref([])
const riwayatList = ref([])
</script>
