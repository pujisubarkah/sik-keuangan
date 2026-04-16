<script setup>
import { Button, TextField, Card } from '@idds/vue'
import DeleteModal from '~/components/UI/DeleteModal.vue'
import { ref, onMounted, watch } from 'vue'
import Icon from '~/components/Icon.vue'
import { useUserStore } from '~/stores/user'

// State
const satker = ref('')
const output = ref('')
const suboutput = ref('')
const kode = ref('')
const unit = ref('')
const tahun = ref('2026')

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Modal error duplicate
const showDuplicateModal = ref(false)
const duplicateMessage = ref('')

const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])
const outputList = ref([{ value: '', label: '- Pilih Output -' }])
const unitList = ref([{ value: '', label: '- Pilih Unit -' }])
const isSubmitting = ref(false)

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// Watch satker untuk fetch output & unit
watch(satker, async (newSatker) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  if (newSatker) {
    // Fetch output
    try {
      const res = await fetch(`/api/output?satker_id=${newSatker}`, { headers })
      if (!res.ok) throw new Error('Gagal mengambil data output')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        outputList.value = [
          { value: '', label: '- Pilih Output -' },
          ...json.data.map(item => ({
            value: String(item.id),
            label: `${item.kode_output || ''} - ${item.nama_output || item.name || ''}`
              .replace(/^ - | - $/, '').trim(),
            kode_output: item.kode_output || ''
          }))
        ]
      }
    } catch {
      outputList.value = [{ value: '', label: '- Pilih Output -' }]
    }

    // Fetch unit
    try {
      const res = await fetch(`/api/unit_kerja/satker/${newSatker}`, { headers })
      if (!res.ok) throw new Error('Gagal mengambil data unit')
      const data = await res.json()
      unitList.value = [
        { value: '', label: '- Pilih Unit -' },
        ...Array.isArray(data) ? data.map(item => ({ 
          value: String(item.id), 
          label: item.name 
        })) : []
      ]
    } catch {
      unitList.value = [{ value: '', label: '- Pilih Unit -' }]
    }
  } else {
    outputList.value = [{ value: '', label: '- Pilih Output -' }]
    unitList.value = [{ value: '', label: '- Pilih Unit -' }]
  }
})

// Submit handler
async function submitForm() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const token = localStorage.getItem('token')
  if (!token) {
    userStore.clearUser?.()
    router?.push({ path: '/login' })
    return
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  try {
    // 1. POST suboutput
    const selectedOutput = outputList.value.find(o => o.value === output.value)
    const kodeOutput = selectedOutput?.kode_output || ''
    const kodeGabungan = kodeOutput && kode.value ? `${kodeOutput}.${kode.value}` : kode.value

    const payloadSuboutput = {
      output_id: output.value,
      nama_suboutput: suboutput.value,
      kode_suboutput: kodeGabungan,
      kode_output: kodeOutput
    }

    const suboutputRes = await fetch('/api/suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify(payloadSuboutput)
    })
    const suboutputJson = await suboutputRes.json()

    if (!suboutputRes.ok || !suboutputJson.id) {
      if (suboutputJson.message?.includes('duplicate key value')) {
        duplicateMessage.value = 'Data suboutput dengan kode dan output tersebut sudah ada. Silakan gunakan kode lain.'
        showDuplicateModal.value = true
        isSubmitting.value = false
        return
      }
      throw new Error(suboutputJson.message || suboutputJson.error || 'Gagal menambah suboutput')
    }
    const suboutputId = suboutputJson.id

    // 2. POST anggaran_suboutput
    let tahunAnggaranId = null
    try {
      const tahunRes = await fetch('/api/tahun_anggaran', { headers })
      const tahunData = await tahunRes.json()
      if (Array.isArray(tahunData)) {
        const found = tahunData.find(item => String(item.tahun) === String(tahun.value))
        if (found?.id) tahunAnggaranId = found.id
      }
    } catch {}

    if (!tahunAnggaranId) {
      throw new Error('Gagal mendapatkan tahun_anggaran_id')
    }

    const anggaranPayload = {
      suboutput_id: suboutputId,
      satker_id: satker.value,
      unit_id: unit.value,
      tahun_anggaran_id: tahunAnggaranId,
      anggaran: 0
    }

    const anggaranRes = await fetch('/api/anggaran_suboutput/by-suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify(anggaranPayload)
    })
    const anggaranJson = await anggaranRes.json()

    if (anggaranRes.ok && anggaranJson.success) {
      toastMessage.value = 'Suboutput berhasil ditambahkan'
      toastType.value = 'success'
      showToast.value = true
      // Tidak redirect, biarkan user tetap di halaman ini
    } else {
      throw new Error(anggaranJson.message || anggaranJson.error || 'Gagal menambah anggaran suboutput')
    }
  } catch (err) {
    toastMessage.value = err.message
    toastType.value = 'error'
    showToast.value = true
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 300)
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

// On mounted: fetch initial data
onMounted(async () => {
  isSubmitting.value = true
  const token = localStorage.getItem('token')
  
  if (!token) {
    userStore.clearUser?.()
    if (typeof navigateTo === 'function') {
      await navigateTo('/login')
    } else {
      router?.push({ path: '/login' })
    }
    return
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  try {
    const [satkerRes, unitRes] = await Promise.all([
      fetch('/api/satker', { headers }),
      fetch('/api/unit_kerja', { headers })
    ])

    if (satkerRes.ok) {
      const json = await satkerRes.json()
      if (json.success && Array.isArray(json.data)) {
        satkerList.value = [
          { value: '', label: '- Pilih Satker -' },
          ...json.data.map(item => ({ value: String(item.id), label: item.name }))
        ]
      }
    }
    if (unitRes.ok) {
      const json = await unitRes.json()
      if (json.success && Array.isArray(json.data)) {
        unitList.value = [
          { value: '', label: '- Pilih Unit -' },
          ...json.data.map(item => ({ value: String(item.id), label: item.name }))
        ]
      }
    }
  } catch {
    satkerList.value = [{ value: '', label: '- Pilih Satker -' }]
    unitList.value = [{ value: '', label: '- Pilih Unit -' }]
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 300)
  }
})
</script>

<template>
    <!-- Modal Duplicate Error -->
    <DeleteModal
      :show="showDuplicateModal"
      :error="duplicateMessage"
      @close="showDuplicateModal = false"
      @confirm="showDuplicateModal = false"
    />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-16 pb-24">
    
    <!-- ✨ Toast Notification -->
    <Transition name="slide-fade">
      <div v-if="showToast" 
           :class="[
             'fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border backdrop-blur-sm',
             toastType === 'success' 
               ? 'bg-emerald-500/95 text-white border-emerald-400/50 shadow-emerald-500/25' 
               : 'bg-rose-500/95 text-white border-rose-400/50 shadow-rose-500/25'
           ]"
      >
        <div :class="['p-1.5 rounded-full', toastType === 'success' ? 'bg-white/20' : 'bg-white/20']">
          <Icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="w-5 h-5" />
        </div>
        <span class="font-medium text-sm">{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- 📍 Breadcrumb -->
    <div class="max-w-5xl mx-auto px-6 mb-8">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
          <Icon icon="mdi:home-outline" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Dashboard</span>
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route.params.slug}/suboutput`" 
                  class="text-slate-500 hover:text-blue-600 transition-colors font-medium">
          Suboutput
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Tambah Baru</span>
      </nav>
    </div>

    <!-- 🎯 Header Section -->
    <div class="max-w-5xl mx-auto px-6 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Tambah Suboutput
          </h1>
          <p class="text-slate-500 mt-2 text-base">
            Lengkapi formulir di bawah untuk menambahkan rincian output baru ke dalam sistem.
          </p>
        </div>
        <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
          <Icon icon="mdi:calendar" class="w-4 h-4 text-blue-600" />
          <span class="text-sm font-medium text-blue-700">Tahun Anggaran {{ tahun }}</span>
        </div>
      </div>
    </div>

    <!-- 📋 Form Card -->
    <div class="max-w-5xl mx-auto px-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        
        <!-- Card Header dengan gradient accent -->
        <div class="px-8 py-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-100 rounded-xl">
              <Icon icon="mdi:file-document-plus-outline" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-800">Detail Suboutput</h2>
              <p class="text-sm text-slate-500">Field dengan <span class="text-rose-500">*</span> wajib diisi</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <form class="px-8 py-8" @submit.prevent="submitForm">
          <div class="space-y-7">
            <!-- Satker -->
            <div class="flex items-center gap-4">
              <label for="satker" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:office-building-outline" class="w-4 h-4 text-slate-400" />
                Satuan Kerja
              </label>
              <div class="relative flex-1">
                <select v-model="satker" id="satker" 
                        class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 
                               focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 cursor-pointer">
                  <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <!-- Output -->
            <div class="flex items-center gap-4">
              <label for="output" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:format-list-bulleted" class="w-4 h-4 text-slate-400" />
                Output <span class="text-rose-500">*</span>
              </label>
              <div class="relative flex-1">
                <select v-model="output" id="output" required
                        class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 
                               focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 cursor-pointer">
                  <option v-for="o in outputList" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <!-- Suboutput (Textarea) -->
            <div class="flex items-center gap-4">
              <label for="suboutput" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:text-box-edit-outline" class="w-4 h-4 text-slate-400" />
                Rincian Output <span class="text-rose-500">*</span>
              </label>
              <textarea v-model="suboutput" id="suboutput" rows="3" required
                        class="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 
                               focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 
                               resize-y min-h-[80px] max-h-48 leading-relaxed"
                        placeholder="Deskripsikan rincian output secara jelas dan spesifik..." />
            </div>

            <!-- Kode -->
            <div class="flex items-center gap-4">
              <label for="kode" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:code-tags" class="w-4 h-4 text-slate-400" />
                Kode Suboutput <span class="text-rose-500">*</span>
              </label>
              <TextField v-model="kode" id="kode" type="text" required maxlength="255"
                         class="flex-1 [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-50/50 [&>input]:px-4 [&>input]:py-3 
                                [&>input]:text-slate-700 [&>input]:placeholder-slate-400 
                                [&>input:focus]:border-blue-400 [&>input:focus]:ring-4 [&>input:focus]:ring-blue-100/60 [&>input:focus]:bg-white 
                                [&>input]:transition-all [&>input]:duration-200"
                         placeholder="Contoh: 001.01" />
            </div>

            <!-- Unit -->
            <div class="flex items-center gap-4">
              <label for="unit" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:account-group-outline" class="w-4 h-4 text-slate-400" />
                Unit Kerja
              </label>
              <div class="relative flex-1">
                <select v-model="unit" id="unit"
                        class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 
                               focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 cursor-pointer">
                  <option v-for="u in unitList" :key="u.value" :value="u.value">{{ u.label }}</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <!-- Tahun (Readonly) -->
            <div class="flex items-center gap-4 pt-2">
              <label for="tahun" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:calendar-clock" class="w-4 h-4 text-slate-400" />
                Tahun Anggaran <span class="text-rose-500">*</span>
              </label>
              <div class="relative flex-1">
                <TextField v-model="tahun" id="tahun" type="text" readonly required
                           class="w-full [&>input]:rounded-xl [&>input]:border-slate-200 [&>input]:bg-slate-100/70 [&>input]:px-4 [&>input]:py-3 
                                  [&>input]:text-slate-600 [&>input]:cursor-not-allowed
                                  [&>input]:transition-all [&>input]:duration-200" />
                <Icon icon="mdi:lock-outline" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
            <Button type="neutral" native-type="button" 
                    class="px-6 py-2.5 rounded-xl font-medium border-slate-200 hover:bg-slate-50 transition-all"
                    @click="router?.back()">
              <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" /> Batal
            </Button>
            <Button type="success" native-type="submit" :disabled="isSubmitting"
                    class="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600
                           transition-all duration-200 flex items-center gap-2">
              <Icon v-if="isSubmitting" icon="mdi:loading" class="w-5 h-5 animate-spin" />
              <Icon v-else icon="mdi:check" class="w-5 h-5" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
            </Button>
          </div>
        </form>
      </div>

      <!-- Helper Text -->
      <p class="text-center text-xs text-slate-400 mt-6">
        Pastikan semua data telah diverifikasi sebelum menyimpan. Perubahan dapat mempengaruhi laporan anggaran.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ✨ Smooth Toast Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

/* ✨ Subtle Input Focus Glow */
select:focus,
textarea:focus,
:deep(input:focus) {
  box-shadow: 0 0 0 4px rgb(59 130 246 / 0.15);
}

/* ✨ Smooth Scroll for Textarea */
textarea {
  scroll-behavior: smooth;
}

/* ✨ Loading Button Pulse */
@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
:deep(button:disabled) {
  animation: subtle-pulse 2s ease-in-out infinite;
}
</style>