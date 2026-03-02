<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style="background-image: url('/main_logo.png')">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div class="relative z-10 w-full max-w-md mx-4">
      <!-- Login Box -->
      <div class="bg-white rounded-lg shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-600 px-6 py-4">
          <h1 class="text-2xl font-bold text-white text-center">
            Sistem Informasi Keuangan (SIK)
          </h1>
        </div>

        <!-- Body -->
        <div class="px-6 py-8">
          <p class="text-gray-600 text-center mb-6 text-lg">
            Silahkan login terlebih dahulu
          </p>

          <form class="space-y-4" @submit.prevent="handleLogin">
            <!-- Username Field -->
            <div class="form-group">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  v-model="form.username"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                  type="text"
                  required
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  v-model="form.password"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                  type="password"
                  required
                />
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            </div>

            <!-- Year Field -->
            <div class="form-group">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  v-model="form.tahun"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tahun"
                  type="text"
                  required
                />
              </div>
            </div>

            <!-- Remember Me & Login Button -->
            <div class="flex items-center justify-between pt-4">
              <div class="flex items-center">
                <input
                  v-model="form.rememberMe"
                  id="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
                  Remember me next time
                </label>
              </div>

              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: false
})

const form = reactive({
  username: '',
  password: '',
  tahun: '2026',
  rememberMe: false
})

const errors = reactive({
  password: ''
})

const userStore = useUserStore()

const handleLogin = () => {
  errors.password = ''
  if (!form.password) {
    errors.password = 'Password cannot be blank.'
    return
  }
  $fetch<{ token: string; name?: string }>('/api/auth/login', {
    method: 'POST',
    body: {
      username: form.username,
      password: form.password
    }
  })
    .then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token)
        // decode token untuk cek role_id
        const tokenParts = res.token.split('.')
        const payload = JSON.parse(atob(tokenParts[1] || ''))
        // Set user ke Pinia
        userStore.setUser({ 
          username: form.username, 
          name: res.name || form.username,
          role: payload.role || '',
          role_id: payload.role_id,
          satker_id: payload.satker_id
        })
        if (payload.role_id === 1) {
          navigateTo('/admin')
        } else if (payload.role_id === 8) {
          navigateTo(`/${userStore.username}`)
        } else {
          // navigasi sesuai role lain
        }
      } else {
        errors.password = 'Login gagal: token tidak diterima.'
      }
    })
    .catch((err) => {
      errors.password = err?.statusMessage || 'Login gagal.'
    })
}
</script>

<style scoped>
/* Additional custom styles if needed */
.form-group {
  margin-bottom: 1rem;
}
</style>