<template>
  <div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mt-8">
    <!-- Header -->
    <div class="px-8 pt-8 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center gap-2">
      <i class="fa fa-bar-list text-blue-600 text-xl"></i>
      <h3 class="text-xl font-bold text-blue-800 mb-1">Jadwal Rencana Pengeluaran</h3>
    </div>
    
    <!-- Table Container -->
    <div class="px-4 py-6 overflow-x-auto">
      <table class="table-auto w-full text-sm border">
        <thead class="bg-white">
          <tr>
            <th class="px-2 py-2 text-left border-b">Kode</th>
            <th class="px-2 py-2 text-left border-b">Uraian</th>
            <th class="px-2 py-2 text-center border-b">Jumlah</th>
            <th v-for="bulan in bulanList" :key="bulan" class="px-2 py-2 text-center border-b">{{ bulan }}</th>
            <th class="px-2 py-2 text-right border-b">Total</th>
            <th class="px-2 py-2 text-right border-b">Selisih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="row.kode" class="hover:bg-blue-50/50 transition-colors">
            <td class="px-2 py-2 border-b">{{ row.kode }}</td>
            <td class="px-2 py-2 border-b">
              <div class="inline-flex items-center gap-2">
                <div class="relative" ref="dropdownRefs" :data-idx="idx">
                  <button 
                    type="button"
                    class="p-1 rounded hover:bg-gray-100 focus:outline-none transition-shadow"
                    @click="toggleDropdown(idx)"
                    :aria-expanded="dropdownOpen === idx"
                    :aria-controls="`dropdown-menu-${idx}`"
                  >
                    <span class="fa fa-bars"></span>
                  </button>
                  <div 
                    v-if="dropdownOpen === idx" 
                    :id="`dropdown-menu-${idx}`"
                    class="fixed z-30 bg-white border rounded shadow-lg mt-1 left-0 w-48 py-1"
                    :style="dropdownMenuStyle"
                  >
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-gray-700" @click.prevent="handleAction('jadwal', row)">
                      <i class="fa fa-calendar w-4 text-blue-600"></i> Jadwal
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-gray-700" @click.prevent="handleAction('revisi', row)">
                      <i class="fa fa-edit w-4 text-blue-600"></i> Revisi
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-gray-700" @click.prevent="handleAction('sub', row)">
                      <i class="fa fa-plus w-4 text-blue-600"></i> Sub Anggaran
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-gray-700" @click.prevent="handleAction('cairkan', row)">
                      <i class="fa fa-shopping-cart w-4 text-blue-600"></i> Ajukan Pencairan
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-blue-700" @click.prevent="confirmDelete(row)">
                      <i class="fa fa-trash w-4 text-blue-600"></i> Hapus
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-blue-50 text-gray-700" @click.prevent="handleAction('debug', row)">
                      <i class="fa fa-refresh w-4 text-blue-600"></i> Debug (Developer)
                    </a>
                  </div>
                </div>
                <span class="text-gray-800">{{ row.uraian }}</span>
              </div>
            </td>
            <td class="px-2 py-2 text-right border-b font-medium">{{ formatCurrency(row.jumlah) }}</td>
            <td v-for="(cell, i) in row.bulanan" :key="i" class="px-2 py-2 text-right border-b">
              <template v-if="editingCell && editingCell.row === row && editingCell.idx === i">
                <input
                  type="number"
                  min="0"
                  :max="row.jumlah - (row.total - (cell || 0))"
                  v-model.number="editingCell.value"
                  @keydown.enter="saveCell(row, i)"
                  @blur="saveCell(row, i)"
                  class="w-20 px-1 py-0.5 border rounded text-right focus:ring-2 focus:ring-blue-300"
                  :class="{'border-red-400': editingCell.error}"
                  autofocus
                />
                <div v-if="editingCell.error" class="text-xs text-red-500">Melebihi pagu</div>
              </template>
              <template v-else>
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                  @click="startEditCell(row, i, cell)"
                >
                  {{ cell === null || cell === 0 ? '—' : formatCurrency(cell) }}
                </button>
              </template>
            </td>
                <!-- Tombol Simpan -->
                <div class="flex justify-end px-8 pb-6 mt-8">
                  <button
                    class="bg-[#2663A3] hover:bg-[#1F4F85] text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-50"
                    :disabled="!canSave"
                    @click="saveAll"
                  >
                    Simpan
                  </button>
                </div>
            <td class="px-2 py-2 text-right border-b font-bold text-gray-800">{{ formatCurrency(row.total) }}</td>
            <td class="px-2 py-2 text-right border-b font-bold" :class="row.selisih > 0 ? 'text-orange-600' : 'text-green-600'">
              {{ formatCurrency(row.selisih) }}
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-if="rows.length === 0">
            <td colspan="18" class="px-4 py-8 text-center text-gray-500">
              <i class="fa fa-info-circle mr-2"></i>Belum ada data rencana pengeluaran
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Delete Modal - placed outside table container but inside main wrapper -->
    <DeleteModal 
      :show-delete-modal="showDeleteModal"
      :delete-loading="deleteLoading"
      :delete-error="deleteError"
      :delete-success="deleteSuccess"
      :item-name="itemToDelete?.uraian"
      @close="closeDeleteModal"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import DeleteModal from './DeleteModal.vue'

const bulanList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
]

const rows = ref([
  {
    kode: '001',
    uraian: 'Konsumsi Peserta dan Pengajar (6 hari x 44 orang)',
    jumlah: 253440000,
    bulanan: Array(12).fill(null),
    total: 0,
    selisih: 253440000
  }
])

// Dropdown state
const dropdownOpen = ref(null)
const dropdownRefs = ref([])
const dropdownMenuStyle = ref({})

// Inline edit state
const editingCell = ref(null) // { row, idx, value, error }

// Delete modal state
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

// Toggle dropdown dengan close outside handler
function toggleDropdown(idx) {
  if (dropdownOpen.value === idx) {
    dropdownOpen.value = null
    dropdownMenuStyle.value = {}
  } else {
    dropdownOpen.value = idx
    nextTick(() => {
      const btn = dropdownRefs.value[idx]?.querySelector('button')
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const menuHeight = 240 // approx height of dropdown
        const menuWidth = 192 // w-48
        const spaceBelow = window.innerHeight - rect.bottom
        let top = rect.bottom
        if (spaceBelow < menuHeight) {
          top = rect.top - menuHeight
        }
        let left = rect.left
        if (left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - 8
        }
        dropdownMenuStyle.value = {
          left: left + 'px',
          top: top + 'px',
          width: menuWidth + 'px',
        }
      }
    })
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownOpen.value === null) return
  
  const target = event.target
  const dropdownContainer = target.closest('[data-idx]')
  
  if (!dropdownContainer) {
    dropdownOpen.value = null
  }
}

// Handle dropdown actions
function handleAction(action, row) {
  dropdownOpen.value = null
  const actions = {
    jadwal: () => alert(`Buka jadwal untuk: ${row.uraian}`),
    revisi: () => alert(`Revisi anggaran: ${row.uraian}`),
    sub: () => alert(`Tambah sub-anggaran: ${row.uraian}`),
    cairkan: () => alert(`Ajukan pencairan: ${row.uraian}`),
    debug: () => console.log('Debug row:', row)
  }
  actions[action]?.()
}

// Delete flow
function confirmDelete(row) {
  itemToDelete.value = row
  showDeleteModal.value = true
  deleteError.value = ''
  deleteSuccess.value = false
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
  deleteLoading.value = false
  deleteError.value = ''
  deleteSuccess.value = false
}

const doDelete = async () => {
  if (!itemToDelete.value) return
  
  deleteLoading.value = true
  deleteError.value = ''
  
  try {
    // TODO: Replace with actual API call
    // await api.delete(`/anggaran/${itemToDelete.value.kode}`)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const idx = rows.value.findIndex(r => r.kode === itemToDelete.value.kode)
    if (idx > -1) {
      rows.value.splice(idx, 1)
    }
    
    deleteSuccess.value = true
    setTimeout(closeDeleteModal, 1200)
  } catch (error) {
    console.error('Delete error:', error)
    deleteError.value = 'Gagal menghapus data. Silakan coba lagi.'
  } finally {
    deleteLoading.value = false
  }
}


function startEditCell(row, idx, cell) {
  editingCell.value = {
    row,
    idx,
    value: cell || 0,
    error: false
  }
  nextTick(() => {
    // Autofocus handled by input
  })
}

function saveCell(row, idx) {
  if (!editingCell.value) return
  const val = editingCell.value.value || 0
  // Hitung total baru jika nilai ini diubah
  const totalTanpaCell = row.bulanan.reduce((sum, v, i) => sum + (i === idx ? 0 : (v || 0)), 0)
  if (val + totalTanpaCell > row.jumlah) {
    editingCell.value.error = true
    return
  }
  row.bulanan[idx] = val
  calculateRowMetrics(row)
  editingCell.value = null
}
// Validasi tombol simpan
const canSave = computed(() => {
  return rows.value.every(row => row.selisih >= 0)
})

// Simpan semua perubahan (dummy, ganti dengan API call jika perlu)
function saveAll() {
  alert('Data berhasil disimpan!')
  // TODO: Ganti dengan API call
}

// Currency formatter dengan locale Indonesia
function formatCurrency(val) {
  if (val === null || val === undefined) return '—'
  if (val === 0) return '0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val)
}

// Auto-calculate total & selisih ketika bulanan berubah (opsional)
function calculateRowMetrics(row) {
  const totalBulanan = row.bulanan.reduce((sum, val) => sum + (val || 0), 0)
  row.total = totalBulanan
  row.selisih = row.jumlah - totalBulanan
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Initial calculation
  rows.value.forEach(calculateRowMetrics)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for changes in bulanan array untuk auto-calculate
// (jika diperlukan reaktivitas mendalam)
</script>

<style scoped>
/* Optional: Tambahkan transition untuk dropdown */
.absolute {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
</style>