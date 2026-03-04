<!-- src/components/layout/UserMenuDropdown.vue -->
<template>
  <div class="dropdown dropdown-end" ref="dropdownRef" data-testid="user-dropdown">
    <button
      tabindex="0"
      role="button"
      class="flex items-center gap-3 bg-gradient-to-r from-blue-800 to-blue-950 rounded-lg shadow-lg px-4 py-2 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      :aria-expanded="isOpen"
      aria-controls="user-menu"
      @click="toggle"
      data-testid="btn-user-toggle"
    >
      <Icon icon="tabler:user-circle" class="w-7 h-7 text-green-400" />
      <div class="hidden md:flex flex-col items-start">
        <span class="font-bold text-sm text-white">{{ username }}</span>
        <span class="flex items-center text-xs text-green-400">
          <Icon icon="tabler:point-filled" class="w-3 h-3 mr-0.5 animate-pulse" />
          Online
        </span>
      </div>
      <Icon icon="tabler:chevron-down" class="w-4 h-4 text-white transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <ul 
      v-show="isOpen"
      id="user-menu"
      tabindex="0" 
      class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-lg w-52 border border-blue-200"
      data-testid="user-menu"
    >
      <li v-if="showAdminMenu">
        <router-link 
          to="/admin/users" 
          class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all"
          @click="close"
          data-testid="menu-user-data"
        >
          <Icon icon="tabler:users" class="w-4 h-4" />
          <span class="font-medium">Data User</span>
        </router-link>
      </li>
      
      <li class="border-t border-blue-100 my-1" />
      
      <li>
        <a 
          href="/logout" 
          class="text-blue-900 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white rounded-md transition-all"
          data-testid="menu-logout"
        >
          <Icon icon="tabler:logout" class="w-4 h-4" />
          <span class="font-medium">Logout</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useClickOutside } from '@/composables/useClickOutside'

const userStore = useUserStore()
const { username, role } = storeToRefs(userStore)

const isOpen = ref(false)
const dropdownRef = ref(null)

const showAdminMenu = computed(() => 
  ['admin', 'superadmin'].includes(role.value?.toLowerCase())
)

const toggle = () => isOpen.value = !isOpen.value
const close = () => isOpen.value = false

useClickOutside(dropdownRef, () => {
  if (isOpen.value) close()
})
</script>