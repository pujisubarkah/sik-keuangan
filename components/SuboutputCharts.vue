<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Chart Penyerapan -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
            <IconChartBar class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">Penyerapan Anggaran</h3>
            <p class="text-xs text-gray-500">Tren bulanan tahun {{ tahun }}</p>
          </div>
        </div>
      </div>
      <div class="p-5">
        <client-only>
          <apexchart
            type="bar"
            :options="chartPenyerapanOptions"
            :series="chartPenyerapanSeries"
            height="400"
          />
        </client-only>
      </div>
    </div>
    <!-- Chart Pengeluaran -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
            <IconChartLine class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">Pengeluaran Anggaran</h3>
            <p class="text-xs text-gray-500">Tren bulanan tahun {{ tahun }}</p>
          </div>
        </div>
      </div>
      <div class="p-5">
        <client-only>
          <apexchart
            type="area"
            :options="chartPengeluaranOptions"
            :series="chartPengeluaranSeries"
            height="320"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconChartBar, IconChartLine } from '@tabler/icons-vue'
const props = defineProps({
  tahun: [String, Number],
  chartPenyerapanOptions: Object,
  chartPenyerapanSeries: Array,
  chartPengeluaranOptions: Object,
  chartPengeluaranSeries: Array
})
</script>
