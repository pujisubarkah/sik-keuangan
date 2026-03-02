<template>
	<div class="mb-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
				<span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
					<i class="fa fa-list text-2xl text-blue-600"></i>
				</span>
				Daftar Output Semua Satker Tahun 2026
			</h2>
			<div class="flex gap-2">
				<button class="btn btn-sm btn-success" @click="collapsed = false">
					<i class="fa fa-plus"></i> Tampilkan Output
				</button>
				<a class="btn btn-sm btn-success" href="/index.php?r=admin/index&export=1&exportObject=output">
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
						<th class="px-3 py-2 font-semibold text-blue-700 align-middle">Output</th>
						<th class="px-3 py-2 font-semibold text-blue-700 align-middle">Unit</th>
						<th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">Sub Output</th>
						<th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Pagu</th>
						<th class="px-3 py-2 text-center font-semibold text-red-700 align-middle">Realisasi<br>Bendahara</th>
						<th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">% Bendahara</th>
						<th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Sisa<br>Bendahara</th>
						<th class="px-3 py-2 text-center font-semibold text-red-700 align-middle">Realisasi<br>SP2D</th>
						<th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">% SP2D</th>
						<th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Sisa<br>SP2D</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr v-for="(row, idx) in outputData" :key="row.kode" class="hover:bg-yellow-50">
						<td class="px-3 py-2 text-center align-middle">{{ idx + 1 }}</td>
						<td class="px-3 py-2 align-middle">{{ row.kode }}</td>
						<td class="px-3 py-2 align-middle">
							<a :href="row.link" class="text-blue-600 hover:underline font-semibold">{{ row.output }}</a>
						</td>
						<td class="px-3 py-2 align-middle">{{ row.unit }}</td>
						<td class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ row.suboutput }}</span>
						</td>
						<td class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.pagu) }}</span>
						</td>
						<td class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.realisasiBendahara) }}</span>
						</td>
						<td class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ formatPercent(row.percentBendahara) }}</span>
						</td>
						<td class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.sisaBendahara) }}</span>
						</td>
						<td class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.realisasiSP2D) }}</span>
						</td>
						<td class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ formatPercent(row.percentSP2D) }}</span>
						</td>
						<td class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.sisaSP2D) }}</span>
						</td>
					</tr>
					<tr class="bg-blue-50 font-bold">
						<th colspan="4" class="px-3 py-2 text-right align-middle">TOTAL</th>
						<th class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ total.suboutput }}</span>
						</th>
						<th class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(total.pagu) }}</span>
						</th>
						<th class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(total.realisasiBendahara) }}</span>
						</th>
						<th class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ formatPercent(total.percentBendahara) }}</span>
						</th>
						<th class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(total.sisaBendahara) }}</span>
						</th>
						<th class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(total.realisasiSP2D) }}</span>
						</th>
						<th class="px-3 py-2 text-center align-middle">
							<span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ formatPercent(total.percentSP2D) }}</span>
						</th>
						<th class="px-3 py-2 text-right align-middle">
							<span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(total.sisaSP2D) }}</span>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const collapsed = ref(false)

const outputData = ref([
	// ...example data, replace with real data or props
	{
		kode: '7913.ADI',
		output: 'Sertifikasi Profesi dan SDM[Base Line]',
		link: '/index.php?r=output/view&id=2243',
		unit: '',
		suboutput: 1,
		pagu: 1076950000,
		realisasiBendahara: 64037419,
		percentBendahara: 5.95,
		sisaBendahara: 1012912581,
		realisasiSP2D: 27347419,
		percentSP2D: 2.54,
		sisaSP2D: 1049602581,
	},
	// ...add more rows as needed
])

const total = computed(() => {
	const sum = (key) => outputData.value.reduce((a, b) => a + (b[key] || 0), 0)
	return {
		suboutput: sum('suboutput'),
		pagu: sum('pagu'),
		realisasiBendahara: sum('realisasiBendahara'),
		percentBendahara: outputData.value.length ? (sum('percentBendahara') / outputData.value.length) : 0,
		sisaBendahara: sum('sisaBendahara'),
		realisasiSP2D: sum('realisasiSP2D'),
		percentSP2D: outputData.value.length ? (sum('percentSP2D') / outputData.value.length) : 0,
		sisaSP2D: sum('sisaSP2D'),
	}
})

function formatCurrency(value) {
	if (value == null) return '-'
	return value.toLocaleString('id-ID')
}

function formatPercent(value) {
	if (value == null) return '-'
	return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
}
</script>
