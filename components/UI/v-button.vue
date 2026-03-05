<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-button.vue -->
<template>
  <button
    class="btn"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
    <component v-if="prependIcon && !loading" :is="prependIcon" class="w-4 h-4 mr-2" />
    {{ text }}
    <component v-if="appendIcon && !loading" :is="appendIcon" class="w-4 h-4 ml-2" />
  </button>
</template>

<script>
export default {
  name: 'DaisyButton',
  props: {
    text: {
      type: String,
      default: 'Button'
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'neutral', 'ghost', 'outline'].includes(value)
    },
    variant: {
      type: String,
      default: 'filled',
      validator: (value) => ['filled', 'outline', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: [String, Object],
      default: ''
    },
    appendIcon: {
      type: [String, Object],
      default: ''
    }
  },
  emits: ['click'],
  computed: {
    buttonClass() {
      let classes = ['btn']

      // Size
      if (this.size !== 'md') {
        classes.push(`btn-${this.size}`)
      }

      // Variant and Color
      if (this.variant === 'outline') {
        classes.push(`btn-outline btn-${this.color}`)
      } else if (this.variant === 'ghost') {
        classes.push(`btn-ghost`)
      } else {
        classes.push(`btn-${this.color}`)
      }

      return classes.join(' ')
    }
  }
}
</script>
