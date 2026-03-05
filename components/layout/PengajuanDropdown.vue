<!-- src/components/layout/PengajuanDropdown.vue -->
<template>
  <div class="dropdown dropdown-end" ref="dropdownRef" data-testid="pengajuan-dropdown">
    <button
      tabindex="0"
      role="button"
      class="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
      :aria-expanded="isOpen"
      aria-controls="pengajuan-menu"
      @click="toggle"
      data-testid="btn-pengajuan-toggle"
    >
      <IconShoppingCart class="w-5 h-5" />
      <span class="hidden md:inline text-sm font-semibold">Pengajuan Baru</span>
      
      <!-- Loading skeleton -->
      <span v-if="store.isLoading" class="w-4 h-4 bg-white/30 rounded-full animate-pulse" />
      
      <!-- Badge -->
      <Badge 
        v-else-if="store.hasPending" 
        :value="store.count" 
        customClass="ml-1"
      />
    </button>
    
    <ul 
      v-show="isOpen"
      id="pengajuan-menu"
      tabindex="0" 
      class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-lg w-56 border border-blue-200"
      data-testid="pengajuan-menu"
    >
      <li class="menu-title text-xs text-gray-500 uppercase tracking-wider px-2">Aksi</li>
      <li>
        <router-link 
          to="/admin/pengajuan/baru" 
          class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all"
          @click="close"
          data-testid="menu-pengajuan-baru"
        >
          <IconPlus class="w-4 h-4" />
          <span class="font-medium">Buat Pengajuan</span>
        </router-link>
      </li>
      
      <li class="menu-title mt-2 text-xs text-gray-500 uppercase tracking-wider px-2">Monitoring</li>
      <li>
        <router-link 
          to="/admin/pengajuan?status_verifikator=0" 
          class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all"
          @click="close"
          data-testid="menu-pengajuan-total"
        >
          <Icon icon="tabler:list" class="w-4 h-4" />
          <span class="font-medium">Semua Pengajuan</span>
          <span v-if="store.hasPending" class="ml-auto badge badge-sm badge-primary">{{ store.count }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconShoppingCart } from '@tabler/icons-vue'
import { usePengajuanStore } from '@/stores/pengajuan'
import Badge from '@/components/UI/badge.vue'
import { useClickOutside } from '@/composables/useClickOutside'

const store = usePengajuanStore()
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggle = () => isOpen.value = !isOpen.value
const close = () => isOpen.value = false

// Close dropdown when clicking outside
useClickOutside(dropdownRef, () => {
  if (isOpen.value) close()
})

// Auto-fetch count on mount
store.fetchCount()
</script>
