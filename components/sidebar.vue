<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\sidebar.vue -->
<template>
  <aside :class="['main-sidebar', 'bg-gray-800', 'text-white', 'min-h-screen', 'flex', 'flex-col', 'overflow-hidden', { rail }]">
      <!-- Header Section -->
      <div class="user-panel flex items-center p-4 mb-4 bg-gray-900 rounded-lg shadow">
        <div class="pull-left image mr-3">
          <Icon icon="mdi:account-circle" class="w-12 h-12 text-blue-400" />
        </div>
        <div class="pull-left info">
          <p class="font-semibold mb-1">{{ username }}</p>
          <a href="#" class="flex items-center text-xs text-green-400">
            <Icon icon="fa:circle" class="w-3 h-3 text-success mr-1" /> Online
          </a>
        </div>
      </div>
      <form class="sidebar-form px-4 mb-4" v-if="!rail">
        <div class="user-panel flex items-center p-4 mb-4 bg-gray-900 rounded-lg shadow">
          <div class="pull-left image mr-3">
            <Icon icon="mdi:account-circle" class="w-12 h-12 text-blue-400" />
          </div>
          <div class="pull-left info">
            <p class="font-semibold mb-1">{{ username }}</p>
            <a href="#" class="flex items-center text-xs text-green-400">
              <Icon icon="fa:circle" class="w-3 h-3 text-success mr-1" /> Online
            </a>
          </div>
        </div>
        <div class="flex rounded overflow-hidden bg-gray-700">
          <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-1 px-3 py-2 bg-gray-700 text-white focus:outline-none" />
          <button type="submit" class="px-3 text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" /></svg></button>
        </div>
      </form>

      <!-- Rail Mode Avatar -->
      <div class="flex justify-center p-4" v-else>
        <div class="avatar">
          <div class="w-8 rounded-full">
            <img :src="`https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff&size=32`" alt="User" />
          </div>
        </div>
      </div>

      <div class="divider my-2" v-if="!rail"></div>

    


      <!-- Navigation Menu -->
      <ul class="sidebar-menu flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" :style="{maxHeight: 'calc(100vh - 120px)'}">
        <li v-if="!rail" class="header text-xs text-gray-400 tracking-wider py-2">MENU NAVIGASI</li>
        <template v-for="(item, index) in menuItems.filter(i => i.group === 'navigation')" :key="'nav-' + index">
          <li v-if="item.children && item.children.length > 0">
            <div class="menu-item-group">
              <div class="flex items-center py-2 px-3 hover:bg-gray-700 rounded cursor-pointer" @click="toggleSubmenu(index)">
                <Icon :icon="item.icon" class="w-5 h-5" />
                <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
                <Icon v-if="!rail" :icon="openMenus.includes(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 ml-auto transition-transform" />
              </div>
              <ul v-if="openMenus.includes(index)" class="ml-4 mt-1 space-y-1">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <router-link :to="child.to" class="flex items-center py-1 px-3 hover:bg-gray-700 rounded text-sm">
                    <Icon :icon="child.icon" class="w-4 h-4" />
                    <span v-if="!rail" class="ml-2 block">{{ child.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li v-else>
            <router-link :to="item.to" class="flex items-center py-2 px-3 hover:bg-gray-700 rounded">
              <Icon :icon="item.icon" class="w-5 h-5" />
              <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
            </router-link>
          </li>
        </template>
        <li v-if="!rail && menuItems.some(i => i.group === 'admin')" class="header text-xs text-gray-400 tracking-wider py-2 mt-2">MENU ADMIN</li>
        <template v-for="(item, index) in menuItems.filter(i => i.group === 'admin')" :key="'admin-' + index">
          <li v-if="item.children && item.children.length > 0">
            <div class="menu-item-group">
              <div class="flex items-center py-2 px-3 hover:bg-gray-700 rounded cursor-pointer" @click="toggleSubmenu('admin-' + index)">
                <Icon :icon="item.icon" class="w-5 h-5" />
                <span v-if="!rail" class="ml-2 block">{{ item.title }}</span>
                <Icon v-if="!rail" :icon="openMenus.includes('admin-' + index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 ml-auto transition-transform" />
              </div>
              <ul v-if="openMenus.includes('admin-' + index)" class="ml-4 mt-1 space-y-1">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <router-link :to="child.to" class="flex items-center py-1 px-3 hover:bg-gray-700 rounded text-sm">
                    <Icon :icon="child.icon" class="w-4 h-4" />
                    <span v-if="!rail" class="ml-2 block">{{ child.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li v-else>
            <router-link :to="item.to" class="flex items-center py-2 px-3 hover:bg-gray-700 rounded">
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
  scrollbar-color: #374151 #111827;
}
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}
.sidebar-menu::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}
.sidebar-menu::-webkit-scrollbar-track {
  background: #111827;
}
.main-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
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
  background-color: #2563eb;
  color: #fff;
}
.sidebar-form input::placeholder {
  color: #a1a1aa;
}
.sidebar-menu {
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}
</style>