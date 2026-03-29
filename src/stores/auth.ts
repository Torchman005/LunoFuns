import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
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

  const login = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login({ username, password })
      const { token: newToken, user: userData } = response.data.data
      setLoginData(newToken, userData)
      return true
    } catch (err: any) {
      error.value = err.error || '登录失败'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await authApi.register(data)
      return true
    } catch (err: any) {
      error.value = err.error || '注册失败'
      return false
    } finally {
      loading.value = false
    }
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
    loading,
    error,
    setLoginData,
    login,
    register,
    logout,
    isLoggedIn
  }
})