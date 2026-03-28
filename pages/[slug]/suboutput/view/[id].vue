<template>
  <div class="p-6">
    <SuboutputAlert :showAlert="true" />
    <!-- Konten detail suboutput di sini -->
    <div class="mt-8">
      <SuboutputDetail :data="subOutputData ?? {}" />
      <SuboutputRekapan v-if="stats" :stats="stats" />
      <SuboutputCharts
        :tahun="subOutputData?.tahun ?? ''"
        :chartPenyerapanOptions="chartPenyerapanOptions"
        :chartPenyerapanSeries="chartPenyerapanSeries"
        :chartPengeluaranOptions="chartPengeluaranOptions"
        :chartPengeluaranSeries="chartPengeluaranSeries"
      />
      <SuboutputRkakl :data="rkaklDetail" />
    </div>
  </div>
</template>

<script setup>
import SuboutputRkakl from '@/components/SuboutputRkakl.vue'

import { ref, onMounted } from 'vue'
const rkaklDetail = ref(null)
onMounted(async () => {
  const id = route.params.id
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/rkakl_detail/suboutput/${id}`, { headers })
    const json = await res.json()
    // Jika respons API berupa array, ambil elemen pertama (atau sesuaikan kebutuhan)
    rkaklDetail.value = Array.isArray(json) ? json[0] : json
  } catch (err) {
    console.error('Fetch rkakl_detail error:', err)
    rkaklDetail.value = null
  }
})
import SuboutputCharts from '@/components/SuboutputCharts.vue'

// Dummy chart data, ganti dengan fetch API jika perlu
const chartPenyerapanOptions = {
  chart: { id: 'penyerapan-chart', toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'] },
  title: { text: 'Grafik Penyerapan Anggaran', align: 'center', style: { fontSize: '16px', fontWeight: 'bold' } },
  yaxis: { labels: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` } }
}
const chartPenyerapanSeries = [
  { name: 'Penyerapan', data: [200000000, 300000000, 150000000, 250000000, 176950000] }
]
const chartPengeluaranOptions = {
  chart: { id: 'pengeluaran-chart', toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'] },
  title: { text: 'Grafik Pengeluaran Anggaran', align: 'center', style: { fontSize: '16px', fontWeight: 'bold' } },
  yaxis: { labels: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` } }
}
const chartPengeluaranSeries = [
  { name: 'Pengeluaran', data: [100000000, 120000000, 90000000, 110000000, 50000000] }
]
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetail from '@/components/SuboutputDetail.vue'
import SuboutputRekapan from '@/components/SuboutputRekapan.vue'


const stats = ref(null)


const subOutputData = ref(null)
const route = useRoute()

onMounted(async () => {
  const id = route.params.id
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  // Fetch detail suboutput
  try {
    const res = await fetch(`/api/suboutput/${id}`, { headers })
    const json = await res.json()
    if (json && typeof json === 'object') {
      subOutputData.value = json
    }
  } catch (err) {
    console.error('Fetch error:', err)
  }
  // Fetch stats dari dashboard endpoint
  try {
    const res = await fetch(`/api/dashboard/suboutput/${id}`, { headers })
    const json = await res.json()
    if (json && Array.isArray(json.data) && json.data.length > 0) {
      stats.value = json.data[0]
    } else {
      stats.value = null
    }
  } catch (err) {
    console.error('Fetch stats error:', err)
    stats.value = null
  }
})
</script>
