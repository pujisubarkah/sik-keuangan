<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <button class="btn btn-sm btn-outline flex items-center justify-center mr-2" @click="collapsed = !collapsed" :aria-label="collapsed ? 'Tampilkan' : 'Sembunyikan'">
          <i :class="collapsed ? 'fa fa-chevron-down' : 'fa fa-chevron-up'" class="text-xl text-blue-700"></i>
        </button>
        Daftar Program Semua Satker Tahun {{ currentYear }}
      </h2>
      <div class="flex gap-2">
        
        <a class="btn btn-sm flex items-center gap-1.5 text-white bg-[#00B925] hover:opacity-90 transition-colors" style="border-radius:0.5rem;padding:0.5rem 1rem;" :href="exportUrl">
          <i class="fa fa-download"></i> Export Excel
        </a>
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
             <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Output</th>
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
            <td class="px-3 py-2 align-middle">{{ program.kode_program }}</td>
            <td class="px-3 py-2 align-middle">
              <a :href="`/index.php?r=program/view&id=${program.id}`" class="text-blue-600 hover:underline font-semibold">
                {{ program.nama_program }}
              </a>
            </td>
            <td class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ program.jumlah_kegiatan }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ program.jumlah_output }}</span>
            </td>
            <td class="px-3 py-2 text-center align-middle">
               <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ program.jumlah_suboutput }}</span>
            </td>
            <td class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.pagu) }}</span>
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
                        <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(program.sp2dBalance) }}</span>
            </td>
          </tr>
          <!-- Total Row -->
          <tr class="bg-blue-50 font-bold">
            <th colspan="3" class="px-3 py-2 text-right align-middle">TOTAL</th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.activities }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ totalProgram.outputs }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalProgram.subOutputs }}</span>
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
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.treasurerBalance) }}</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.sp2dRealization) }}</span>
            </th>
            <th class="px-3 py-2 text-center align-middle">
              <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalProgram.sp2dAbsorption.toFixed(2) }}%</span>
            </th>
            <th class="px-3 py-2 text-right align-middle">
              <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalProgram.sp2dBalance) }}</span>
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

const programData = computed(() =>
  props.programs.map(item => ({
    kode_program: item.kode_program,
    nama_program: item.nama_program,
    jumlah_kegiatan: item.jumlah_kegiatan,
    jumlah_output: item.jumlah_output,
    jumlah_suboutput: item.jumlah_suboutput,
    pagu: item.pagu,
    treasurerRealization: item.treasurerRealization,
    treasurerAbsorption: item.treasurerAbsorption,
    treasurerBalance: item.treasurerBalance,
    sp2dRealization: item.sp2dRealization,
    sp2dAbsorption: item.sp2dAbsorption,
    sp2dBalance: item.sp2dBalance,
  }))
)

const collapsed = ref(true)

const exportUrl = `/index.php?r=admin/index&export=1&exportObject=program`

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID')
  }
  return value
}
</script>
