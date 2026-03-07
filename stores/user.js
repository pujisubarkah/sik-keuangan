import { defineStore } from 'pinia'

const STORAGE_KEY = 'auth_user'

function parseStoredUser() {
  if (!import.meta.client) return null

  const rawUser = localStorage.getItem(STORAGE_KEY)
  if (rawUser) {
    try {
      return JSON.parse(rawUser)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null

    const normalizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalizedBase64))

    return {
      username: payload.username || '',
      name: payload.name || payload.username || '',
      role: payload.role || '',
      role_id: payload.role_id || null,
      satker_id: payload.satker_id || null
    }
  } catch {
    return null
  }
}

function persistUser(data) {
  if (!import.meta.client) return

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    username: data.username || '',
    name: data.name || data.username || '',
    role: data.role || '',
    role_id: data.role_id || null,
    satker_id: data.satker_id || null
  }))
}

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
      this.username = data.username || ''
      this.name = data.name || data.username || ''
      this.role = data.role || ''
      this.role_id = data.role_id || null
      this.satker_id = data.satker_id || null
      persistUser({
        username: this.username,
        name: this.name,
        role: this.role,
        role_id: this.role_id,
        satker_id: this.satker_id
      })
    },
    hydrateFromStorage() {
      const storedUser = parseStoredUser()
      if (!storedUser) return

      this.username = storedUser.username || ''
      this.name = storedUser.name || storedUser.username || ''
      this.role = storedUser.role || ''
      this.role_id = storedUser.role_id || null
      this.satker_id = storedUser.satker_id || null
    },
    clearUser() {
      this.username = ''
      this.name = ''
      this.role = ''
      this.role_id = null
      this.satker_id = null
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
})
