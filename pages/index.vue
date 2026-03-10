<template>
  <div
    class="min-h-screen flex items-center justify-end bg-cover bg-center bg-no-repeat relative pr-8 md:pr-12"
    style="background-image: url('/main_logo.png')"
  >
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Card login tetap di kanan -->
    <div class="fixed top-12 right-12 z-20 w-full max-w-[420px]">
     <Card class="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <div class="px-8 pt-0 py-8">
          <!-- Logo di dalam card -->
          <div class="flex flex-col items-center text-center mb-5">
            <img
              src="/LANRI-ORG.png"
              alt="LANRI"
              class="w-[220px] max-w-full h-auto mb-0"
            />

            <p class="mt-3 text-sm text-gray-600">
              Silahkan login terlebih dahulu
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="form-group">
              <label class="block text-sm font-medium mb-2 text-gray-700">
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
              <label class="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <TextField
                v-model="form.password"
                placeholder="Masukkan password"
                type="password"
                required
              />
              <p v-if="errors.password" class="text-red-500 text-sm mt-2">
                {{ errors.password }}
              </p>
            </div>

            <!-- Tahun -->
            <div class="form-group">
              <label class="block text-sm font-medium mb-2 text-gray-700">
                Tahun
              </label>
              <TextField
                v-model="form.tahun"
                placeholder="Masukkan tahun"
                type="text"
                required
              />
            </div>

            <!-- Checkbox -->
            <div class="pt-1">
              <label for="rememberMe" class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="form.rememberMe"
                  id="rememberMe"
                  type="checkbox"
                  class="w-5 h-5 cursor-pointer appearance-auto accent-blue-600"
                />
                <span class="text-sm font-medium text-gray-700">Ingatkan saya</span>
              </label>
            </div>

            <!-- Button Login -->
            <div class="pt-2">
              <Button
                html-type="primary"
                type="submit"
                class="w-full"
              >
                LOGIN
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, TextField, Card } from '@idds/vue'
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

// Load remember me data on mount
onMounted(() => {
  const savedUsername = localStorage.getItem('remember_username')
  const savedPassword = localStorage.getItem('remember_password')
  const savedRememberMe = localStorage.getItem('remember_me')
  
  if (savedRememberMe === 'true' && savedUsername && savedPassword) {
    form.username = savedUsername
    form.password = savedPassword
    form.rememberMe = true
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
    localStorage.setItem('remember_me', 'true')
  } else {
    localStorage.removeItem('remember_username')
    localStorage.removeItem('remember_password')
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
        const payloadRaw = (tokenParts[1] || '').replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(payloadRaw))
        const roleId = Number(payload.role_id)
        const username = payload.username || form.username

        userStore.setUser({
          username,
          name: res.name || username,
          role: payload.role || '',
          role_id: payload.role_id,
          satker_id: payload.satker_id
        })

        if (roleId === 1) {
          navigateTo('/admin')
        } else if (roleId === 8) {
          navigateTo(`/${username}`)
        } else {
          navigateTo(`/${username}`)
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
