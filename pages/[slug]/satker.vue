<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const showAlert = ref(true)
const filter = ref({ nama: '' })
const satkers = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      navigateTo('/login')
      return
    }
    
    const res = await $fetch('/api/satker/unit-count', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    satkers.value = res.map(s => ({
      id: s.id,
      name: s.name,
      unit: Number(s.unit_count)
    }))
  } catch (err) {
    console.error(err)
    if (err.statusCode === 401) {
      localStorage.removeItem('token')
      navigateTo('/login')
    }
  }
})
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/satker" class="hover:text-blue-700">Satkers</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Manage</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      Daftar Satker
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <!-- ACTION -->
        <div class="mb-4">
          <NuxtLink
            to="/admin/satker/create"
            class="btn btn-success"
          >
            <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
            Tambah Satker
          </NuxtLink>
        </div>
    

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th>Nama</th>
                <th class="text-center">Jumlah Unit</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input
                    v-model="filter.nama"
                    class="input input-bordered input-xs w-full"
                    placeholder="Nama Satker"
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(s, i) in satkers.filter(sk => sk.name.toLowerCase().includes(filter.nama.toLowerCase()))"
                :key="s.id"
                class="hover:bg-blue-50 transition"
              >
                <td class="text-center font-bold text-blue-700">{{ i + 1 }}</td>
                <td class="font-semibold text-blue-700">{{ s.name }}</td>
                <td class="text-center">
                  <span class="badge badge-success text-white font-bold px-2 py-1 rounded-lg" style="font-size:0.95em; min-width:fit-content; display:inline-block;">
                    {{ s.unit }} Unit
                  </span>
                </td>
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <NuxtLink
                      :to="`/admin/satker/view/${s.id}`"
                      class="btn btn-xs btn-circle btn-info tooltip"
                      data-tip="View"
                    >
                      <Icon icon="tabler:eye" class="w-4 h-4" />
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/satker/update/${s.id}`"
                      class="btn btn-xs btn-circle btn-warning tooltip"
                      data-tip="Update"
                    >
                      <Icon icon="tabler:pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button
                      class="btn btn-xs btn-circle btn-error tooltip text-white"
                      data-tip="Delete"
                      @click="confirm('Yakin hapus satker ini?')"
                    >
                      <Icon icon="tabler:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
