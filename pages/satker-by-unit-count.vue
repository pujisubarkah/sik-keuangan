<template>
  <div class="content-wrapper p-6">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Satker by Unit Count</h1>

      <ul class="breadcrumb flex gap-2 text-sm text-gray-500">
        <li><a href="/">Dashboard</a></li>
        <li>/</li>
        <li><a href="#">Satker</a></li>
        <li>/</li>
        <li>By Unit Count</li>
      </ul>
    </div>

    <!-- Filter Card -->
    <Card class="mb-4">
      <template #header>
        <h3 class="text-lg font-semibold">Filter</h3>
      </template>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Min Units:</label>
          <TextField 
            v-model.number="minCount" 
            type="number" 
            placeholder="Minimal unit"
            min="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Max Units:</label>
          <TextField 
            v-model.number="maxCount" 
            type="number" 
            placeholder="Maksimal unit"
            min="0"
          />
        </div>
        <div class="flex items-end">
          <Button @click="refresh()" type="primary" class="w-full">
            <Icon icon="mdi:filter" class="w-5 h-5 mr-2" />
            Filter
          </Button>
        </div>
      </div>
    </Card>

    <!-- Loading -->
    <div v-if="pending" class="text-center py-8 bg-white shadow rounded-lg">
      <p class="text-gray-600">Loading...</p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger mb-4">
      Error: {{ error.message }}
    </div>

    <!-- Table Card -->
    <Card v-else>
      <template #header>
        <div class="text-sm text-gray-600">
          Menampilkan <b>{{ data?.length || 0 }}</b> data
        </div>
      </template>

      <table class="table-auto w-full border">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-center">No</th>
            <th class="p-2 text-left">Nama Satker</th>
            <th class="p-2 text-center">Jumlah Unit</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td class="text-center p-2">{{ index + 1 }}</td>
            <td class="p-2">{{ item.name }}</td>
            <td class="text-center p-2">
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold">
                {{ item.unitCount }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="data && data.length === 0" class="text-center py-8 text-gray-500">
        Tidak ada data ditemukan
      </div>
    </Card>

  </div>
</template>

<script setup>
import Icon from '~/components/Icon.vue'
import { Button, TextField, Card } from '@idds/vue'

const minCount = ref(0)
const maxCount = ref(null)

const { data, pending, error, refresh } = await useFetch('/api/satker/by-unit-count', {
  query: computed(() => ({
    min: minCount.value,
    max: maxCount.value || undefined
  }))
})
</script>

<style scoped>
.alert {
  padding: 10px;
  border-radius: 6px;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
}
</style>
