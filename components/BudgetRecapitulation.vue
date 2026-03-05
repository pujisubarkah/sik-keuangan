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
          'stat shadow-lg rounded-xl p-6 flex flex-col justify-between relative',
          cardColors[idx % cardColors.length]
        ]">
        <div class="flex items-center gap-3 mb-2">
          <span class="inline-flex items-center justify-center bg-green-500 rounded-full p-2">
            <Icon :icon="card.icon" class="text-2xl text-white" />
          </span>
          <span class="absolute top-2 right-2 opacity-20">
            <Icon icon="mdi:chart-line" class="text-7xl text-gray-700" />
          </span>
          <span class="font-semibold text-green-700 text-lg">{{ card.title }}</span>
        </div>
        <div class="flex items-end gap-2">
          <span class="text-3xl font-bold text-blue-700">{{ card.value }}</span>
          <span v-if="card.unit" class="text-lg text-gray-500 font-medium">{{ card.unit }}</span>
        </div>
        <a :href="card.link" class="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1">
          Info Lebih Lanjut <i class="fa fa-arrow-circle-right text-base text-blue-500"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const cardColors = [
  'bg-yellow-300',
  'bg-purple-300',
  'bg-orange-300',
  'bg-teal-300',
  'bg-pink-300',
  'bg-indigo-300',
]

const formatCurrency = (value) => {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
}

const cards = [
  {
    title: 'Total Pagu Anggaran',
    value: formatCurrency(props.budgetData.totalBudget),
    icon: 'fa:tags',
    link: '#',
    unit: null,
  },
  {
    title: 'Jumlah Pengajuan',
    value: props.budgetData.submissionCount,
    icon: 'fa:tags',
    link: '/index.php?r=pengeluaran/pengajuan',
    unit: null,
  },
  {
    title: 'Nominal Pengajuan',
    value: formatCurrency(props.budgetData.submissionAmount),
    icon: 'fa:tags',
    link: '/index.php?r=pengeluaran/pengajuan',
    unit: null,
  },
  {
    title: 'Realisasi Bendahara',
    value: formatCurrency(props.budgetData.treasurerRealization),
    icon: 'fa:shopping-cart',
    link: '#',
    unit: null,
  },
  {
    title: 'Sisa Bendahara',
    value: formatCurrency(props.budgetData.treasurerBalance),
    icon: 'fa:check',
    link: '#',
    unit: null,
  },
  {
    title: '% Penyerapan Bendahara',
    value: props.budgetData.treasurerAbsorption?.toFixed(2) ?? '0.00',
    icon: 'fa:circle-o',
    link: '#',
    unit: '%',
  },
  {
    title: 'Realisasi SP2D',
    value: formatCurrency(props.budgetData.sp2dRealization),
    icon: 'fa:shopping-cart',
    link: '#',
    unit: null,
  },
  {
    title: 'Sisa SP2D',
    value: formatCurrency(props.budgetData.sp2dBalance),
    icon: 'fa:check',
    link: '#',
    unit: null,
  },
  {
    title: '% Penyerapan SP2D',
    value: props.budgetData.sp2dAbsorption?.toFixed(2) ?? '0.00',
    icon: 'fa:circle-o',
    link: '#',
    unit: '%',
  },
]
</script>
