
<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

// Helper untuk menentukan menu aktif berdasarkan path
const activeMenu = computed(() => {
  const path = route.path;
  if (path.includes('/suboutput/update/')) return 'edit';
  if (path.includes('/suboutput/view/')) return 'anggaran';
  if (path.includes('pekerjaan/pengeluaran')) return 'pengeluaran';
  if (path.includes('pekerjaan/pengajuan')) return 'pengajuan';
  if (path.includes('pekerjaan/perencanaan')) return 'perencanaan';
  return '';
});
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
  <div class="flex flex-wrap items-center gap-2 w-full">
    <a :href="`/${$route.params.slug}/suboutput/update/${id}`"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap border',
        activeMenu === 'edit'
          ? 'text-blue-700 bg-blue-100 border-blue-400'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
      ]"
    >
      <Icon icon="tabler:pencil" class="w-4 h-4 text-blue-500" /> Edit
    </a>
    <a :href="`/${$route.params.slug}/suboutput/view/${id}`"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap border',
        activeMenu === 'anggaran'
          ? 'text-blue-700 bg-blue-100 border-blue-400'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
      ]"
    >
      <Icon icon="tabler:currency-dollar" class="w-4 h-4 text-gray-500" /> Anggaran
    </a>
    <a :href="`/index.php?r=pekerjaan/pengeluaran&id=${id}`"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap border',
        activeMenu === 'pengeluaran'
          ? 'text-blue-700 bg-blue-100 border-blue-400'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
      ]"
    >
      <Icon icon="tabler:shopping-cart" class="w-4 h-4 text-gray-500" /> Pengeluaran
      <span v-if="pengeluaranCount > 0" class="ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-500 rounded-full">{{ pengeluaranCount }}</span>
    </a>
    <a :href="`/index.php?r=pekerjaan/pengajuan&id=${id}`"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap border',
        activeMenu === 'pengajuan'
          ? 'text-blue-700 bg-blue-100 border-blue-400'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
      ]"
    >
      <Icon icon="tabler:arrow-up-circle" class="w-4 h-4 text-gray-500" /> Pengajuan
      <span v-if="pengajuanCount > 0" class="ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-500 rounded-full">{{ pengajuanCount }}</span>
    </a>
    <a :href="`/index.php?r=pekerjaan/perencanaan&id=${id}`"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap border',
        activeMenu === 'perencanaan'
          ? 'text-blue-700 bg-blue-100 border-blue-400'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
      ]"
    >
      <Icon icon="tabler:calendar" class="w-4 h-4 text-gray-500" /> Perencanaan
    </a>
    <a
      :href="`/index.php?r=pekerjaan/salin&id=${id}`"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
      @click="handleSalinClick"
    >
      <Icon icon="tabler:copy" class="w-4 h-4 text-gray-500" /> Salin RO
    </a>
    <NuxtLink :to="`/${$route.params.slug}/suboutput/jadwal?id=${id}`"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
    >
      <Icon icon="tabler:calendar-time" class="w-4 h-4 text-gray-500" /> Jadwal
    </NuxtLink>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
      @click="$emit('revisi')"
    >
      <Icon icon="tabler:edit-circle" class="w-4 h-4 text-gray-500" /> Revisi
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
      @click="$emit('sub')"
    >
      <Icon icon="tabler:subtask" class="w-4 h-4 text-gray-500" /> Sub
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-green-700 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors whitespace-nowrap"
      @click="$emit('ajukan')"
    >
      <Icon icon="tabler:send" class="w-4 h-4 text-white" /> Ajukan
    </button>
    <button
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-red-700 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors whitespace-nowrap"
      @click="$emit('delete')"
    >
      <Icon icon="tabler:trash" class="w-4 h-4 text-white" /> Hapus
    </button>
    <div class="relative inline-block" ref="dropdownRef">
      <button @click="toggleDropdown" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap" type="button">
        <Icon icon="tabler:refresh" class="w-4 h-4 text-gray-500" /> Refresh
        <Icon icon="tabler:chevron-down" class="w-4 h-4 ml-1 text-gray-400" />
      </button>
      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <ul v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
          <li>
            <a :href="`/index.php?r=pekerjaan/refreshPagu&id=${id}`" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Icon icon="tabler:refresh" class="w-4 h-4 text-gray-400" /> Refresh Pagu
            </a>
          </li>
          <li>
            <a :href="`/index.php?r=pekerjaan/refreshPengeluaran&id=${id}`" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Icon icon="tabler:refresh" class="w-4 h-4 text-gray-400" /> Refresh Realisasi
            </a>
          </li>
          <li>
            <a :href="`/index.php?r=pekerjaan/refreshPerencanaan&id=${id}`" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Icon icon="tabler:refresh" class="w-4 h-4 text-gray-400" /> Refresh Perencanaan
            </a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>
