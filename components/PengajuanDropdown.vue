<template>
  <div class="dropdown dropdown-end">
    <button
      tabindex="0"
      class="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200"
    >
      <IconShoppingCart class="w-5 h-5" />
      <span class="hidden md:inline text-sm font-semibold">Pengajuan Baru</span>
      <span v-if="pengajuanCount > 0" class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ pengajuanCount }}</span>
    </button>
    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-lg w-56 border border-blue-200">
      <li>
        <a href="#" class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all">
          <IconSearch class="w-4 h-4" />
          <span class="font-medium">Pengajuan Baru</span>
        </a>
      </li>
      <li>
        <a href="/admin/pengajuan?status_verifikator=0" class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all">
          <Icon icon="tabler:list" class="w-4 h-4" />
          <span class="font-medium">Pengajuan Total</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IconSearch, IconShoppingCart } from '@tabler/icons-vue'

const pengajuanCount = ref(0)

onMounted(() => {
  // Load pengajuan count from API
  // Example: pengajuanCount.value = await fetchPengajuanCount()
})
</script>
