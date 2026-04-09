<script setup>

import { Button, TextField, Card } from '@idds/vue'
import { ref, reactive } from 'vue'
import { IconKey, IconX } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' })

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
    <SuboutputAlert :showAlert="hasSubOutputWarning" />

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Ganti Password</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Ganti Password
    </h1>

    <!-- CARD (Styled like DashboardFilter.vue) -->
    <div class="filter-card bg-gradient-to-br from-white to-blue-50/30 shadow-xl mb-6 rounded-2xl border border-blue-200/60 backdrop-blur-sm overflow-hidden max-w-3xl mx-auto">
      <div class="h-1" style="background-color: #B1670C;" />
      <div class="p-5 md:p-6">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-blue-100">
          <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2.5">
            <div class="p-2 bg-blue-100 rounded-lg">
              <IconKey class="w-5 h-5 text-blue-600" />
            </div>
            <span>Form Ganti Password</span>
          </h2>
        </div>
        <!-- PASSWORD LAMA -->
        <div class="mb-4">
          <label class="block font-semibold text-blue-700 mb-2">
            Password Lama
          </label>
          <TextField
            v-model="form.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            @blur="validateField('oldPassword')"
            placeholder="Password Lama"
          />
          <span v-if="errors.oldPassword" class="text-red-500 text-sm mt-1">
            {{ errors.oldPassword }}
          </span>
        </div>
        <!-- PASSWORD BARU -->
        <div class="mb-4">
          <label class="block font-semibold text-blue-700 mb-2">
            Password Baru
          </label>
          <TextField
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            @blur="validateField('newPassword')"
            placeholder="Password Baru"
          />
          <span v-if="errors.newPassword" class="text-red-500 text-sm mt-1">
            {{ errors.newPassword }}
          </span>
        </div>
        <!-- KONFIRMASI -->
        <div class="mb-6">
          <label class="block font-semibold text-blue-700 mb-2">
            Konfirmasi Password Baru
          </label>
          <TextField
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            @blur="validateField('confirmPassword')"
            placeholder="Konfirmasi Password Baru"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ errors.confirmPassword }}
          </span>
        </div>
        <!-- ACTION -->
        <div>
          <Button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="btn w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </span>
          </Button>
        </div>
      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
        <Icon icon="mdi:check-circle" class="text-green-500 w-16 h-16 mb-4" />
        <h3 class="text-xl font-bold mb-2 text-green-700">Berhasil!</h3>
        <p class="mb-4 text-center">Password anda berhasil dirubah.</p>
        <Button type="success" class="w-full" @click="showSuccessModal = false">Tutup</Button>
      </div>
    </div>

  </div>
</template>