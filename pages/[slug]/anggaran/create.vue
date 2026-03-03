<template>
  <div class="content-wrapper min-h-screen font-poppins">
    <!-- Tombol kembali dan info suboutput belum unit -->
    <div class="mb-4">
      <button class="btn btn-link text-blue-700 flex items-center mb-2" @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Kembali
      </button>
      <div class="alert alert-danger mb-0">
        Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
        <NuxtLink to="/index.php?r=pekerjaan/admin&id_unit=null" class="underline text-blue-700">klik di sini</NuxtLink>
        untuk memperbaiki.
      </div>
    </div>

    <section class="content-header mt-4">
      <h1 class="text-2xl font-bold">Tambah Anggaran</h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 mt-2">
        <li>
          <NuxtLink to="/index.php?r=/site/index"><i class="fa fa-dashboard"></i></NuxtLink>
        </li>
        <li>
          <NuxtLink to="/index.php?r=anggaran/index">Anggarans</NuxtLink>
        </li>
        <li><span>Create</span></li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content mt-6">
      <form class="form-horizontal" id="anggaran-form" @submit.prevent="handleSubmit">
        <div class="box box-primary">
          <div class="box-header">
            <h3 class="box-title">Form Anggaran</h3>
          </div>
          <div class="box-body">
            <div class="row">
              <div class="col-sm-6">
                <input type="hidden" v-model="form.id_pekerjaan" />
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_id_induk">Anggaran Induk</label>
                  <select class="form-control w-2/3" v-model="form.id_induk" id="Anggaran_id_induk">
                    <option value="">-- Pilih Induk --</option>
                    <option v-for="opt in indukOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </div>
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_uraian">Uraian</label>
                  <textarea class="form-control w-2/3" maxlength="255" v-model="form.uraian" id="Anggaran_uraian" placeholder="Uraian"></textarea>
                </div>
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_kode">Kode</label>
                  <input class="form-control w-2/3" maxlength="255" v-model="form.kode" id="Anggaran_kode" placeholder="Kode" type="text" />
                </div>
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_revisi">Revisi</label>
                  <select class="form-control w-2/3" v-model="form.revisi" id="Anggaran_revisi">
                    <option value="tidak">Tidak</option>
                    <option value="ya">Ya</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_volume">Volume</label>
                  <input class="form-control w-2/3" v-model="form.volume" id="Anggaran_volume" placeholder="Volume" type="text" />
                </div>
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_satuan">Satuan</label>
                  <input class="form-control w-2/3" maxlength="255" v-model="form.satuan" id="Anggaran_satuan" placeholder="Satuan" type="text" />
                </div>
                <div class="form-group flex items-center mb-4">
                  <label class="w-1/3 font-medium" for="Anggaran_harga_satuan">Harga Satuan</label>
                  <input class="form-control w-2/3" maxlength="20" v-model="form.harga_satuan" id="Anggaran_harga_satuan" placeholder="Harga Satuan" type="text" />
                </div>
                <input type="hidden" v-model="form.referrer" />
              </div>
            </div>
          </div>
          <div class="form-actions box-footer flex gap-4">
            <button class="btn-flat btn btn-primary flex items-center gap-2" type="submit">
              <span class="mdi mdi-check"></span> Simpan
            </button>
            <button class="btn-flat btn btn-danger flex items-center gap-2" type="button" @click="$router.back()">
              <span class="mdi mdi-close"></span> Batal
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const form = ref({
  id_pekerjaan: '4725',
  id_induk: '',
  uraian: '',
  kode: '',
  revisi: 'tidak',
  volume: '',
  satuan: '',
  harga_satuan: '',
  referrer: 'https://sik-keuangan.lan.go.id/index.php?r=pekerjaan/perencanaan&id=4725',
});

const indukOptions = [
  { value: '228748', label: 'Pelaksanaan Pembinaan Tata Kelola Kebijakan Instansi Pemerintah' },
  { value: '228749', label: '== Persiapan' },
  { value: '228750', label: '==== Belanja Bahan' },
  { value: '228752', label: '====== 000963 ATK' },
  { value: '228753', label: '====== 000127 Makan Rapat Biasa D.K.I.  JAKARTA' },
  { value: '228754', label: '====== 000128 Snack Rapat Biasa D.K.I.  JAKARTA' },
  { value: '228759', label: '== Pelaksanaan' },
  { value: '228760', label: '==== Belanja Bahan' },
  { value: '228761', label: '====== 000132 ATK' },
  { value: '228762', label: '====== 000133 Seminar Kit' },
  { value: '228763', label: '====== 000134 Makan Rapat Biasa D.K.I.  JAKARTA' },
  { value: '228764', label: '====== 000135 Snack Rapat Biasa D.K.I.  JAKARTA' },
  { value: '228765', label: '==== Belanja Jasa Profesi' },
  { value: '228766', label: '====== 000136 Honorarium Narasumber (Pejabat Eselon I)' },
  { value: '228767', label: '====== 000137 Honorarium Narasumber (Pejabat Eselon II)' },
  { value: '228768', label: '====== 000138 Honorarium Narasumber (Pejabat Eselon III)' },
  { value: '233484', label: '====== 01476. Honorarium Narasumber (MenteriPejabat Setingkat Menteri)' },
  { value: '228769', label: '==== Belanja Perjalanan Dinas Biasa' },
  { value: '228770', label: '====== 000139 Perjalanan Dinas Sulawesi' },
  { value: '228771', label: '==== Belanja Perjalanan Dinas Paket Meeting Dalam Kota' },
  { value: '228772', label: '====== 000146 Paket Rapat Luar Kantor Luar Kota' },
  { value: '228773', label: '== Penyusunan Laporan' },
  { value: '228774', label: '==== Belanja Bahan' },
  { value: '228775', label: '====== 001147. Alat Tulis Kantor' },
];

const cancelUrl = '/index.php?r=pekerjaan/view&id=4725';

function handleSubmit() {
  // Simulasi submit, bisa diganti dengan API call
  alert('Anggaran berhasil disimpan!');
  router.push(form.value.referrer);
}
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.breadcrumb {
  background: #fff;
  padding: 10px;
  list-style: none;
  border-radius: 4px;
  margin-bottom: 20px;
}
.breadcrumb li {
  display: inline;
}
.box {
  background: #fff;
  border-top: 3px solid #3c8dbc;
  margin-bottom: 20px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  border-radius: 3px;
}
.box-header {
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
  color: #444;
}
.box-body {
  padding: 10px;
}
.box-footer {
  border-top: 1px solid #f4f4f4;
  padding: 10px;
  background: #fff;
}
.form-group label {
  margin-bottom: 0;
}
.form-control {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 15px;
}
.btn {
  display: inline-block;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.42857;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-flat {
  border-radius: 0;
  box-shadow: none;
  border-width: 1px;
}
.btn-primary {
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
}
.btn-danger {
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a;
}
.btn-primary:hover {
  background-color: #286090;
}
.btn-danger:hover {
  background-color: #c9302c;
}
.alert {
  border-radius: 6px;
  padding: 12px 18px;
  font-size: 15px;
}
.alert-danger {
  background: #f2dede;
  color: #a94442;
  border: 1px solid #ebccd1;
}
</style>
