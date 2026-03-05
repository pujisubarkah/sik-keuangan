<!-- src/components/layout/Header.vue -->
<template>
  <header class="main-header">
    <div class="header-left">
      <span class="logo" aria-label="SIK-LAN Dashboard">
        <span class="logo-lg">
          <span class="text-green-400">SIK</span>LAN
        </span>
      </span>
    </div>
    <!-- Navbar -->
    <nav class="navbar">
      
      <!-- Sidebar toggle button -->
           <button
      class="sidebar-toggle"
      aria-label="Toggle sidebar"
      type="button"
      aria-expanded="false"
      @click="$emit('toggle-sidebar')"
    >
      <!-- Icon tiga garis vertikal putih -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="2" rx="1" fill="#fff"/>
        <rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/>
        <rect x="4" y="16" width="16" height="2" rx="1" fill="#fff"/>
      </svg>
      <span class="sr-only">Toggle navigation</span>
    </button>

      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          
          <!-- Pengajuan Baru Dropdown -->
          <li class="dropdown notifications-menu" ref="pengajuanRef">
            <button
              class="dropdown-toggle"
              @click.stop="togglePengajuan"
              :aria-expanded="isPengajuanOpen"
              aria-haspopup="true"
              aria-controls="pengajuan-menu"
              type="button"
            >
              <i class="idds idds-shopping-cart"></i>
              <span class="hidden-sm hidden-xs">Pengajuan Baru</span>
              <span v-if="pengajuanCount > 0" class="badge-notification">{{ pengajuanCount }}</span>
            </button>
            
            <ul 
              v-show="isPengajuanOpen"
              id="pengajuan-menu"
              class="dropdown-menu"
              role="menu"
            >
              <li>
                <NuxtLink 
                  to="/pengajuan/baru" 
                  @click="closePengajuan"
                  role="menuitem"
                >
                  <i class="idds idds-search"></i>
                  <span>Pengajuan Baru</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/pengajuan" 
                  @click="closePengajuan"
                  role="menuitem"
                >
                  <i class="idds idds-list"></i>
                  <span>Pengajuan Total</span>
                </NuxtLink>
              </li>
            </ul>
          </li>

          <!-- User Account Dropdown -->
          <li class="dropdown user-menu" ref="userRef">
            <button
              class="dropdown-toggle user-toggle"
              @click.stop="toggleUser"
              :aria-expanded="isUserOpen"
              aria-haspopup="true"
              aria-controls="user-menu"
              type="button"
            >
              <div class="user-avatar">
                <i class="idds idds-user"></i>
              </div>
              <span class="hidden-xs user-name">{{ displayName }}</span>
              <i class="idds idds-chevron-down" :class="{ 'rotate-180': isUserOpen }"></i>
            </button>
            
            <ul 
              v-show="isUserOpen"
              id="user-menu"
              class="dropdown-menu user-dropdown"
              role="menu"
            >
              <!-- User Header -->
              <li class="user-header">
                <div class="user-avatar-large">
                  <i class="idds idds-user"></i>
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
                  <a 
                    href="/logout" 
                    class="btn-logout"
                    role="menuitem"
                  >
                    <i class="idds idds-logout"></i>
                    Sign out
                  </a>
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
  },
  pengajuanCount: {
    type: Number,
    default: 0
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
  background: #1e3a8a; /* blue-900 */
  border-bottom: 1px solid #1e3a8a;
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
  background: #172554; /* blue-950 */
  color: white;
  text-decoration: none;
  transition: background 0.2s;
  min-width: 230px;
  border-right: 1px solid #1e3a8a;
}

.logo:hover {
  background: #1e40af; /* blue-800 */
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
  background: #1e3a8a; /* blue-900 */
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
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  border-right: none;
}

.sidebar-toggle:hover {
  background: #1e40af; /* blue-800 */
  color: #4ade80; /* green-400 */
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
  background: #1e40af; /* blue-800 */
  color: #4ade80; /* green-400 */
}

.dropdown-toggle:focus {
  outline: 2px solid #4ade80;
  outline-offset: 2px;
}

.dropdown-toggle i:first-child {
  color: #4ade80; /* green-400 */
  font-size: 18px;
}

/* Badge Notification */
.badge-notification {
  background: #22c55e; /* green-500 */
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
  padding: 4px 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #4ade80; /* green-400 */
  background: #1e40af; /* blue-700 */
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
  background: #1e40af; /* blue-700 */
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
  color: #4ade80; /* green-300 */
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
  color: #fff; /* putih */
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
