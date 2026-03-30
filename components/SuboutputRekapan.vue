<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full px-3 py-3 mr-1 mt-2">
          <i class="fa fa-bar-chart-o text-2xl text-blue-600"></i>
        </span>
        Rekapitulasi Suboutput
      </h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Pagu Anggaran"
          :value="formatCurrency(stats.pagu)"
          prefix="Rp "
          icon="shopping-cart"
          moreInfoLink="#"
        >
          <template #silhouette>
            <i class="fa fa-shopping-cart text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Jumlah Pengajuan"
          :value="formatCurrency(stats.total)"
          icon="tags"
          moreInfoLink="/index.php?r=pekerjaan/pengajuan&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-tags text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Nominal Pengajuan"
          :value="formatCurrency(stats.total)"
          prefix="Rp "
          icon="circle-o"
          moreInfoLink="/index.php?r=pekerjaan/pengajuan&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-circle-o text-7xl"></i>
          </template>
        </StatBox>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Realisasi Bendahara"
          :value="formatCurrency(stats.treasurerRealization)"
          prefix="Rp "
          icon="shopping-cart"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-shopping-cart text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Saldo Bendahara"
          :value="formatCurrency(stats.treasurerBalance)"
          prefix="Rp "
          icon="check"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-check text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Penyerapan Bendahara"
          :value="(stats.treasurerAbsorption ?? 0).toFixed(2) + ' %'"
          icon="circle-o"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-percent text-7xl"></i>
          </template>
        </StatBox>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Realisasi SP2D"
          :value="formatCurrency(stats.sp2dRealization)"
          prefix="Rp "
          icon="shopping-cart"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-shopping-cart text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Saldo SP2D"
          :value="formatCurrency(stats.sp2dBalance)"
          prefix="Rp "
          icon="check"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-check text-7xl"></i>
          </template>
        </StatBox>
      </div>
      <div class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
        <StatBox
          color="blue"
          title="Penyerapan SP2D"
          :value="(stats.sp2dAbsorption ?? 0).toFixed(2) + ' %'"
          icon="circle-o"
          moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
        >
          <template #silhouette>
            <i class="fa fa-percent text-7xl"></i>
          </template>
        </StatBox>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatBox from '@/components/UI/StatBox.vue'
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  formatCurrency: {
    type: Function,
    default: (val) => new Intl.NumberFormat('id-ID').format(val)
  }
})
</script>
