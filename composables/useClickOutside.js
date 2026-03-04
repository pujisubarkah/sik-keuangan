import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(ref, callback) {
  const handler = (event) => {
    if (ref.value && !ref.value.contains(event.target)) {
      callback(event)
    }
  }

  onMounted(() => document.addEventListener('click', handler))
  onUnmounted(() => document.removeEventListener('click', handler))
  
  return { handler }
}
