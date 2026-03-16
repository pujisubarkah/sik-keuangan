<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-text-field.vue -->
<template>
  <div class="form-control w-full mb-4">
    <label class="label" v-if="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <div class="relative">
      <component
        v-if="prependIcon"
        :is="prependIcon"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60"
      />
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :class="inputClass"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input input-bordered w-full"
      />
    </div>
    <div v-if="errorMessages && errorMessages.length" class="text-error text-sm mt-1">
      <span v-for="error in errorMessages" :key="error">{{ error }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaisyInput',
  props: {
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array,
      default: () => []
    },
    prependIcon: {
      type: [String, Object],
      default: ''
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'secondary', 'accent'].includes(value)
    }
  },
  emits: ['update:modelValue'],
  computed: {
    inputClass() {
      let classes = ['input', 'input-bordered', 'w-full']

      if (this.prependIcon) {
        classes.push('pl-10')
      }

      if (this.variant !== 'default') {
        classes.push(`input-${this.variant}`)
      }

      if (this.errorMessages && this.errorMessages.length) {
        classes.push('input-error')
      }

      return classes.join(' ')
    }
  }
}
</script>
