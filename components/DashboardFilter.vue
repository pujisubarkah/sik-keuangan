<!-- src/components/FilterForm.vue -->
<template>
  <div 
    class="filter-card bg-gradient-to-br from-white to-blue-50/30 shadow-xl mb-6 rounded-2xl border border-blue-200/60 backdrop-blur-sm overflow-hidden"
    :class="{ 'animate-fade-in-up': true }"
  >
    <!-- Decorative Header Bar -->
    <div class="h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500" />
    
    <div class="p-5 md:p-6">
      <!-- Card Header -->
      <div class="flex items-center justify-between mb-5 pb-4 border-b border-blue-100">
        <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2.5">
          <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <IconFilter class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span>Filter Data</span>
        </h2>
        
        <!-- Reset Button -->
        <button 
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50"
          title="Reset semua filter"
        >
          <IconRefresh class="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
      
      <form @submit.prevent="submitFilter" class="space-y-4">
        <!-- Filter Fields Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="col-span-12 flex flex-row items-end gap-4">
          
          <!-- 🏢 Satker Select -->
            <div class="md:col-span-4 flex-1 flex flex-col">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <IconBuilding class="w-4 h-4 text-blue-500" />
              <span>Satker</span>
              <span v-if="selectedSatker" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
            </label>
            <div class="relative">
              <select 
                v-model="selectedSatker"
                @change="loadUnits"
                class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all rounded-xl hover:border-gray-500 appearance-none cursor-pointer"
                name="DashboardForm[id_satker]"
                :class="{ 'border-green-400 ring-2 ring-green-100': selectedSatker }"
              >
                <option value="" disabled selected>Pilih Satker...</option>
                <option v-for="satker in satkers" :key="satker.value" :value="satker.value">
                  {{ satker.label }}
                </option>
              </select>
              <!-- Icon di dalam dropdown Satker dihapus -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconChevronDown class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- 🏭 Unit Select -->
            <div class="md:col-span-4 flex-1 flex flex-col">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <IconSitemap class="w-4 h-4 text-blue-500" />
              <span>Unit</span>
              <span v-if="selectedUnit" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
            </label>
            <div class="relative">
              <select 
                v-model="selectedUnit"
                class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all rounded-xl hover:border-gray-500 appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                name="DashboardForm[id_unit]"
                :disabled="!selectedSatker"
                :class="{ 'border-green-400 ring-2 ring-green-100': selectedUnit }"
              >
                <option value="" disabled selected>{{ selectedSatker ? 'Pilih Unit...' : 'Pilih Satker terlebih dahulu' }}</option>
                <option v-for="unit in units" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </option>
              </select>
              <!-- Icon di dalam dropdown Unit dihapus -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconChevronDown class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- 📅 Year Input -->
            <div class="md:col-span-2 flex-1 flex flex-col">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <IconCalendar class="w-4 h-4 text-blue-500" />
              <span>Tahun</span>
            </label>
            <div class="relative">
              <input 
                v-model.number="localYear"
                type="number"
                min="2000"
                max="2100"
                placeholder="2026"
                class="input input-bordered w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all rounded-xl hover:border-gray-500 text-center font-[Inter]"
                @input="validateYear"
              />
              <!-- Icon di dalam input Tahun dihapus -->
            </div>
          </div>

          <!-- 🔍 Submit Button -->
            <div class="md:col-span-2 flex-1 flex flex-col">
              <button 
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                style="min-height:44px"
              >
                <IconSearch class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Tampilkan</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ✨ Active Filters Chips (Optional) -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 pt-2">
          <span class="text-xs text-gray-500 font-medium">Filter aktif:</span>
          <span v-if="selectedSatker" class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            🏢 {{ getSatkerLabel }}
            <button @click.prevent="selectedSatker = ''; selectedUnit = ''" class="hover:text-red-500 transition-colors">
              <IconX class="w-3 h-3" />
            </button>
          </span>
          <span v-if="selectedUnit" class="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            🏭 {{ getUnitLabel }}
            <button @click.prevent="selectedUnit = ''" class="hover:text-red-500 transition-colors">
              <IconX class="w-3 h-3" />
            </button>
          </span>
          <span v-if="localYear !== props.currentYear" class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            📅 {{ localYear }}
            <button @click.prevent="localYear = props.currentYear" class="hover:text-red-500 transition-colors">
              <IconX class="w-3 h-3" />
            </button>
          </span>
        </div>
      </form>

      <!-- 📊 Quick Actions -->
      <div class="flex flex-wrap gap-2 mt-6 pt-4 border-t border-blue-100">
        <span class="text-xs text-gray-500 font-medium self-center mr-2">Laporan:</span>
        
        <a 
          href="/index.php?r=admin/perBulan" 
          class="btn btn-outline btn-sm btn-soft-success rounded-xl px-4 group"
        >
          <IconCalendarMonth class="w-4 h-4 mr-1.5" />
          <span class="hidden sm:inline">Per Bulan</span>
        </a>
        
        <a 
          href="/index.php?r=admin/perBulan&sp2d=1" 
          class="btn btn-outline btn-sm btn-soft-success rounded-xl px-4 group"
        >
          <IconCalendarCheck class="w-4 h-4 mr-1.5" />
          <span class="hidden sm:inline">SP2D</span>
        </a>
        
        <!-- ...existing code... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { IconBuilding, IconCalendar, IconCalendarCheck, IconCalendarMonth, IconCalendarTime, IconChevronDown, IconDownload, IconFilter, IconInfoCircle, IconRefresh, IconSearch, IconSitemap, IconUsersGroup, IconX } from '@tabler/icons-vue'

const props = defineProps({
  satkers: { type: Array, required: true },
  units: { type: Array, required: true },
  currentYear: { type: Number, required: true }
})

const emit = defineEmits(['filter', 'loadUnits'])

const selectedSatker = ref('')
const selectedUnit = ref('')
const localYear = ref(props.currentYear)

// Computed: Check if any filter is active
const hasActiveFilters = computed(() => {
  return selectedSatker.value || selectedUnit.value || localYear.value !== props.currentYear
})

// Computed: Get labels for chips display
const getSatkerLabel = computed(() => {
  const satker = props.satkers.find(s => s.value === selectedSatker.value)
  return satker?.label?.split(' - ')[0] || selectedSatker.value // Shorten long labels
})

const getUnitLabel = computed(() => {
  const unit = props.units.find(u => u.value === selectedUnit.value)
  return unit?.label || selectedUnit.value
})

// Sync localYear with prop changes
watch(() => props.currentYear, (newYear) => {
  localYear.value = newYear
})

// Validate year input
const validateYear = () => {
  if (localYear.value < 2000) localYear.value = 2000
  if (localYear.value > 2100) localYear.value = 2100
}

const loadUnits = () => {
  selectedUnit.value = '' // Reset unit when satker changes
  if (selectedSatker.value) {
    emit('loadUnits', selectedSatker.value)
  }
}

const submitFilter = () => {
  emit('filter', {
    satker: selectedSatker.value,
    unit: selectedUnit.value,
    year: localYear.value
  })
}

const resetFilters = () => {
  selectedSatker.value = ''
  selectedUnit.value = ''
  localYear.value = props.currentYear
  emit('filter', {
    satker: '',
    unit: '',
    year: props.currentYear
  })
}
</script>

<style scoped>
/* ===== ANIMATIONS ===== */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

/* ===== GRADIENT BUTTON ===== */
.btn-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ===== SOFT OUTLINE BUTTONS ===== */
.btn-soft-success {
  border-color: #22c55e !important;
  color: #22c55e !important;
}
.btn-soft-success:hover {
  background: #22c55e !important;
  color: white !important;
}

.btn-soft-primary {
  border-color: #3b82f6 !important;
  color: #3b82f6 !important;
}
.btn-soft-primary:hover {
  background: #3b82f6 !important;
  color: white !important;
}

/* ===== CUSTOM SELECT STYLING ===== */
select {
  background-image: none !important; /* Remove default arrow */
}

/* ===== FOCUS GLOW EFFECT ===== */
select:focus,
input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

/* ===== HOVER LIFT EFFECT ===== */
.filter-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.15);
}

/* ===== CHIP REMOVE BUTTON ===== */
.chip-remove {
  opacity: 0.7;
  transition: opacity 0.2s;
}
.chip-remove:hover {
  opacity: 1;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .filter-card .p-5.md\:p-6 {
    padding: 1rem;
  }
  
  .btn span.hidden {
    display: none;
  }
}

/* ===== DISABLED STATE STYLING ===== */
select:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.7;
}
select:disabled + div.absolute {
  opacity: 0.4;
}
</style>
