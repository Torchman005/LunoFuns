import api from './index'

export const loginApi = (data: any) => {
  return api.post('/auth/login', data)
}

export const registerApi = (data: any) => {
  return api.post('/auth/register', data)
}