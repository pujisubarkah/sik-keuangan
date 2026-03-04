<template>
  <div class="pt-14">
    
    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <div class="flex items-center gap-1 text-blue-700 font-bold">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </div>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Selamat Datang di SIK Keuangan
    </h1>

    <!-- WELCOME CARD -->
    <Card class="mb-6">
      <template #header>
        <h2 class="text-2xl font-bold text-blue-900">
          Sistem Informasi Keuangan
        </h2>
      </template>
      <p class="text-blue-800">
        Kelola data satuan kerja, unit, dan keuangan dengan mudah dan efisien
      </p>
    </Card>

    <!-- FEATURE CARDS -->
    <div class="grid md:grid-cols-3 gap-6 mb-6">
      
      <!-- Manajemen Satker -->
      <Card>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-3 rounded-lg">
              <Icon icon="mdi:office-building" class="w-8 h-8 text-blue-700" />
            </div>
            <h3 class="text-xl font-bold text-blue-700">Manajemen Satker</h3>
          </div>
        </template>
        <p class="text-gray-600 mb-4">
          Kelola data satuan kerja dengan mudah dan terstruktur
        </p>
        <NuxtLink to="/satker">
          <Button type="primary" size="sm">
            <Icon icon="mdi:arrow-right" class="w-4 h-4 mr-1" />
            Lihat Satker
          </Button>
        </NuxtLink>
      </Card>

      <!-- Manajemen Unit -->
      <Card>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-green-100 p-3 rounded-lg">
              <Icon icon="mdi:domain" class="w-8 h-8 text-green-700" />
            </div>
            <h3 class="text-xl font-bold text-blue-700">Manajemen Unit</h3>
          </div>
        </template>
        <p class="text-gray-600 mb-4">
          Monitor dan kelola unit-unit dalam setiap satuan kerja
        </p>
        <NuxtLink to="/satker-by-unit-count">
          <Button type="success" size="sm">
            <Icon icon="mdi:arrow-right" class="w-4 h-4 mr-1" />
            Satker by Unit
          </Button>
        </NuxtLink>
      </Card>

      <!-- Laporan Keuangan -->
      <Card>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-yellow-100 p-3 rounded-lg">
              <Icon icon="mdi:chart-line" class="w-8 h-8 text-yellow-700" />
            </div>
            <h3 class="text-xl font-bold text-blue-700">Laporan Keuangan</h3>
          </div>
        </template>
        <p class="text-gray-600 mb-4">
          Analisis dan laporan keuangan yang detail dan akurat
        </p>
        <Button type="warning" size="sm" disabled>
          <Icon icon="mdi:arrow-right" class="w-4 h-4 mr-1" />
          Coming Soon
        </Button>
      </Card>

    </div>

    <!-- STATISTICS CARD -->
    <Card>
      <template #header>
        <h2 class="text-2xl font-bold text-blue-700">
          Statistik Sistem
        </h2>
      </template>

      <div class="grid md:grid-cols-3 gap-6">
        
        <!-- Total Satker -->
        <div class="stats shadow bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div class="stat">
            <div class="stat-figure text-blue-700">
              <Icon icon="mdi:office-building" class="w-12 h-12" />
            </div>
            <div class="stat-title text-blue-900 font-semibold">Total Satker</div>
            <div class="stat-value text-blue-700">{{ stats.satkerCount }}</div>
            <div class="stat-desc text-blue-600">Satuan Kerja Terdaftar</div>
          </div>
        </div>

        <!-- Total Unit -->
        <div class="stats shadow bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div class="stat">
            <div class="stat-figure text-green-700">
              <Icon icon="mdi:domain" class="w-12 h-12" />
            </div>
            <div class="stat-title text-green-900 font-semibold">Total Unit</div>
            <div class="stat-value text-green-700">{{ stats.unitCount }}</div>
            <div class="stat-desc text-green-600">Unit yang Dikelola</div>
          </div>
        </div>

        <!-- Pengguna Aktif -->
        <div class="stats shadow bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div class="stat">
            <div class="stat-figure text-yellow-700">
              <Icon icon="mdi:account-group" class="w-12 h-12" />
            </div>
            <div class="stat-title text-yellow-900 font-semibold">Pengguna Aktif</div>
            <div class="stat-value text-yellow-700">{{ stats.activeUsers }}</div>
            <div class="stat-desc text-yellow-600">User Terdaftar</div>
          </div>
        </div>

      </div>
    </Card>

  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { Button, Card } from '@idds/vue'

definePageMeta({ layout: 'default' })

const stats = ref({
  satkerCount: 0,
  unitCount: 0,
  activeUsers: 0
})
</script>