<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-dialog.vue -->
<template>
  <div v-if="modelValue" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ title }}</h3>

      <div class="py-4">
        <slot></slot>
      </div>

      <div class="modal-action">
        <button
          class="btn"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaisyModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    }
  },
  emits: ['update:modelValue', 'cancel', 'confirm']
}
</script>
