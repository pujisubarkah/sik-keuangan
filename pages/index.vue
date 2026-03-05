<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style="background-image: url('/main_logo.png')">
    <!-- Gambar logolanwhite.png di atas background main_logo.png di sebelah kiri -->
    <!-- Logo logolanwhite.png di atas form login, agak ke kanan -->
    <img src="/logolanwhite.png" alt="LANRI" class="absolute top-16 left-1/2 transform -translate-x-1/2 w-[320px] max-w-[60vw] h-auto opacity-90 z-10" />
    <div class="absolute inset-0 bg-black bg-opacity-30"></div>

    <div class="fixed top-12 right-12 z-20 w-full max-w-md">
      <!-- Login Box -->
      <Card class="overflow-hidden">
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

            <!-- Username Field with Icon -->
            <div class="form-group">
              <label class="block text-sm font-medium mb-1 text-gray-700">Username</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconUser class="w-5 h-5 text-blue-500" />
                </span>
                <TextField
                  v-model="form.username"
                  placeholder="Username"
                  type="text"
                  required
                  class="pl-10"
                />
              </div>
            </div>

            <!-- Password Field with Icon -->
            <div class="form-group">
              <label class="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconLock class="w-5 h-5 text-blue-500" />
                </span>
                <TextField
                  v-model="form.password"
                  placeholder="Password"
                  type="password"
                  required
                  class="pl-10"
                />
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            </div>

            <!-- Year Field with Icon -->
            <div class="form-group">
              <label class="block text-sm font-medium mb-1 text-gray-700">Tahun</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconCalendar class="w-5 h-5 text-blue-500" />
                </span>
                <TextField
                  v-model="form.tahun"
                  placeholder="Tahun"
                  type="text"
                  required
                  class="pl-10"
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

              <Button
                html-type="primary"
                type="submit"
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
import { IconCalendar, IconLock, IconUser } from '@tabler/icons-vue'

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
