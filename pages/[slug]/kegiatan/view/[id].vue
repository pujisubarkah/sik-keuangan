<template>
  <div class="content-wrapper" style="min-height: 1164px;">
    <!-- Alert Section -->
    <section class="content-header">
      <div v-if="unassignedCount > 0" class="alert alert-danger" style="margin-bottom: 0px">
        Terdapat {{ unassignedCount }} Sub Output yang belum ditentukan unitnya.
        Silahkan
        <NuxtLink to="/index.php?r=pekerjaan/admin&id_unit=null">klik di sini</NuxtLink>
        untuk memperbaiki.
      </div>
    </section>

    <!-- Header & Breadcrumb -->
    <section class="content-header">
      <h1>
        Lihat Kegiatan<small></small>
      </h1>
      <ul class="breadcrumb">
        <li>
          <NuxtLink to="/index.php?r=/site/index">
            <i class="fa fa-dashboard"></i>
          </NuxtLink>
        </li>
        <li><span>Kegiatan</span></li>
        <li><span>{{ kegiatan.nama }}</span></li>
      </ul>
    </section>

    <!-- Main Content -->
    <section class="content">
      <div class="box box-primary">
        <div class="box-body">
          <table class="detail-view table table-striped table-condensed">
            <tbody>
              <tr><th>Tahun</th><td>{{ kegiatan.tahun }}</td></tr>
              <tr><th>Id Program</th><td>{{ kegiatan.idProgram }}</td></tr>
              <tr><th>Kode</th><td>{{ kegiatan.kode }}</td></tr>
              <tr><th>Nama</th><td>{{ kegiatan.nama }}</td></tr>
              <tr><th>Jumlah</th><td>{{ kegiatan.jumlah }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const unassignedCount = 41
const kegiatan = {
  tahun: 2026,
  idProgram: 243,
  kode: '7918',
  nama: 'Peningkatan Kualitas Layanan Umum, Kerja Sama, Hubungan Masyarakat, dan Sistem Informasi',
  jumlah: 115972623000
}
</script>

<style scoped>
.content-wrapper { background: #ecf0f5; }
.content-header { padding: 15px; }
.breadcrumb {
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  list-style: none;
  margin: 10px 0;
}
.breadcrumb li { display: inline; margin-right: 6px; }
.box {
  background: #fff;
  border-top: 3px solid #3c8dbc;
  margin: 0 15px 20px;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.box-body { padding: 12px; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td {
  padding: 8px;
  border-top: 1px solid #ddd;
}
</style>