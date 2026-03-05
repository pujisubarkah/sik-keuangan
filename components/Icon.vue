<template>
  <component :is="resolvedIcon" v-bind="attrs" v-if="resolvedIcon" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import * as TablerIcons from '@tabler/icons-vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  icon?: string
}>()

const attrs = useAttrs()

const mdiAliases: Record<string, string> = {
  'mdi:alert': 'IconAlertCircle',
  'mdi:account': 'IconUser',
  'mdi:account-circle': 'IconUserCircle',
  'mdi:clipboard-edit-outline': 'IconClipboardText',
  'mdi:currency-usd': 'IconCurrencyDollar',
  'mdi:file-document': 'IconFileDescription',
  'mdi:file-document-outline': 'IconFileDescription',
  'mdi:filter-cog': 'IconFilterCog',
  'mdi:information': 'IconInfoCircle',
  'mdi:loading': 'IconLoader2',
  'mdi:lock-reset': 'IconLockPassword',
  'mdi:magnify': 'IconSearch',
  'mdi:view-list': 'IconListDetails'
}

function toTablerComponentName(iconName: string): string {
  const raw = iconName.replace(/^(tabler:|mdi:)/, '')
  const pascal = raw
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return `Icon${pascal}`
}

const resolvedIcon = computed(() => {
  if (!props.icon) return null

  const iconMap = TablerIcons as Record<string, unknown>
  const aliasName = mdiAliases[props.icon]

  if (aliasName && iconMap[aliasName]) {
    return iconMap[aliasName]
  }

  const generatedName = toTablerComponentName(props.icon)
  if (iconMap[generatedName]) {
    return iconMap[generatedName]
  }

  return null
})
</script>
