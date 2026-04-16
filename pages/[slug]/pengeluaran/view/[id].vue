<template>
  <section class="px-8 pt-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
        Edit Pengeluaran <span class="text-base font-normal text-slate-500">: {{ form.nama_suboutput || '-' }}</span>
      </h1>
      <ul class="flex items-center gap-2 text-sm text-slate-500 mt-2">
        <li>
          <NuxtLink to="/" class="hover:text-blue-600"><i class="fa fa-dashboard"></i></NuxtLink>
        </li>
        <li><span class="mx-1">/</span></li>
        <li>Pengeluaran</li>
        <li><span class="mx-1">/</span></li>
        <li>Edit</li>
      </ul>
    </div>
    <form @submit.prevent class="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-slate-800 mb-6">Detil Pengeluaran</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-slate-200 rounded-lg">
            <tbody>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold w-56 border-r border-slate-200">Tanggal Pengajuan</th>
                <td class="px-4 py-2">{{ form.tanggal_pengajuan }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Komponen</th>
                <td class="px-4 py-2">{{ form.kode_komponen }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Subkomponen</th>
                <td class="px-4 py-2">{{ form.kode_subkomponen }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Akun</th>
                <td class="px-4 py-2">{{ form.kode_akun }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Jumlah Pengeluaran</th>
                <td class="px-4 py-2">Rp {{ form.jumlah }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Sisa Anggaran</th>
                <td class="px-4 py-2">Rp {{ form.sisa }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Keterangan</th>
                <td class="px-4 py-2">{{ form.keterangan }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status</th>
                <td class="px-4 py-2">
                  <span>{{ form.nama_status || '-' }}</span>
                </td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Tanggal Cair</th>
                <td class="px-4 py-2">{{ form.tanggal }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status SP2D</th>
                <td class="px-4 py-2">
                  <span v-if="form.status_sp2d == 1">Sudah</span>
                  <span v-else>Belum</span>
                </td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Tanggal SP2D</th>
                <td class="px-4 py-2">{{ form.tanggal_sp2d }}</td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status PJ</th>
                <td class="px-4 py-2">
                  <span v-if="form.status_pertanggungjawaban == 1">Sudah</span>
                  <span v-else-if="form.status_pertanggungjawaban == 0">Belum</span>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr :class="['even:bg-blue-50', 'odd:bg-white']">
                <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Tanggal PJ</th>
                <td class="px-4 py-2">{{ form.tanggal_pertanggungjawaban }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex items-center gap-4 border-t border-slate-200 pt-6 mt-8">
        <NuxtLink :to="`/${slug}/pengeluaran/update/${id}`" class="inline-flex px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" type="button">
          Edit Pengeluaran
        </NuxtLink>
        <button @click.prevent="eksporUMK" class="inline-flex px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition" type="button">
          Ekspor UMK
        </button>
      </div>
    </form>
    <div class="flex flex-col gap-8">
      <Berkas :berkas-list="berkasList" @delete="handleBerkasDelete" @add="goToAddBerkas" />
      <Riwayat :riwayat-list="riwayatList" />
      <DeleteModal 
        :show-delete-modal="showDeleteModal"
        :delete-loading="deleteLoading"
        :delete-error="deleteError"
        :delete-success="deleteSuccess"
        @close="closeDeleteModal"
        @confirm="doDeleteBerkas"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Berkas from '@/components/berkas.vue'
import Riwayat from '@/components/riwayat.vue'
import DeleteModal from '@/components/UI/DeleteModal.vue'
import { onMounted } from 'vue'

function eksporUMK() {
  // TODO: Implementasi ekspor UMK
  alert('Fitur ekspor UMK belum diimplementasikan.');
}

const form = ref({
  tanggal_pengajuan: '',
  kode_komponen: '',
  kode_subkomponen: '',
  kode_akun: '',
  jumlah: '',
  sisa: '',
  keterangan: '',
  id_pengeluaran_status: '',
  tanggal: '',
  status_sp2d: '',
  tanggal_sp2d: '',
  status_pertanggungjawaban: '',
  tanggal_pertanggungjawaban: '',
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const id = route.params.id

function goBack() {
  router.back()
}

const berkasList = ref([])
const riwayatList = ref([])

const showDeleteModal = ref(false)
const berkasToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

function handleBerkasDelete(berkas) {
  berkasToDelete.value = berkas
  showDeleteModal.value = true
  deleteError.value = ''
  deleteSuccess.value = false
}

function goToAddBerkas() {
  router.push(`/${slug}/berkas-laporan/index?pengeluaran_id=${id}`)
}

function closeDeleteModal() {
  showDeleteModal.value = false
  berkasToDelete.value = null
  deleteLoading.value = false
  deleteError.value = ''
  deleteSuccess.value = false
}

const doDeleteBerkas = async () => {
  if (!berkasToDelete.value) return
  
  deleteLoading.value = true
  deleteError.value = ''
  
  try {
    // Simulate API call - replace with actual delete API: $fetch(`/api/berkas/${berkasToDelete.value.id}`, { method: 'DELETE' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from list
    const idx = berkasList.value.findIndex(b => b.id === berkasToDelete.value.id)
    if (idx > -1) {
      berkasList.value.splice(idx, 1)
    }
    
    deleteSuccess.value = true
    setTimeout(() => {
      closeDeleteModal()
    }, 1500)
  } catch (error) {
    deleteError.value = 'Gagal menghapus berkas. Silakan coba lagi.'
  } finally {
    deleteLoading.value = false
  }
}

const fetchPengajuanById = async () => {
  const pengajuanId = route.params.id
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/pengajuan/${pengajuanId}`, { headers })
    const json = await res.json()
    if (json && json.id) {
      form.value.tanggal_pengajuan = json.tanggal_pengajuan || ''
      form.value.kode_komponen = json.kode_komponen || ''
      form.value.kode_subkomponen = json.kode_subkomponen || ''
      form.value.kode_akun = json.kode_akun || ''
      form.value.jumlah = json.jumlah_pengajuan || ''
      form.value.sisa = json.rkakl_jumlah || ''
      form.value.keterangan = json.pengeluaran?.keterangan || ''
      form.value.id_pengeluaran_status = json.pengeluaran?.id_pengeluaran_status || ''
      form.value.nama_status = json.pengeluaran?.nama_status || json.nama_status || ''
      form.value.nama_suboutput = json.nama_suboutput || ''
      form.value.tanggal = json.pengeluaran?.tanggal_cair || ''
      form.value.status_sp2d = json.pengeluaran?.status_sp2d ? '1' : '0'
      form.value.tanggal_sp2d = json.pengeluaran?.tanggal_sp2d || ''
      form.value.status_pertanggungjawaban = json.pengeluaran?.status_pj ? '1' : '0'
      form.value.tanggal_pertanggungjawaban = json.pengeluaran?.tanggal_pj || ''
    }
  } catch (e) {
    console.error('Gagal fetch detail pengajuan', e)
  }
}

onMounted(() => {
  fetchPengajuanById()
})
</script>
