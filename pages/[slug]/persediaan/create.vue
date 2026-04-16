<script setup>
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showAlert = ref(true)

const satkers = [
	{ id: 1, name: 'LAN JAKARTA' },
	{ id: 2, name: 'PUSJAR SKTASN NAS' },
	{ id: 3, name: 'PUSJAR SKMP' },
	{ id: 4, name: 'PUSJAR SKPP' },
	{ id: 5, name: 'PUSJAR SKMK' },
	{ id: 6, name: 'STIA LAN BANDUNG' },
	{ id: 7, name: 'STIA LAN JAKARTA' },
	{ id: 8, name: 'STIA MAKASSAR' }
]

const units = [
	{ id: 1, name: 'Poksi Keuangan' },
	{ id: 3, name: 'Poksi SDM' },
	{ id: 4, name: 'Bagian Barjas dan BMN' },
	{ id: 5, name: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal' },
	{ id: 6, name: 'Poksi Humas dan Protokol' },
	{ id: 7, name: 'Poksi Hukum dan Organisasi' },
	{ id: 8, name: 'Poksi Arsip dan Dokumentasi' },
	{ id: 11, name: 'Inspektorat' },
	{ id: 12, name: 'Pusat Pelatihan dan Pengembangan dan Pemetaan Kompetensi Aparatur Sipil Negara (Puslatbang PKASN)' },
	{ id: 13, name: 'Pusat Pelatihan dan Pengembangan dan Kajian Manajemen Pemerintahan (Puslatbang KMP)' },
	{ id: 14, name: 'Pusat Pelatihan dan Pengembangan dan Kajian Desentralisasi dan Otonomi Daerah (Puslatbang KDOD)' },
	{ id: 15, name: 'Pusat Pelatihan dan Pengembangan dan Kajian Hukum Administrasi Negara (Puslatbang KHAN)' },
	{ id: 16, name: 'STIA LAN Jakarta' },
	{ id: 17, name: 'STIA LAN Bandung' },
	{ id: 18, name: 'STIA LAN Makassar' },
	{ id: 21, name: 'Balai Bahasa' },
	{ id: 24, name: 'Pemkom Puslatbang PKASN' },
	{ id: 26, name: 'Latbang Puslatbang PKASN' },
	{ id: 27, name: 'Administrasi Puslatbang PKASN' },
	{ id: 31, name: 'Administrasi Puslatbang KDOD' },
	{ id: 32, name: 'Latbang Puslatbang KDOD' },
	{ id: 36, name: 'Pelatihan dan Pengembangan Puslatbang KHAN' },
	{ id: 37, name: 'Kajian Hukum Administrasi Negara Puslatbang KHAN' },
	{ id: 38, name: 'Administrasi Puslatbang KHAN' },
	{ id: 39, name: 'Kajian Puslatbang KDOD' },
	{ id: 43, name: 'Pusat Pembinaan Analis Kebijakan (Pusaka)' },
	{ id: 44, name: 'Pusat Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara (Pusbangkom Pimnas & Manajerial ASN)' },
	{ id: 45, name: 'Pusat Inovasi Adminsitrasi Negara (PIAN)' },
	{ id: 46, name: 'Pusat Kajian Kebijakan Administrasi Negara (PK2AN)' },
	{ id: 47, name: 'Pusat Kajian Manajemen Aparatur Sipil Negara (PKMASN)' },
	{ id: 48, name: 'Pusat Inovasi Manajemen Pengembangan Kompetensi Aparatur Sipil Negara (PIM Bangkom ASN)' },
	{ id: 49, name: 'Pusat Teknologi Pengembangan Kompetensi (Pustek Bangkom)' },
	{ id: 50, name: 'Pusat Pembinaan Program dan Kebijakan Pengembangan Kompetensi Aparatur Sipil Negara (P3K Bangkom ASN)' },
	{ id: 52, name: 'Pusat Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Pegawai Aparatur Sipil Negara (Pusbin JF Bangkom ASN)' },
	{ id: 54, name: 'Pusat Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara (Pusbangkom TSK ASN)' },
	{ id: 55, name: 'Pusat Pengembangan Kader Aparatur Sipil Negara (Pusbang Kader ASN)' },
	{ id: 56, name: 'Pusat Data dan Sistem Informasi (Pusdatin)' },
	{ id: 62, name: 'Bagian Umum dan Layanan Pengadaan Barjas' },
	{ id: 63, name: 'Biro Hukum, Organisasi dan Sumber Daya Manusia' },
	{ id: 64, name: 'Biro Umum, Kerjasama dan Hubungan Masyarakat' },
	{ id: 65, name: 'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara' },
	{ id: 66, name: 'Direktorat Advokasi dan Pengembangan Kinerja Kebijakan' },
	{ id: 67, name: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN' },
	{ id: 68, name: 'Direktorat Pembelajaran Sistem Terintegrasi' },
	{ id: 69, name: 'Direktorat Teknologi dan Digitalisasi Pembelajaran' },
	{ id: 70, name: 'Direktorat Ekosistem Pembejalaran ASN' },
	{ id: 71, name: 'Direktorat Pembelajaran Manajerial Kepemimpinan' },
	{ id: 72, name: 'Direktorat Pembelajaran Karakter dan Sosial Kultural' },
	{ id: 73, name: 'Direktorat Pembalajaran Teknis dan Fungsional' },
	{ id: 74, name: 'Direktorat Penjaminan Mutu Pengembangan Kapasitas' },
	{ id: 75, name: 'Direktorat Penjaminan Mutu Pembelajaran' },
	{ id: 76, name: 'Biro Perencanaan dan Keuangan' }
]

const form = ref({
	id_satker: '',
	id_unit: '',
	kode_akun: '',
	kode_barang: '',
	nama_barang: '',
	harga_satuan: ''
})


function submitForm() {
	// Simulate submit, replace with actual API call
	alert('Barang Persediaan berhasil disimpan!')
	router.push('/admin/persediaan/daftar-barang')
}

function formatHargaSatuan(e) {
	let val = e.target.value.replace(/\D/g, '')
	if (val === '') {
		form.value.harga_satuan = ''
		return
	}
	// Format ribuan manual tanpa batas digit
	form.value.harga_satuan = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>

<template>
	<div class="pt-14">
		<!-- ALERT -->
		<SuboutputAlert :showAlert="showAlert" />

		<!-- BREADCRUMB -->
		<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
			<NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">Beranda</NuxtLink>
			<span>/</span>
			<span class="font-bold text-blue-700">Tambah</span>
		</div>

		<!-- TITLE -->
		<h1 class="text-3xl font-bold text-blue-700 mb-6">Tambah Barang Persediaan</h1>

		<!-- CARD -->
		<div class="card bg-white shadow-xl rounded-xl border border-blue-100 max-w-4xl mx-auto p-8">
			<div class="card-body p-0">
				<form @submit.prevent="submitForm" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="relative">
							<label class="block mb-2 font-semibold text-blue-700">Satker</label>
							<select v-model="form.id_satker" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition pr-10 appearance-none">
								<option value="">Pilih Satker</option>
								<option v-for="s in satkers" :key="s.id" :value="s.id">{{ s.name }}</option>
							</select>
							<Icon icon="tabler:chevron-down" class="w-5 h-5 text-gray-400 absolute right-3 top-11 pointer-events-none" />
						</div>
						<div class="relative">
							<label class="block mb-2 font-semibold text-blue-700">Unit</label>
							<select v-model="form.id_unit" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition pr-10 appearance-none">
								<option value="">Pilih Unit</option>
								<option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
							</select>
							<Icon icon="tabler:chevron-down" class="w-5 h-5 text-gray-400 absolute right-3 top-11 pointer-events-none" />
						</div>
						<div>
							<label class="block mb-2 font-semibold text-blue-700">Kode Akun</label>
							<input v-model="form.kode_akun" type="text" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" maxlength="50" placeholder="Kode Akun" />
						</div>
						<div>
							<label class="block mb-2 font-semibold text-blue-700">Kode Barang</label>
							<input v-model="form.kode_barang" type="text" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" maxlength="50" placeholder="Kode Barang" />
						</div>
						<div class="md:col-span-2">
							<label class="block mb-2 font-semibold text-blue-700">Nama Barang <span class="text-red-500">*</span></label>
							<input v-model="form.nama_barang" type="text" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" maxlength="255" placeholder="Nama Barang" required />
						</div>
						<div class="md:col-span-2">
							<label class="block mb-2 font-semibold text-blue-700">Harga Satuan</label>
							<div class="input-group flex">
								<span class="input-group-addon bg-blue-100 px-3 py-2 rounded-l">Rp</span>
																<input
																	v-model.lazy="form.harga_satuan"
																	type="text"
																	inputmode="numeric"
																	pattern="[0-9.]*"
																	class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition rounded-l-none"
																	placeholder="Harga Satuan"
																	@input="formatHargaSatuan"
																/>
							</div>
						</div>
					</div>
					<div class="form-actions flex justify-end mt-8">
						<button type="submit" class="inline-flex items-center gap-2 rounded-md border border-[#2663A3] bg-[#2663A3] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1F4F85] hover:shadow-lg">
							Simpan
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
