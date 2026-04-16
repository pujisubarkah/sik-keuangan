<script setup>
import { Button, TextField } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const kode_akun = ref('521211')
const nama_berkas = ref('Faktur Barang')
const kata_kunci = ref('')

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isSubmitting = ref(false)

const router = useRouter()
const route = useRoute()

async function submitForm() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    toastMessage.value = 'Berkas berhasil diperbarui'
    toastType.value = 'success'
    showToast.value = true
    setTimeout(() => router?.back(), 1500)
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-16 pb-24">
    <Transition name="slide-fade">
      <div v-if="showToast" :class="['fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border backdrop-blur-sm', toastType === 'success' ? 'bg-emerald-500/95 text-white border-emerald-400/50 shadow-emerald-500/25' : 'bg-rose-500/95 text-white border-rose-400/50 shadow-rose-500/25']">
        <div :class="['p-1.5 rounded-full bg-white/20']"><Icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="w-5 h-5" /></div>
        <span class="font-medium text-sm">{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group"><Icon icon="mdi:home-outline" class="w-4 h-4" /><span class="font-medium">Dashboard</span></NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route.params.slug}/berkas`" class="text-slate-500 hover:text-blue-600 transition-colors font-medium">Daftar Berkas</NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Ubah Data</span>
      </nav>
    </div>

    <div class="max-w-5xl mx-auto px-6 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Update Berkas Akun</h1>
          <p class="text-slate-500 mt-2 text-base">Ubah data berkas sesuai kebutuhan.</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        <form class="px-8 py-8" @submit.prevent="submitForm">
          <div class="space-y-7">
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Kode Akun <span class="text-rose-500">*</span></label>
              <TextField v-model="kode_akun" type="text" required class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Nama Berkas <span class="text-rose-500">*</span></label>
              <TextField v-model="nama_berkas" type="text" required class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">Kata Kunci</label>
              <TextField v-model="kata_kunci" type="text" class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
            <Button type="neutral" native-type="button" class="px-6 py-2.5 rounded-xl border-slate-200" @click="router?.back()">Batal</Button>
            <Button type="success" native-type="submit" :disabled="isSubmitting" class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{{ isSubmitting ? 'Menyimpan...' : 'Perbarui Data' }}</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-20px) scale(0.98); }
</style>
