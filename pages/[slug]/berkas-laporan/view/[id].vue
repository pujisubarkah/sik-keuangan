<script setup>
import { Button, TextField } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'
import { useRoute, useRouter } from 'vue-router'

const judul = ref('tes')
const berkas = ref('Penawaran Pembuatan Aplikasi Sistem Informasi Akademik.pdf')
const user_pembuat = ref('Admin')
const waktu_dibuat = ref('12 April 2026')

const router = useRouter?.() || null
const route = useRoute?.() || null

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-16 pb-24">
    <div class="max-w-5xl mx-auto px-6 mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group"><Icon icon="mdi:home-outline" class="w-4 h-4" /><span class="font-medium">Dashboard</span></NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route.params.slug}/berkas-laporan`" class="text-slate-500 hover:text-blue-600 transition-colors font-medium">Berkas Laporan</NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Detail Data</span>
      </nav>
    </div>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Detail Berkas Laporan</h1>
          <p class="text-slate-500 mt-2 text-base">Informasi detail mengenai berkas laporan.</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <form class="px-8 py-8" @submit.prevent>
          <div class="space-y-7">
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Judul</label>
              <TextField v-model="judul" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">File Berkas</label>
              <TextField v-model="berkas" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">User Pembuat</label>
              <TextField v-model="user_pembuat" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Waktu Dibuat</label>
              <TextField v-model="waktu_dibuat" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
            <Button type="neutral" native-type="button" class="px-6 py-2.5 rounded-xl border-slate-200" @click="router?.back()">Kembali</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
