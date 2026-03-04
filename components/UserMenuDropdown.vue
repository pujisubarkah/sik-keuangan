<template>
  <div class="dropdown dropdown-end">
    <button
      tabindex="0"
      class="flex items-center gap-3 bg-gradient-to-r from-blue-800 to-blue-950 rounded-lg shadow-lg px-4 py-2 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 border border-blue-700"
    >
      <Icon icon="tabler:user-circle" class="w-7 h-7 text-green-400" />
      <div class="hidden md:flex flex-col items-start">
        <span class="font-bold text-sm text-white">{{ username }}</span>
        <span class="flex items-center text-xs text-green-400">
          <Icon icon="tabler:point-filled" class="w-3 h-3 mr-0.5" />
          Online
        </span>
      </div>
      <Icon icon="tabler:chevron-down" class="w-4 h-4 text-white" />
    </button>
    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-lg w-52 border border-blue-200">
      <li>
        <a href="/admin/users" class="text-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-md transition-all">
          <Icon icon="tabler:user" class="w-4 h-4" />
          <span class="font-medium">Data User</span>
        </a>
      </li>
      <li>
        <a href="/logout" class="text-blue-900 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white rounded-md transition-all">
          <Icon icon="tabler:logout" class="w-4 h-4" />
          <span class="font-medium">Logout</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const username = computed(() => userStore?.username || 'User')
</script>
