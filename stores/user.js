import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    name: '',
    role: '',
    role_id: null,
    satker_id: null
  }),
  actions: {
    setUser(data) {
      this.username = data.username
      this.name = data.name || data.username
      this.role = data.role || ''
      this.role_id = data.role_id || null
      this.satker_id = data.satker_id || null
    },
    clearUser() {
      this.username = ''
      this.name = ''
      this.role = ''
      this.role_id = null
      this.satker_id = null
    }
  }
})
