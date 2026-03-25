<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto">
      <SuboutputAlert class="mb-6" :showAlert="true" />
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-blue-500">
        <div class="px-8 pt-6 pb-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-800">Ubah Rincian Ouput</h1>
          <p class="text-gray-500 text-sm mt-1">Perbarui detail Rincian Ouput di bawah ini.</p>
        </div>
        <form class="px-8 py-8" @submit.prevent="handleSubmit">
          <div class="space-y-6">
            
            <!-- Satker -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700">Satker</label>
              <div class="col-span-9">
                <input
                  class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition"
                  id="Satker_nama"
                  v-model="satkerNama"
                  readonly
                />
              </div>
            </div>

            <!-- Output -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="output">Output</label>
              <div class="col-span-9 flex items-center min-h-[40px]">
                <span v-if="outputName" class="text-base text-gray-800 font-semibold">{{ outputName }}</span>
                <span v-else class="text-gray-400 italic">(Tidak ada data output)</span>
              </div>
            </div>

            <!-- Suboutput -->
            <div class="grid grid-cols-12 items-start gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="suboutput">Rincian Ouput <span style="color: red;">*</span></label>
              <div class="col-span-9">
                <textarea v-model="form.suboutput" rows="4" id="suboutput" placeholder="Deskripsi Suboutput" class="form-textarea w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"></textarea>
              </div>
            </div>

            <!-- Kode -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="kode">Kode <span style="color: red;">*</span></label>
              <div class="col-span-9">
                <VTextField v-model="form.kode" placeholder="e.g. 001.A" required id="kode" />
              </div>
            </div>

            <!-- Unit -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="unit">Unit</label>
              <div class="col-span-9">
                <select v-model="form.unit" id="unit" class="form-select w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm">
                  <option value="">- Pilih Unit -</option>
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
                </select>
              </div>
            </div>
            
            <!-- Tahun -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="tahun">Tahun</label>
              <div class="col-span-9">
                <VTextField v-model="form.tahun" readonly disabled id="tahun" />
              </div>
            </div>

          </div>
          <div class="flex justify-end mt-10">
            <VButton type="submit" variant="primary" text="Simpan Perubahan" :loading="isSubmitting" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SuboutputAlert from '@/components/SuboutputAlert.vue';
import { useUserStore } from '~/stores/user';
const userStore = useUserStore();
import { useRoute, useRouter } from 'vue-router';
import VButton from '@/components/UI/v-button.vue';
import VTextField from '@/components/UI/v-text-field.vue';

const isSubmitting = ref(false);
const route = useRoute ? useRoute() : null;
const router = useRouter ? useRouter() : null;

import { computed } from 'vue';
const satkerOptions = ref([]);
const satkerLabel = computed(() => {
  const found = satkerOptions.value.find(opt => opt.value === form.value.satker);
  return found ? found.label : '';
});

// outputOptions dihapus, output tidak bisa diubah pada update

import { watch } from 'vue';
const unitOptions = ref([]);

// Fetch unit options by satker_id
async function fetchUnitOptions(satkerId) {
  console.log('fetchUnitOptions satkerId:', satkerId);
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
    console.log('unit data:', data);
    unitOptions.value = Array.isArray(data)
      ? data.map(unit => ({ value: String(unit.id), label: unit.name }))
      : [];
  } catch (err) {
    unitOptions.value = [];
  }
}

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

// Fetch data by id saat mount
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser && userStore.clearUser();
    await navigateTo('/login');
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };
  const id = route?.params?.id;
  if (!id) return;
  try {
    // Fetch satker options from API
    const satkerRes = await fetch('/api/satker', { headers });
    if (!satkerRes.ok) throw new Error('Gagal mengambil data satker');
    const satkerJson = await satkerRes.json();
    if (satkerJson.success && Array.isArray(satkerJson.data)) {
      satkerOptions.value = satkerJson.data.map(item => ({ value: String(item.id), label: item.name }));
    } else {
      satkerOptions.value = [];
    }

    const response = await fetch(`/api/anggaran_suboutput/by-suboutput/${id}`, { headers });
    if (response.status === 401) {
      localStorage.removeItem('token');
      userStore.clearUser && userStore.clearUser();
      await navigateTo('/login');
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
      // Fetch unit options for initial satker
      await fetchUnitOptions(form.value.satker);
    }
    // Watch for satker change to update unit options
    watch(() => form.value.satker, (newSatker) => {
      fetchUnitOptions(newSatker);
    });
  } catch (err) {
    alert(err.message || 'Terjadi kesalahan saat mengambil data');
  }
});

async function handleSubmit() {
  isSubmitting.value = true;
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser && userStore.clearUser();
    await navigateTo('/login');
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
      userStore.clearUser && userStore.clearUser();
      await navigateTo('/login');
      return;
    }
    if (!response.ok) {
      throw new Error('Gagal memperbarui data');
    }
    isSubmitting.value = false;
    alert('Data berhasil diperbarui!');
    // Redirect ke halaman suboutput setelah update
    if (router && route) {
      const slug = route.params?.slug;
      if (slug) {
        router.push({ path: `/${slug}/suboutput` });
      } else {
        router.push({ path: `/suboutput` });
      }
    }
  } catch (err) {
    isSubmitting.value = false;
    alert(err.message || 'Terjadi kesalahan');
  }
}
</script>

<style scoped>
/* You can add component-specific styles here if needed */
.form-select, .form-textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
:deep(.form-control.w-full.mb-4) {
  margin-bottom: 0;
}
</style>
