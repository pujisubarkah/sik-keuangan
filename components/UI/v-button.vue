<template>
  <component
    :is="as"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg 
      v-if="loading" 
      class="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>

    <!-- Prepend Icon -->
    <component 
      v-if="prependIcon && !loading" 
      :is="prependIcon" 
      class="w-4 h-4" 
    />

    <span class="flex-1 text-center" v-if="$slots.default">
      <slot />
    </span>
    <span v-else>{{ text }}</span>

    <!-- Append Icon -->
    <component 
      v-if="appendIcon && !loading" 
      :is="appendIcon" 
      class="w-4 h-4" 
    />
  </component>
</template>

    <script setup>
    import { computed } from 'vue'

    const props = defineProps({
      as: { type: String, default: 'button' }, // 'button', 'a', 'router-link', dll
      type: { type: String, default: 'button' },
      text: { type: String, default: '' },
      // Variant warna
      variant: { 
        type: String, 
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'success', 'danger', 'outline'].includes(v)
      },
      // Ukuran
      size: { 
        type: String, 
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg'].includes(v)
      },
      disabled: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
      prependIcon: { type: [Object, String], default: null },
      appendIcon: { type: [Object, String], default: null },
      fullWidth: { type: Boolean, default: false }
    })

    defineEmits(['click'])

    // Map variant ke class Tailwind
    const variantClasses = {
      primary: 'border-[#03300C] bg-[#03300C] text-white hover:bg-[#022408] hover:border-[#022408] hover:shadow-lg',
      secondary: 'border-gray-600 bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg',
      success: 'border-emerald-800 bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg',
      danger: 'border-red-800 bg-red-700 text-white hover:bg-red-800 hover:shadow-lg',
      outline: 'border-green-800 bg-transparent text-green-700 hover:bg-green-50 hover:shadow-md',
      brandblue: 'border-brandBlue-700 bg-brandBlue-600 text-white hover:bg-brandBlue-700 active:bg-brandBlue-800 hover:border-brandBlue-800 active:border-brandBlue-800 focus:outline-none focus:ring-2 focus:ring-brandBlue-300 focus:ring-offset-2 shadow-md transition-all'
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const buttonClasses = computed(() => [
      'inline-flex items-center gap-2 rounded-md border font-semibold shadow-md transition-all',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md',
      variantClasses[props.variant],
      sizeClasses[props.size],
      props.fullWidth ? 'w-full justify-center' : ''
    ])
    </script>