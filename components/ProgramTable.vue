<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
          <i class="fa fa-list text-2xl text-blue-600"></i>
        </span>
        Daftar Program Semua Satker Tahun {{ currentYear }}
      </h2>
      <div class="flex gap-2">
        <button class="btn btn-sm btn-success" @click="collapsed = false">
          <i class="fa fa-plus"></i> Tampilkan Program
        </button>
        <a class="btn btn-sm btn-success" :href="exportUrl">
          <i class="fa fa-download"></i> Export Excel
        </a>
        <button class="btn btn-sm btn-outline" @click="collapsed = !collapsed">
          <i :class="collapsed ? 'fa fa-plus' : 'fa fa-minus'" class="text-xl text-blue-700"></i>
        </button>
      </div>
    </div>
    <div v-show="!collapsed" class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
        <thead class="bg-blue-100 sticky top-0 z-10">
          <tr>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
            <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode</th>
            <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Program</th>
            <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Kegiatan</th>
             <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">KRO</th>
             <th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">RO</th>
            <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Pagu</th>
            <th class="px-3 py-2 text-center font-semibold text-red-700 align-middle">Realisasi<br>Bendahara</th>
            <th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">%<br>Bendahara</th>
            <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Sisa<br>Bendahara</th>
            <th class="px-3 py-2 text-center font-semibold text-red-700 align-middle">Realisasi<br>SP2D</th>
            <th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">%<br>SP2D</th>
            <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Sisa<br>SP2D</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(program, index) in programs" :key="program.id" class="hover:bg-yellow-50">
            <td class="px-3 py-2 text-center align-middle">{{ index + 1 }}</td>
            <td class="px-3 py-2 align-middle">{{ program.code }}</td>
            <td class="px-3 py-2 align-middle">
              <a :href="`/index.php?r=program/view&id=${program.id}`" class="text-blue-600 hover:underline font-semibold">
                {{ program.name }}
              </a>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ program.activities }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ program.kros }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ program.ros }}</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.budget) }}</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.treasurerRealization) }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ program.treasurerAbsorption.toFixed(2) }}%</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.treasurerBalance) }}</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.sp2dRealization) }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ program.sp2dAbsorption.toFixed(2) }}%</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ program.sp2dBalance }}</span>
            </td>
          </tr>
          <!-- Total Row -->
          <tr class="bg-blue-50 font-bold">
            <th colspan="3" class="px-3 py-2 text-right align-middle">TOTAL</th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.activities }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.kros }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalProgram.ros }}</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.budget) }}</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.treasurerRealization) }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalProgram.treasurerAbsorption.toFixed(2) }}%</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.treasurerBalance }}</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.sp2dRealization) }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalProgram.sp2dAbsorption.toFixed(2) }}%</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.sp2dBalance }}</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  programs: {
    type: Array,
    required: true
  },
  totalProgram: {
    type: Object,
    required: true
  },
  currentYear: {
    type: Number,
    default: 2026
  }
})

const collapsed = ref(true)

const exportUrl = `/index.php?r=admin/index&export=1&exportObject=program`

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID')
  }
  return value
}
</script>
