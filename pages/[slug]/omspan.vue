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
      <NuxtLink to="/admin" class="hover:text-blue-700 flex items-center gap-1">
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
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Satker</th>
                <th class="text-right">Realisasi SIK</th>
                <th class="text-right">Realisasi OMSPAN</th>
                <th class="text-right">Selisih</th>
                <th class="text-center">Aksi</th>
                <th class="text-center">Email Terakhir</th>
                <th class="text-center">Status</th>
                <th class="rounded-tr-xl">Email Penerima</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(row, idx) in tableData"
                :key="row.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ idx + 1 }}</td>
                <td class="font-semibold text-blue-700">{{ row.satker }}</td>
                <td class="text-right text-blue-700 font-semibold">
                  {{ formatCurrency(row.realisasi_sik) }}
                </td>
                <td class="text-right font-semibold text-indigo-700">
                  {{ formatCurrency(row.realisasi_omspan) }}
                </td>
                <td
                  class="text-right font-bold"
                  :class="row.selisih < 0 ? 'text-red-600' : 'text-green-600'"
                >
                  {{ formatCurrency(row.selisih) }}
                </td>

                <!-- ACTION -->
                <td class="text-center">
                  <div class="flex justify-center gap-2">
                    <NuxtLink
                      :to="`/admin/omspan/preview/${row.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Preview"
                    >
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>

                    <NuxtLink
                      :to="`/admin/omspan/sendEmail/${row.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Kirim Email"
                    >
                      <Icon icon="mdi:send" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>

                    <NuxtLink
                      :to="`/admin/omspan/update/${row.id}`"
                      class="hover:text-blue-700 transition tooltip" data-tip="Penerima Email"
                    >
                      <Icon icon="mdi:account" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                  </div>
                </td>

                <td class="text-center text-sm">{{ row.email_terakhir }}</td>

                <td class="text-center">
                  <span
                    class="badge badge-success badge-lg text-white font-bold"
                    v-if="row.status_alert === 'Aktif'"
                  >
                    Aktif
                  </span>
                  <span class="badge badge-error badge-lg" v-else>
                    Nonaktif
                  </span>
                </td>

                <td class="text-sm">{{ row.email_penerima }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- FOOTER ACTION -->
        <div class="mt-6">
          <NuxtLink to="/admin/omspanPengaturan">
            <Button class="btn btn-gradient w-auto px-6 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconEdit class="w-4 h-4" />
              <span>Kelola Isi Konten OMSPAN</span>
            </Button>
          </NuxtLink>
        </div>
    </Card>
  </div>
</template>