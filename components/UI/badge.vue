<!-- src/components/ui/Badge.vue -->
<template>
  <span 
    v-if="visible"
    class="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-[pulse_2s_ease-in-out_1]"
    :class="customClass"
    data-testid="badge-notification"
  >
    {{ displayValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 99 }, // 99+ format
  visible: { type: Boolean, default: true },
  customClass: { type: String, default: '' }
})

const displayValue = computed(() => 
  props.value > props.max ? `${props.max}+` : props.value
)
</script>