<template>
  <!-- ✅ Modal Konfirmasi Hapus - OUTSIDE v-for, root of template -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fadein">
      <h2 class="text-xl font-bold text-red-700 mb-3">Konfirmasi Hapus</h2>
      <p class="mb-4 text-gray-700">Apakah anda yakin akan menghapus kegiatan ini?</p>
      <div v-if="deleteError" class="mb-2 text-red-600">{{ deleteError }}</div>
      <div v-if="deleteSuccess" class="mb-2 text-green-600">Data berhasil dihapus.</div>
      <div class="flex justify-end gap-3 mt-4">
        <button @click="$emit('close')" :disabled="deleteLoading" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Batal</button>
        <button @click="$emit('confirm')" :disabled="deleteLoading" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
          <span v-if="deleteLoading" class="loader mr-2"></span>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  showDeleteModal: Boolean,
  deleteLoading: Boolean,
  deleteError: String,
  deleteSuccess: Boolean
})

// Emits
defineEmits(['close', 'confirm'])
</script>

<style scoped>
@keyframes fadein {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadein {
  animation: fadein 0.2s ease-out;
}
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

