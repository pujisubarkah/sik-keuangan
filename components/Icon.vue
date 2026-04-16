<template>
  <component :is="resolvedIcon" v-bind="attrs" v-if="resolvedIcon" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { 
  IconAlertCircle, 
  IconUser, 
  IconUserCircle, 
  IconClipboardText, 
  IconCurrencyDollar, 
  IconFileDescription, 
  IconFilterCog, 
  IconInfoCircle, 
  IconLoader2, 
  IconLockPassword, 
  IconSearch, 
  IconListDetails,
  IconHome,
  IconClipboardList,
  IconShoppingCart,
  IconCash,
  IconStar,
  IconTag,
  IconBriefcase,
  IconFolder,
  IconFolderOpen,
  IconPackage,
  IconLock,
  IconUsers,
  IconBuildingBank,
  IconBuilding,
  IconFileText,
  IconFileImport,
  IconLogout,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconEye,
  IconPencil,
  IconTrash,
  IconHome2,
  IconCircleCheck
} from '@tabler/icons-vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  icon?: string
}>()

const attrs = useAttrs()

// Map of common aliases and icon names
const iconMap: Record<string, any> = {
  'mdi:home': IconHome,
  'mdi:home-outline': IconHome2,
  'mdi:chevron-right': IconChevronRight,
  'mdi:chevron-down': IconChevronDown,
  'mdi:chevron-up': IconChevronUp,
  'mdi:alert': IconAlertCircle,
  'mdi:account': IconUser,
  'mdi:user': IconUser,
  'mdi:account-circle': IconUserCircle,
  'mdi:clipboard-edit-outline': IconClipboardText,
  'mdi:currency-usd': IconCurrencyDollar,
  'mdi:file-document': IconFileDescription,
  'mdi:file-document-outline': IconFileDescription,
  'mdi:filter-cog': IconFilterCog,
  'mdi:information': IconInfoCircle,
  'mdi:loading': IconLoader2,
  'mdi:lock-reset': IconLockPassword,
  'mdi:magnify': IconSearch,
  'mdi:view-list': IconListDetails,
  'mdi:plus': IconPlus,
  'mdi:eye': IconEye,
  'mdi:pencil': IconPencil,
  'mdi:trash': IconTrash,
  'mdi:check-circle': IconCircleCheck,
  'tabler:home': IconHome,
  'tabler:clipboard-list': IconClipboardList,
  'tabler:shopping-cart': IconShoppingCart,
  'tabler:cash-banknote': IconCash,
  'tabler:star': IconStar,
  'tabler:tag': IconTag,
  'tabler:briefcase': IconBriefcase,
  'tabler:folder': IconFolder,
  'tabler:folder-open': IconFolderOpen,
  'tabler:package': IconPackage,
  'tabler:lock': IconLock,
  'tabler:users': IconUsers,
  'tabler:user': IconUser,
  'tabler:building-bank': IconBuildingBank,
  'tabler:building': IconBuilding,
  'tabler:info-circle': IconInfoCircle,
  'tabler:file-description': IconFileDescription,
  'tabler:file-text': IconFileText,
  'tabler:file-import': IconFileImport,
  'tabler:logout': IconLogout
}

const resolvedIcon = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon] || null
})
</script>
