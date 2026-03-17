<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white shadow-lg rounded-lg">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-bold text-blue-700 flex items-center gap-2">
            <i class="fa fa-list"></i>
            Daftar Suboutput
          </h3>
          <div class="flex gap-2">
            <button class="btn btn-box-tool" title="Collapse"><i class="fa fa-minus"></i></button>
            <button class="btn btn-box-tool" title="Remove"><i class="fa fa-times"></i></button>
          </div>
        </div>
        <!-- Export Button -->
        <div class="border-b border-gray-200 px-6 py-3 bg-gray-50">
          <a class="btn btn-success" href="/index.php?r=admin/perBulan&export=1&exportObject=subOutput">
            <i class="fa fa-download"></i> Export Excel
          </a>
        </div>
        <!-- Table -->
        <div class="p-6 overflow-x-auto">
          <table class="min-w-full table-auto border text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-center px-2 py-2 border">No</th>
                <th class="text-center px-2 py-2 border">Kode</th>
                <th class="px-2 py-2 border">Sub Output</th>
                <th v-for="bulan in bulanList" :key="bulan" class="text-right px-2 py-2 border">{{ bulan }}</th>
                <th class="text-right px-2 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- Example row, replace with dynamic data -->
              <tr>
                <td class="text-center px-2 py-2 border">1</td>
                <td class="text-center px-2 py-2 border">001</td>
                <td class="px-2 py-2 border">Suboutput Contoh</td>
                <td v-for="bulan in bulanList" :key="bulan + '-row'" class="text-right px-2 py-2 border">
                  <span class="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-semibold">0</span>
                </td>
                <td class="text-right px-2 py-2 border">
                  <span class="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-semibold">0</span>
                </td>
              </tr>
              <!-- Total row -->
              <tr class="bg-blue-50 font-bold">
                <td colspan="3" class="text-right px-2 py-2 border">TOTAL</td>
                <td v-for="bulan in bulanList" :key="bulan + '-total'" class="text-right px-2 py-2 border">
                  <span class="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-semibold">0</span>
                </td>
                <td class="text-right px-2 py-2 border">
                  <span class="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-semibold">0</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const bulanList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
]
</script>

<style scoped>
.btn {
  @apply inline-flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition;
}
.btn-success {
  @apply bg-green-600 hover:bg-green-700;
}
.btn-box-tool {
  @apply bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300;
}
</style>
