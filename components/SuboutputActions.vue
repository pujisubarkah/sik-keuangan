<template>
  <div class="flex flex-wrap gap-3 items-center mb-6">
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-blue-400 hover:bg-blue-500 text-white flex items-center gap-2" @click="onEdit">
      <IconPencil class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Sunting</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-green-400 hover:bg-green-500 text-white flex items-center gap-2" @click="onAnggaran">
      <IconCash class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Anggaran</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-red-400 hover:bg-red-500 text-white flex items-center gap-2" @click="onPengeluaran">
      <IconShoppingCart class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Pengeluaran</span> <span class="ml-1">({{ stats.pengeluaranCount }})</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-yellow-300 hover:bg-yellow-400 text-white flex items-center gap-2" @click="onPengajuan">
      <IconArrowUpCircle class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Pengajuan</span> <span class="ml-1">({{ stats.pengajuanCount }})</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-green-300 hover:bg-green-500 text-white flex items-center gap-2" @click="onPerencanaan">
      <IconCalendar class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Perencanaan</span>
    </button>
    <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200  bg-red-300 hover:bg-red-500 text-white flex items-center gap-2" @click="onSalin">
      <IconCopy class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Salin Suboutput</span>
    </button>
    <div class="relative inline-block">
      <button class="btn px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 bg-blue-200 hover:bg-blue-400 text-white flex items-center gap-2" @click="onToggleDropdown">
        <IconRefresh class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Refresh</span>
        <span class="caret"></span>
      </button>
      <div v-if="showDropdown" class="absolute z-10 mt-2 w-40 bg-white border rounded shadow-lg">
        <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="onRefresh('pagu')">Refresh Pagu</a>
        <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="onRefresh('realisasi')">Refresh Realisasi</a>
        <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="onRefresh('perencanaan')">Refresh Perencanaan</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  IconPencil, IconCash, IconShoppingCart, IconArrowUpCircle, IconCalendar, IconCopy, IconRefresh 
} from '@tabler/icons-vue'
const props = defineProps({
  stats: Object,
  showDropdown: Boolean
})
const emit = defineEmits([
  'edit', 'anggaran', 'pengeluaran', 'pengajuan', 'perencanaan', 'salin', 'toggleDropdown', 'refresh'
])
const onEdit = () => emit('edit')
const onAnggaran = () => emit('anggaran')
const onPengeluaran = () => emit('pengeluaran')
const onPengajuan = () => emit('pengajuan')
const onPerencanaan = () => emit('perencanaan')
const onSalin = () => emit('salin')
const onToggleDropdown = () => emit('toggleDropdown')
const onRefresh = (type) => emit('refresh', type)
</script>
