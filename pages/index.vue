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
              <TextField
                v-model="form.username"
                placeholder="Masukkan username"
                type="text"
                required
              />
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <TextField
                v-model="form.password"
                placeholder="Masukkan password"
                type="password"
                required
              />
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
              class="w-full shadow-lg hover:shadow-xl transition-shadow"
            >
              LOGIN
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