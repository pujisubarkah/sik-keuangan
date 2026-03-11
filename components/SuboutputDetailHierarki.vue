<!-- components/SuboutputDetailHierarchy.vue -->
<template>
  <Card class="mb-6 shadow-lg border-0 overflow-hidden">
    <template #header>
      <div class="flex items-center gap-3 py-3">
        <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800">Detail Anggaran</h3>
          <p class="text-sm text-gray-500">Struktur hierarki RKAKL</p>
        </div>
      </div>
    </template>
    
    <div class="p-6 bg-gradient-to-b from-gray-50 to-white">
      <!-- Breadcrumb Hierarchy -->
      <div v-if="data" class="mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span v-if="data.kode_kegiatan" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span class="font-mono">{{ data.kode_kegiatan }}</span>
            <span class="hidden sm:inline">|</span>
            <span class="hidden sm:inline truncate max-w-[200px]">{{ data.nama_kegiatan }}</span>
          </span>
          <span v-if="data.kode_output" class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span class="font-mono">{{ data.kode_output }}</span>
            <span class="hidden md:inline">|</span>
            <span class="hidden md:inline truncate max-w-[200px]">{{ data.nama_output }}</span>
          </span>
          <span v-if="data.kode_suboutput || data.nama_suboutput" class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg font-medium">
            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span v-if="data.kode_suboutput" class="font-mono">{{ data.kode_suboutput }}</span>
            <span class="hidden lg:inline">|</span>
            <span class="hidden lg:inline truncate max-w-[200px]">{{ data.nama_suboutput || data.nama }}</span>
          </span>
        </div>
      </div>

      <!-- Tree View Hierarchy -->
      <div v-if="data?.komponen?.length" class="space-y-4">
        <div v-for="(komp, idx) in data.komponen" :key="komp.kode_komponen" class="ml-0">
          <!-- Level 1: Komponen -->
          <HierarchyItem 
            level="1"
            :code="komp.kode_komponen"
            :name="komp.nama_komponen"
            icon-type="folder"
            :color="['border-l-blue-500', 'bg-blue-50', 'text-blue-700']"
          >
            <!-- Level 2: Subkomponen -->
            <div v-for="(subkomp, sIdx) in komp.subkomponen" :key="subkomp.kode_subkomponen" class="ml-6">
              <HierarchyItem 
                level="2"
                :code="subkomp.kode_subkomponen"
                :name="subkomp.nama_subkomponen"
                icon-type="tag"
                :color="['border-l-green-500', 'bg-green-50', 'text-green-700']"
              >
                <!-- Level 3: Akun -->
                <div v-for="(akun, aIdx) in subkomp.akun" :key="`${akun.kode_akun}-${akun.uraian}-${aIdx}`" class="ml-6">
                  <HierarchyItem 
                    level="3"
                    :code="akun.kode_akun"
                    :name="akun.nama_akun"
                    icon-type="currency"
                    :color="['border-l-amber-500', 'bg-amber-50', 'text-amber-700']"
                  >
                    <!-- Level 4: Uraian Detail -->
                    <div class="ml-6 pl-4 py-3 pr-3 bg-gray-50 rounded-r-lg border-l-2 border-gray-300">
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span class="text-gray-800 font-medium break-words">{{ akun.uraian }}</span>
                          </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                          <span class="px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                            <span class="font-semibold text-gray-800">{{ formatNumber(akun.volume) }}</span> {{ akun.satuan }}
                          </span>
                          <span class="px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                            @ <span class="font-semibold text-gray-800">{{ formatCurrency(akun.harga_satuan) }}</span>
                          </span>
                          <span class="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold shadow-sm">
                            {{ formatCurrency(akun.jumlah) }}
                          </span>
                        </div>
                      </div>
                      <div v-if="akun.indent_level > 0" class="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <span v-for="n in akun.indent_level" :key="n" class="w-3 h-px bg-gray-300"></span>
                        <span>Level {{ akun.indent_level }}</span>
                      </div>
                    </div>
                  </HierarchyItem>
                </div>
              </HierarchyItem>
            </div>
          </HierarchyItem>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-500 font-medium">Tidak ada data detail anggaran</p>
        <p class="text-gray-400 text-sm mt-1">Silakan pilih suboutput lain untuk melihat rincian</p>
      </div>
      
      <!-- Summary Footer -->
      <div v-if="data?.komponen?.length" class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex flex-wrap justify-between items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div class="text-sm text-gray-600">
            <span class="font-semibold text-gray-800">{{ countItems(data.komponen) }}</span> item anggaran
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500">Total Anggaran</div>
            <div class="text-xl font-bold text-blue-700">{{ formatCurrency(calculateTotal(data.komponen)) }}</div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>

import HierarchyItem from './HierarchyItem.vue'
import { Card } from '@idds/vue'
import { h, defineComponent } from 'vue'

const props = defineProps({ 
  data: Object 
})

// Format currency IDR
function formatCurrency(value) {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Format number with thousand separator
function formatNumber(value) {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('id-ID').format(value)
}

// Count total items recursively
function countItems(komponens) {
  let count = 0
  komponens?.forEach(komp => {
    komp.subkomponen?.forEach(sub => {
      count += sub.akun?.length || 0
    })
  })
  return count
}

// Calculate total amount recursively
function calculateTotal(komponens) {
  let total = 0
  komponens?.forEach(komp => {
    komp.subkomponen?.forEach(sub => {
      sub.akun?.forEach(akun => {
        total += akun.jumlah || 0
      })
    })
  })
  return total
}

</script>

<style scoped>
.border-l-4 {
  transition: all 0.2s ease;
}
.border-l-4:hover {
  transform: translateX(2px);
}
.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ml-6 {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.ml-6::-webkit-scrollbar {
  width: 4px;
}
.ml-6::-webkit-scrollbar-track {
  background: transparent;
}
.ml-6::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.border-l-4 {
  animation: fadeIn 0.3s ease forwards;
}
</style>