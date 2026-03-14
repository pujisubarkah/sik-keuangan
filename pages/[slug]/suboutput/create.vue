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
    const data = await response.json();
    if (Array.isArray(data)) {
      satkerList.value = [
        { value: '', label: '- Pilih Satker -' },
        ...data.map(item => ({ value: String(item.id), label: item.name }))
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
    const response = await fetch('/api/suboutput', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        kode_suboutput: kodeSuboutput,
        nama_suboutput: suboutput.value,
        output_id: output.value,
        total: '0', // atau bisa diisi sesuai kebutuhan
      })
    });
    const data = await response.json();
    if (response.ok && !data.error) {
      if (window.$toast) {
        window.$toast.success('Suboutput berhasil disimpan!');
      } else {
        alert('Suboutput berhasil disimpan!');
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
      if (window.$toast) {
        window.$toast.error(data.error || 'Gagal menyimpan suboutput');
      } else {
        alert(data.error || 'Gagal menyimpan suboutput');
      }
    }
  } catch (err) {
    alert('Terjadi kesalahan saat menyimpan suboutput');
  } finally {
    isSubmitting.value = false;
  }
}
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
      <NuxtLink to="/admin/suboutput" class="hover:text-blue-700">Suboutput</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Tambah</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Tambah Suboutput
    </h1>

    <!-- CARD -->
    <Card class="bg-white shadow-xl rounded-xl border border-blue-100">
      <template #default>
        <h3 class="text-xl font-bold mb-6">Form Suboutput</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="satker">Satker</label>
              <select v-model="satker" id="satker" class="select select-bordered flex-1">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="output">Output <span class="text-red-500">*</span></label>
              <select v-model="output" id="output" class="select select-bordered flex-1" required>
                <option v-for="o in outputList" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="suboutput">Suboutput <span class="text-red-500">*</span></label>
              <textarea v-model="suboutput" id="suboutput" rows="3" class="textarea textarea-bordered flex-1" placeholder="Suboutput" required></textarea>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="kode">Kode <span class="text-red-500">*</span></label>
              <TextField v-model="kode" id="kode" type="text" class="flex-1" placeholder="Kode" required maxlength="255" />
            </div>
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="unit">Unit</label>
              <div class="flex-1">
                <select v-model="unit" id="unit" class="select select-bordered w-full">
                  <option v-for="u in unitList" :key="u.value" :value="u.value">{{ u.label }}</option>
                </select>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-40 font-semibold mb-0" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <TextField v-model="tahun" id="tahun" type="text" class="flex-1" placeholder="Tahun" readonly required />
            </div>
          </div>
          <div class="mt-6">
            <Button type="success" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
            </Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
