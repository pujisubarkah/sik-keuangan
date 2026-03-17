<template>
  <div class="bg-white rounded-xl shadow-lg border border-slate-200 mt-6 mb-8">
    <div class="px-8 py-6 border-b border-slate-200 bg-slate-50">
      <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">Form Berkas Pengeluaran</h3>
    </div>
    <div class="px-8 py-8">
      <SuboutputAlert :showAlert="showAlert" class="mb-6" />
      <form @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-6 mb-8">
          <div class="flex items-center gap-6">
            <label for="nama_berkas" class="min-w-[160px] text-right text-blue-600 font-semibold">Nama Berkas</label>
            <input class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" maxlength="255" placeholder="Nama Berkas" id="nama_berkas" v-model="form.nama_berkas" type="text" />
          </div>
          <div class="flex items-center gap-6">
            <label for="status" class="min-w-[160px] text-right text-blue-600 font-semibold">Status</label>
            <select class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-base font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100" id="status" v-model="form.status">
              <option value="1">Tersedia</option>
              <option value="2">Belum Tersedia</option>
              <option value="3">Tidak Perlu</option>
            </select>
          </div>
        </div>
        <input type="hidden" v-model="form.referrer" id="referrer" />
        <div class="flex justify-end border-t border-slate-200 bg-slate-50 pt-6 mt-8">
          <button class="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition" type="submit">
            <i class="fa fa-check"></i> Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SuboutputAlert from '@/components/SuboutputAlert.vue'

const form = ref({
  nama_berkas: 'Kuitansi Honorarium',
  status: '2',
  referrer: 'https://sik-keuangan.lan.go.id/index.php?r=pengeluaran/view&id=183737',
})

const showAlert = ref(true)

function handleSubmit() {
  // Submit logic here
}
</script>
