<template>
  <div :class="['small-box', bgColor, 'rounded-lg shadow flex flex-col justify-between h-full relative overflow-hidden']">
    <!-- Silhouette Icon -->
    <span class="absolute top-2 right-2 opacity-20 text-white">
      <slot name="silhouette">
        <i class="fa fa-chart-line text-6xl"></i>
      </slot>
    </span>
    <div class="inner py-2 px-2 relative z-10">
      <p class="font-bold text-base mb-1">{{ title }}</p>
      <h3 class="text-2xl font-bold">{{ value }}</h3>
    </div>
    <div class="flex items-center justify-between px-2 pb-2 relative z-10">
      <div class="icon text-2xl">
        <slot name="icon">
          <i class="fa fa-circle-o"></i>
        </slot>
      </div>
      <div v-if="link">
        <NuxtLink :to="link" class="text-xs text-white underline flex items-center gap-1">
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
  switch (props.color) {
    case 'green': return 'bg-green-600 text-white';
    case 'red': return 'bg-red-600 text-white';
    case 'yellow': return 'bg-yellow-400 text-black';
    case 'aqua': return 'bg-cyan-500 text-white';
    case 'olive': return 'bg-lime-600 text-white';
    case 'orange': return 'bg-orange-500 text-white';
    default: return 'bg-blue-600 text-white';
  }
})
</script>

<style scoped>
.small-box {
  min-height: 110px;
}
</style>
