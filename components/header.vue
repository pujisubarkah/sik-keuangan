<!-- src/components/layout/Header.vue -->
<template>
  <header class="main-header flex items-center justify-between relative">
    <!-- Sidebar toggle button di perbatasan sidebar-header -->
    <button
      class="sidebar-toggle absolute left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-12 w-12 rounded hover:bg-white/10 transition"
      style="box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
      aria-label="Toggle sidebar"
      type="button"
      aria-expanded="false"
      @click="$emit('toggle-sidebar')"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="2" rx="1" fill="#fff"/>
        <rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/>
        <rect x="4" y="16" width="16" height="2" rx="1" fill="#fff"/>
      </svg>
      <span class="sr-only">Toggle navigation</span>
    </button>
    <div class="header-left flex items-center h-full pl-4">
      <!-- Kosong, bisa diisi logo jika perlu -->
    </div>
    <!-- Navbar -->
    <nav class="navbar flex-1">
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu flex items-center">
        <ul class="nav navbar-nav flex items-center">
          
          <!-- ...existing code... -->

          <!-- User Account Dropdown -->
          <li class="dropdown user-menu" ref="userRef">
            <div class="flex items-center gap-1.5">
              <button
                class="dropdown-toggle user-toggle flex items-center gap-2 p-0"
                @click.stop="toggleUser"
                :aria-expanded="isUserOpen"
                aria-haspopup="true"
                aria-controls="user-menu"
                type="button"
              >
                <div class="user-avatar flex items-center justify-center w-9 h-9 rounded-full bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div class="flex flex-col items-start justify-center">
                  <span class="hidden-xs user-name font-extrabold text-base text-white leading-tight">{{ displayName }}</span>
                  <span class="flex items-center gap-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="#4ade80"><circle cx="10" cy="10" r="8" /></svg>
                    <span class="text-[10px] font-semibold text-white">Online</span>
                  </span>
                </div>
                <i class="idds idds-chevron-down" :class="{ 'rotate-180': isUserOpen }"></i>
              </button>
              <a
                href="/logout"
                class="flex items-center justify-center rounded-full p-2 text-white hover:bg-white/20 transition cursor-pointer"
                style="min-width:32px; min-height:32px;"
                title="Sign out"
                aria-label="Sign out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 8v-2a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h12m0 0l-4-4m4 4l-4 4" />
                </svg>
              </a>
            </div>
            
            <ul 
              v-show="isUserOpen"
              id="user-menu"
              class="dropdown-menu user-dropdown"
              role="menu"
            >
              <!-- User Header -->
              <li class="user-header">
                <div class="user-avatar-large flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p class="user-info">
                  <span class="user-info-name">{{ displayName }}</span>
                  <span class="user-info-role">{{ displayRole }}</span>
                </p>
              </li>
              
              <!-- Menu Footer -->
              <li class="user-footer">
                <div class="footer-btn-group">
                  <NuxtLink 
                    to="/users" 
                    class="btn-profile"
                    @click="closeUser"
                    role="menuitem"
                  >
                    <i class="idds idds-user"></i>
                    Profile
                  </NuxtLink>
                </div>
              </li>
            </ul>
          </li>
          
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/stores/user'

const props = defineProps({
  rail: { 
    type: Boolean, 
    default: false 
  }
})

defineEmits(['toggle-sidebar'])

// State
const isUserOpen = ref(false)
const isPengajuanOpen = ref(false)
const userRef = ref(null)
const pengajuanRef = ref(null)

const userStore = useUserStore()

const displayName = computed(() => userStore.username || userStore.name || 'User')
const displayRole = computed(() => userStore.role || 'User')

// Toggle methods
const togglePengajuan = () => {
  isPengajuanOpen.value = !isPengajuanOpen.value
  if (isUserOpen.value) isUserOpen.value = false
}
const closePengajuan = () => { isPengajuanOpen.value = false }

const toggleUser = () => {
  isUserOpen.value = !isUserOpen.value
  if (isPengajuanOpen.value) isPengajuanOpen.value = false
}
const closeUser = () => { isUserOpen.value = false }

// Click outside handler
const handleClickOutside = (event) => {
  if (pengajuanRef.value && !pengajuanRef.value.contains(event.target)) {
    closePengajuan()
  }
  if (userRef.value && !userRef.value.contains(event.target)) {
    closeUser()
  }
}

onMounted(() => {
  if (!userStore.username) {
    userStore.hydrateFromStorage()
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== UTILITIES ===== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== MAIN HEADER ===== */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px; /* 3.5rem = 56px */
  background: #1f4f85; /* brandBlue-700 */
  border-bottom: 1px solid #1f4f85;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 1000;
  margin: 0;
  padding: 0;
}

/* ===== LOGO ===== */
.logo {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: #1f4f85; /* sidebar color now */
  color: white;
  text-decoration: none;
  transition: background 0.2s;
  min-width: 230px;
  border-right: 1px solid #f3f4f6;
}

.logo:hover {
  background: #1f4f85; /* match header */
}

.logo-lg {
  font-size: 18px;
  font-weight: bold;
  color: white;
  letter-spacing: 0.5px;
}

/* ===== NAVBAR ===== */
.navbar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #1f4f85; /* brandBlue-700 */
  color: white;
  height: 56px;
  padding: 0;
  margin: 0;
}

/* ===== SIDEBAR TOGGLE ===== */
.sidebar-toggle {
  width: 48px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #1f4f85;
  cursor: pointer;
  transition: all 0.2s;
  border-right: none;
}

.sidebar-toggle:hover {
  background: #e5e7eb; /* light gray hover */
  color: #1f4f85;
}

.sidebar-toggle:focus {
  outline: 2px solid #4ade80;
  outline-offset: -2px;
}

/* ===== NAVBAR RIGHT ===== */
.navbar-custom-menu {
  margin-left: auto;
  padding-right: 16px;
}

.nav.navbar-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ===== DROPDOWN ===== */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-toggle:focus {
  outline: 2px solid #5B9BD5;
  outline-offset: 2px;
}

.dropdown-toggle i:first-child {
  color: #5B9BD5; /* brandBlue-400 */
  font-size: 18px;
}

/* Badge Notification */
.badge-notification {
  background: #3781C7; /* brandBlue-500 */
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
  animation: pulse-once 0.3s ease-in-out;
}

@keyframes pulse-once {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* ===== USER TOGGLE ===== */
.user-toggle {
  padding: 2px 6px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #5B9BD5; /* brandBlue-400 */
  background: #1F4F85; /* brandBlue-700 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-name {
  font-weight: 500;
  color: white;
}

/* ===== DROPDOWN MENU ===== */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 224px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  padding: 4px 0;
  z-index: 50;
  list-style: none;
  margin: 0;
  animation: slideDown 0.15s ease-out;
}

.user-dropdown {
  width: 288px;
  padding: 0;
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-8px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.dropdown-menu li a,
.dropdown-menu li > a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
}

.dropdown-menu li a:hover {
  background: #eff6ff; /* blue-50 */
  color: #1e3a8a; /* blue-900 */
}

.dropdown-menu li a i {
  color: #3b82f6; /* blue-500 */
}

/* ===== USER HEADER ===== */
.user-header {
  background: #1e3a8a; /* blue-900 */
  padding: 16px;
  text-align: center;
}

.user-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid white;
  background: #1F4F85; /* brandBlue-700 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 24px;
}

.user-info {
  margin-top: 8px;
  color: white;
}

.user-info-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
}

.user-info-role {
  display: block;
  font-size: 12px;
  color: #94BDE5; /* brandBlue-300 */
  text-transform: capitalize;
}

/* ===== USER FOOTER ===== */
.user-footer {
  background: #f9fafb; /* gray-50 */
  padding: 12px 16px;
}

.footer-btn-group {
  display: flex;
  gap: 8px;
}

.btn-profile,
.btn-logout {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-profile:hover {
  background: #f3f4f6;
}

.btn-logout:hover {
  background: #fef2f2; /* red-50 */
  border-color: #fca5a5; /* red-300 */
  color: #dc2626; /* red-600 */
}

/* ===== RESPONSIVE ===== */
.hidden-xs {
  display: none;
}

@media (min-width: 768px) {
  .hidden-xs {
    display: inline;
  }
}

.hidden-sm {
  display: inline;
}

@media (min-width: 992px) {
  .hidden-sm {
    display: inline;
  }
}

/* ===== ICON ANIMATION ===== */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease-in-out;
}

i {
  transition: transform 0.2s;
}

/* Tambahkan di style scoped header.vue atau global CSS */
.sidebar-toggle i {
  color: #1f4f85; /* dark icon */
  font-size: 24px;
}

.sidebar-toggle {
  background: none;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.sidebar-toggle svg {
  display: block;
}
</style>
