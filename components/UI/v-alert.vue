<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-alert.vue -->
<template>
  <div v-if="modelValue" class="alert mb-4" :class="alertClass">
    <component v-if="icon" :is="icon" class="w-6 h-6" />
    <div class="flex-1">
      <div v-if="title" class="font-semibold">{{ title }}</div>
      <div>{{ message }}</div>
    </div>
    <button
      v-if="dismissible"
      class="btn btn-sm btn-circle btn-ghost"
      @click="$emit('update:modelValue', false)"
    >
      ✕
    </button>
  </div>
</template>

<script>
export default {
  name: 'DaisyAlert',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    variant: {
      type: String,
      default: 'default'
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: 'This is an alert message'
    },
    icon: {
      type: [String, Object],
      default: ''
    }
  },
  emits: ['update:modelValue'],
  computed: {
    alertClass() {
      const baseClass = 'alert'

      switch (this.type) {
        case 'success':
          return `${baseClass} alert-success`
        case 'warning':
          return `${baseClass} alert-warning`
        case 'error':
          return `${baseClass} alert-error`
        case 'info':
        default:
          return `${baseClass} alert-info`
      }
    }
  }
}
</script>
