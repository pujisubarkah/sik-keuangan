
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
      <Icon icon="tabler:pencil" class="w-6 h-6 text-blue-500 align-middle" /> Edit
    </a>
    <a :href="`/index.php?r=pekerjaan/view&id=${id}`" class="flex items-center gap-1 text-xs font-normal text-blue-700 bg-blue-100 rounded px-2 py-1 border border-blue-300 hover:bg-blue-200 transition">
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
.box-footer {
  border-top: 1px solid #f4f4f4;
  padding: 10px;
  background-color: #fff;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.with-border {
  border-top: 1px solid #f4f4f4;
}
.btn-success {
  color: #fff;
  background-color: #00a65a;
  border-color: #008d4c;
}
.btn-success:hover {
  background-color: #008d4c;
}
.btn-primary {
  color: #fff;
  background-color: #3c8dbc;
  border-color: #367fa9;
}
.btn-primary:hover {
  background-color: #367fa9;
}
.btn-danger {
  color: #fff;
  background-color: #dd4b39;
  border-color: #d73925;
}
.btn-danger:hover {
  background-color: #d73925;
}
.btn-warning {
  color: #fff;
  background-color: #f39c12;
  border-color: #e08e0b;
}
.btn-warning:hover {
  background-color: #e08e0b;
}
.btn-group {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.dropdown-toggle .caret {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
.dropdown-menu > li > a {
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;
  text-decoration: none;
}
.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {
  color: #262626;
  text-decoration: none;
  background-color: #f5f5f5;
}
.dropdown-menu > li > a > .fa,
.dropdown-menu > li > a > .glyphicon {
    margin-right: 10px;
}
.btn > .fa,
.btn > .glyphicon {
    margin-right: 5px;
}
</style>
