<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-card.vue -->
<template>
  <div class="card bg-base-100 shadow-xl max-w-md mx-auto" :class="cardClass">
    <div class="card-body">
      <div class="flex items-center mb-4" v-if="icon || title">
        <div v-if="icon" class="mr-3">
          <component :is="icon" class="w-8 h-8 text-primary" />
        </div>
        <h2 class="card-title" v-if="title">{{ title }}</h2>
      </div>

      <div class="text-3xl font-bold mb-2" v-if="value">{{ value }}</div>
        <p class="text-base-content" v-if="subtitle">{{ subtitle }}</p>

      <div class="card-actions justify-end mt-4" v-if="showActions">
        <button
          class="btn btn-primary btn-sm"
          @click="$emit('action')"
        >
          {{ actionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaisyCard',
  props: {
    title: {
      type: String,
      default: 'Card Title'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: [String, Object],
      default: ''
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'secondary', 'accent', 'neutral'].includes(value)
    },
    showActions: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: 'Action'
    }
  },
  emits: ['action'],
  computed: {
    cardClass() {
      const baseClass = 'card bg-base-100 shadow-xl transition-all duration-200'
      // Outline lebih tipis dan soft, efek hover
      switch (this.variant) {
        case 'primary':
          return `${baseClass} border border-primary/40 hover:border-primary hover:shadow-2xl`
        case 'secondary':
          return `${baseClass} border border-secondary/40 hover:border-secondary hover:shadow-2xl`
        case 'accent':
          return `${baseClass} border border-accent/40 hover:border-accent hover:shadow-2xl`
        case 'neutral':
          return `${baseClass} border border-neutral/40 hover:border-neutral hover:shadow-2xl`
        default:
          return baseClass + ' border border-base-200 hover:border-primary/60 hover:shadow-2xl'
      }
    }
  }
}
</script>