<template>
  <div :class="['border-l-4 pl-4 py-2 rounded-r-lg', ...color]">
    <div class="flex items-start gap-3">
      <div :class="['p-1.5 rounded-lg', color[1]]">
        <component :is="iconComponent" :class="['h-4 w-4', color[2]]" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-baseline gap-2">
          <span v-if="code" class="font-mono text-xs px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-600">{{ code }}</span>
          <span class="font-semibold truncate">{{ name }}</span>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconFolder, IconTag, IconCurrencyDollar } from '@tabler/icons-vue'

const props = defineProps({
  level: String,
  code: String,
  name: String,
  iconType: { type: String, default: 'folder' },
  color: { type: Array, default: () => [] }
})

const iconComponent = computed(() => {
  const icons = { folder: IconFolder, tag: IconTag, currency: IconCurrencyDollar }
  return icons[props.iconType] || IconFolder
})
</script>