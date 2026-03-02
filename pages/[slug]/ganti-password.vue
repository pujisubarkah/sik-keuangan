<script setup>
definePageMeta({ layout: 'default' })

import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'

const hasSubOutputWarning = ref(true)
const isSubmitting = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const error = ref('')
const success = ref('')
const showSuccessModal = ref(false)

watch(error, (val) => {
  if (val) {
    console.log('Ganti Password Error:', val)
  }
})

const validateField = (field) => {
  if (field === 'oldPassword') {
    errors.oldPassword = form.value.oldPassword ? '' : 'Password lama wajib diisi'
  }

  if (field === 'newPassword') {
    if (!form.value.newPassword) errors.newPassword = 'Password baru wajib diisi'
    else if (form.value.newPassword.length < 6)
      errors.newPassword = 'Minimal 6 karakter'
    else errors.newPassword = ''
  }

  if (field === 'confirmPassword') {
    if (!form.value.confirmPassword)
      errors.confirmPassword = 'Konfirmasi wajib diisi'
    else if (form.value.newPassword !== form.value.confirmPassword)
      errors.confirmPassword = 'Password tidak sama'
    else errors.confirmPassword = ''
  }
}

const validateAll = () => {
  validateField('oldPassword')
  validateField('newPassword')
  validateField('confirmPassword')
  return !Object.values(errors).some(v => v)
}

const handleSubmit = async () => {
  if (!validateAll()) return
  isSubmitting.value = true

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword,
        confirmPassword: form.value.confirmPassword
      })
    })
    const data = await res.json()
    if (res.ok && data.success) {
      showSuccessModal.value = true
      Object.keys(form.value).forEach(k => (form.value[k] = ''))
    } else {
      error.value = data.message || 'Gagal mengubah password'
    }
  } catch (e) {
    error.value = 'Gagal mengubah password'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="pt-14">

    <!-- ALERT -->
    <div
      v-if="hasSubOutputWarning"
      class="alert alert-error shadow-lg mb-6"
    >
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Ganti Password</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Ganti Password
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100 max-w-3xl">
      <div class="card-body">

        <h2 class="text-xl font-bold text-blue-700 mb-6">
          Form Ganti Password
        </h2>

        <!-- PASSWORD LAMA -->
        <div class="form-control mb-4">
          <label class="label font-semibold text-blue-700">
            Password Lama
          </label>
          <div class="relative">
            <input
              :type="showOldPassword ? 'text' : 'password'"
              v-model="form.oldPassword"
              @blur="validateField('oldPassword')"
              class="input input-bordered w-full pr-10"
              placeholder="Password Lama"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" @click="showOldPassword = !showOldPassword">
              <Icon :icon="showOldPassword ? 'mdi:eye-off' : 'mdi:eye'" class="w-5 h-5 text-gray-500" />
            </span>
          </div>
          <span v-if="errors.oldPassword" class="text-error text-sm mt-1">
            {{ errors.oldPassword }}
          </span>
        </div>

        <!-- PASSWORD BARU -->
        <div class="form-control mb-4">
          <label class="label font-semibold text-blue-700">
            Password Baru
          </label>
          <div class="relative">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="form.newPassword"
              @blur="validateField('newPassword')"
              class="input input-bordered w-full pr-10"
              placeholder="Password Baru"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" @click="showNewPassword = !showNewPassword">
              <Icon :icon="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'" class="w-5 h-5 text-gray-500" />
            </span>
          </div>
          <span v-if="errors.newPassword" class="text-error text-sm mt-1">
            {{ errors.newPassword }}
          </span>
        </div>

        <!-- KONFIRMASI -->
        <div class="form-control mb-6">
          <label class="label font-semibold text-blue-700">
            Konfirmasi Password Baru
          </label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="form.confirmPassword"
              @blur="validateField('confirmPassword')"
              class="input input-bordered w-full pr-10"
              placeholder="Konfirmasi Password Baru"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
              <Icon :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" class="w-5 h-5 text-gray-500" />
            </span>
          </div>
          <span v-if="errors.confirmPassword" class="text-error text-sm mt-1">
            {{ errors.confirmPassword }}
          </span>
        </div>

        <!-- ACTION -->
        <div class="flex gap-3">
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="btn btn-success"
          >
            <Icon
              v-if="!isSubmitting"
              icon="mdi:check"
              class="w-5 h-5 mr-2"
            />
            <span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </span>
          </button>

          <NuxtLink
            to="/admin/omspan"
            class="btn btn-error"
          >
            <Icon icon="mdi:close" class="w-5 h-5 mr-2" />
            Batal
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
        <Icon icon="mdi:check-circle" class="text-green-500 w-16 h-16 mb-4" />
        <h3 class="text-xl font-bold mb-2 text-green-700">Berhasil!</h3>
        <p class="mb-4 text-center">Password anda berhasil dirubah.</p>
        <button class="btn btn-success w-full" @click="showSuccessModal = false">Tutup</button>
      </div>
    </div>

  </div>
</template>