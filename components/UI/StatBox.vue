<template>
  <div :class="['small-box', bgColor, 'rounded-lg shadow flex flex-col justify-between h-full relative overflow-hidden']">
    <!-- Gold accent bar -->
    <div class="h-1 w-full bg-[#F9E650] absolute top-0 left-0 z-20" />
    <div class="inner py-2 px-2 relative z-10">
      <p class="font-bold text-base mb-1">{{ title }}</p>
      <h3 class="text-2xl font-bold">{{ value }}</h3>
    </div>
    <div class="flex items-center justify-end px-2 pb-2 relative z-10">
      <div v-if="link">
        <NuxtLink :to="link" class="text-xs text-[#F9E650] underline flex items-center gap-1 drop-shadow font-semibold">
          Info Lebih Lanjut <i class="fa fa-arrow-circle-right"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NuxtLink } from '#components'
const props = defineProps({
  title: String,
  value: String,
  color: {
    type: String,
    default: 'blue',
    validator: v => ['blue', 'green', 'red', 'yellow', 'aqua', 'olive', 'orange'].includes(v)
  },
  link: String
})
const bgColor = computed(() => {
  // Card utama pakai warna #3781C7 (brandBlue-500)
  return 'bg-[#3781C7] text-white';
})
</script>

<style scoped>
.small-box {
  min-height: 110px;
}
</style>
