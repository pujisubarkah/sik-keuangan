<template>
	<section class="max-w-2xl mx-auto mt-10 px-4">
		<h1 class="text-2xl font-bold mb-6">Tambah Berkas Anggaran</h1>
		<v-alert v-if="alert.message" :type="alert.type" :message="alert.message" dismissible class="mb-4" />
		<form @submit.prevent="handleSubmit">
			<div class="bg-white rounded-xl shadow-md overflow-hidden">
				<!-- Header kartu -->
				<div class="bg-primary/10 border-b border-primary/20 px-6 py-3">
					<p class="text-sm text-gray-500">
						Field bertanda <span class="text-red-500 font-bold">*</span> wajib diisi.
					</p>
				</div>

				<!-- Body form -->
				<div class="px-6 py-6 space-y-5">

					<!-- Kode Akun -->
					<div class="grid grid-cols-[170px_1fr] items-start gap-x-4">
						<label class="pt-2.5 text-sm font-semibold text-gray-700 text-right">
							Kode Akun <span class="text-red-500">*</span>
						</label>
						<div>
							<input
								v-model="form.kode_akun"
								type="text"
								placeholder="Masukkan kode akun"
								class="input input-bordered w-full"
							/>
							<p v-if="errors.kode_akun" class="text-error text-xs mt-1">{{ errors.kode_akun }}</p>
						</div>
					</div>

					<!-- Nama Berkas -->
					<div class="grid grid-cols-[170px_1fr] items-start gap-x-4">
						<label class="pt-2.5 text-sm font-semibold text-gray-700 text-right">
							Nama Berkas <span class="text-red-500">*</span>
						</label>
						<div>
							<input
								v-model="form.nama_berkas"
								type="text"
								placeholder="Masukkan nama berkas"
								class="input input-bordered w-full"
							/>
							<p v-if="errors.nama_berkas" class="text-error text-xs mt-1">{{ errors.nama_berkas }}</p>
						</div>
					</div>

					<!-- Kata Kunci -->
					<div class="grid grid-cols-[170px_1fr] items-start gap-x-4">
						<label class="pt-2.5 text-sm font-semibold text-gray-700 text-right" for="kata_kunci">
							Kata Kunci
						</label>
						<div>
							<textarea
								id="kata_kunci"
								v-model="form.kata_kunci"
								placeholder="Masukkan kata kunci (opsional)"
								maxlength="255"
								rows="3"
								class="textarea textarea-bordered w-full resize-none"
							></textarea>
							<p v-if="errors.kata_kunci" class="text-error text-xs mt-1">{{ errors.kata_kunci }}</p>
							<p class="text-gray-400 text-xs mt-1 text-right">{{ form.kata_kunci.length }}/255</p>
						</div>
					</div>

				</div>

				<!-- Footer -->
				<div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2">
					<button type="button" class="btn btn-ghost" @click="$router.back()">Batal</button>
					<v-button :loading="loading" type="submit" class="btn btn-primary">
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
