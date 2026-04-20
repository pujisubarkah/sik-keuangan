<template>
	<section class="max-w-5xl mx-auto mt-10 px-6">
		<h1 class="text-2xl font-bold mb-6">Tambah Berkas Anggaran</h1>
		<v-alert v-if="alert.message" :type="alert.type" :message="alert.message" dismissible class="mb-4" />
		<form @submit.prevent="handleSubmit">
			<div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden border-t-4 border-t-[#D69009]">
				<!-- Card Header dengan gradient accent -->
				<div class="px-8 py-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-slate-100">
					<div class="flex items-center gap-3">
						<div>
							<h2 class="text-lg font-semibold text-slate-800">Detail Berkas Anggaran</h2>
							<p class="text-sm text-slate-500">Field bertanda <span class="text-rose-500">*</span> wajib diisi</p>
						</div>
					</div>
				</div>

				<!-- Body form -->
				<div class="px-8 py-8 space-y-7">

					<!-- Kode Akun -->
					<div class="flex items-center gap-4">
						<label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
							Kode Akun <span class="text-red-500">*</span>
						</label>
						<div class="relative flex-1">
							<input
								v-model="form.kode_akun"
								type="text"
								placeholder="Masukkan kode akun"
								class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200"
							/>
							<p v-if="errors.kode_akun" class="text-error text-xs mt-1">{{ errors.kode_akun }}</p>
						</div>
					</div>

					<!-- Nama Berkas -->
					<div class="flex items-center gap-4">
						<label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0">
							Nama Berkas <span class="text-red-500">*</span>
						</label>
						<div class="relative flex-1">
							<input
								v-model="form.nama_berkas"
								type="text"
								placeholder="Masukkan nama berkas"
								class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200"
							/>
							<p v-if="errors.nama_berkas" class="text-error text-xs mt-1">{{ errors.nama_berkas }}</p>
						</div>
					</div>

					<!-- Kata Kunci -->
					<div class="flex items-center gap-4">
						<label class="w-48 flex items-center gap-2 text-sm font-semibold text-slate-700 flex-shrink-0" for="kata_kunci">
							Kata Kunci
						</label>
						<div class="relative flex-1">
							<textarea
								id="kata_kunci"
								v-model="form.kata_kunci"
								placeholder="Masukkan kata kunci (opsional)"
								maxlength="255"
								rows="3"
								class="flex-1 min-w-0 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 focus:bg-white transition-all duration-200 resize-y min-h-[80px] max-h-48 leading-relaxed"
							></textarea>
							<p v-if="errors.kata_kunci" class="text-error text-xs mt-1">{{ errors.kata_kunci }}</p>
							<p class="text-gray-400 text-xs mt-1 text-right">{{ form.kata_kunci.length }}/255</p>
						</div>
					</div>

				</div>

				<!-- Footer -->
				<div class="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100 px-8 py-4 bg-gray-50">
					<v-button :loading="loading" type="submit" class="px-8 py-2.5 rounded-xl font-semibold bg-[#2663A3] text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">
						<template #default>Simpan</template>
					</v-button>
				</div>
			</div>
		</form>
	</section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VTextField from '@/components/UI/v-text-field.vue'
import VButton from '@/components/UI/v-button.vue'
import VAlert from '@/components/UI/v-alert.vue'

const router = useRouter()
const route = useRoute()

const form = reactive({
	kode_akun: '',
	nama_berkas: '',
	kata_kunci: '',
})
const errors = reactive({
	kode_akun: '',
	nama_berkas: '',
	kata_kunci: '',
})
const alert = reactive({
	type: '',
	message: ''
})
const loading = ref(false)

function validate() {
	let valid = true
	errors.kode_akun = form.kode_akun ? '' : 'Kode Akun wajib diisi.'
	errors.nama_berkas = form.nama_berkas ? '' : 'Nama Berkas wajib diisi.'
	errors.kata_kunci = form.kata_kunci.length > 255 ? 'Maksimal 255 karakter.' : ''
	if (!form.kode_akun || !form.nama_berkas || errors.kata_kunci) valid = false
	return valid
}

async function handleSubmit() {
	alert.message = ''
	if (!validate()) return
	loading.value = true
	try {
		// Ganti endpoint sesuai backend API Anda
		const { $authFetch } = useNuxtApp()
		await $authFetch('/api/anggaran-berkas', {
			method: 'POST',
			body: {
				kode_akun: form.kode_akun,
				nama_berkas: form.nama_berkas,
				kata_kunci: form.kata_kunci,
			},
		})
		alert.type = 'success'
		alert.message = 'Berkas anggaran berhasil disimpan.'
		setTimeout(() => router.back(), 1200)
	} catch (e) {
		alert.type = 'error'
		alert.message = e?.data?.message || e?.message || 'Gagal menyimpan data.'
	} finally {
		loading.value = false
	}
}
</script>
