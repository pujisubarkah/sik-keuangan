<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Chart Pengeluaran -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
            <IconChartLine class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">Pengeluaran Anggaran</h3>
            <p class="text-xs text-gray-500">Tren bulanan tahun {{ props.tahun }}</p>
          </div>
        </div>
      </div>
      <div class="p-5">
        <client-only>
          <fusioncharts
            type="line"
            width="100%"
            height="320"
            :dataFormat="'json'"
            :dataSource="props.chartPengeluaranFusion"
          />
        </client-only>
      </div>
    </div>
    <!-- Chart Penyerapan -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
            <IconChartBar class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">Penyerapan Anggaran</h3>
            <p class="text-xs text-gray-500">Tren bulanan tahun {{ props.tahun }}</p>
          </div>
        </div>
      </div>
      <div class="p-5">
        <client-only>
          <fusioncharts
            type="column3d"
            width="100%"
            height="400"
            :dataFormat="'json'"
            :dataSource="props.chartPenyerapanFusion"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChartBar, IconChartLine } from '@tabler/icons-vue'

const props = defineProps({
  tahun: [String, Number],
  chartPenyerapanFusion: Object,
  chartPengeluaranFusion: Object,
})
</script>
