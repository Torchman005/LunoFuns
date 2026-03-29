import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<any>(null)
  
  // Try to load user from localStorage on init
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  } catch (e) {
    console.error('Failed to parse user from local storage')
  }

  const setLoginData = (newToken: string, userData: any) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isLoggedIn = () => {
    return !!token.value
  }

  return {
    token,
    user,
    setLoginData,
    logout,
    isLoggedIn
  }
})