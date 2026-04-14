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
    </div>
    <div v-show="!collapsed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(satker, idx) in satkerData" :key="satker.id"
        :class="[
          'stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300',
          'bg-brandBlue-500 text-white'
        ]"
      >
        <div class="flex flex-col items-start gap-0">
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center justify-center bg-white/20 shadow-lg rounded-full p-2 z-10">
              <Icon icon="tabler:ChartBar" class="text-2xl drop-shadow text-white" />
            </span>
            <span class="font-semibold text-lg drop-shadow z-10">{{ satker.name }}</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="text-3xl font-extrabold drop-shadow">{{ satker.percentage.toFixed(2) }}</span>
            <span class="text-lg font-medium">%</span>
          </div>
          <NuxtLink
            v-if="satker.username"
            :to="`/${satker.username}`"
            class="mt-4 text-sm font-semibold text-white inline-flex items-center gap-1 py-2 rounded-lg transition-all duration-200 cursor-pointer group focus:outline-none"
            style="padding-left:0"
          >
            <span class="group-hover:underline decoration-2 underline-offset-2 inline-flex items-center">
              Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base ml-1 text-white"></i>
            </span>
          </NuxtLink>
          <span
            v-else
            class="mt-4 text-sm font-semibold text-white/70 inline-flex items-center gap-1 py-2 rounded-lg cursor-not-allowed"
            style="padding-left:0"
          >
            Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base ml-1 text-white/70"></i>
          </span>
        </div>
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
