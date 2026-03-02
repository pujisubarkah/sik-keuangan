<template>
  <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
    <div class="card-body">
      <h2 class="card-title text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
        <Icon icon="mdi:filter" class="w-6 h-6 text-blue-500" />
        Filter Data
      </h2>
      
      <form @submit.prevent="submitFilter">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Satker Select -->
          <div class="form-control md:col-span-4">
            <label class="label">
              <span class="label-text font-medium">Satker</span>
            </label>
            <select 
              v-model="selectedSatker"
              @change="loadUnits"
              class="select select-bordered w-full focus:outline-blue-500"
              name="DashboardForm[id_satker]"
            >
              <option v-for="satker in satkers" :key="satker.value" :value="satker.value">
                {{ satker.label }}
              </option>
            </select>
          </div>

          <!-- Unit Select -->
          <div class="form-control md:col-span-4">
            <label class="label">
              <span class="label-text font-medium">Unit</span>
            </label>
            <select 
              v-model="selectedUnit"
              class="select select-bordered w-full focus:outline-blue-500"
              name="DashboardForm[id_unit]"
            >
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>

          <!-- Year Input -->
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text font-medium">Tahun</span>
            </label>
            <input 
              v-model.number="localYear"
              type="number"
              min="2000"
              max="2100"
              placeholder="2026"
              class="input input-bordered w-full focus:outline-blue-500"
            />
          </div>

          <!-- Submit Button -->
          <div class="form-control md:col-span-2 flex justify-end">
            <label class="label">
              <span class="label-text opacity-0">Action</span>
            </label>
            <button type="submit" class="btn btn-success w-full">
              <Icon icon="mdi:magnify" class="w-5 h-5 mr-1" />
              Tampilkan
            </button>
          </div>
        </div>

        <!-- Additional Action Buttons -->
        <div class="flex flex-wrap gap-2 mt-4">
          <a href="/index.php?r=admin/perBulan" class="btn btn-outline btn-success btn-sm">
            <Icon icon="mdi:calendar-month" class="w-4 h-4 mr-1" />
            Realisasi Per Bulan
          </a>
          <a href="/index.php?r=admin/perBulan&sp2d=1" class="btn btn-outline btn-success btn-sm">
            <Icon icon="mdi:calendar-check" class="w-4 h-4 mr-1" />
            Realisasi Per Bulan SP2D
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  satkers: {
    type: Array,
    required: true
  },
  units: {
    type: Array,
    required: true
  },
  currentYear: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['filter', 'loadUnits'])

const selectedSatker = ref('')
const selectedUnit = ref('')
const localYear = ref(props.currentYear)

// Sync localYear with prop changes
watch(() => props.currentYear, (newYear) => {
  localYear.value = newYear
})

const loadUnits = () => {
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
</script>