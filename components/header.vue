<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\Header.vue -->
<template>
  <div class="navbar bg-primary text-primary-content fixed top-0 left-0 right-0 z-50 shadow-lg">
    <div class="navbar-start">
      <!-- Logo -->
      <div class="font-bold text-xl px-4">
        SIK LAN
      </div>

      <!-- Sidebar toggle button -->
      <button
        class="btn btn-ghost btn-circle text-primary-content"
        @click="toggleSidebar"
      >
        <Icon :icon="rail ? 'mdi:chevron-right' : 'mdi:menu'" class="w-6 h-6" />
      </button>
    </div>

    <div class="navbar-end">
      <!-- Pengajuan Baru Menu -->
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost text-primary-content gap-2"
        >
          <Icon icon="mdi:cart" class="w-5 h-5" />
          Pengajuan Baru
          <div v-if="pengajuanCount > 0" class="badge badge-success badge-sm">{{ pengajuanCount }}</div>
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">

        </ul>
      </div>

      <!-- User Menu -->
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost text-primary-content gap-2"
        >
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img :src="`https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff&size=32`" alt="User" />
            </div>
          </div>
          <span class="hidden sm:inline">{{ username }}</span>
          <Icon icon="mdi:chevron-down" class="w-4 h-4" />
        </button>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li class="menu-title">
            <div class="flex flex-col items-center py-4">
              <div class="avatar mb-2">
                <div class="w-16 rounded-full">
                  <img :src="`https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff&size=64`" alt="User" />
                </div>
              </div>
              <p class="font-semibold">{{ username }}</p>
            </div>
          </li>
          <li><hr class="my-1"></li>
          <li class="px-4 py-2">
            <div class="flex gap-2">

              <button class="btn btn-outline btn-sm flex-1" @click="logout">
                Sign out
              </button>
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
    const { username } = storeToRefs(userStore);
    return { userStore, username };
  },
  data() {
    return {
      pengajuanCount: 0,
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    },
    logout() {
      // Implementasi logout
      this.$router.push('/login')
    }
  },
  mounted() {
    // Load pengajuan count - bisa dari API
    // this.loadPengajuanCount()
  }
}
</script>
