<template>
  <div class="modern-card">
    <div class="modern-card-header">
      <h3 class="modern-card-title">Daftar Berkas</h3>
      <slot name="add-button">
        <button class="modern-btn modern-btn-primary" @click="$emit('add')">
          <i class="fa fa-plus"></i> Tambah Berkas
        </button>
      </slot>
    </div>
    <div class="modern-card-body">
      <table class="modern-table">
        <thead>
          <tr>
            <th style="text-align:center" width="50px">No</th>
            <th>Nama Berkas</th>
            <th width="200px" style="text-align:center">Status</th>
            <th width="80px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in berkasList" :key="item.id">
            <td style="text-align:center">{{ idx + 1 }}</td>
            <td>{{ item.nama }}</td>
            <td style="text-align:center">
              <span :class="['modern-label', item.status === 'Belum Tersedia' ? 'modern-label-danger' : 'modern-label-success']">
                {{ item.status }}
              </span>
            </td>
            <td style="text-align:center">
              <div class="modern-action-icons">
                <NuxtLink :to="`/${$route.params.slug}/pengeluaran/berkas/${item.id}`" class="modern-btn modern-btn-icon">
                  <i class="fa fa-pencil"></i>
                </NuxtLink>
                <button class="modern-btn modern-btn-icon" @click="$emit('delete', item)"><i class="fa fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  berkasList: {
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
.modern-table td .modern-action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.modern-label {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
}
.modern-label-danger {
  background: #fee2e2;
  color: #b91c1c;
}
.modern-label-success {
  background: #dcfce7;
  color: #166534;
}
.modern-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  transition: background 0.15s;
  margin: 0 2px;
}
.modern-btn-icon {
  padding: 6px 8px;
  font-size: 1.1rem;
  background: none;
}
.modern-btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  margin-left: 8px;
}
.modern-btn-primary:hover {
  background: #1d4ed8;
}
.modern-btn:hover {
  background: #f1f5f9;
}
</style>
