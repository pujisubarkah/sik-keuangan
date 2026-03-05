<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl" :class="iconBgClass">
            <Icon :icon="icon" class="w-4.5 h-4.5" :class="iconColorClass" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5">{{ subtitle }}</p>
          </div>
        </div>
        <slot name="header-actions"></slot>
      </div>
    </div>
    <!-- Chart Body -->
    <div class="p-5">
      <client-only fallback-tag="div" fallback-class="h-80 flex items-center justify-center text-gray-400">
        <apexchart
          :type="type"
          :options="mergedOptions"
          :series="series"
          :height="height"
          class="chart-container"
        />
      </client-only>
    </div>
    <!-- Footer (Optional) -->
    <div v-if="$slots.footer" class="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '~/components/Icon.vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  type: { 
    type: String, 
    default: 'line',
    validator: v => ['line', 'bar', 'area', 'pie', 'donut'].includes(v)
  },
  series: { type: Array, required: true },
  options: { type: Object, default: () => ({}) },
  height: { type: [String, Number], default: 320 },
  icon: { type: String, default: 'mdi:chart-line' },
  color: { 
    type: String, 
    default: 'blue',
    validator: v => ['blue', 'emerald', 'rose', 'amber', 'purple', 'indigo'].includes(v)
  }
})

// Color mapping untuk konsistensi desain
const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', chart: '#3b82f6' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', chart: '#10b981' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', chart: '#f43f5e' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', chart: '#f59e0b' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', chart: '#a855f7' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', chart: '#6366f1' }
}

const iconBgClass = computed(() => colorMap[props.color]?.bg || colorMap.blue.bg)
const iconColorClass = computed(() => colorMap[props.color]?.text || colorMap.blue.text)

// Merge default options dengan user options
const mergedOptions = computed(() => ({
  chart: {
    type: props.type,
    height: props.height,
    toolbar: { show: false },
    fontFamily: 'Poppins, sans-serif',
    foreColor: '#6b7280',
    background: 'transparent',
    ...props.options.chart
  },
  colors: props.options.colors || [colorMap[props.color]?.chart || colorMap.blue.chart],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
      ...props.options.plotOptions?.bar
    },
    ...props.options.plotOptions
  },
  fill: props.type === 'area' ? {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: [colorMap[props.color]?.chart || colorMap.blue.chart],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100]
    },
    ...props.options.fill
  } : props.options.fill,
  ...props.options
}))
</script>
