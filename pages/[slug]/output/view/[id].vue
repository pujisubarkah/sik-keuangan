<template>
  <div class="p-6">
    <SuboutputAlert :showAlert="true" />
    <div class="mt-8">
      <SuboutputDetailOutput v-if="outputData" :data="outputData" />
    </div>
    <div class="mt-8 flex flex-col gap-4">
      <div v-if="outputData" class="flex justify-end">
        <NuxtLink :to="`/${$route.params.slug}/suboutput/create?id_output=${outputData.id}`" class="inline-flex items-center gap-1.5 px-4 py-2 text-base font-medium text-white bg-[#D69009] rounded-lg hover:opacity-90 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Suboutput
        </NuxtLink>
      </div>
      <SubOutputTable v-if="outputData" :subOutputs="suboutputItems" />
    </div>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetailOutput from '@/components/SuboutputDetailOutput.vue'
import SubOutputTable from '@/components/SubOutputTable.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const outputData = ref(null)
const suboutputItems = ref([])

onMounted(async () => {
  const id = route.params.id
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    // 1. Fetch Output Data
    const res = await fetch(`/api/output/${id}`, { headers })
    const json = await res.json()
    if (json.success && json.data) {
      outputData.value = {
        id: json.data.id,
        kode: json.data.kode_output,
        nama: json.data.nama_output,
        program: json.data.program ? json.data.program.nama_program : '',
        kode_program: json.data.program ? json.data.program.kode_program : '',
        kegiatan: json.data.kegiatan ? json.data.kegiatan.nama_kegiatan : '',
        kode_kegiatan: json.data.kegiatan ? json.data.kegiatan.kode_kegiatan : '',
        unit: json.data.unit || '',
        satker: json.data.satker ? json.data.satker.name : '',
        kro: json.data.kro || '',
        tahun: json.data.tahun_anggaran || '',
        total: json.data.total || '',
        jumlah_suboutput: json.data.jumlah_suboutput || 0
      }
    }

    // 2. Fetch Suboutput Table Data using output_id
    const resSub = await fetch(`/api/dashboard/suboutput?output_id=${id}`, { headers })
    const jsonSub = await resSub.json()
    if (jsonSub.success && jsonSub.data) {
      suboutputItems.value = jsonSub.data.map(item => ({
        ...item,
        link: `/${route.params.slug}/suboutput/view/${item.id}`
      }))
    }
  } catch (e) {
    outputData.value = null
  }
})
</script>
