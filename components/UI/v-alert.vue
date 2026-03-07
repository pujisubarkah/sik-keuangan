<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-alert.vue -->
<template>
  <div v-if="show" :class="alertClass" class="alert shadow-lg mb-4 text-white">
    <slot name="icon">
      <svg v-if="type==='danger' || type==='error'" class="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/></svg>
      <svg v-else-if="type==='warning'" class="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 17a5 5 0 100-10 5 5 0 000 10z"/></svg>
      <svg v-else-if="type==='info'" class="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01"/></svg>
      <svg v-else-if="type==='success'" class="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    </slot>
    <span>
      <slot>{{ message }}</slot>
    </span>
    <button v-if="dismissible" @click="show=false" class="ml-4 text-white text-lg font-bold">×</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  type: { type: String, default: 'info' },
  message: { type: String, default: '' },
  dismissible: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: true }
})
const show = ref(props.modelValue)
const alertClass = computed(() => {
  switch (props.type) {
    case 'danger':
    case 'error':
      return 'bg-gradient-to-r from-red-500 via-red-600 to-red-700';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600';
    case 'success':
      return 'bg-gradient-to-r from-green-500 via-green-600 to-green-700';
    case 'info':
    default:
      return 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';
  }
})
</script>

<style scoped>
.alert {
  border-radius: 8px;
  padding: 14px 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
}
</style>
