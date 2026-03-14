<template>
  <div>
    <SuboutputAlert :showAlert="true" />
    <section class="content py-10 flex justify-center bg-gray-50 min-h-[60vh]">
      <form
        class="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        id="satker-form"
        @submit.prevent="submitForm"
      >
        <h3 class="text-2xl font-bold text-blue-800 mb-8 text-center">Form Satker</h3>
        <div class="mb-6">
          <label for="Satker_nama" class="block text-sm font-semibold text-gray-700 mb-2">
            Nama <span class="text-red-500">*</span>
          </label>
          <input
            maxlength="255"
            class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition"
            placeholder="Nama"
            name="Satker[nama]"
            id="Satker_nama"
            type="text"
            v-model="satkerNama"
            required
          />
        </div>
        <div class="mb-6">
          <label for="unit_kerja" class="block text-sm font-semibold text-gray-700 mb-2">
            Unit Kerja
          </label>
          <select
            id="unit_kerja"
            v-model="selectedUnit"
            class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 shadow-sm transition"
          >
            <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Simpan
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SuboutputAlert from '@/components/SuboutputAlert.vue'

const route = useRoute()
const satkerId = route?.params?.id
const satkerNama = ref('LAN JAKARTA')
const unitOptions = ref([])
const selectedUnit = ref('')

onMounted(async () => {
  if (!satkerId) return
  try {
    // Fetch data satker untuk mendapatkan unit_id yang sedang dipakai
    const satkerRes = await fetch(`/api/satker/${satkerId}`)
    const satkerData = await satkerRes.json()
    // Fetch unit options
    const res = await fetch(`/api/unit_kerja/satker/${satkerId}`)
    const data = await res.json()
    unitOptions.value = Array.isArray(data) ? data : []
    // Jika satkerData.unit_id ada di unitOptions, set selectedUnit ke unit_id tersebut
    if (satkerData && satkerData.unit_id) {
      const found = unitOptions.value.find(u => u.id === satkerData.unit_id)
      if (found) {
        selectedUnit.value = found.id.toString()
      } else if (unitOptions.value.length > 0) {
        selectedUnit.value = unitOptions.value[0].id.toString()
      }
    } else if (unitOptions.value.length > 0) {
      selectedUnit.value = unitOptions.value[0].id.toString()
    }
  } catch (e) {
    unitOptions.value = []
  }
})

function submitForm() {
  // TODO: Implement actual update logic, e.g., API call
  // Contoh pengiriman data ke backend
  const payload = {
    nama: satkerNama.value,
    unit_id: selectedUnit.value
  }
  // Contoh: fetch('/api/satker/update', { method: 'POST', body: JSON.stringify(payload) })
  alert(`Satker disimpan: ${satkerNama.value}, Unit ID: ${selectedUnit.value}`)
}
</script>
