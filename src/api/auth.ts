import api from './index'

export const authApi = {
  login(data: any) {
    return api.post('/auth/login', data)
  },
  register(data: any) {
    return api.post('/auth/register', data)
  }
}