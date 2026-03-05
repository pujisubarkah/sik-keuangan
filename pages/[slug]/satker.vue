<script setup>
import { Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const showAlert = ref(true)

const units = ref([
  {
    nama: 'Inspektorat',
    kode: '2003',
    satker: 'LAN JAKARTA',
    alias: 'Inspektorat'
  },
  {
    nama: 'STIA LAN Jakarta',
    kode: '2008',
    satker: 'STIA LAN JAKARTA',
    alias: 'STIA LAN Jakarta'
  },
  {
    nama: 'STIA LAN Bandung',
    kode: '2009',
    satker: 'STIA LAN BANDUNG',
    alias: 'STIA LAN Bandung'
  },
  {
    nama: 'STIA LAN Makassar',
    kode: '2010',
    satker: 'STIA MAKASSAR',
    alias: 'STIA LAN Makassar'
  },
  {
    nama: 'Pusat Data dan Sistem Informasi (Pusdatin)',
    kode: '2023',
    satker: 'LAN JAKARTA',
    alias: 'Pusdatin'
  }
])

definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
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
      <NuxtLink to="/admin/unit" class="hover:text-blue-700">Units</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Manage</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Unit
    </h1>

    <!-- WARNING -->
    <div class="alert alert-warning shadow mb-6">
      <Icon icon="mdi:information" class="w-5 h-5" />
      <span>
        Untuk tambah / ubah / hapus unit dilakukan melalui aplikasi
        <b>Sireva</b>
      </span>
    </div>

    <!-- CARD -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-blue-700">Daftar Unit</h2>
      </template>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">

            <!-- HEADER -->
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Nama</th>
                <th>Kode</th>
                <th class="text-center">Satker</th>
                <th class="text-center rounded-tr-xl">Alias</th>
              </tr>
            </thead>

            <!-- BODY -->
            <tbody>
              <tr
                v-for="(unit, index) in units"
                :key="index"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">
                  {{ index + 1 }}
                </td>

                <td class="font-semibold text-blue-700">
                  {{ unit.nama }}
                </td>

                <td class="font-mono">
                  {{ unit.kode }}
                </td>

                <td class="text-center">
                  <span class="badge badge-info text-white">
                    {{ unit.satker }}
                  </span>
                </td>

                <td class="text-center">
                  <span class="badge badge-success text-white">
                    {{ unit.alias }}
                  </span>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

    </Card>

  </div>
</template>