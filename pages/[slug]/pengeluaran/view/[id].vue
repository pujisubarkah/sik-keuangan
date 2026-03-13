<template>
	<div>
		<SuboutputAlert :showAlert="showAlert" />
		<SuboutputPengeluaran :data="pengeluaranData" />
		<!-- ...existing content... -->
	</div>
</template>

<script setup>
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import SuboutputPengeluaran from '~/components/SuboutputPengeluaran.vue'
import { ref } from 'vue'

// Contoh: showAlert bisa diatur sesuai kebutuhan
const showAlert = ref(true)

// Contoh data, ganti dengan fetch/props sesuai kebutuhan
const pengeluaranData = ref({
	kode_suboutput: '123.456',
	kode_komponen: 'A01',
	kode_subkomponen: 'A01.01',
	kode_akun: '521213',
	nama_suboutput: 'Belanja Barang',
	anggaran: 100000000,
	jumlah_pengeluaran: 50000000,
	pencairan_bendahara: 30000000,
	status_pertanggungjawaban: 'Lengkap',
	status_sp2d: 'Sudah',
	keterangan: 'Pengeluaran semester 1',
	tanggal_dicairkan: '2026-03-01',
	tanggal_diajukan: '2026-02-25',
	status_berkas: 'Terverifikasi',
	stats: {}
})
</script>
