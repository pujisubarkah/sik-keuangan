<script setup>
import { Button, TextField } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const kode_akun = ref('521211')
const nama_berkas = ref('Faktur Barang')
const kata_kunci = ref('')

const router = useRouter()
const route = useRoute()

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-16 pb-24">
    <div class="max-w-5xl mx-auto px-6 mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group"><Icon icon="mdi:home-outline" class="w-4 h-4" /><span class="font-medium">Dashboard</span></NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route.params.slug}/berkas`" class="text-slate-500 hover:text-blue-600 transition-colors font-medium">Daftar Berkas</NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Detail Data</span>
      </nav>
    </div>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Detail Berkas Akun</h1>
          <p class="text-slate-500 mt-2 text-base">Informasi detail mengenai berkas.</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <form class="px-8 py-8" @submit.prevent>
          <div class="space-y-7">
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Kode Akun</label>
              <TextField v-model="kode_akun" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Nama Berkas</label>
              <TextField v-model="nama_berkas" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Kata Kunci</label>
              <TextField v-model="kata_kunci" type="text" readonly class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-gray-100 [&>input]:px-4 [&>input]:py-3" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
