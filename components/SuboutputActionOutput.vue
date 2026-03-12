<template>
  <div class="flex flex-wrap gap-3 items-center mb-6">
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-blue-400 hover:bg-blue-500 text-white flex items-center gap-2" @click="onEdit">
      <IconPencil class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Sunting RO</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-green-400 hover:bg-green-500 text-white flex items-center gap-2" @click="onAnggaran">
      <IconCash class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Update Jumlah</span>
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
