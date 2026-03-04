<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\Header.vue -->
<template>
  <div class="navbar bg-blue-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg min-h-0 h-14 py-0">
    <div class="navbar-start">
      <!-- Logo -->
      <div class="font-bold text-lg px-3 flex items-center gap-2">
        <span class="text-green-400">SIK</span>
        <span>LAN</span>
      </div>

      <!-- Sidebar toggle button -->
      <button
        class="btn btn-ghost btn-sm btn-circle text-white hover:bg-blue-800"
        @click="toggleSidebar"
      >
        <Icon :icon="rail ? 'mdi:chevron-right' : 'mdi:menu'" class="w-5 h-5" />
      </button>
    </div>

    <div class="navbar-end">
      <!-- Pengajuan Baru Menu -->
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost btn-sm text-white hover:bg-blue-800 gap-2"
        >
          <Icon icon="mdi:cart" class="w-4 h-4" />
          <span class="text-sm">Pengajuan Baru</span>
          <div v-if="pengajuanCount > 0" class="badge bg-green-500 text-white border-green-600 badge-xs">{{ pengajuanCount }}</div>
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">

        </ul>
      </div>

      <!-- User Menu -->
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost btn-sm text-white hover:bg-blue-800 gap-2"
        >
          <Icon icon="mdi:account-circle" class="w-5 h-5" />
          <span class="text-sm">{{ username }}</span>
          <Icon icon="mdi:chevron-down" class="w-3 h-3" />
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li class="menu-title">
            <div class="flex flex-col items-center py-3">
              <p class="font-semibold text-base">{{ username }}</p>
            </div>
          </li>
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
