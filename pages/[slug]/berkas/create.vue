<script setup>
import { Button, TextField } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'
import { useUserStore } from '~/stores/user'
import { useRoute, useRouter } from 'vue-router'

const kode_akun = ref('')
const nama_berkas = ref('')
const kata_kunci = ref('')

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isSubmitting = ref(false)

const userStore = useUserStore()
const router = useRouter?.() || null
const route = useRoute?.() || null

async function submitForm() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    toastMessage.value = 'Berkas berhasil ditambahkan'
    toastType.value = 'success'
    showToast.value = true
    setTimeout(() => router?.back(), 1500)
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-16 pb-24">
    <Transition name="slide-fade">
      <div v-if="showToast" 
           :class="[
             'fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border backdrop-blur-sm',
             toastType === 'success' 
               ? 'bg-emerald-500/95 text-white border-emerald-400/50 shadow-emerald-500/25' 
               : 'bg-rose-500/95 text-white border-rose-400/50 shadow-rose-500/25'
           ]"
      >
        <div :class="['p-1.5 rounded-full bg-white/20']">
          <Icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="w-5 h-5" />
        </div>
        <span class="font-medium text-sm">{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
          <Icon icon="mdi:home-outline" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Dashboard</span>
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route.params.slug}/berkas`" 
                  class="text-slate-500 hover:text-blue-600 transition-colors font-medium">
          Daftar Berkas
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Tambah Baru</span>
      </nav>
    </div>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Tambah Berkas Akun
          </h1>
          <p class="text-slate-500 mt-2 text-base">
            Lengkapi formulir di bawah untuk menambahkan data berkas baru.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <div class="px-8 py-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-100 rounded-xl">
              <Icon icon="mdi:file-document-plus-outline" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-800">Detail Berkas</h2>
              <p class="text-sm text-slate-500">Field dengan <span class="text-rose-500">*</span> wajib diisi</p>
            </div>
          </div>
        </div>

        <form class="px-8 py-8" @submit.prevent="submitForm">
          <div class="space-y-7">
            <div class="flex items-center gap-4">
              <label for="kode_akun" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:pound" class="w-4 h-4 text-slate-400" />
                Kode Akun <span class="text-rose-500">*</span>
              </label>
              <TextField v-model="kode_akun" id="kode_akun" type="text" required maxlength="255"
                         class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 
                                [&>input]:text-slate-700 [&>input]:placeholder-slate-400 
                                [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60 [&>input:focus]:bg-white"
                         placeholder="Contoh: 521211" />
            </div>

            <div class="flex items-center gap-4">
              <label for="nama_berkas" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:text-box-outline" class="w-4 h-4 text-slate-400" />
                Nama Berkas <span class="text-rose-500">*</span>
              </label>
              <TextField v-model="nama_berkas" id="nama_berkas" type="text" required maxlength="255"
                         class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 
                                [&>input]:text-slate-700 [&>input]:placeholder-slate-400 
                                [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60 [&>input:focus]:bg-white"
                         placeholder="Faktur Barang, Kuitansi, dll..." />
            </div>

            <div class="flex items-center gap-4">
              <label for="kata_kunci" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:key-outline" class="w-4 h-4 text-slate-400" />
                Kata Kunci
              </label>
              <TextField v-model="kata_kunci" id="kata_kunci" type="text" maxlength="255"
                         class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 
                                [&>input]:text-slate-700 [&>input]:placeholder-slate-400 
                                [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60 [&>input:focus]:bg-white"
                         placeholder="Kata kunci pencarian (opsional)..." />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
            <Button type="neutral" native-type="button" 
                    class="px-6 py-2.5 rounded-xl font-medium border-slate-200 hover:bg-slate-50 transition-all"
                    @click="router?.back()">
              <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" /> Batal
            </Button>
            <Button type="success" native-type="submit" :disabled="isSubmitting"
                    class="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white">
              <Icon v-if="isSubmitting" icon="mdi:loading" class="w-5 h-5 animate-spin mr-2" />
              <Icon v-else icon="mdi:check" class="w-5 h-5 mr-2" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-20px) scale(0.98); }
:deep(input:focus) { box-shadow: 0 0 0 4px rgb(59 130 246 / 0.15); }
@keyframes subtle-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
:deep(button:disabled) { animation: subtle-pulse 2s ease-in-out infinite; }
</style>
