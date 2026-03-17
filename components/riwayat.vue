<template>
  <div class="modern-card">
    <div class="modern-card-header">
      <h3 class="modern-card-title">Riwayat Perubahan Data</h3>
    </div>
    <div class="modern-card-body">
      <table class="modern-table">
        <thead>
          <tr>
            <th style="width: 5px; text-align: center">No</th>
            <th style="text-align: center">User</th>
            <th style="text-align: center">Aktivitas</th>
            <th style="text-align: center">Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in riwayatList" :key="item.id">
            <td style="text-align:center">{{ idx + 1 }}</td>
            <td style="text-align:center">{{ item.user }}</td>
            <td>{{ item.aktivitas }}</td>
            <td style="text-align:center">{{ item.waktu }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  riwayatList: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<style scoped>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 24px 32px;
  background: #fff;
}
.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}
.modern-table th, .modern-table td {
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
}
.modern-table th {
  background: #f1f5f9;
  font-weight: 700;
  color: #1e293b;
}
</style>
