<template>
  <div v-if="showAlert" class="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
    <div class="flex">
      <div class="flex-shrink-0">
        <IconAlertCircle class="h-6 w-6 text-red-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">Perhatian: Data Belum Lengkap</h3>
        <div class="mt-2 text-sm text-red-700">
          <p>
            Terdapat <span class="font-bold">{{ count }} Rincian Output</span> yang belum ditentukan unitnya.
            <NuxtLink to="/admin/suboutput" class="font-medium underline hover:text-red-900">Klik di sini untuk memperbaiki</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
const count = ref(0)
const showAlert = ref(false)

const loadAlertCount = async () => {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch('/api/alert_unit', { headers })
    if (!res.ok) throw new Error('Gagal fetch')
    const data = await res.json()
    count.value = data.count
    showAlert.value = count.value > 0
  } catch (e) {
    showAlert.value = false
  }
}

onMounted(loadAlertCount)
</script>

<style scoped>
.alert-container {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(90deg, #ffe5e5 0%, #fff7f7 100%);
  border: 1.5px solid #fca5a5;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(255, 0, 0, 0.08);
  padding: 18px 24px;
  margin-bottom: 24px;
}
.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fee2e2;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  box-shadow: 0 1px 4px 0 rgba(255, 0, 0, 0.08);
}
.alert-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #b91c1c;
  margin-bottom: 6px;
}
.alert-content {
  font-size: 1rem;
  color: #991b1b;
}
.alert-link {
  color: #b91c1c;
  font-weight: 600;
  text-decoration: underline;
  transition: color 0.2s;
}
.alert-link:hover {
  color: #7f1d1d;
}
</style>
