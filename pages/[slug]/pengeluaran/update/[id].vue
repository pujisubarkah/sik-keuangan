<template>
  <div class="content-wrapper">
    <section class="content-header flex flex-wrap items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-xl">Edit Pengeluaran</h1>
        <span class="text-xl text-blue-600 font-semibold">: {{ namaSuboutput || '-' }}</span>
      </div>
      <ul class="breadcrumb flex items-center gap-2 bg-transparent p-0 m-0">
        <li>
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800"><i class="fa fa-dashboard"></i></NuxtLink>
        </li>
        <li><span class="text-slate-500">Pengeluaran</span></li>
        <li><span class="text-slate-500">Edit</span></li>
      </ul>
    </section>

    <section class="content">
      <form class="modern-form" @submit.prevent="submitForm">
        <div class="modern-card">
          <div class="modern-card-header">
            <h3 class="modern-card-title">Form Pengeluaran / Pengajuan</h3>
          </div>
          <div class="modern-card-body">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-slate-200 rounded-xl">
                <tbody>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold w-56 border-r border-slate-200">Tanggal Pengajuan</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" type="date" v-model="form.tanggal_pengajuan" />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold w-56 border-r border-slate-200">Detil Uraian</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control bg-light text-muted" type="text" v-model="form.detil" readonly />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold w-56 border-r border-slate-200">Keterangan</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" type="text" v-model="form.keterangan" placeholder="Keterangan tambahan" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Card Anggaran Induk -->
            <div class="modern-card mt-6 mb-6">
              <div class="modern-card-header">
                <h4 class="modern-card-title font-bold">Anggaran Induk</h4>
              </div>
              <div class="modern-card-body">
                <div class="overflow-x-auto">
                  <table class="min-w-full bg-white border border-slate-200 rounded-lg">
                    <tbody>
                      <tr>
                        <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Rincian Output</th>
                        <td class="px-4 py-2">
                          <select class="modern-form-control" v-model="selectedSuboutput">
                            <option value="">- Pilih Rincian Output -</option>
                            <option v-for="item in suboutputs" :key="item.id" :value="item.id">{{ item.kode_suboutput }}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Komponen</th>
                        <td class="px-4 py-2">
                          <select class="modern-form-control" v-model.number="selectedKomponen" :disabled="!selectedSuboutput">
                            <option value="">- Pilih Komponen -</option>
                            <option v-for="item in komponen" :key="item.id" :value="Number(item.id)">{{ item.kode_komponen }}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Subkomponen</th>
                        <td class="px-4 py-2">
                          <select class="modern-form-control" v-model.number="selectedSubkomponen" :disabled="!selectedKomponen">
                            <option value="">- Pilih Subkomponen -</option>
                            <option v-for="item in subkomponen" :key="item.id" :value="Number(item.id)">{{ item.kode_subkomponen }}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Akun</th>
                        <td class="px-4 py-2">
                          <select class="modern-form-control" v-model="selectedAkun" :disabled="!selectedSubkomponen">
                            <option value="">- Pilih Akun -</option>
                            <option v-for="item in akun" :key="item.id" :value="item.id">{{ item.kode_akun }}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left align-top px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Uraian</th>
                        <td class="px-4 py-2">
                          <select class="modern-form-control" v-model="form.rkakl_detail_id" :disabled="!selectedAkun">
                            <option value="">- Pilih Uraian -</option>
                            <option v-for="item in rkakl" :key="item.id" :value="item.id">{{ item.uraian }}</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-slate-200 rounded-lg">
                <tbody>
                  <tr>
                    <td colspan="2" class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm font-semibold w-32 text-black" for="Pengeluaran_jumlah">Jumlah Pengajuan</label>
                          <div class="relative flex-1">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none select-none">Rp</span>
                            <input id="Pengeluaran_jumlah" class="modern-form-control text-right pl-10 text-black" placeholder="0" v-model="form.jumlah" type="text" />
                          </div>
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm font-semibold w-32 text-black" for="Pengeluaran_sisa">Sisa Anggaran</label>
                          <div class="relative flex-1">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none select-none">Rp</span>
                            <input id="Pengeluaran_sisa" class="modern-form-control bg-light text-right pl-10 text-black" readonly placeholder="Sisa" :value="form.sisa" type="text" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_id_pengeluaran_status">Status</label>
                          <input id="Pengeluaran_id_pengeluaran_status" class="modern-form-control flex-1 bg-light text-muted" type="text" :value="form.nama_status || '-'" readonly />
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_tanggal">Tanggal Cair</label>
                          <input id="Pengeluaran_tanggal" class="modern-form-control flex-1" type="date" v-model="form.tanggal" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_status_sp2d">Status SP2D</label>
                          <select id="Pengeluaran_status_sp2d" class="modern-form-control flex-1" v-model.boolean="form.status_sp2d">
                            <option :value="false">Belum</option>
                            <option :value="true">Sudah</option>
                          </select>
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_tanggal_sp2d">Tanggal SP2D</label>
                          <input id="Pengeluaran_tanggal_sp2d" class="modern-form-control flex-1" type="date" v-model="form.tanggal_sp2d" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_status_pertanggungjawaban">Status PJ</label>
                          <select id="Pengeluaran_status_pertanggungjawaban" class="modern-form-control flex-1" v-model.boolean="form.status_pertanggungjawaban">
                            <option :value="false">Belum</option>
                            <option :value="true">Sudah</option>
                          </select>
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                          <label class="text-sm text-blue-600 font-semibold w-32" for="Pengeluaran_tanggal_pertanggungjawaban">Tanggal PJ</label>
                          <input id="Pengeluaran_tanggal_pertanggungjawaban" class="modern-form-control flex-1" type="date" v-model="form.tanggal_pertanggungjawaban" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modern-card-footer flex justify-end">
            <button class="modern-btn modern-btn-primary bg-[#3781C7] hover:bg-[#2663A3] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200" type="submit">
              <i class="fa fa-save"></i> Update
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
// Nama suboutput untuk judul
const namaSuboutput = ref('')
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'default',
  title: 'Sunting Pengeluaran',
})

const form = ref({
  tanggal_pengajuan: '',
  detil: '',
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


// Dropdown state (nested)
const struktur = ref({ suboutputs: [] })
const selectedSuboutput = ref('')
const selectedKomponen = ref(null)
const selectedSubkomponen = ref(null)
const selectedAkun = ref(null)
// Flag to prevent watcher resets during API assignment
const isInitializing = ref(false)

// Helper untuk fetch dengan token
async function fetchWithToken(url) {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token autentikasi tidak ditemukan. Silakan login ulang.');
    window.location.href = '/login';
    throw new Error('No token provided');
  }
  const headers = { Authorization: `Bearer ${token}` }
  const res = await fetch(url, { headers })
  return await res.json()
}

// Computed untuk dropdown bertingkat
const suboutputs = computed(() => struktur.value.suboutputs || [])
const komponen = computed(() => {
  const so = suboutputs.value.find(s => s.id == selectedSuboutput.value)
  return so && so.komponen ? so.komponen : []
})
const subkomponen = computed(() => {
  const k = komponen.value.find(k => k.id == selectedKomponen.value)
  return k && k.subkomponen ? k.subkomponen : []
})
const akun = computed(() => {
  const sk = subkomponen.value.find(sk => sk.id == selectedSubkomponen.value)
  return sk && sk.akun ? sk.akun : []
})
const rkakl = computed(() => {
  const a = akun.value.find(a => a.id == selectedAkun.value)
  return a && a.uraian ? a.uraian : []
})

// Set dropdown bertingkat dari data pengajuan by id
async function fetchPengajuanById() {
  const pengajuanId = route.params.id
  try {
    const json = await fetchWithToken(`/api/pengajuan/${pengajuanId}`)
    if (json && json.id) {
      console.log('API response:', json);
      isInitializing.value = true;
      // Set dropdown selections
      selectedSuboutput.value = json.id_suboutput || json.rkakl_suboutput_id || json.suboutput_id || ''
      selectedKomponen.value = Number(json.rkakl_komponen_id || json.komponen_id || '')
      selectedSubkomponen.value = json.rkakl_subkomponen_id || json.subkomponen_id || ''
      selectedAkun.value = json.rkakl_akun_id || json.akun_id || ''
      form.value.rkakl_detail_id = json.rkakl_detail_id || ''

      // Map kode fields for display/reference if needed
      form.value.kode_suboutput = json.kode_suboutput || ''
      form.value.kode_komponen = json.kode_komponen || ''
      form.value.kode_subkomponen = json.kode_subkomponen || ''
      form.value.kode_akun = json.kode_akun || ''

      // Set form lain
      form.value.tanggal_pengajuan = json.tanggal_pengajuan || ''
      form.value.detil = json.detil || ''
      form.value.jumlah = json.jumlah_pengajuan || ''
      // Prioritaskan sisa_anggaran, fallback ke saldo.saldo jika tidak ada
      form.value.sisa = (json.sisa_anggaran !== undefined && json.sisa_anggaran !== null)
        ? json.sisa_anggaran
        : (json.saldo && json.saldo.saldo ? json.saldo.saldo : '')
      form.value.keterangan = json.pengeluaran?.keterangan || ''
      form.value.id_pengeluaran_status = json.pengeluaran?.id_pengeluaran_status || ''
      form.value.nama_status = json.pengeluaran?.nama_status || json.nama_status || ''
      form.value.tanggal = json.pengeluaran?.tanggal_cair || ''
      form.value.status_sp2d = json.pengeluaran?.status_sp2d ?? false
      form.value.tanggal_sp2d = json.pengeluaran?.tanggal_sp2d || ''
      form.value.status_pertanggungjawaban = json.pengeluaran?.status_pj ?? false
      form.value.tanggal_pertanggungjawaban = json.pengeluaran?.tanggal_pj || ''
      namaSuboutput.value = json.nama_suboutput || ''
      // Debug mapped values
      console.log('selectedSuboutput', selectedSuboutput.value, 'komponen', komponen.value);
      isInitializing.value = false;
    }
  } catch (e) {
    isInitializing.value = false;
    console.error('Gagal fetch detail pengajuan', e)
  }
}

// Fetch struktur nested sekali saja
async function fetchStruktur() {
  const json = await fetchWithToken('/api/master/struktur')
  struktur.value = json && json.suboutputs ? json : { suboutputs: [] }
}

// Watcher reset child selection saat parent berubah
watch(selectedSuboutput, () => {
  if (isInitializing.value) {
    console.log('[watch:selectedSuboutput] skip reset (isInitializing)');
    return;
  }
  console.log('[watch:selectedSuboutput] RESET: selectedKomponen, selectedSubkomponen, selectedAkun, rkakl_detail_id');
  selectedKomponen.value = null
  selectedSubkomponen.value = null
  selectedAkun.value = null
  form.value.rkakl_detail_id = ''
})
watch(selectedKomponen, () => {
  if (isInitializing.value) {
    console.log('[watch:selectedKomponen] skip reset (isInitializing)');
    return;
  }
  console.log('[watch:selectedKomponen] RESET: selectedSubkomponen, selectedAkun, rkakl_detail_id');
  selectedSubkomponen.value = null
  selectedAkun.value = null
  form.value.rkakl_detail_id = ''
})
watch(selectedSubkomponen, () => {
  if (isInitializing.value) {
    console.log('[watch:selectedSubkomponen] skip reset (isInitializing)');
    return;
  }
  console.log('[watch:selectedSubkomponen] RESET: selectedAkun, rkakl_detail_id');
  selectedAkun.value = null
  form.value.rkakl_detail_id = ''
})
watch(selectedAkun, () => {
  if (isInitializing.value) {
    console.log('[watch:selectedAkun] skip reset (isInitializing)');
    return;
  }
  console.log('[watch:selectedAkun] RESET: rkakl_detail_id');
  form.value.rkakl_detail_id = ''
})

// Submit update pengajuan
async function submitForm() {
  try {
    const pengajuanId = route.params.id
    const body = {
      rkakl_detail_id: form.value.rkakl_detail_id,
      detil: form.value.detil,
      tanggal_pengajuan: form.value.tanggal_pengajuan,
      jumlah_pengajuan: form.value.jumlah,
      jumlah_data_dukung: form.value.jumlah_data_dukung,
      status_berkas: form.value.status_berkas,
      status_pengajuan_id: form.value.id_pengajuan_status,
      tahun_anggaran_id: form.value.tahun_anggaran_id,
      satker_id: form.value.satker_id,
      unit_id: form.value.unit_id,
      user_id: form.value.user_id,
    }
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')
    const res = await fetch(`/api/pengajuan/${pengajuanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (res.ok && json && json.id) {
      alert('Data pengajuan berhasil diupdate!')
      // Optionally redirect or refresh
    } else {
      alert('Gagal update data: ' + (json.error || 'Unknown error'))
    }
  } catch (e) {
    alert('Gagal update data: ' + e.message)
  }
}

onMounted(async () => {
  await fetchStruktur();
  await fetchPengajuanById();
  // Debug: tampilkan struktur suboutputs dan komponen
  console.log('suboutputs', JSON.parse(JSON.stringify(suboutputs.value)));
  console.log('komponen', JSON.parse(JSON.stringify(komponen.value)));
  // Debug: tampilkan isi dan tipe id komponen
  komponen.value.forEach(k => {
    console.log('komponen item', k, 'id:', k.id, typeof k.id);
  });
  console.log('selectedKomponen', selectedKomponen.value, typeof selectedKomponen.value);
  // Cek kecocokan selectedKomponen
  if (selectedKomponen.value && !komponen.value.find(k => k.id == selectedKomponen.value)) {
    console.warn('selectedKomponen tidak ditemukan di komponen.value, reset ke null');
    selectedKomponen.value = null;
  }
})
</script>

<style scoped>
.content-wrapper {
  padding: 24px;
}
.content-header h1 {
  font-size: 1.7rem;
  font-weight: 700;
}
.breadcrumb {
  float: right;
  background: transparent;
  font-size: 13px;
}
.modern-card {
  margin-top: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08);
}
.modern-card-header {
  padding: 20px 32px;
  border-bottom: 1.5px solid #e2e8f0;
}
.modern-card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.modern-card-body {
  padding: 32px;
}
.modern-card-footer {
  padding: 20px 32px;
  border-top: 1.5px solid #e2e8f0;
}
.modern-form-control {
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: #1e293b;
  background-color: #fff;
  background-clip: padding-box;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04);
}
.modern-form {
  width: 100%;
}
label {
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 4px;
}
.text-right {
  text-align: right !important;
}
.bg-light {
  background-color: #f1f5f9;
}
.text-muted {
  color: #64748b !important;
}
.modern-input-group-text {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 1rem;
  font-weight: 500;
  color: #2563eb;
  text-align: center;
  white-space: nowrap;
  background-color: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px 0 0 8px;
  border-right: none;
}
.modern-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1.5px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  gap: 10px;
}
.modern-btn-primary {
  color: #fff;
  background-color: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.08);
}
</style>