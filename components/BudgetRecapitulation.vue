<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
          <i class="fa fa-bar-chart-o text-2xl text-blue-600"></i>
        </span>
        Rekapitulasi Total Anggaran Semua Satker Tahun {{ currentYear }}
      </h2>
    </div>
    <div v-show="!collapsed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(card, idx) in cards" :key="idx"
        class="stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 bg-brandBlue-500 text-white"
      >
        <!-- Silhouette Background -->
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none z-0">
          <Icon :icon="card.icon" class="text-[10rem] blur-[3px] text-white" />
        </div>
        
        <!-- Gradient Overlay (dihilangkan agar warna card keluar) -->
        <!-- <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div> -->
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col items-start gap-0">
          <div class="flex items-center gap-3 mb-2 relative">
            <span class="inline-flex items-center justify-center bg-white/20 shadow-lg rounded-full p-2 z-10">
              <Icon :icon="card.icon" class="text-2xl drop-shadow text-white" />
            </span>
            <span class="font-semibold text-lg drop-shadow z-10">{{ card.title }}</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="text-3xl font-extrabold drop-shadow">{{ card.value }}</span>
            <span v-if="card.unit" class="text-lg font-medium">{{ card.unit }}</span>
          </div>
          <a
            :href="card.link"
            class="mt-4 text-sm font-semibold text-white flex items-center gap-1 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:underline focus:outline-none"
            style="padding-left:0"
          >
            Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base ml-1 text-white !text-white"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '~/components/Icon.vue'

const props = defineProps({
  budgetData: {
    type: Object,
    required: true
  },
  currentYear: {
    type: Number,
    default: 2026
  }
})

const collapsed = ref(false)

// Urutan: Total Pagu, Jumlah Pengajuan, Nominal Pengajuan, Realisasi Bendahara, Sisa Bendahara, % Penyerapan Bendahara, Realisasi SP2D, Sisa SP2D, % Penyerapan SP2D
const cardColors = [
  'bg-gradient-to-br from-yellow-300 to-yellow-400', // Total Pagu Anggaran
  'bg-gradient-to-br from-blue-400 to-blue-600',     // Jumlah Pengajuan (ubah: biru)
  'bg-gradient-to-br from-orange-300 to-orange-400', // Nominal Pengajuan
  'bg-gradient-to-br from-green-400 to-green-600',   // Realisasi Bendahara (ubah: hijau)
  'bg-gradient-to-br from-rose-400 to-rose-600',     // Sisa Bendahara (ubah: merah muda)
  'bg-gradient-to-br from-fuchsia-400 to-pink-500', // % Penyerapan Bendahara (ubah: fuchsia ke pink terang)
  'bg-gradient-to-br from-indigo-300 to-indigo-400', // Realisasi SP2D
  'bg-gradient-to-br from-teal-300 to-teal-400',     // Sisa SP2D
  'bg-gradient-to-br from-red-300 to-red-400',       // % Penyerapan SP2D
]

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'Rp 0'
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
}

const cards = computed(() => [
  {
    title: 'Total Pagu Anggaran',
    value: formatCurrency(props.budgetData?.totalBudget),
    icon: 'tabler:Moneybag',
    link: '#',
    unit: null,
  },
  {
    title: 'Jumlah Pengajuan',
    value: props.budgetData?.submissionCount ?? 0,
    icon: 'tabler:FileText',
    link: '/index.php?r=pengeluaran/pengajuan',
    unit: null,
  },
  {
    title: 'Nominal Pengajuan',
    value: formatCurrency(props.budgetData?.submissionAmount),
    icon: 'tabler:Calculator',
    link: '/index.php?r=pengeluaran/pengajuan',
    unit: null,
  },
  {
    title: 'Realisasi Bendahara',
    value: formatCurrency(props.budgetData?.treasurerRealization),
    icon: 'tabler:ShoppingCart',
    link: '#',
    unit: null,
  },
  {
    title: 'Sisa Bendahara',
    value: formatCurrency(props.budgetData?.treasurerBalance),
    icon: 'tabler:CircleCheck',
    link: '#',
    unit: null,
  },
  {
    title: '% Penyerapan Bendahara',
    value: props.budgetData?.treasurerAbsorption?.toFixed(2) ?? '0.00',
    icon: 'tabler:ChartPie',
    link: '#',
    unit: '%',
  },
  {
    title: 'Realisasi SP2D',
    value: formatCurrency(props.budgetData?.sp2dRealization),
    icon: 'tabler:CreditCard',
    link: '#',
    unit: null,
  },
  {
    title: 'Sisa SP2D',
    value: formatCurrency(props.budgetData?.sp2dBalance),
    icon: 'tabler:Wallet',
    link: '#',
    unit: null,
  },
  {
    title: '% Penyerapan SP2D',
    value: props.budgetData?.sp2dAbsorption?.toFixed(2) ?? '0.00',
    icon: 'tabler:ChartLine',
    link: '#',
    unit: '%',
  },
])
</script>

<style scoped>
.stat {
  min-height: 180px;
  position: relative;
  z-index: 1;
  border-radius: 1rem;
}

.color-card {
  /* Card akan mengikuti gradient dari cardColors, tidak lagi putih */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 2px solid rgba(255,255,255,0.18);
  /* Efek glass tipis di atas warna */
  position: relative;
  overflow: hidden;
}

.color-card::before {
  /* Overlay dihilangkan agar warna gradient card benar-benar keluar */
  content: none;
}

.stat:hover {
  box-shadow: 0 12px 36px 0 rgba(31, 38, 135, 0.18);
}

@keyframes fadein {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fadein {
  animation: fadein 0.7s cubic-bezier(0.4,0,0.2,1);
}

.stat .drop-shadow {
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.10));
}

.stat .drop-shadow-sm {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));
}
</style>