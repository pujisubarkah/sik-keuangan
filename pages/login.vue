<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
    style="background-image: url('/main_logo.png')"
  >
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Card login tetap di kanan -->
    <div class="fixed top-12 right-12 bottom-12 z-20 w-full max-w-[420px] overflow-auto">
      <Card class="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div class="px-8 py-8">
          <!-- Logo di dalam card -->
          <div class="flex flex-col items-center text-center mb-8">
            <img
              src="/LANRI-ORG.png"
              alt="LANRI"
              class="w-[220px] max-w-full h-auto mb-4"
            />
            <p class="text-sm text-gray-600 font-medium">
              Silahkan login terlebih dahulu
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <!-- Stabler Icon: user -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
                    <path d="M17 21v-2a4 4 0 0 0-8 0v2" />
                  </svg>
                </span>
                <TextField
                  v-model="form.username"
                  placeholder="Masukkan username"
                  type="text"
                  required
                  class="pl-10"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <!-- Stabler Icon: lock -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <TextField
                  v-model="form.password"
                  placeholder="Masukkan password"
                  type="password"
                  required
                  class="pl-10"
                />
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                {{ errors.password }}
              </p>
            </div>

            <!-- Tahun -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tahun
              </label>
              <TextField
                v-model="form.tahun"
                placeholder="Masukkan tahun"
                type="text"
                required
              />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-2">
              <input
                v-model="form.rememberMe"
                id="rememberMe"
                type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded cursor-pointer"
                style="appearance: auto; -webkit-appearance: auto;"
              />
              <label for="rememberMe" class="text-sm font-medium text-gray-700 cursor-pointer">
                Ingatkan saya
              </label>
            </div>

            <!-- Button Login -->
            <Button
              html-type="primary"
              type="submit"
              class="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg border-2 border-green-600 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <span class="flex items-center justify-center gap-2">
                <!-- Stabler Icon: arrow-right (https://tabler.io/icons/arrow-right) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 18l6-6" />
                  <path d="M13 6l6 6" />
                </svg>
                LOGIN
              </span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Button, TextField, Card } from '@idds/vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: false
})

const form = reactive({
  username: '',
  password: '',
  tahun: '',
  rememberMe: false
})

const errors = reactive({
  password: ''
})

const userStore = useUserStore()

// Load remember me data on mount
onMounted(() => {
  const savedUsername = localStorage.getItem('remember_username')
  const savedPassword = localStorage.getItem('remember_password')
  const savedTahun = localStorage.getItem('remember_tahun')
  const savedRememberMe = localStorage.getItem('remember_me')
  
  if (savedRememberMe === 'true' && savedUsername && savedPassword) {
    form.username = savedUsername
    form.password = savedPassword
    form.tahun = savedTahun || '2026'
    form.rememberMe = true
  } else {
    // Set default tahun jika tidak ada remember me
    form.tahun = '2026'
  }
})

const handleLogin = () => {
  errors.password = ''
  if (!form.password) {
    errors.password = 'Password cannot be blank.'
    return
  }
  
  // Save or clear remember me data
  if (form.rememberMe) {
    localStorage.setItem('remember_username', form.username)
    localStorage.setItem('remember_password', form.password)
    localStorage.setItem('remember_tahun', form.tahun)
    localStorage.setItem('remember_me', 'true')
  } else {
    localStorage.removeItem('remember_username')
    localStorage.removeItem('remember_password')
    localStorage.removeItem('remember_tahun')
    localStorage.removeItem('remember_me')
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
        const tokenParts = res.token.split('.')
        const payload = JSON.parse(atob(tokenParts[1] || ''))
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
.form-group {
  margin-bottom: 0;
}
</style>