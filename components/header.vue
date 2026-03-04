<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\Header.vue -->
<template>
  <div class="navbar bg-blue-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg min-h-0 h-20 flex items-center px-4">
    <div class="flex items-center flex-1 min-w-0">
      <!-- Sidebar toggle button -->
      <button
        class="btn btn-ghost btn-sm btn-circle text-white hover:bg-blue-800 mr-2"
        @click="toggleSidebar"
        aria-label="Toggle Sidebar"
      >
        <Icon :icon="rail ? 'tabler:chevron-right' : 'tabler:menu'" class="w-5 h-5" />
      </button>
      <!-- Logo -->
      <div class="font-bold text-lg flex items-center gap-2 whitespace-nowrap">
        <span class="text-green-400">SIK</span>
        <span>LAN</span>
      </div>
    </div>
    <div class="flex items-center gap-4 ml-auto">
      <!-- Pengajuan Baru Menu -->
      <div class="dropdown dropdown-end flex items-center">
        <button
          tabindex="0"
          class="btn btn-ghost btn-sm text-white gap-2 hover:bg-blue-800 flex items-center"
        >
          <Icon icon="tabler:shopping-cart" class="w-5 h-5" />
          <span class="hidden sm:inline">Pengajuan Baru</span>
          <div v-if="pengajuanCount > 0" class="badge badge-success badge-sm">{{ pengajuanCount }}</div>
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
          <!-- Tambahkan item pengajuan di sini jika ada -->
        </ul>
      </div>

      <!-- User Menu (panel style) -->
      <div class="dropdown dropdown-end flex items-center">
        <button
          tabindex="0"
          class="btn btn-ghost btn-sm text-white gap-2 hover:bg-blue-800 flex items-center"
        >
          <div class="user-panel flex items-center bg-blue-950 rounded-lg shadow px-3 py-1">
            <div class="pull-left image mr-2">
              <Icon icon="mdi:account-circle" class="w-8 h-8 text-green-400" />
            </div>
            <div class="pull-left info flex flex-col items-start">
              <span class="font-semibold leading-tight text-sm">{{ username }}</span>
              <span class="flex items-center text-xs text-green-400">
                <Icon icon="fa:circle" class="w-3 h-3 text-success mr-1" /> Online
              </span>
            </div>
          </div>
          <Icon icon="tabler:chevron-down" class="w-4 h-4 ml-1" />
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export default {
  name: 'Header',
  components: {
    Icon
  },
  props: {
    rail: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const userStore = useUserStore();
    const { username, role } = storeToRefs(userStore);
    return { userStore, username, role };
  },
  data() {
    return {
      pengajuanCount: 0,
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    }
  },
  mounted() {
    // Load pengajuan count - bisa dari API
    // this.loadPengajuanCount()
  }
}
</script>
