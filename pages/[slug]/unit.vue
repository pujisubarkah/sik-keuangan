<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const satkers = ref([])
const unitsData = ref([])
const units = ref([])
const userStore = useUserStore()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  
  try {
    console.log('Token:', token)
    
    // Gunakan $fetch biasa dengan manual header
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    
    satkers.value = await $fetch('/api/satker', { headers })
    // Cek role_id dari userStore
    if (userStore.role_id === 8 && userStore.satker_id) {
      unitsData.value = await $fetch(`/api/unit_kerja/satker/${userStore.satker_id}`, { headers })
    } else {
      unitsData.value = await $fetch('/api/unit_kerja', { headers })
    }
    
    console.log('satkers:', satkers.value)
    console.log('unitsData:', unitsData.value)
    
    // Map data untuk menggabungkan unit dengan satker
    if (unitsData.value && satkers.value) {
      units.value = unitsData.value.map(unit => {
        const satker = satkers.value.find(s => s.id === unit.satker_id)
        return {
          id: unit.id,
          nama: unit.name || '',
          kode: unit.kode || '',
          satker: satker ? satker.name : '',
          alias: unit.alias || ''
        }
      })
      console.log('units mapped:', units.value)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const showAlert = ref(true)

const filter = ref({
  nama: '',
  kode: '',
  satker: '',
  alias: ''
})
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
      <NuxtLink to="/admin/unit" class="hover:text-blue-700">Units</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Unit
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="alert alert-warning mb-4">
          Untuk tambah/ubah/hapus unit dilakukan melalui aplikasi Sireva
        </div>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <b>{{ Array.isArray(units) ? units.length : 0 }}</b> data
        </div>
        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Nama</th>
                <th>Kode</th>
                <th class="text-center">Satker</th>
                <th class="text-center rounded-tr-xl">Alias</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input
                    v-model="filter.nama"
                    class="input input-bordered input-xs w-full"
                    placeholder="Nama Unit"
                  />
                </td>
                <td>
                  <input
                    v-model="filter.kode"
                    class="input input-bordered input-xs w-full"
                    placeholder="Kode"
                  />
                </td>
                <td>
                  <select
                    v-model="filter.satker"
                    class="select select-bordered select-xs w-full"
                  >
                    <option value="">Semua</option>
                    <option v-for="s in satkers" :key="s.id" :value="s.name">{{ s.name }}</option>
                  </select>
                </td>
                <td>
                  <input
                    v-model="filter.alias"
                    class="input input-bordered input-xs w-full"
                    placeholder="Alias"
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(u, i) in (Array.isArray(units) ? units.filter(unit =>
                  unit.nama.toLowerCase().includes(filter.nama.toLowerCase()) &&
                  unit.kode.toLowerCase().includes(filter.kode.toLowerCase()) &&
                  (filter.satker === '' || unit.satker === filter.satker) &&
                  unit.alias.toLowerCase().includes(filter.alias.toLowerCase())
                ) : [])"
                :key="u.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="font-semibold text-blue-700">{{ u.nama }}</td>
                <td>{{ u.kode }}</td>
                <td class="text-center">{{ u.satker }}</td>
                <td class="text-center">{{ u.alias }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
