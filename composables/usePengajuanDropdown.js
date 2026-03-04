import { ref } from 'vue'

export function usePengajuanDropdown() {
  const isPengajuanOpen = ref(false)
  const pengajuanDropdownRef = ref(null)

  const togglePengajuan = () => { isPengajuanOpen.value = !isPengajuanOpen.value }
  const closePengajuan = () => { isPengajuanOpen.value = false }
  const handleClickOutside = (event) => {
    if (pengajuanDropdownRef.value && !pengajuanDropdownRef.value.contains(event.target)) {
      closePengajuan()
    }
  }

  return { isPengajuanOpen, pengajuanDropdownRef, togglePengajuan, closePengajuan, handleClickOutside }
}