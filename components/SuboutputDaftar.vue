<template>
	<div class="box box-primary">
		<div class="box-header with-border flex items-center justify-between">
			<h3 class="box-title text-lg font-bold">Daftar Rincian Ouput</h3>
			<NuxtLink :to="computedAddUrl" class="btn-flat btn btn-success bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
				<span class="icon-plus">+</span> Tambah Rincian Ouput
			</NuxtLink>
		</div>
		<div class="box-body overflow-x-auto">
			<div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
					<thead class="bg-blue-100 sticky top-0 z-10">
						<tr>
							<th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
							<th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode</th>
							<th class="px-3 py-2 font-semibold text-blue-700 align-middle">Suboutput</th>
							<th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tahun</th>
							<th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Pagu</th>
							<th class="px-3 py-2 text-right font-semibold text-red-700 align-middle">Realisasi Bendahara</th>
							<th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">% Bendahara</th>
							<th class="px-3 py-2 text-right font-semibold text-red-700 align-middle">Realisasi SP2D</th>
							<th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">% SP2D</th>
							<th class="px-3 py-2 text-right font-semibold text-green-700 align-middle">Sisa</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr v-for="(item, idx) in items" :key="item.id" class="hover:bg-yellow-50 align-middle">
							<td class="px-3 py-2 text-center align-middle">{{ idx + 1 }}</td>
							<td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ item.kode }}</td>
							<td class="px-3 py-2 align-middle">
								<NuxtLink :to="item.detailUrl" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">{{ item.nama }}</NuxtLink>
							</td>
							<td class="px-3 py-2 text-center align-middle">{{ item.tahun }}</td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ item.pagu }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ item.realisasiBendahara }}</span></td>
							<td class="px-3 py-2 text-center align-middle"><span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ item.persenBendahara }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ item.realisasiSp2d }}</span></td>
							<td class="px-3 py-2 text-center align-middle"><span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ item.persenSp2d }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ item.sisa }}</span></td>
						</tr>
						<tr v-if="items.length" class="bg-blue-50 font-bold">
							<td colspan="3" class="px-3 py-2 text-right align-middle">TOTAL</td>
							<td class="px-3 py-2 text-center align-middle">&nbsp;</td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ total.pagu }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ total.realisasiBendahara }}</span></td>
							<td class="px-3 py-2 text-center align-middle"><span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ total.persenBendahara }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ total.realisasiSp2d }}</span></td>
							<td class="px-3 py-2 text-center align-middle"><span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ total.persenSp2d }}</span></td>
							<td class="px-3 py-2 text-right align-middle"><span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ total.sisa }}</span></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#imports'
import { NuxtLink } from '#components'

const route = useRoute()
const slug = computed(() => route.params.slug)
const computedAddUrl = computed(() => `/${slug.value}/suboutput/create`)
const props = defineProps({
	items: {
		type: Array,
		default: () => []
	}
})

const total = computed(() => {
	// Hitung total dari items
	const sum = (arr, key) => arr.reduce((a, b) => a + (parseFloat((b[key]||'0').toString().replace(/[^\d.-]/g, '')) || 0), 0)
	return {
		pagu: sum(props.items, 'pagu').toLocaleString('id-ID'),
		realisasiBendahara: sum(props.items, 'realisasiBendahara').toLocaleString('id-ID'),
		persenBendahara: props.items.length ? (sum(props.items, 'persenBendahara')/props.items.length).toFixed(2) + '%' : '0%',
		realisasiSp2d: sum(props.items, 'realisasiSp2d').toLocaleString('id-ID'),
		persenSp2d: props.items.length ? (sum(props.items, 'persenSp2d')/props.items.length).toFixed(2) + '%' : '0%',
		sisa: sum(props.items, 'sisa').toLocaleString('id-ID'),
	}
})
</script>
