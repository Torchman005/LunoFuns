<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { loginApi, registerApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  show: boolean
  initialMode?: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const message = useMessage()
const authStore = useAuthStore()

const internalShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const mode = ref<'login' | 'register'>(props.initialMode || 'login')
const loading = ref(false)

// Sync mode when initialMode prop changes (e.g. when clicking different buttons in NavBar)
watch(() => props.initialMode, (newMode) => {
  if (newMode) {
    mode.value = newMode
  }
})

// Form Data
const formData = ref({
  username: '',
  password: '',
  nickname: '',
  email: ''
})

const formRef = ref<any>(null)

const loginRules = {
  username: [{ required: true, message: '请输入账号或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'input'] }
  ]
}

const handleClose = () => {
  internalShow.value = false
  // Reset form
  formData.value = {
    username: '',
    password: '',
    nickname: '',
    email: ''
  }
}

const switchMode = (newMode: 'login' | 'register') => {
  mode.value = newMode
  formRef.value?.restoreValidation()
}

const handleSubmit = (e: Event) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (mode.value === 'login') {
        handleLogin()
      } else {
        handleRegister()
      }
    }
  })
}

const handleLogin = async () => {
  try {
    loading.value = true
    const res = await loginApi({
      username: formData.value.username,
      password: formData.value.password
    })
    
    // Assuming backend returns { data: { token: '...', user: {...} }, message: '...' }
    // Adjust this according to your actual backend response structure
    const token = res.data?.data?.token || res.data?.token
    const user = res.data?.data?.user || res.data?.user
    
    if (token) {
      authStore.setLoginData(token, user)
      message.success('登录成功')
      handleClose()
    } else {
      message.error('登录失败，未获取到凭证')
    }
  } catch (error: any) {
    message.error(error.message || error.error || '登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    await registerApi({
      username: formData.value.username,
      password: formData.value.password,
      nickname: formData.value.nickname,
      email: formData.value.email
    })
    
    message.success('注册成功，请登录')
    switchMode('login')
  } catch (error: any) {
    message.error(error.message || error.error || '注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <n-modal v-model:show="internalShow" :mask-closable="false">
    <!-- Adjusted bottom padding and removed minimum height to make the modal shorter -->
    <div class="bg-white rounded-2xl w-[480px] px-8 md:px-12 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative flex flex-col items-center" style="padding-bottom: 50px;">
      <!-- Close Button -->
      <div class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer text-2xl transition-colors z-10" @click="handleClose">
        <i class="ri-close-line"></i>
      </div>

      <!-- Header -->
      <div class="text-center mb-10 mt-2 w-full">
        <div class="w-16 h-16 bg-acg-bg rounded-full flex items-center justify-center mx-auto mb-5 text-acg-primary text-3xl shadow-sm">
          <i class="ri-blaze-fill"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-wide">
          {{ mode === 'login' ? '欢迎回来' : '创建新账号' }}
        </h2>
        <p class="text-gray-500 text-sm mt-3">
          {{ mode === 'login' ? '登录以体验更多精彩内容' : '加入 LunoFuns，开启你的二次元之旅' }}
        </p>
      </div>

      <!-- Form with a fixed width, centered perfectly -->
      <div class="w-full max-w-[340px]">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="mode === 'login' ? loginRules : registerRules"
          size="large"
          :show-require-mark="false"
        >
          <template v-if="mode === 'register'">
            <n-form-item path="nickname">
              <n-input v-model:value="formData.nickname" placeholder="昵称" round>
                <template #prefix>
                  <i class="ri-user-smile-line text-gray-400 mr-2 ml-1"></i>
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="email">
              <n-input v-model:value="formData.email" placeholder="邮箱" round>
                <template #prefix>
                  <i class="ri-mail-line text-gray-400 mr-2 ml-1"></i>
                </template>
              </n-input>
            </n-form-item>
          </template>

          <n-form-item path="username">
            <n-input v-model:value="formData.username" :placeholder="mode === 'login' ? '账号/邮箱' : '用户名'" round>
              <template #prefix>
                <i class="ri-user-3-line text-gray-400 mr-2 ml-1"></i>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="password">
            <n-input
              v-model:value="formData.password"
              type="password"
              show-password-on="click"
              placeholder="密码"
              round
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <i class="ri-lock-password-line text-gray-400 mr-2 ml-1"></i>
              </template>
            </n-input>
          </n-form-item>

          <div v-if="mode === 'login'" class="flex justify-end pr-2" style="margin-top: -10px; margin-bottom: 10px;">
            <a href="#" class="text-sm text-acg-primary hover:text-acg-primary-hover transition-colors">忘记密码？</a>
          </div>

          <!-- Add explicit inline space above buttons to guarantee they are pushed down further -->
          <div class="flex gap-4" style="margin-top: 40px;">
            <n-button 
              v-if="mode === 'login'"
              class="flex-1 shadow-sm font-semibold" 
              size="large" 
              round 
              @click="switchMode('register')"
              :disabled="loading"
            >
              注册
            </n-button>
            
            <n-button 
              type="primary" 
              class="flex-1 shadow-[0_4px_12px_rgba(255,133,162,0.3)] font-bold text-base" 
              size="large" 
              round 
              :loading="loading"
              @click="handleSubmit"
            >
              {{ mode === 'login' ? '登录' : '立即注册' }}
            </n-button>
          </div>

          <div v-if="mode === 'register'" class="text-center mt-6 text-sm text-gray-500">
            已有账号？ 
            <a href="#" class="text-acg-primary hover:text-acg-primary-hover font-semibold transition-colors" @click.prevent="switchMode('login')">
              直接登录
            </a>
          </div>

          <!-- Explicit bottom spacer to guarantee whitespace below buttons -->
          <div style="height: 10px; width: 100%;"></div>
        </n-form>
      </div>
    </div>
  </n-modal>
</template>