<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
          <i class="fa fa-bar-chart-o text-2xl text-blue-600"></i>
        </span>
        Rekapitulasi Realisasi Semua Satker Tahun {{ currentYear }}
      </h2>
      <button class="btn btn-sm btn-outline" @click="collapsed = !collapsed">
        <Icon :icon="collapsed ? 'mdi:plus' : 'mdi:minus'" class="text-xl text-blue-700" />
      </button>
    </div>
    <div v-show="!collapsed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(satker, idx) in satkerData" :key="satker.id"
        :class="[
          'stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative',
          cardColors[idx % cardColors.length]
        ]">
        <div class="flex items-center gap-3 mb-2">
          <span class="inline-flex items-center justify-center bg-green-500 rounded-full p-2">
            <i class="fa fa-line-chart text-2xl text-white"></i>
          </span>
          <!-- Chart silhouette icon -->
          <span class="absolute top-2 right-2 opacity-20">
            <Icon icon="mdi:chart-bar" class="text-7xl text-gray-700" />
          </span>
          <span class="font-semibold text-green-700 text-lg">{{ satker.name }}</span>
        </div>
        <div class="flex items-end gap-2">
          <span class="text-3xl font-bold text-blue-700">{{ satker.percentage.toFixed(2) }}</span>
          <span class="text-lg text-gray-500 font-medium">%</span>
        </div>
        <a :href="`/index.php?r=admin/index&DashboardForm[id_satker]=${satker.id}`" class="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1">
          Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base text-blue-500"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'

const props = defineProps({
  satkerData: {
    type: Array,
    required: true
  },
  currentYear: {
    type: Number,
    default: 2026
  }
})

const collapsed = ref(false)
const cardColors = [
  'bg-green-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-red-400',
]
</script>
