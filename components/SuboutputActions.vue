
<script setup>
import { ref } from 'vue';
import { useClickOutside } from '~/composables/useClickOutside';
import Icon from '~/components/Icon.vue';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  pengeluaranCount: {
    type: Number,
    default: 7,
  },
  pengajuanCount: {
    type: Number,
    default: 0,
  },
});

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

useClickOutside(dropdownRef, closeDropdown);

function handleSalinClick(event) {
  if (!confirm('Yakin akan menyalin data?')) {
    event.preventDefault();
  }
}
</script>

<template>
  <div class="box-footer with-border items-center flex gap-1 flex-nowrap overflow-x-auto">
    <a :href="`/${$route.params.slug}/suboutput/update/${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
      <Icon icon="tabler:pencil" class="w-6 h-6 text-blue-500 align-middle" /> Sunting
    </a>
    <a :href="`/${$route.params.slug}/suboutput/view/${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
      <Icon icon="tabler:currency-dollar" class="w-6 h-6 text-blue-500 align-middle" /> Anggaran
    </a>
    <a :href="`/index.php?r=pekerjaan/pengeluaran&id=${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
      <Icon icon="tabler:shopping-cart" class="w-6 h-6 text-blue-500 align-middle" /> Pengeluaran ({{ pengeluaranCount }})
    </a>
    <a :href="`/index.php?r=pekerjaan/pengajuan&id=${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
      <Icon icon="tabler:arrow-up-circle" class="w-6 h-6 text-blue-500 align-middle" /> Pengajuan ({{ pengajuanCount }})
    </a>
    <a :href="`/index.php?r=pekerjaan/perencanaan&id=${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
      <Icon icon="tabler:calendar" class="w-6 h-6 text-blue-500 align-middle" /> Perencanaan
    </a>
    <a
      :href="`/index.php?r=pekerjaan/salin&id=${id}`"
      class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition whitespace-nowrap"
      @click="handleSalinClick"
    >
      <Icon icon="tabler:copy" class="w-6 h-6 text-blue-500 align-middle" />
      <span>Salin RO</span>
    </a>
    <div class="btn-flat btn-group" ref="dropdownRef">
      <button @click="toggleDropdown" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition dropdown-toggle" type="button">
        <Icon icon="tabler:refresh" class="w-6 h-6 text-blue-500 align-middle" /> Refresh <span class="caret"></span>
      </button>
      <ul v-if="dropdownOpen" class="dropdown-menu" style="display: block; right: 0; left: auto;">
        <li>
          <a :href="`/index.php?r=pekerjaan/refreshPagu&id=${id}`" class="flex items-center bg-blue-100 rounded px-4 py-2 border border-blue-300 hover:bg-blue-200 transition text-blue-700 font-normal gap-2 text-sm">
            <Icon icon="tabler:refresh" class="w-6 h-6 text-blue-500 align-middle" /> Refresh Pagu
          </a>
        </li>
        <li>
          <a :href="`/index.php?r=pekerjaan/refreshPengeluaran&id=${id}`" class="flex items-center bg-blue-100 rounded px-4 py-2 border border-blue-300 hover:bg-blue-200 transition text-blue-700 font-normal gap-2 text-sm">
            <Icon icon="tabler:refresh" class="w-6 h-6 text-blue-500 align-middle" /> Refresh Realisasi
          </a>
        </li>
        <li>
          <a :href="`/index.php?r=pekerjaan/refreshPerencanaan&id=${id}`" class="flex items-center bg-blue-100 rounded px-4 py-2 border border-blue-300 hover:bg-blue-200 transition text-blue-700 font-normal gap-2 text-sm">
            <Icon icon="tabler:refresh" class="w-6 h-6 text-blue-500 align-middle" /> Refresh Perencanaan
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Premium Card and Button Styling */
.box-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(120deg, #3b82f6 0%, #1e40af 100%);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.18);
  border: 2px solid #2563eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #fff;
}
.box-footer:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);
}

.with-border {
  border-top: none;
}

/* Base button style */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  color: #fff;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Gradient button variants */
.btn-primary {
  background: linear-gradient(45deg, #3b82f6, #1e40af);
  border: none;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}

.btn-success {
  background: linear-gradient(45deg, #10b981, #065f46);
}
.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16,185,129,0.3);
}

.btn-danger {
  background: linear-gradient(45deg, #ef4444, #991b1b);
}
.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239,68,68,0.3);
}

.btn-warning {
  background: linear-gradient(45deg, #f59e0b, #b45309);
}
.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245,158,11,0.3);
}

/* Dropdown styling */
.btn-group {
  position: relative;
  display: inline-block;
}

.dropdown-toggle .caret {
  border-top: 4px solid #fff;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  margin-left: 0.3rem;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  left: auto;
  min-width: 12rem;
  background: rgba(255,255,255,0.95);
  border-radius: 0.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  padding: 0.5rem 0;
  display: none;
  z-index: 1000;
}

.dropdown-menu li a {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #333;
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.dropdown-menu li a:hover {
  background: #f0f4ff;
}

.dropdown-menu li a .fa,
.dropdown-menu li a .glyphicon {
  margin-right: 0.5rem;
}

/* Show dropdown when open */
.dropdown-menu.show {
  display: block;
}

/* Icon spacing for buttons */
.btn > .fa,
.btn > .glyphicon {
  margin-right: 0.3rem;
}
</style>
