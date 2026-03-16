<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const showAlert = ref(true)
const satker = ref('')
const output = ref('')
const suboutput = ref('')
const kode = ref('')
const unit = ref('')
const tahun = ref('2026')

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' | 'error'

import { onMounted } from 'vue'
const satkerList = ref([{ value: '', label: '- Pilih Satker -' }])

const isSubmitting = ref(false)
import { useUserStore } from '~/stores/user'
const userStore = useUserStore();
import { useRoute, useRouter } from 'vue-router';
const router = useRouter ? useRouter() : null;
const route = useRoute ? useRoute() : null;

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
    const response = await fetch('/api/satker', { headers });
    if (!response.ok) throw new Error('Gagal mengambil data satker');
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      satkerList.value = [
        { value: '', label: '- Pilih Satker -' },
        ...json.data.map(item => ({ value: String(item.id), label: item.name }))
      ];
    }
  } catch (err) {
    satkerList.value = [{ value: '', label: '- Pilih Satker -' }];
  } finally {
    isSubmitting.value = false;
  }
})

const outputList = ref([{ value: '', label: '- Pilih Output -' }])

onMounted(async () => {
  // ...existing code for satkerList...

  // Fetch outputList from API
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
    const response = await fetch('/api/output', { headers });
    if (!response.ok) throw new Error('Gagal mengambil data output');
    const data = await response.json();
    if (Array.isArray(data)) {
      outputList.value = [
        { value: '', label: '- Pilih Output -', kode: '' },
        ...data.map(item => ({
          value: String(item.id),
          label: `${item.kode_output} - ${item.nama_output}`,
          kode: item.kode_output
        }))
      ];
    }
  } catch (err) {
    outputList.value = [{ value: '', label: '- Pilih Output -' }];
  } finally {
    isSubmitting.value = false;
  }
})

const unitList = ref([{ value: '', label: '- Pilih Unit -' }])

import { watch } from 'vue'
watch(satker, async (newSatker) => {
  unit.value = ''
  if (!newSatker) {
    unitList.value = [{ value: '', label: '- Pilih Unit -' }]
    return
  }
  isSubmitting.value = true
  const token = localStorage.getItem('token')
  if (!token) {
    userStore.clearUser && userStore.clearUser()
    if (typeof navigateTo === 'function') {
      await navigateTo('/login')
    } else if (router) {
      router.push({ path: '/login' })
    }
    return
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
  try {
    const response = await fetch(`/api/unit_kerja/satker/${newSatker}`, { headers })
    if (!response.ok) throw new Error('Gagal mengambil data unit')
    const data = await response.json()
    if (Array.isArray(data)) {
      unitList.value = [
        { value: '', label: '- Pilih Unit -' },
        ...data.map(item => ({ value: String(item.id), label: item.name }))
      ]
    }
  } catch (err) {
    unitList.value = [{ value: '', label: '- Pilih Unit -' }]
  } finally {
    isSubmitting.value = false
  }
})

async function submitForm() {
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
  // Ambil kode_output dari output terpilih
  const selectedOutput = outputList.value.find(o => o.value === output.value);
  const kodeOutput = selectedOutput ? selectedOutput.kode : '';
  const kodeSuboutput = kodeOutput && kode.value ? `${kodeOutput}.${kode.value}` : kode.value;
  try {
    // 1. POST ke /api/suboutput
    const response = await fetch('/api/suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        kode_suboutput: kodeSuboutput,
        nama_suboutput: suboutput.value,
        output_id: output.value,
        total: '0',
      })
    });
    const data = await response.json();
    if (response.ok && data && data.id) {
      // 2. Cari tahun_anggaran_id dari tahun
      let tahunAnggaranId = null;
      try {
        // Ambil list tahun_anggaran dari /api/anggaran_suboutput, lalu cari id berdasarkan tahun
        const tahunRes = await fetch(`/api/anggaran_suboutput`, { headers });
        const tahunData = await tahunRes.json();
        if (tahunRes.ok && Array.isArray(tahunData)) {
          const found = tahunData.find(item => String(item.tahun) === String(tahun.value));
          if (found && found.tahun_anggaran_id) tahunAngGaranId = found.tahun_anggaran_id;
        }
      } catch (e) {}
      // Fallback: jika tidak ketemu, coba fetch ke endpoint tahun_anggaran
      if (!tahunAngGaranId) {
        try {
          const tahunRes = await fetch(`/api/tahun_anggaran`, { headers });
          const tahunData = await tahunRes.json();
          if (tahunRes.ok && Array.isArray(tahunData)) {
            const found = tahunData.find(item => String(item.tahun) === String(tahun.value));
            if (found && found.id) tahunAngGaranId = found.id;
          }
        } catch (e) {}
      }
      if (!tahunAngGaranId) {
        toastType.value = 'error';
        toastMessage.value = 'Gagal mendapatkan tahun_anggaran_id, data anggaran_suboutput tidak dikirim.';
        showToast.value = true;
        setTimeout(() => { showToast.value = false }, 2500);
      } else {
        // 3. POST ke /api/anggaran_suboutput
        const anggaranPayload = {
          suboutput_id: data.id,
          satker_id: satker.value,
          unit_id: unit.value,
          tahun_anggaran_id: tahunAngGaranId,
          anggaran: '0'
        };
        console.log('POST /api/anggaran_suboutput payload:', anggaranPayload);
        const anggaranRes = await fetch('/api/anggaran_suboutput', {
          method: 'POST',
          headers,
          body: JSON.stringify(anggaranPayload)
        });
        const anggaranData = await anggaranRes.json();
        console.log('POST /api/anggaran_suboutput response:', anggaranData);
        if ((anggaranRes.ok && !anggaranData.error) || (anggaranData && anggaranData.success)) {
          toastType.value = 'success';
          toastMessage.value = 'data berhasil RO berhasil ditambahkan';
          showToast.value = true;
          setTimeout(() => { showToast.value = false }, 2000);
        }
      }
      // Redirect ke halaman suboutput setelah berhasil
      if (router && route) {
        const slug = route.params?.slug;
        if (slug) {
          router.push({ path: `/${slug}/suboutput` });
        } else {
          router.push({ path: `/suboutput` });
        }
      }
    } else {
      toastType.value = 'error';
      toastMessage.value = data.error || 'Gagal menyimpan suboutput';
      showToast.value = true;
      setTimeout(() => { showToast.value = false }, 2500);
    }
  } catch (err) {
    toastType.value = 'error';
    toastMessage.value = 'Terjadi kesalahan saat menyimpan suboutput';
    showToast.value = true;
    setTimeout(() => { showToast.value = false }, 2500);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="pt-14">
    <transition name="fade-toast">
      <div v-if="showToast" :class="['fixed top-8 right-8 z-[9999] px-7 py-4 rounded-2xl flex items-center gap-3 animate-fadein-toast border-2', toastType === 'success' ? 'bg-green-600 text-white shadow-2xl shadow-green-400/40 border-green-300/60' : 'bg-red-600 text-white shadow-2xl shadow-red-400/40 border-red-300/60']">
        <Icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="w-7 h-7 text-white drop-shadow" />
        <span class="font-semibold text-lg tracking-wide">{{ toastMessage }}</span>
      </div>
    </transition>
    <SuboutputAlert class="mb-6" :showAlert="showAlert" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/suboutput" class="hover:text-blue-700">Suboutput</NuxtLink>
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
            <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="suboutput">Rincian Ouput<span class="text-red-500">*</span></label>
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
          <Button type="success" native-type="submit">
            <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
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
