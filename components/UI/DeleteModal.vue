<!-- components/UI/DeleteModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="show" 
        class="modal-overlay" 
        @click.self="handleOverlayClick"
        @keydown.esc="handleEscape"
        tabindex="-1"
      >
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          
          <!-- Header -->
          <div class="modal-header">
            <h3 id="modal-title" class="modal-title">
              <i class="fa fa-exclamation-triangle" />
              Konfirmasi Hapus
            </h3>
            <button 
              type="button" 
              class="modal-close" 
              @click="$emit('close')"
              :disabled="loading"
              aria-label="Tutup modal"
            >
              <i class="fa fa-times" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Success State -->
            <div v-if="success" class="alert alert-success">
              <i class="fa fa-check-circle" />
              Berkas berhasil dihapus.
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="alert alert-error">
              <i class="fa fa-exclamation-circle" />
              {{ error }}
            </div>
            
            <!-- Default Content -->
            <template v-else>
              <p class="modal-text">
                Apakah Anda yakin ingin menghapus berkas ini?
              </p>
              
              <div v-if="fileName" class="file-preview">
                <i class="fa fa-file-o" />
                <span class="file-name">{{ fileName }}</span>
              </div>
              
              <p class="modal-warning">
                <i class="fa fa-info-circle" />
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </template>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="$emit('close')"
              :disabled="loading"
            >
              Batal
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="$emit('confirm')"
              :disabled="loading || success"
            >
              <span v-if="loading" class="btn-loading">
                <i class="fa fa-spinner fa-spin" />
                Menghapus...
              </span>
              <span v-else-if="success">
                <i class="fa fa-check" />
                Terhapus
              </span>
              <span v-else>
                <i class="fa fa-trash" />
                Ya, Hapus
              </span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: Boolean, default: false },
  fileName: { type: String, default: '' }
})

const emit = defineEmits(['close', 'confirm'])

// Prevent body scroll when modal is open
watch(() => props.show, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

// Keyboard navigation
const handleEscape = (e) => {
  if (e.key === 'Escape' && !props.loading) {
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (!props.loading) {
    emit('close')
  }
}

// Focus trap (basic implementation)
onMounted(() => {
  if (props.show) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* Container */
.modal-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.3);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: modal-slide-up 0.2s ease-out;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-title i {
  color: #f59e0b;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
}
.modal-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}
.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Body */
.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.modal-text {
  margin: 0 0 16px 0;
  font-size: 1rem;
  color: #334155;
  line-height: 1.5;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 16px;
}
.file-preview i {
  color: #64748b;
  font-size: 1.25rem;
}
.file-name {
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  color: #1e293b;
  word-break: break-all;
}

.modal-warning {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-warning i {
  color: #3b82f6;
}

/* Alerts */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9375rem;
  margin-bottom: 16px;
}
.alert i {
  font-size: 1.125rem;
  margin-top: 2px;
}
.alert-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Footer */
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 8px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  color: #2563eb;
  border-color: #e2e8f0;
}
.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgb(239 68 68 / 0.3);
}

.btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-container {
    max-height: 95vh;
    border-radius: 12px;
  }
  .modal-footer {
    flex-direction: column-reverse;
  }
  .btn {
    width: 100%;
  }
}
</style>