*** End Patch
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
        class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
        :style="{ backgroundColor: [
          '#fde047', // yellow-300
          '#f472b6', // pink-400
          '#4ade80', // green-400
          '#60a5fa', // blue-400
          '#fdba74', // orange-300
          '#67e8f9'  // cyan-300
        ][idx % 6] }"
      >
        <div class="flex items-center gap-3 mb-2 relative">
          <span class="inline-flex items-center justify-center bg-white shadow-lg rounded-full p-2 z-10">
            <Icon icon="tabler:ChartBar" class="text-2xl text-blue-500 drop-shadow" />
          </span>
          <span class="font-semibold text-gray-900 text-lg drop-shadow z-10">{{ satker.name }}</span>
          <!-- Silhouette background icon watermark -->
          <span class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none z-0">
            <Icon icon="tabler:ChartBar" class="text-[10rem] text-black/5 blur-[3px]" />
          </span>
        </div>
        <div class="flex items-end gap-2 mt-4">
          <span class="text-3xl font-extrabold text-gray-900 drop-shadow">{{ satker.percentage.toFixed(2) }}</span>
          <span class="text-lg text-gray-700 font-medium">%</span>
        </div>
        <a :href="`/index.php?r=admin/index&DashboardForm[id_satker]=${satker.id}`" class="mt-4 text-sm font-semibold text-blue-700 hover:text-pink-600 transition-colors flex items-center gap-1">
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
// cardColors dihapus, gunakan inline style backgroundColor agar tidak tergantung Tailwind
</script>
