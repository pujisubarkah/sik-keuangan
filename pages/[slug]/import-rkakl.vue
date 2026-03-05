<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const showAlert = ref(true)
const tahun = ref(2026)
const satker = ref('1')
const file = ref(null)
const barisAwal = ref('')
const barisAkhir = ref('')

const satkers = [
  { id: '1', name: 'LAN JAKARTA' },
  { id: '2', name: 'PUSJAR SKTASN NAS' },
  { id: '3', name: 'PUSJAR SKMP' },
  { id: '4', name: 'PUSJAR SKPP' },
  { id: '5', name: 'PUSJAR SKMK' },
  { id: '6', name: 'STIA LAN BANDUNG' },
  { id: '7', name: 'STIA LAN JAKARTA' },
  { id: '8', name: 'STIA MAKASSAR' },
]

function handleFileChange(e) {
  file.value = e.target.files[0]
}

function submitForm() {
  // Implementasi submit sesuai kebutuhan backend
  alert('Impor RKAKL diproses!')
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
      <span class="font-bold text-blue-700">Import RKAKL</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Import RKAKL
    </h1>

    <!-- CARD -->
    <Card class="bg-white shadow-xl rounded-xl border border-blue-100">
      <template #default>
        <h3 class="text-xl font-bold mb-6">Form Import</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1" for="tahun">Tahun <span class="text-red-500">*</span></label>
              <TextField v-model="tahun" id="tahun" type="number" class="w-full" placeholder="Tahun" required />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="satker">Satker</label>
              <select v-model="satker" id="satker" class="select select-bordered w-full">
                <option v-for="s in satkers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block font-semibold mb-1" for="file">File</label>
              <input id="file" type="file" class="file-input file-input-bordered w-full" @change="handleFileChange" />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="barisAwal">Baris Awal <span class="text-red-500">*</span></label>
              <TextField v-model="barisAwal" id="barisAwal" type="text" class="w-full" placeholder="Baris Awal" required />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="barisAkhir">Baris Akhir <span class="text-red-500">*</span></label>
              <TextField v-model="barisAkhir" id="barisAkhir" type="number" class="w-full" placeholder="Baris Akhir" required />
            </div>
          </div>
          <div class="mt-6">
            <Button type="success" native-type="submit">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Proses Impor RKAKL
            </Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
