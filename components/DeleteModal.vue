<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full m-4">
      <h2 class="text-xl font-bold text-red-700 mb-3">Konfirmasi Hapus</h2>
      <p class="mb-4 text-gray-700">Apakah anda yakin akan menghapus item ini? Tindakan ini tidak dapat dibatalkan.</p>
      
      <div v-if="error" class="my-3 text-sm bg-red-100 border border-red-300 text-red-800 rounded-lg p-3">{{ error }}</div>
      <div v-if="success" class="my-3 text-sm bg-green-100 border border-green-300 text-green-800 rounded-lg p-3">Data berhasil dihapus.</div>
      
      <div class="flex justify-end gap-3 mt-5">
        <button @click="$emit('close')" :disabled="loading" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 font-medium">
          Batal
        </button>
        <button @click="$emit('confirm')" :disabled="loading" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 font-medium">
          <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  loading: Boolean,
  error: String,
  success: Boolean,
})

defineEmits(['close', 'confirm'])
</script>
