<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12">
    <div class="max-w-5xl mx-auto px-6">
      
      <!-- 📍 Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
          <Icon icon="mdi:home-outline" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Dashboard</span>
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <NuxtLink :to="`/${route?.params?.slug}/suboutput`" 
                  class="text-slate-500 hover:text-blue-600 transition-colors font-medium">
          Suboutput
        </NuxtLink>
        <Icon icon="mdi:chevron-right" class="w-4 h-4 text-slate-300" />
        <span class="text-blue-600 font-semibold">Ubah Data</span>
      </nav>

      <!-- 🎯 Header Section -->
      <div class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Ubah Rincian Output
            </h1>
            <p class="text-slate-500 mt-2 text-base">
              Perbarui detail rincian output. Pastikan data yang diubah telah diverifikasi.
            </p>
          </div>
        </div>
      </div>

      <!-- ⚠️ Alert Component (Elegant Wrapper) -->
      <div class="mb-6">
        <SuboutputAlert :showAlert="true" />
      </div>

      <!-- 📋 Form Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        
        <!-- Card Header -->
        <div class="px-8 py-6 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-amber-100 rounded-xl">
              <Icon icon="mdi:pencil-outline" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-800">Edit Detail</h2>
              <p class="text-sm text-slate-500">Field dengan <span class="text-rose-500">*</span> wajib diisi</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <form class="px-8 py-8" @submit.prevent="handleSubmit">
          <div class="space-y-7">
            <!-- Satker (readonly) -->
            <div class="flex items-center gap-4">
              <label for="satker" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:office-building-outline" class="w-4 h-4 text-slate-400" />
                Satuan Kerja
              </label>
              <input id="satker" type="text" :value="satkerNama || '-'" readonly disabled
                class="flex-1 rounded-xl border border-gray-200 bg-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed transition-all duration-200" />
            </div>

            <!-- Output (readonly) -->
            <div class="flex items-center gap-4">
              <label for="output" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:format-list-bulleted" class="w-4 h-4 text-slate-400" />
                Output
              </label>
              <input id="output" type="text" :value="outputName || '-'" readonly disabled
                class="flex-1 rounded-xl border border-gray-200 bg-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed transition-all duration-200" />
            </div>

            <!-- Suboutput (Textarea) -->
            <div class="flex items-center gap-4">
              <label for="suboutput" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:text-box-edit-outline" class="w-4 h-4 text-slate-400" />
                Rincian Output <span class="text-rose-500">*</span>
              </label>
              <textarea 
                v-model="form.suboutput" 
                id="suboutput" 
                rows="4" 
                required
                class="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 
                       focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 focus:bg-white transition-all duration-200 
                       resize-y min-h-[100px] max-h-52 leading-relaxed"
                placeholder="Deskripsikan rincian output secara jelas dan spesifik..."
              />
            </div>

            <!-- Kode -->
            <div class="flex items-center gap-4">
              <label for="kode" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:code-tags" class="w-4 h-4 text-slate-400" />
                Kode RO <span class="text-rose-500">*</span>
              </label>
              <VTextField 
                v-model="form.kode" 
                id="kode" 
                required 
                placeholder="Contoh: 001.A.01"
                class="flex-1 border border-gray-300 rounded-xl bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 focus:bg-white transition-all duration-200"
              />
            </div>

            <!-- Unit -->
            <div class="flex items-center gap-4">
              <label for="unit" class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                <Icon icon="mdi:account-group-outline" class="w-4 h-4 text-slate-400" />
                Unit Kerja
              </label>
              <div class="relative flex-1">
                <select 
                  v-model="form.unit" 
                  id="unit"
                  class="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-slate-700 placeholder-slate-400 
                         focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="">- Pilih Unit -</option>
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <!-- Tahun (Readonly) -->
            <div class="flex items-center gap-4 pt-2">
              <label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
                Tahun Anggaran
              </label>
              <div class="relative flex-1">
                <input 
                  type="text"
                  :value="tahunLogin"
                  readonly
                  disabled
                  class="w-full rounded-xl border border-gray-200 bg-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
            <VButton 
              type="submit" 
              :loading="isSubmitting"
              class="px-8 py-2.5 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 focus:ring-4 focus:ring-green-200 shadow-lg shadow-green-500/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Icon v-if="isSubmitting" icon="mdi:loading" class="w-5 h-5 animate-spin" />
              <Icon v-else icon="mdi:content-save" class="w-5 h-5" />
              {{ isSubmitting ? 'Memperbarui...' : 'Simpan' }}
            </VButton>
          </div>
        </form>
      </div>

      <!-- Helper Text -->
      <p class="text-center text-xs text-slate-400 mt-6">
        Perubahan data akan tercatat dalam audit log. Pastikan koordinasikan dengan tim terkait sebelum menyimpan.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import SuboutputAlert from '@/components/SuboutputAlert.vue';
import { useUserStore } from '~/stores/user';
import { useRoute, useRouter } from 'vue-router';
import VButton from '@/components/UI/v-button.vue';
import VTextField from '@/components/UI/v-text-field.vue';
import Icon from '~/components/Icon.vue';

const isSubmitting = ref(false);
const route = useRoute?.() || null;
const router = useRouter?.() || null;
const userStore = useUserStore();

// Options & Form State
const satkerOptions = ref([]);
const unitOptions = ref([]);

const form = ref({
  satker: '',
  output: '',
  suboutput: '',
  kode: '',
  unit: '',
  tahun: ''
});

const outputName = ref('');
const satkerNama = ref('');
const tahunLogin = computed(() => {
  // Ambil tahun dari userStore jika ada, fallback ke tahun sekarang
  // Misal userStore.year atau userStore.tahun, jika tidak ada pakai tahun sekarang
  // Jika di token tidak ada, bisa di-set manual di sini
  // Untuk demo, pakai tahun sekarang
  return new Date().getFullYear().toString();
});

// Fetch unit options by satker_id
async function fetchUnitOptions(satkerId) {
  if (!satkerId) {
    unitOptions.value = [];
    return;
  }
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    const response = await fetch(`/api/unit_kerja/satker/${satkerId}`, { headers });
    if (!response.ok) throw new Error('Gagal mengambil unit');
    const data = await response.json();
    unitOptions.value = Array.isArray(data)
      ? data.map(unit => ({ value: String(unit.id), label: unit.name }))
      : [];
  } catch {
    unitOptions.value = [];
  }
}

// Fetch initial data
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser?.();
    await navigateTo?.('/login') || router?.push('/login');
    return;
  }
  
  const headers = { Authorization: `Bearer ${token}` };
  const id = route?.params?.id;
  if (!id) return;
  
  try {
    // Fetch satker options
    const satkerRes = await fetch('/api/satker', { headers });
    if (satkerRes.ok) {
      const json = await satkerRes.json();
      if (json.success && Array.isArray(json.data)) {
        satkerOptions.value = json.data.map(item => ({ 
          value: String(item.id), 
          label: item.name 
        }));
      }
    }

    // Fetch suboutput data
    const response = await fetch(`/api/anggaran_suboutput/by-suboutput/${id}`, { headers });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      userStore.clearUser?.();
      await navigateTo?.('/login') || router?.push('/login');
      return;
    }
    
    if (!response.ok) throw new Error('Gagal mengambil data');
    
    const data = await response.json();
    if (data) {
      form.value = {
        satker: data.satker_id?.toString() || '',
        output: data.output_id?.toString() || '',
        suboutput: data.nama_suboutput || '',
        kode: data.kode || '',
        unit: data.unit_id?.toString() || '',
        tahun: data.tahun?.toString() || ''
      };
      outputName.value = data.output_name || '';
      satkerNama.value = data.satker_name || '';
      
      // Fetch initial unit options
      await fetchUnitOptions(form.value.satker);
    }
    
    // Watch satker changes for dynamic unit loading
    watch(() => form.value.satker, (newSatker) => {
      fetchUnitOptions(newSatker);
    });
    
  } catch (err) {
    alert(err.message || 'Terjadi kesalahan saat mengambil data');
  }
});

// Handle form submission
async function handleSubmit() {
  isSubmitting.value = true;
  
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser?.();
    await navigateTo?.('/login') || router?.push('/login');
    return;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const id = route?.params?.id;
  if (!id) {
    alert('ID tidak ditemukan');
    isSubmitting.value = false;
    return;
  }
  
  try {
    const response = await fetch(`/api/anggaran_suboutput/by-suboutput/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        satker_id: form.value.satker,
        output_id: form.value.output,
        suboutput: form.value.suboutput,
        kode: form.value.kode,
        unit_id: form.value.unit,
        tahun_anggaran: form.value.tahun
      })
    });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      userStore.clearUser?.();
      await navigateTo?.('/login') || router?.push('/login');
      return;
    }
    
    if (!response.ok) throw new Error('Gagal memperbarui data');
    
    // Success feedback
    alert('✅ Data berhasil diperbarui!');
    
    // Redirect
    const slug = route?.params?.slug;
    if (router) {
      router.push({ path: `/${slug || 'suboutput'}/suboutput` });
    }
    
  } catch (err) {
    alert(err.message || 'Terjadi kesalahan');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* ✨ Smooth transitions for interactive elements */
select,
textarea,
:deep(input) {
  transition: all 0.2s ease-in-out;
}

/* ✨ Focus glow enhancement */
select:focus,
textarea:focus,
:deep(input:focus) {
  box-shadow: 0 0 0 4px rgb(245 158 11 / 0.15); /* amber-500/15 */
}

/* ✨ Custom scrollbar for textarea */
textarea {
  scrollbar-width: thin;
  scrollbar-color: rgb(148 163 184) transparent; /* slate-400 */
}
textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background-color: rgb(148 163 184);
  border-radius: 3px;
}

/* ✨ Subtle hover lift for card */
:deep(.bg-white.rounded-3xl) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.bg-white.rounded-3xl:hover) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.3);
}

/* ✨ Button loading animation */
@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
:deep(button:disabled) {
  animation: subtle-pulse 2s ease-in-out infinite;
}
</style>