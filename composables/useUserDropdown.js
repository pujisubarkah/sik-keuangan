import { ref } from 'vue'

export function useUserDropdown() {
  const isUserOpen = ref(false)
  const userDropdownRef = ref(null)

  const toggleUser = () => { isUserOpen.value = !isUserOpen.value }
  const closeUser = () => { isUserOpen.value = false }
  const handleClickOutside = (event) => {
    if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
      closeUser()
    }
  }

  return { isUserOpen, userDropdownRef, toggleUser, closeUser, handleClickOutside }
}