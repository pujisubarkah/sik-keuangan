<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto">
      <transition name="fade-toast">
        <div v-if="showToast" class="fixed top-8 right-8 z-[9999] bg-green-600 text-white px-7 py-4 rounded-2xl shadow-2xl shadow-green-400/40 flex items-center gap-3 animate-fadein-toast border-2 border-green-300/60">
          <Icon icon="mdi:check-circle" class="w-7 h-7 text-white drop-shadow" />
          <span class="font-semibold text-lg tracking-wide">Data berhasil diupdate!</span>
        </div>
      </transition>
      <SuboutputAlert class="mb-6" :showAlert="true" />
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 border-t-4 border-t-[#D69009]">
        <div class="px-8 pt-6 pb-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-800">Ubah Kegiatan</h1>
          <p class="text-gray-500 text-sm mt-1">Perbarui detail kegiatan di bawah ini.</p>
        </div>
        <form class="px-8 py-8" @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Tahun -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="tahun">Tahun</label>
              <div class="col-span-9">
                <input v-model="form.tahun" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" id="tahun" type="text" maxlength="4" placeholder="Tahun" />
              </div>
            </div>
            <!-- Id Program -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="id_program">Id Program</label>
              <div class="col-span-9">
                <input v-model="form.id_program" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" id="id_program" type="text" maxlength="32" placeholder="Id Program" />
              </div>
            </div>
            <!-- Kode -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="kode">Kode</label>
              <div class="col-span-9">
                <input v-model="form.kode" class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition" id="kode" type="text" maxlength="255" placeholder="Kode" />
              </div>
            </div>
            <!-- Nama -->
            <div class="grid grid-cols-12 items-start gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700 pt-2" for="nama">Nama</label>
              <div class="col-span-9">
                <textarea v-model="form.nama" class="form-control block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition min-h-[48px] max-h-40 resize-y break-words" id="nama" maxlength="255" placeholder="Nama" rows="2"></textarea>
              </div>
            </div>
            <!-- Jumlah -->
            <div class="grid grid-cols-12 items-center gap-4">
              <label class="col-span-3 text-right font-semibold text-gray-700" for="jumlah">Jumlah</label>
              <div class="col-span-9">
                <input
                  v-model="form.jumlah"
                  @input="form.jumlah = formatNumberWithDots(form.jumlah)"
                  class="form-control block w-full rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm transition"
                  id="jumlah"
                  type="text"
                  maxlength="20"
                  placeholder="Jumlah"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-10">
            <Button type="success" class="rounded-xl shadow-lg bg-green-600 hover:bg-green-700 transition-transform duration-150 px-8 py-3 font-semibold text-lg text-white" native-type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

const showToast = ref(false)
const form = ref({
  tahun: '',
  id_program: '',
  kode: '',
  nama: '',
  jumlah: ''
})
const route = useRoute()

const formatNumberWithDots = (value) => {
  if (!value) return ''
  // Hanya angka
  const number = value.toString().replace(/\D/g, '')
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const unformatNumber = (value) => {
  if (!value) return ''
  return value.toString().replace(/\./g, '')
}

async function fetchKegiatan() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const id = route.params.id
  try {
    const res = await fetch(`/api/kegiatan/${id}`, { headers })
    const json = await res.json()
    if (json.success && json.data) {
      form.value = {
        tahun: json.data.tahun_anggaran || '',
        id_program: json.data.program_id || '',
        kode: json.data.kode_kegiatan || '',
        nama: json.data.nama_kegiatan || '',
        jumlah: json.data.total ? formatNumberWithDots(String(json.data.total)) : ''
      }
    }
  } catch (e) {}
}

async function handleSubmit() {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  const id = route.params.id
  try {
    const res = await fetch(`/api/kegiatan/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        kode_kegiatan: form.value.kode,
        nama_kegiatan: form.value.nama,
        program_id: form.value.id_program,
        total: form.value.jumlah ? Number(unformatNumber(form.value.jumlah)) : null
      })
    })
    const json = await res.json()
    if (json.success) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 2000)
    } else {
      alert(json.message || 'Gagal menyimpan data!')
    }
  } catch (e) {
    alert('Gagal menyimpan data!')
  }
}

onMounted(fetchKegiatan)
</script>

<style scoped>
input.form-control {
  border: 1.5px solid #cbd5e1;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: transparent;
  font-size: 1.08rem;
  padding: 0.7rem 1.1rem;
}
input.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #bfdbfe66;
  background: #f0f9ff;
}
.glass-card {
  background: linear-gradient(120deg, #f0f9ffcc 60%, #e0e7efcc 100%);
  backdrop-filter: blur(8px) saturate(1.2);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  border-top: 5px solid #3b82f6;
  border-bottom: none;
  position: relative;
}
.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 2rem;
  pointer-events: none;
  box-shadow: 0 2px 24px 0 rgba(59,130,246,0.08);
}
.breadcrumb {
  background: #fff;
  padding: 10px;
  list-style: none;
  border-radius: 4px;
  margin-bottom: 20px;
}
.breadcrumb li { display: inline; }
.animate-fadein { animation: fadein 0.7s; }
@keyframes fadein-toast {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.fade-toast-enter-active, .fade-toast-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-toast-enter-from, .fade-toast-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
.fade-toast-enter-to, .fade-toast-leave-from {
  opacity: 1;
  transform: none;
}
</style>