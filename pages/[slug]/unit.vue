<template>
  <div class="content-wrapper p-6">

    <!-- Alert -->
    <div class="alert alert-danger mb-4">
      Terdapat 41 Sub Output yang belum ditentukan unitnya.
      Silahkan
      <a href="/index.php?r=pekerjaan/admin&id_unit=null">klik di sini</a>
      untuk memperbaiki.
    </div>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Daftar Unit</h1>

      <ul class="breadcrumb flex gap-2 text-sm text-gray-500">
        <li><a href="/">Dashboard</a></li>
        <li>/</li>
        <li><a href="#">Units</a></li>
        <li>/</li>
        <li>Daftar</li>
      </ul>
    </div>

    <!-- Warning -->
    <div class="alert alert-warning mb-4">
      Untuk tambah/ubah/hapus unit dilakukan melalui aplikasi Sireva
    </div>

    <!-- Loading -->
    <div v-if="pending" class="text-center py-8 bg-white shadow rounded-lg">
      <p class="text-gray-600">Loading...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger mb-4">
      Error: {{ error.message }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white shadow rounded-lg p-4">
      <div class="mb-3 text-sm text-gray-600">
        Menampilkan <b>{{ units?.length || 0 }}</b> data
      </div>

      <table class="table-auto w-full border">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-center">No</th>
            <th class="p-2 text-left">Nama</th>
            <th class="p-2 text-left">Kode</th>
            <th class="p-2 text-center">Satker</th>
            <th class="p-2 text-center">Alias</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(unit, index) in units" :key="unit.id">
            <td class="text-center p-2">{{ index + 1 }}</td>
            <td class="p-2">{{ unit.name }}</td>
            <td class="p-2">{{ unit.kode }}</td>
            <td class="text-center p-2">{{ getSatkerName(unit.satker_id) }}</td>
            <td class="text-center p-2">{{ unit.alias }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="units && units.length === 0" class="text-center py-8 text-gray-500">
        Tidak ada data ditemukan
      </div>
    </div>

  </div>
</template>

<script setup>
// Get token from cookie or localStorage
const token = useCookie('auth_token') // atau useLocalStorage jika menggunakan localStorage

// Fetch units data from API with authorization
const { data: units, pending, error } = await useFetch('/api/unit_kerja', {
  headers: {
    Authorization: `Bearer ${token.value}`
  }
})

// Fetch satker data to get satker names
const { data: satkers } = await useFetch('/api/satker', {
  headers: {
    Authorization: `Bearer ${token.value}`
  }
})

// Helper function to get satker name by ID
const getSatkerName = (satkerId) => {
  if (!satkers.value) return '-'
  const satker = satkers.value.find(s => s.id === satkerId)
  return satker ? satker.name : '-'
}
</script>

<style scoped>
.alert {
  padding: 10px;
  border-radius: 6px;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
}
</style>