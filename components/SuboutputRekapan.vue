<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <StatBox
        color="blue"
        title="Pagu Anggaran"
        :value="formatCurrency(stats.pagu)"
        prefix="Rp "
        icon="shopping-cart"
        moreInfoLink="#"
      />
      <StatBox
        color="purple"
        title="Jumlah Pengajuan"
        :value="formatCurrency(stats.jumlahPengajuan)"
        icon="tags"
        moreInfoLink="/index.php?r=pekerjaan/pengajuan&id=4723"
      />
      <StatBox
        color="aqua"
        title="Nominal Pengajuan"
        :value="formatCurrency(stats.nominalPengajuan)"
        prefix="Rp "
        icon="circle-o"
        moreInfoLink="/index.php?r=pekerjaan/pengajuan&id=4723"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <StatBox
        color="red"
        title="Realisasi Bendahara"
        :value="formatCurrency(stats.realisasiBendahara)"
        prefix="Rp "
        icon="shopping-cart"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
      <StatBox
        color="green"
        title="Saldo Bendahara"
        :value="formatCurrency(stats.saldoBendahara)"
        prefix="Rp "
        icon="check"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
      <StatBox
        color="yellow"
        title="% Penyerapan Bendahara"
        :value="stats.persenPenyerapanBendahara.toFixed(2) + ' %'"
        icon="circle-o"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatBox
        color="red"
        title="Realisasi SP2D"
        :value="formatCurrency(stats.realisasiSp2d)"
        prefix="Rp "
        icon="shopping-cart"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
      <StatBox
        color="green"
        title="Saldo SP2D"
        :value="formatCurrency(stats.saldoSp2d)"
        prefix="Rp "
        icon="check"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
      <StatBox
        color="yellow"
        title="% Penyerapan SP2D"
        :value="stats.persenPenyerapanSp2d.toFixed(2) + ' %'"
        icon="circle-o"
        moreInfoLink="/index.php?r=pekerjaan/pengeluaran&id=4723"
      />
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
