<template>
  <div class="content-wrapper">
    <section class="content-header">
      <SuboutputAlert :showAlert="true" />
    </section>

    <section class="content-header">
      <h1>Sunting Pengeluaran <small>: Belanja Gaji Pokok PNS</small></h1>
      <ul class="breadcrumb">
        <li>
          <NuxtLink to="/"><i class="fa fa-dashboard"></i></NuxtLink>
        </li>
        <li><span>Pengeluaran</span></li>
        <li><span>Sunting</span></li>
      </ul>
    </section>

    <section class="content">
      <form class="modern-form" @submit.prevent>
        <div class="modern-card">
          <div class="modern-card-header">
            <h3 class="modern-card-title">Form Pengeluaran / Pengajuan</h3>
          </div>
          <div class="modern-card-body">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-slate-200 rounded-lg">
                <tbody>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold w-56 border-r border-slate-200">Tanggal Pengajuan</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" type="date" v-model="form.tanggal_pengajuan" />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Komponen</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" placeholder="Kode Komponen" v-model="form.kode_komponen" type="text" maxlength="20" />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Subkomponen</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" placeholder="Kode Subkomponen" v-model="form.kode_subkomponen" type="text" maxlength="20" />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Kode Akun</th>
                    <td class="px-4 py-2">
                      <input class="modern-form-control" placeholder="Kode Akun" v-model="form.kode_akun" type="text" />
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left align-top px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Jumlah Pengeluaran & Sisa Anggaran</th>
                    <td class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_jumlah">Jumlah Pengeluaran</label>
                          <div class="flex items-center gap-2">
                            <span class="modern-input-group-text">Rp</span>
                            <input id="Pengeluaran_jumlah" class="modern-form-control text-right" placeholder="0" v-model="form.jumlah" type="text" />
                          </div>
                        </div>
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_sisa">Sisa Anggaran</label>
                          <div class="flex items-center gap-2">
                            <span class="modern-input-group-text">Rp</span>
                            <input id="Pengeluaran_sisa" class="modern-form-control bg-light text-muted text-right" readonly placeholder="Sisa" v-model="form.sisa" type="text" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Keterangan</th>
                    <td class="px-4 py-2">
                      <textarea rows="3" class="modern-form-control" placeholder="Tambahkan keterangan detail di sini..." v-model="form.keterangan"></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left align-top px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status & Tanggal Cair</th>
                    <td class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_id_pengeluaran_status">Status</label>
                          <select id="Pengeluaran_id_pengeluaran_status" class="modern-form-control" v-model="form.id_pengeluaran_status">
                            <option value="1">Cair</option>
                            <option value="2">Proses</option>
                            <option value="3">Batal</option>
                          </select>
                        </div>
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_tanggal">Tanggal Cair</label>
                          <input id="Pengeluaran_tanggal" class="modern-form-control" type="date" v-model="form.tanggal" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left align-top px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status & Tanggal SP2D</th>
                    <td class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_status_sp2d">Status SP2D</label>
                          <select id="Pengeluaran_status_sp2d" class="modern-form-control" v-model="form.status_sp2d">
                            <option value="0">Belum</option>
                            <option value="1">Sudah</option>
                          </select>
                        </div>
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_tanggal_sp2d">Tanggal SP2D</label>
                          <input id="Pengeluaran_tanggal_sp2d" class="modern-form-control" type="date" v-model="form.tanggal_sp2d" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left align-top px-4 py-2 text-blue-600 font-semibold border-r border-slate-200">Status & Tanggal PJ</th>
                    <td class="px-4 py-2">
                      <div class="flex gap-4">
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_status_pertanggungjawaban">Status PJ</label>
                          <select id="Pengeluaran_status_pertanggungjawaban" class="modern-form-control" v-model="form.status_pertanggungjawaban">
                            <option value="">- Pilih Status -</option>
                            <option value="0">Belum</option>
                            <option value="1">Sudah</option>
                          </select>
                        </div>
                        <div class="flex flex-col flex-1">
                          <label class="mb-1 text-sm text-blue-600 font-semibold" for="Pengeluaran_tanggal_pertanggungjawaban">Tanggal PJ</label>
                          <input id="Pengeluaran_tanggal_pertanggungjawaban" class="modern-form-control" type="date" v-model="form.tanggal_pertanggungjawaban" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modern-card-footer">
            <button class="modern-btn modern-btn-primary" type="submit">
              <i class="fa fa-save"></i> Simpan
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Sunting Pengeluaran',
})

const form = ref({
  tanggal_pengajuan: '2026-03-17',
  kode_komponen: '001',
  kode_subkomponen: 'A',
  kode_akun: '511111',
  jumlah: '1.590.689.740',
  sisa: '12.119.064.580',
  keterangan: 'SPM 00078 - LS - Gaji Induk PNS Bulan April 2026 untuk 424Pegawai/1050 Jiwa',
  id_pengeluaran_status: '1',
  tanggal: '2026-04-01',
  status_sp2d: '1',
  tanggal_sp2d: '2026-04-01',
  status_pertanggungjawaban: '1',
  tanggal_pertanggungjawaban: '2026-03-12',
})
</script>

<style scoped>
.content-wrapper {
  background-color: #f6f8fa;
  font-family: 'Inter', 'Source Sans Pro', Arial, sans-serif;
  min-height: 100vh;
}
.content-header {
  padding: 24px 24px 0 24px;
}
.content-header > h1 {
  margin: 0;
  font-size: 1.7rem;
  font-weight: 700;
  color: #1e293b;
}
.content-header > h1 > small {
  font-size: 1rem;
  display: inline-block;
  padding-left: 8px;
  font-weight: 400;
  color: #64748b;
}
.breadcrumb {
  float: right;
  background: transparent;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 13px;
  padding: 7px 5px;
  position: absolute;
  top: 32px;
  right: 24px;
  border-radius: 2px;
}
.breadcrumb > li {
  display: inline-block;
}
.breadcrumb > li + li:before {
  content: '>\00a0';
  padding: 0 5px;
  color: #ccc;
}

.modern-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08);
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 32px;
  margin-top: 24px;
  transition: box-shadow 0.2s;
}
.modern-card-header {
  padding: 20px 32px;
  border-bottom: 1.5px solid #e2e8f0;
  background-color: #f8fafc;
}
.modern-card-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modern-card-body {
  padding: 32px;
  background: #fff;
}
.modern-card-footer {
  padding: 20px 32px;
  background-color: #f8fafc;
  border-top: 1.5px solid #e2e8f0;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
}

.modern-form {
  width: 100%;
}
.modern-form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 0;
}
.modern-form-col {
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.modern-form-col.full-width {
  flex-basis: 100%;
}
label {
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 4px;
}
.required:after {
  content: " *";
  color: #ef4444;
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
.modern-form-control:focus {
  border-color: #2563eb;
  outline: 0;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
}
.modern-form-control.bg-light {
  background-color: #f1f5f9;
  cursor: not-allowed;
  color: #64748b;
}
.text-muted {
  color: #64748b !important;
}
.text-right {
  text-align: right !important;
}
.modern-input-group {
  display: flex;
  align-items: stretch;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04);
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
.modern-input-group .modern-form-control {
  border-radius: 0 8px 8px 0;
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}
.modern-divider {
  height: 2px;
  background: linear-gradient(90deg, #2563eb 0%, #e2e8f0 100%);
  margin: 32px 0;
  border-radius: 2px;
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
.modern-btn-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px 0 rgba(37,99,235,0.12);
}
.modern-btn-cancel {
  color: #2563eb;
  background-color: #fff;
  border-color: #e2e8f0;
  font-weight: 600;
}
.modern-btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #1d4ed8;
}
@media (max-width: 900px) {
  .modern-card-body {
    padding: 16px;
  }
  .modern-card-header, .modern-card-footer {
    padding: 12px 16px;
  }
  .modern-form-row {
    gap: 16px;
  }
}
@media (max-width: 600px) {
  .modern-form-row {
    flex-direction: column;
    gap: 8px;
  }
  .modern-card-body {
    padding: 8px;
  }
}

.modern-form-vertical-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}
.modern-form-vertical-row {
  display: flex;
  align-items: center;
  gap: 24px;
}
.modern-form-vertical-row label {
  min-width: 180px;
  margin-bottom: 0;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
}
.modern-form-vertical-row .modern-form-control {
  flex: 1;
  margin-bottom: 0;
}
@media (max-width: 700px) {
  .modern-form-vertical-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  .modern-form-vertical-row label {
    text-align: left;
    min-width: 0;
  }
}
</style>