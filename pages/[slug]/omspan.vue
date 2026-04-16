<script setup>

import { Button, Card } from '@idds/vue'
import { ref } from 'vue'
import { IconEye, IconEdit } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' })

const showAlert = ref(true)

const tableData = ref([
  {
    id: 1,
    satker: 'LAN JAKARTA - 450417',
    realisasi_sik: 17976442419,
    realisasi_omspan: 2075774796,
    selisih: -15900667623,
    email_terakhir: '27-02-2020 11:31',
    status_alert: 'Aktif',
    email_penerima: 'keuanganlan@gmail.com'
  }
])

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <SuboutputAlert :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>OMSPAN</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Realisasi Terakhir</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Realisasi OMSPAN Terakhir Satker
    </h1>

    <!-- CARD -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-blue-700">Realisasi OMSPAN Terakhir Satker</h2>
      </template>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ tableData.length }}</span> satker
        </div>

        <!-- TABLE -->
        <div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
            <thead class="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Satker</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Realisasi SIK</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Realisasi OMSPAN</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Selisih</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Aksi</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Email Terakhir</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Status</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Email Penerima</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(row, idx) in tableData" :key="row.id" class="hover:bg-yellow-50 align-middle">
                <td class="px-3 py-2 text-center align-middle">{{ idx + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ row.satker }}</td>
                <td class="px-3 py-2 text-right text-blue-700 font-semibold align-middle">{{ formatCurrency(row.realisasi_sik) }}</td>
                <td class="px-3 py-2 text-right font-semibold text-indigo-700 align-middle">{{ formatCurrency(row.realisasi_omspan) }}</td>
                <td class="px-3 py-2 text-right font-bold align-middle" :class="row.selisih < 0 ? 'text-red-600' : 'text-green-600'">{{ formatCurrency(row.selisih) }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <div class="flex justify-center gap-2">
                    <NuxtLink :to="`/${$route.params.slug}/omspan/preview/${row.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Preview">
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/omspan/sendEmail/${row.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Kirim Email">
                      <Icon icon="mdi:send" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/omspan/update/${row.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Penerima Email">
                      <Icon icon="mdi:account" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                  </div>
                </td>
                <td class="px-3 py-2 text-center text-sm align-middle">{{ row.email_terakhir }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span v-if="row.status_alert === 'Aktif'" class="inline-block bg-green-500 text-white rounded px-2 py-1 font-bold">Aktif</span>
                  <span v-else class="inline-block bg-red-500 text-white rounded px-2 py-1 font-bold">Nonaktif</span>
                </td>
                <td class="px-3 py-2 text-sm align-middle">{{ row.email_penerima }}</td>
              </tr>
              <!-- Empty State -->
              <tr v-if="tableData.length === 0">
                <td colspan="9" class="px-6 py-10 text-center text-gray-500">
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

        <!-- FOOTER ACTION -->
        <div class="mt-6">
          <NuxtLink :to="`/${$route.params.slug}/omspan/pengaturan`">
            <Button class="btn btn-gradient w-auto px-6 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconEdit class="w-4 h-4" />
              <span>Kelola Isi Konten OMSPAN</span>
            </Button>
          </NuxtLink>
        </div>
    </Card>
  </div>
</template>