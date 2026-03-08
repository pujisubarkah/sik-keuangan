<template>
  <Card class="mb-6">
    <template #header>
      <h3 class="text-xl font-bold text-blue-700">Rekap Perencanaan</h3>
    </template>
    <div class="p-4 flex flex-col md:flex-row gap-4 w-full border-t-4 border-b-4 border-blue-400">
      <!-- Pagu -->
      <div class="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <p class="text-blue-700 font-semibold">Pagu Anggaran</p>
          <h3 class="text-2xl font-bold text-blue-900">Rp {{ formatCurrency(stats.pagu) }}</h3>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <IconShoppingCart class="w-6 h-6 text-blue-500" />
          <span class="text-xs text-blue-500">More info</span>
        </div>
      </div>
      <!-- Perencanaan -->
      <div class="flex-1 bg-green-50 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <p class="text-green-700 font-semibold">Perencanaan</p>
          <h3 class="text-2xl font-bold text-green-900">Rp {{ formatCurrency(stats.perencanaan) }}</h3>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <IconTags class="w-6 h-6 text-green-500" />
          <span class="text-xs text-green-500">More info</span>
        </div>
      </div>
      <!-- Selisih -->
      <div class="flex-1 bg-red-50 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <p class="text-red-700 font-semibold">Selisih</p>
          <h3 class="text-2xl font-bold text-red-900">Rp {{ formatCurrency(stats.selisih) }}</h3>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <IconCircle class="w-6 h-6 text-red-500" />
          <span class="text-xs text-red-500">More info</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Card } from '@idds/vue'
import { IconShoppingCart, IconTags, IconCircle } from '@tabler/icons-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { $fetch } from 'ofetch'

const stats = ref({
  pagu: 0,
  perencanaan: 0,
  selisih: 0
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
}

const route = useRoute();
const fetchRekap = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const data = await $fetch(`/api/anggaran_suboutput/${route.params.id}`, { headers });
    stats.value.pagu = Number(data.anggaranSuboutput?.anggaran || 0);
    stats.value.perencanaan = 0; // Realisasi/perencanaan: 0 sementara
    stats.value.selisih = stats.value.pagu - stats.value.perencanaan;
  } catch (err) {
    // fallback
    stats.value.pagu = 0;
    stats.value.perencanaan = 0;
    stats.value.selisih = 0;
  }
}

onMounted(fetchRekap);
</script>
