// src/stores/pengajuan.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import api from '@/api' // sesuaikan dengan setup API kamu

export const usePengajuanStore = defineStore('pengajuan', () => {
  const count = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  const hasPending = computed(() => count.value > 0)

  async function fetchCount() {
    isLoading.value = true
    error.value = null
    try {
      // const res = await api.get('/admin/pengajuan/count')
      // count.value = res.data.total
      // 👇 Mock data untuk contoh:
      await new Promise(resolve => setTimeout(resolve, 300))
      count.value = Math.floor(Math.random() * 5)
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch pengajuan count:', err)
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    count.value = 0
    isLoading.value = false
    error.value = null
  }

  return { count, isLoading, error, hasPending, fetchCount, reset }
})