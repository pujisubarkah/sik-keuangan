<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\sidebar.vue -->
<template>
  <aside :class="['main-sidebar', 'bg-blue-900', 'text-white', 'min-h-screen', 'flex', 'flex-col', 'overflow-hidden', { rail }]">
      <!-- User Panel Section -->
      <div v-if="!rail" class="user-panel flex items-center p-4 mb-4 bg-blue-950 rounded-lg shadow mx-2">
        <div class="pull-left image mr-3">
          <Icon icon="mdi:account-circle" class="w-12 h-12 text-green-400" />
        </div>
        <div class="pull-left info">
          <p class="font-semibold mb-1">{{ username }}</p>
          <a href="#" class="flex items-center text-xs text-green-400">
            <Icon icon="fa:circle" class="w-3 h-3 text-success mr-1" /> Online
          </a>
        </div>
      </div>

      <!-- Rail Mode Avatar -->
      <div v-else class="flex justify-center p-4">
        <div class="avatar">
          <div class="w-8 rounded-full">
            <img :src="`https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff&size=32`" alt="User" />
          </div>
        </div>
      </div>

      <!-- Search Form -->
      <form v-if="!rail" class="sidebar-form px-4 mb-4">
        <div class="flex rounded overflow-hidden bg-blue-800">
          <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-1 px-3 py-2 bg-blue-800 text-white focus:outline-none placeholder-blue-300" />
          <button type="submit" class="px-3 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
            </svg>
          </button>
        </div>
      </form>

      <div class="divider my-2" v-if="!rail"></div>

    


      <!-- Navigation Menu -->
      <ul class="sidebar-menu flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-950" :style="{maxHeight: 'calc(100vh - 18rem)'}">
        <li v-if="!rail" class="header text-xs text-green-300 tracking-wider py-2">MENU NAVIGASI</li>
        <template v-for="(item, index) in menuItems.filter(i => i.group === 'navigation')" :key="'nav-' + index">
          <li v-if="item.children && item.children.length > 0">
            <div class="menu-item-group">
              <div class="flex items-center py-2 px-3 hover:bg-blue-800 rounded cursor-pointer" @click="toggleSubmenu(index)">
                <Icon :icon="item.icon" class="w-5 h-5" />
                <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
                <Icon v-if="!rail" :icon="openMenus.includes(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 ml-auto transition-transform" />
              </div>
              <ul v-if="openMenus.includes(index)" class="ml-4 mt-1 space-y-1">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <router-link :to="child.to" class="flex items-center py-1 px-3 hover:bg-blue-800 rounded text-sm">
                    <Icon :icon="child.icon" class="w-4 h-4" />
                    <span v-if="!rail" class="ml-2 block">{{ child.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li v-else>
            <router-link :to="item.to" class="flex items-center py-2 px-3 hover:bg-blue-800 rounded">
              <Icon :icon="item.icon" class="w-5 h-5" />
              <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
            </router-link>
          </li>
        </template>
        <li v-if="!rail && menuItems.some(i => i.group === 'admin')" class="header text-xs text-green-300 tracking-wider py-2 mt-2">MENU ADMIN</li>
        <template v-for="(item, index) in menuItems.filter(i => i.group === 'admin')" :key="'admin-' + index">
          <li v-if="item.children && item.children.length > 0">
            <div class="menu-item-group">
              <div class="flex items-center py-2 px-3 hover:bg-blue-800 rounded cursor-pointer" @click="toggleSubmenu('admin-' + index)">
                <Icon :icon="item.icon" class="w-5 h-5" />
                <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
                <Icon v-if="!rail" :icon="openMenus.includes('admin-' + index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 ml-auto transition-transform" />
              </div>
              <ul v-if="openMenus.includes('admin-' + index)" class="ml-4 mt-1 space-y-1">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <router-link :to="child.to" class="flex items-center py-1 px-3 hover:bg-blue-800 rounded text-sm">
                    <Icon :icon="child.icon" class="w-4 h-4" />
                    <span v-if="!rail" class="ml-2 block">{{ child.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li v-else>
            <router-link :to="item.to" class="flex items-center py-2 px-3 hover:bg-blue-800 rounded">
              <Icon :icon="item.icon" class="w-5 h-5" />
              <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </aside>
</template>

<script>
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { getMenuItems } from '~/layouts/menu-config.js';

export default {
  name: 'Sidebar',
  components: {
    Icon
  },
  props: {
    userRole: {
      type: String,
      default: 'admin'
    },
    rail: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const userStore = useUserStore();
    const { username, role, role_id } = storeToRefs(userStore);
    return { username, role, role_id };
  },
  data() {
    return {
      searchQuery: '',
      openMenus: [] // Array to track which menus are open
    }
  },
  computed: {
    sidebarClass() {
      return this.rail ? 'w-16' : 'w-64'
    },
    menuItems() {
      // Gunakan role dari Pinia userStore sebagai slug dan pass role_id
      return getMenuItems(this.role, this.username, this.role_id)
    }
  },
  methods: {
    toggleSubmenu(index) {
      const menuIndex = this.openMenus.indexOf(index);
      if (menuIndex > -1) {
        this.openMenus.splice(menuIndex, 1);
      } else {
        this.openMenus.push(index);
      }
    }
  }
}
</script>

<style scoped>
.main-sidebar {
  transition: width 0.3s;
  width: 16rem;
}
.main-sidebar.rail {
  width: 4.5rem;
}
.sidebar-menu {
  /* Custom scrollbar for sidebar */
  scrollbar-width: thin;
  scrollbar-color: #1e3a8a #172554;
}
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}
.sidebar-menu::-webkit-scrollbar-thumb {
  background: #1e3a8a;
  border-radius: 4px;
}
.sidebar-menu::-webkit-scrollbar-track {
  background: #172554;
}
.main-sidebar {
  position: fixed;
  top: 3.5rem;
  left: 0;
  height: calc(100vh - 3.5rem);
  z-index: 30;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}
.user-panel img {
  width: 48px;
  height: 48px;
}
.sidebar-menu .header {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.sidebar-menu li a.router-link-active {
  background-color: #16a34a;
  color: #fff;
}
.sidebar-form input::placeholder {
  color: #93c5fd;
}
.sidebar-menu {
  overflow-y: auto;
  max-height: calc(100vh - 18rem);
}
</style>