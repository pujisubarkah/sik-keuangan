<template>
  <div class="flex flex-wrap gap-2 items-center w-full">
    <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors whitespace-nowrap" @click="onEdit">
      <IconPencil class="w-4 h-4 text-gray-500" /> Edit Output
    </button>
    <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap" @click="onAnggaran">
      <IconCash class="w-4 h-4 text-gray-500" /> Update Jumlah
    </button>
  </div>
</template>

<script setup>
import { IconPencil, IconCash } from '@tabler/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const emit = defineEmits(['edit', 'anggaran'])
const props = defineProps({
  stats: Object,
  data: Object
})
const router = useRouter()
const route = useRoute()
const onEdit = () => {
  // Ambil slug dan id dari route atau props.data
  const slug = route.params.slug || (props.data && props.data.slug)
  const id = (props.data && props.data.id) || route.params.id
  if (slug && id) {
    router.push({ path: `/${slug}/output/update/${id}` })
  } else {
    emit('edit')
  }
}
const onAnggaran = () => emit('anggaran')
</script>
