<!-- src/components/Sidebar.vue -->
<template>
  <aside 
    :class="['main-sidebar', 'bg-[#1f4f85]', 'text-white', 'flex', 'flex-col', 'overflow-hidden', { rail }]"
    role="navigation"
    aria-label="Main Navigation"
  >
    <!-- User Panel Section -->
    <div v-if="!rail" class="user-panel flex items-center p-4 mb-2 bg-white rounded-lg shadow mx-2">
      <div class="pull-left image mr-3 flex-shrink-0">
        <Icon icon="mdi:account-circle" class="w-12 h-12 text-brandBlue-400" />
      </div>
      <div class="pull-left info overflow-hidden">
        <p class="font-semibold mb-1 text-sm truncate">{{ username }}</p>
        <a href="#" class="flex items-center text-xs text-brandBlue-400">
          <Icon icon="fa:circle" class="w-3 h-3 mr-1 flex-shrink-0" /> 
          <span class="truncate">Online</span>
        </a>
      </div>
    </div>

    <!-- Search Form -->
    <form v-if="!rail" class="sidebar-form px-4 mb-2" @submit.prevent>
      <div class="flex rounded overflow-hidden bg-gray-200">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search..." 
          class="flex-1 px-3 py-2 bg-gray-200 text-white focus:outline-none placeholder-white text-sm"
          aria-label="Search menu"
        />
        <button type="submit" class="px-3 text-white hover:text-gray-300 flex items-center justify-center" aria-label="Submit search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
          </svg>
        </button>
      </div>
    </form>

    <div class="divider my-2 border-t border-gray-300 mx-2" v-if="!rail"></div>

    <!-- Navigation Menu -->
    <ul class="sidebar-menu flex-1 px-2 overflow-y-auto">
      
      <!-- Navigation Group Header -->
      <li v-if="!rail" class="header text-xs text-brandBlue-300 tracking-wider py-2 px-3 font-semibold">MENU NAVIGASI</li>
      
      <!-- Navigation Group Items -->
      <template v-for="(item, index) in menuItems.filter(i => i.group === 'navigation')" :key="'nav-' + index">
        
        <!-- Parent Menu with Children -->
        <li v-if="item.children && item.children.length > 0">
          <div class="menu-item-group">
            <button 
              class="menu-parent flex items-center justify-between w-full py-2.5 px-3 hover:bg-brandBlue-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
              @click="toggleSubmenu('nav-' + index)"
              :aria-expanded="openMenus.includes('nav-' + index)"
              type="button"
            >
              <!-- Icon + Title Container -->
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0 text-brandBlue-400" />
                <span v-if="!rail" class="text-sm font-medium truncate">{{ item.title }}</span>
              </div>
              <!-- Chevron Icon -->
              <Icon 
                v-if="!rail" 
                :icon="openMenus.includes('nav-' + index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                class="w-4 h-4 flex-shrink-0 transition-transform duration-200" 
              />
            </button>
            
            <!-- Submenu -->
            <transition name="slide">
              <ul v-if="openMenus.includes('nav-' + index)" class="submenu ml-4 mt-1 space-y-0.5">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <NuxtLink 
                    :to="child.to" 
                    class="submenu-item flex items-center gap-3 py-2 px-3 hover:bg-brandBlue-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
                    active-class="bg-brandBlue-600 text-white"
                    @click="closeAllSubmenus"
                  >
                    <Icon :icon="child.icon" class="w-4 h-4 flex-shrink-0 text-brandBlue-400" />
                    <span v-if="!rail" class="truncate">{{ child.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </transition>
          </div>
        </li>
        
        <!-- Single Menu Item (No Children) -->
        <li v-else>
          <NuxtLink 
            :to="item.to" 
            class="menu-item flex items-center gap-3 py-2.5 px-3 hover:bg-brandBlue-800 rounded focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
            active-class="bg-brandBlue-600 text-white"
          >
            <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0 text-brandBlue-400" />
            <span v-if="!rail" class="text-sm font-medium truncate">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </template>
      
      <!-- Admin Group Header -->
      <li v-if="!rail && menuItems.some(i => i.group === 'admin')" class="header text-xs text-brandBlue-300 tracking-wider py-2 px-3 mt-4 font-semibold">MENU ADMIN</li>
      
      <!-- Admin Group Items -->
      <template v-for="(item, index) in menuItems.filter(i => i.group === 'admin')" :key="'admin-' + index">
        
        <!-- Parent Menu with Children -->
        <li v-if="item.children && item.children.length > 0">
          <div class="menu-item-group">
            <button 
              class="menu-parent flex items-center justify-between w-full py-2.5 px-3 hover:bg-brandBlue-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
              @click="toggleSubmenu('admin-' + index)"
              :aria-expanded="openMenus.includes('admin-' + index)"
              type="button"
            >
              <!-- Icon + Title Container -->
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0 text-brandBlue-400" />
                <span v-if="!rail" class="text-sm font-medium truncate">{{ item.title }}</span>
              </div>
              <!-- Chevron Icon -->
              <Icon 
                v-if="!rail" 
                :icon="openMenus.includes('admin-' + index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                class="w-4 h-4 flex-shrink-0 transition-transform duration-200" 
              />
            </button>
            
            <!-- Submenu -->
            <transition name="slide">
              <ul v-if="openMenus.includes('admin-' + index)" class="submenu ml-4 mt-1 space-y-0.5">
                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                  <NuxtLink 
                    :to="child.to" 
                    class="submenu-item flex items-center gap-3 py-2 px-3 hover:bg-brandBlue-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
                    active-class="bg-brandBlue-600 text-white"
                    @click="closeAllSubmenus"
                  >
                    <Icon :icon="child.icon" class="w-4 h-4 flex-shrink-0 text-brandBlue-400" />
                    <span v-if="!rail" class="truncate">{{ child.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </transition>
          </div>
        </li>
        
        <!-- Single Menu Item (No Children) -->
        <li v-else>
          <NuxtLink 
            :to="item.to" 
            class="menu-item flex items-center gap-3 py-2.5 px-3 hover:bg-brandBlue-800 rounded focus:outline-none focus:ring-2 focus:ring-brandBlue-400 transition-colors"
            active-class="bg-brandBlue-600 text-white"
          >
            <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0 text-brandBlue-400" />
            <span v-if="!rail" class="text-sm font-medium truncate">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </template>
    </ul>
  </aside>
</template>

<script>
import Icon from '~/components/Icon.vue'
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
    },
    closeAllSubmenus() {
      // Optional: close all submenus when navigating
      // this.openMenus = [];
    }
  }
}
</script>

<style scoped>
/* ===== MAIN SIDEBAR ===== */
.main-sidebar {
  transition: width 0.3s ease;
  width: 230px;
  position: fixed;
  top: 3.5rem; /* 56px = sama dengan header height */
  left: 0;
  height: calc(100vh - 3.5rem);
  z-index: 30;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  margin: 0;
  padding: 0;
}

/* Rail Mode */
.main-sidebar.rail {
  width: 72px; /* 4.5rem */
}

/* ===== SCROLLBAR CUSTOM ===== */
.sidebar-menu {
  /* hide scrollbar visually but keep scrolling */
  scrollbar-width: none; /* Firefox */
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu::-webkit-scrollbar {
  width: 0; /* hide on webkit */
}

/* thumb and track rules can remain but will not be visible */
.sidebar-menu::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

/* ===== USER PANEL ===== */
.user-panel {
  margin: 8px;
}

.user-panel .image {
  flex-shrink: 0;
}

.user-panel .info {
  overflow: hidden;
  min-width: 0;
}

.user-panel .info p,
.user-panel .info a span {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== MENU HEADER ===== */
.sidebar-menu .header {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 12px;
}

/* ===== MENU ITEM ALIGNMENT - FIX UTAMA ===== */
.menu-parent,
.menu-item,
.submenu-item {
  display: flex;
  align-items: center;  /* âœ… Vertikal center */
  justify-content: flex-start;
  gap: 12px;            /* âœ… Jarak icon-text konsisten */
  width: 100%;
}

/* Icon styling */
.menu-parent i,
.menu-item i,
.submenu-item i {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  line-height: 1;
}

/* Text styling - âœ… BUKAN 'block' */
.menu-parent span,
.menu-item span,
.submenu-item span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.25;
  vertical-align: middle;
}

/* Parent container untuk icon+text */
.menu-parent > div:first-child,
.menu-item,
.submenu-item {
  min-width: 0; /* âœ… Penting untuk truncate bekerja */
}

/* Submenu styling */
.submenu {
  padding-left: 8px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Active state */
.menu-item.router-link-active,
.menu-item.nuxt-link-active,
.submenu-item.router-link-active,
.submenu-item.nuxt-link-active {
  background-color: #16a34a; /* green-600 */
  color: #fff;
}

.menu-item.router-link-active i,
.menu-item.nuxt-link-active i,
.submenu-item.router-link-active i,
.submenu-item.nuxt-link-active i {
  color: #fff;
}

/* ===== SEARCH FORM ===== */
.sidebar-form input::placeholder {
  color: #93c5fd; /* blue-300 */
}

.sidebar-form input:focus {
  background: #1e40af; /* blue-800 */
}

/* ===== DIVIDER ===== */
.divider {
  margin: 8px 8px;
}

/* ===== RAIL MODE ADJUSTMENTS ===== */
.main-sidebar.rail .user-panel,
.main-sidebar.rail .sidebar-form,
.main-sidebar.rail .divider,
.main-sidebar.rail .header {
  display: none;
}

.main-sidebar.rail .sidebar-menu {
  padding: 8px;
}

/* Hide text in rail mode */
.main-sidebar.rail .menu-parent span,
.main-sidebar.rail .menu-item span,
.main-sidebar.rail .submenu-item span {
  display: none;
}

/* Center icons in rail mode */
.main-sidebar.rail .menu-parent,
.main-sidebar.rail .menu-item,
.main-sidebar.rail .submenu-item {
  justify-content: center;
  padding: 12px;
  gap: 0;
}

/* Submenu popup in rail mode */
.main-sidebar.rail .menu-item-group {
  position: relative;
}

.main-sidebar.rail .submenu {
  position: absolute;
  left: 100%;
  top: 0;
  background: #1e3a8a;
  border-radius: 0 4px 4px 0;
  padding: 8px 0;
  min-width: 200px;
  display: none;
  z-index: 40;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.main-sidebar.rail .menu-item-group:hover .submenu {
  display: block;
}

.main-sidebar.rail .submenu-item {
  justify-content: flex-start;
  padding: 8px 16px;
}

.main-sidebar.rail .submenu-item span {
  display: inline-block;
}
</style>
