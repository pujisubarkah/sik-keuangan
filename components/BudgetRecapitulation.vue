<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
          <i class="fa fa-bar-chart-o text-2xl text-blue-600"></i>
        </span>
        Rekapitulasi Total Anggaran Semua Satker Tahun {{ currentYear }}
      </h2>
      <button class="btn btn-sm btn-outline" @click="collapsed = !collapsed">
        <Icon :icon="collapsed ? 'mdi:plus' : 'mdi:minus'" class="text-xl text-blue-700" />
      </button>
    </div>
    <div v-show="!collapsed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(card, idx) in cards" :key="idx"
        :class="[
          'stat color-card p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.05] hover:shadow-2xl transition-all duration-300 animate-fadein',
          [5,6,4,7].includes(idx) ? '' : cardColors[idx % cardColors.length]
        ]"
        :style="
          idx === 5 ? 'background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);' :
          idx === 6 ? 'background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);' :
          idx === 4 ? 'background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);' :
          idx === 7 ? 'background: linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%);' :
          ''
        "
      >
        <!-- Silhouette Background -->
        <div class="absolute -right-6 -bottom-6 opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none select-none">
          <Icon :icon="card.icon" :class="[
            'text-[8rem] blur-[2px]',
            idx === 5 ? 'text-pink-900/30' :
            idx === 6 ? 'text-indigo-900/30' :
            idx === 4 ? 'text-rose-900/30' :
            idx === 7 ? 'text-cyan-900/30' :
            'text-black/20'
          ]" />
        </div>
        
        <!-- Gradient Overlay (dihilangkan agar warna card keluar) -->
        <!-- <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div> -->
        
        <!-- Content -->
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center justify-center bg-gradient-to-br from-white/60 to-white/10 shadow-lg rounded-full p-2">
              <Icon :icon="card.icon" class="text-2xl bg-gradient-to-br from-blue-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow" />
            </span>
            <span class="font-semibold text-gray-900 text-lg drop-shadow-sm">{{ card.title }}</span>
          </div>
          <div class="flex items-end gap-2 mt-4">
            <span class="text-3xl font-extrabold text-gray-900 drop-shadow">{{ card.value }}</span>
            <span v-if="card.unit" class="text-lg text-gray-700 font-medium">{{ card.unit }}</span>
          </div>
          <a :href="card.link" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-pink-600 transition-colors">
            Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base"></i>
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