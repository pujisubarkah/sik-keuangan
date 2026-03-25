<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'


const satker = ref('')
const output = ref('')
const suboutput = ref('')
const kode = ref('')
const unit = ref('')
const tahun = ref('2026')

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' | 'error'

import { onMounted, watch } from 'vue'
const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])
const outputList = ref([{ value: '', label: '- Pilih Output -' }])
const unitList = ref([{ value: '', label: '- Pilih Unit -' }])

const isSubmitting = ref(false)
import { useUserStore } from '~/stores/user'
const userStore = useUserStore();
import { useRoute, useRouter } from 'vue-router';
const router = useRouter ? useRouter() : null;
const route = useRoute ? useRoute() : null;

watch(satker, async (newSatker) => {
  if (newSatker) {
    // Fetch output list based on satker
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    try {
      // Fetch output
      const response = await fetch(`/api/output?satker_id=${newSatker}`, { headers });
      if (!response.ok) throw new Error('Gagal mengambil data output');
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        outputList.value = [
          { value: '', label: '- Pilih Output -' },
          ...json.data.map(item => ({
            value: String(item.id),
            label: `${item.kode_output || ''} - ${item.nama_output || item.name || ''}`.replace(/^ - | - $/, '').trim(),
            kode_output: item.kode_output || ''
          }))
        ];
      }
    } catch (err) {
      outputList.value = [{ value: '', label: '- Pilih Output -' }];
    }

    // Fetch unit list based on satker
    try {
      const response = await fetch(`/api/unit_kerja/satker/${newSatker}`, { headers });
      if (!response.ok) throw new Error('Gagal mengambil data unit');
      const data = await response.json();
      unitList.value = [
        { value: '', label: '- Pilih Unit -' },
        ...Array.isArray(data) ? data.map(item => ({ value: String(item.id), label: item.name })) : []
      ];
    } catch (err) {
      unitList.value = [{ value: '', label: '- Pilih Unit -' }];
    }
  } else {
    outputList.value = [{ value: '', label: '- Pilih Output -' }];
    unitList.value = [{ value: '', label: '- Pilih Unit -' }];
  }
});

async function submitForm() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser && userStore.clearUser();
    router.push({ path: '/login' });
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  try {
    // 1. POST ke /api/suboutput
    // Ambil kode_output dari output terpilih
    console.log('output.value:', output.value);
    console.log('outputList:', outputList.value);
    const selectedOutput = outputList.value.find(o => o.value === output.value);
    console.log('selectedOutput:', selectedOutput);
    const kodeOutput = selectedOutput && selectedOutput.kode_output ? selectedOutput.kode_output : '';
    // Gabungkan kode_output.kode_suboutput
    const kodeGabungan = kodeOutput && kode.value ? `${kodeOutput}.${kode.value}` : kode.value;
    const payloadSuboutput = {
      output_id: output.value,
      nama_suboutput: suboutput.value,
      kode_suboutput: kodeGabungan,
      kode_output: kodeOutput
    };
    console.log('Payload POST /api/suboutput:', payloadSuboutput);
    const suboutputRes = await fetch('/api/suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify(payloadSuboutput)
    });
    const suboutputJson = await suboutputRes.json();
    if (!suboutputRes.ok || !suboutputJson.id) {
      // Tangani error duplicate key
      if (suboutputJson.message && suboutputJson.message.includes('duplicate key value')) {
        throw new Error('Suboutput dengan kode dan output tersebut sudah ada. Silakan gunakan kode lain.');
      }
      throw new Error(suboutputJson.message || suboutputJson.error || 'Gagal menambah suboutput');
    }
    const suboutputId = suboutputJson.id;

    // 2. POST ke /api/anggaran_suboutput/by-suboutput
    // Fetch tahun_anggaran_id dari API jika perlu
    let tahunAnggaranId = null;
    try {
      const tahunRes = await fetch('/api/tahun_anggaran', { headers });
      const tahunData = await tahunRes.json();
      if (Array.isArray(tahunData)) {
        const found = tahunData.find(item => String(item.tahun) === String(tahun.value));
        if (found && found.id) tahunAnggaranId = found.id;
      }
    } catch (e) {}
    if (!tahunAnggaranId) {
      alert('Gagal mendapatkan tahun_anggaran_id, data anggaran_suboutput tidak dikirim.');
      throw new Error('Gagal mendapatkan tahun_anggaran_id');
    }
    const anggaranPayload = {
      suboutput_id: suboutputId,
      satker_id: satker.value,
      unit_id: unit.value,
      tahun_anggaran_id: tahunAnggaranId,
      anggaran: 0
    };
    console.log('Payload POST /api/anggaran_suboutput/by-suboutput:', anggaranPayload);
    const anggaranRes = await fetch('/api/anggaran_suboutput/by-suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify(anggaranPayload)
    });
    const anggaranJson = await anggaranRes.json();
    if (anggaranRes.ok && anggaranJson.success) {
      toastMessage.value = 'Suboutput berhasil ditambahkan';
      toastType.value = 'success';
      showToast.value = true;
      setTimeout(() => {
        router.push({ path: `/${route.params.slug}/suboutput` });
      }, 2000);
    } else {
      console.error('Gagal tambah anggaran_suboutput:', anggaranJson);
      alert('Gagal menambah anggaran suboutput: ' + (anggaranJson.message || anggaranJson.error || JSON.stringify(anggaranJson)));
      throw new Error(anggaranJson.message || anggaranJson.error || 'Gagal menambah anggaran_suboutput');
    }
  } catch (err) {
    toastMessage.value = err.message;
    toastType.value = 'error';
    showToast.value = true;
  } finally {
    isSubmitting.value = false;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
}

onMounted(async () => {
  isSubmitting.value = true;
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser && userStore.clearUser();
    if (typeof navigateTo === 'function') {
      await navigateTo('/login');
    } else if (router) {
      router.push({ path: '/login' });
    }
    return;
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  try {
    const [satkerRes, unitRes] = await Promise.all([
      fetch('/api/satker', { headers }),
      fetch('/api/unit_kerja', { headers })
    ]);

    if (!satkerRes.ok) throw new Error('Gagal mengambil data satker');
    const satkerJson = await satkerRes.json();
    if (satkerJson.success && Array.isArray(satkerJson.data)) {
      satkerList.value = [
        { value: '', label: '- Pilih Satker -' },
        ...satkerJson.data.map(item => ({ value: String(item.id), label: item.name }))
      ];
    }

    if (!unitRes.ok) throw new Error('Gagal mengambil data unit');
    const unitJson = await unitRes.json();
    if (unitJson.success && Array.isArray(unitJson.data)) {
      unitList.value = [
        { value: '', label: '- Pilih Unit -' },
        ...unitJson.data.map(item => ({ value: String(item.id), label: item.name }))
      ];
    }

  } catch (err) {
    satkerList.value = [{ value: '', label: '- Pilih Satker -' }];
    unitList.value = [{ value: '', label: '- Pilih Unit -' }];
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="pt-14">
    <transition name="fade-toast">
      <div v-if="showToast" :class="['fixed top-8 right-8 z-[9999] px-7 py-4 rounded-2xl flex items-center gap-3 animate-fadein-toast border-2', toastType === 'success' ? 'bg-green-600 text-white shadow-2xl shadow-green-400/40 border-green-300/60' : 'bg-red-600 text-white shadow-2xl shadow-red-400/40 border-red-300/60']">
        <Icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="w-7 h-7 text-white drop-shadow" />
        <span class="font-semibold text-lg tracking-wide">{{ toastMessage }}</span>
      </div>
    </transition>


    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/${route.params.slug}/suboutput`" class="hover:text-blue-700">Suboutput</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Tambah</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Tambah Suboutput
    </h1>

    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-blue-500">
      <div class="px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Tambah Suboutput</h1>
        <p class="text-gray-500 text-sm mt-1">Lengkapi detail suboutput di bawah ini.</p>
      </div>
      <form class="px-8 py-8" @submit.prevent="submitForm">
        <div class="space-y-6">
          <!-- Satker -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="satker">Satker</label>
            <div class="col-span-9">
              <select v-model="satker" id="satker" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
          <!-- Output -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="output">Output <span class="text-red-500">*</span></label>
            <div class="col-span-9">
              <select v-model="output" id="output" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" required>
                <option v-for="o in outputList" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
          </div>
          <!-- Suboutput -->
          <div class="grid grid-cols-12 items-start gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="suboutput">Rincian Output<span class="text-red-500">*</span></label>
            <div class="col-span-9">
              <textarea v-model="suboutput" id="suboutput" rows="3" class="form-control w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm min-h-[48px] max-h-40 resize-y break-words" placeholder="Suboutput" required></textarea>
            </div>
          </div>
          <!-- Kode -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="kode">Kode <span class="text-red-500">*</span></label>
            <div class="col-span-9">
              <TextField v-model="kode" id="kode" type="text" class="w-full" placeholder="Kode" required maxlength="255" />
            </div>
          </div>
          <!-- Unit -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="unit">Unit</label>
            <div class="col-span-9">
              <select v-model="unit" id="unit" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition">
                <option v-for="u in unitList" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
          </div>
          <!-- Tahun -->
          <div class="grid grid-cols-12 items-center gap-4">
            <label class="col-span-3 text-right font-semibold text-gray-700" for="tahun">Tahun <span class="text-red-500">*</span></label>
            <div class="col-span-9">
              <TextField v-model="tahun" id="tahun" type="text" class="w-full" placeholder="Tahun" readonly required />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-10">
          <Button type="success" native-type="submit" :disabled="isSubmitting">
            <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadein-toast {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.fade-toast-enter-active, .fade-toast-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-toast-enter-from, .fade-toast-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
.fade-toast-enter-to, .fade-toast-leave-from {
  opacity: 1;
  transform: none;
}
</style>
