<script setup lang="ts">
import { ref } from 'vue'
import { NInput, NButton, NAvatar, NPopover, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const message = useMessage()

const navLinks = [
  { name: '首页', icon: 'ri-home-smile-2-line', active: true },
  { name: '番剧', icon: 'ri-tv-2-line', active: false },
  { name: '游戏', icon: 'ri-gamepad-line', active: false },
  { name: '直播', icon: 'ri-live-line', active: false },
  { name: '舞蹈', icon: 'ri-star-smile-line', active: false },
]

// Emits to open auth modals
const emit = defineEmits<{
  (e: 'open-auth', mode: 'login' | 'register'): void
}>()

const handleLoginClick = () => {
  emit('open-auth', 'login')
}

const handleRegisterClick = () => {
  emit('open-auth', 'register')
}

const handleLogout = () => {
  authStore.logout()
  message.success('已退出登录')
}

import { useRouter } from 'vue-router'
const router = useRouter()
const goToUpload = (e?: Event) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  if (!authStore.isLoggedIn()) {
    message.warning('请先登录后再投稿')
    handleLoginClick()
    return
  }
  router.push('/upload')
}
</script>

<template>
  <header class="sticky top-0 z-50 h-16 bg-white shadow-sm flex items-center">
    <div class="max-w-[2000px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4 lg:gap-8">
      <!-- Logo -->
      <div @click="router.push('/')" class="text-xl sm:text-2xl font-extrabold text-acg-primary flex items-center gap-1 sm:gap-2 cursor-pointer font-['Nunito'] shrink-0">
        <i class="ri-blaze-line text-2xl sm:text-3xl"></i>
        <span class="hidden sm:inline-block">LunoFuns</span>
      </div>
      
      <!-- Nav Links -->
      <nav class="hidden md:flex gap-1 lg:gap-2 shrink-0">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          href="#" 
          class="px-3 lg:px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors duration-200 text-acg-text-main hover:bg-acg-bg hover:text-acg-primary whitespace-nowrap"
          :class="{ 'bg-[#fff0f3] text-acg-primary': link.active }"
        >
          <i :class="link.icon"></i>
          {{ link.name }}
        </a>
      </nav>

      <!-- Search -->
      <div class="flex-1 max-w-[500px] mx-auto min-w-[150px]">
        <n-input round placeholder="搜索番剧、UP主、视频..." size="large" clearable>
          <template #suffix>
            <i class="ri-search-line text-acg-text-muted hover:text-acg-primary cursor-pointer transition-colors"></i>
          </template>
        </n-input>
      </div>

      <!-- User Actions -->
      <div class="flex items-center gap-3 sm:gap-5 shrink-0">
        <!-- Avatar with Popover for Login/Register if not logged in -->
        <n-popover v-if="!authStore.isLoggedIn()" trigger="hover" placement="bottom" :show-arrow="false" style="border-radius: 12px; padding: 20px; width: 240px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <template #trigger>
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-white shadow-sm transition-transform hover:scale-110 text-gray-400">
              <i class="ri-user-3-fill text-xl"></i>
            </div>
          </template>
          <div class="flex flex-col items-center gap-3 text-center">
            <h3 class="text-sm text-acg-text-main font-semibold mb-2">登录后享受更多精彩功能</h3>
            <n-button type="primary" block round size="large" @click="handleLoginClick">
              立即登录
            </n-button>
            <div class="text-xs text-acg-text-muted mt-1">
              首次使用？ <a href="#" class="text-acg-primary hover:text-acg-primary-hover transition-colors font-semibold" @click.prevent="handleRegisterClick">点我注册</a>
            </div>
          </div>
        </n-popover>

        <!-- Avatar with Popover for Logged In User -->
        <n-popover v-else trigger="hover" placement="bottom" :show-arrow="false" style="border-radius: 12px; padding: 0; width: 200px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <template #trigger>
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer transition-all duration-300 hover:scale-125 origin-center overflow-hidden z-10 relative">
              <img :src="authStore.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luno&backgroundColor=ffdfbf'" alt="Avatar" class="w-full h-full object-cover" />
            </div>
          </template>
          <div class="flex flex-col">
            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <div class="font-bold text-acg-text-main text-base truncate">{{ authStore.user?.nickname || authStore.user?.username || '用户' }}</div>
            </div>
            <div class="py-2">
              <a href="#" class="flex items-center gap-3 px-5 py-2.5 text-acg-text-main hover:bg-acg-bg hover:text-acg-primary transition-colors">
                <i class="ri-user-smile-line text-lg"></i> 个人中心
              </a>
              <a href="#" class="flex items-center gap-3 px-5 py-2.5 text-acg-text-main hover:bg-acg-bg hover:text-acg-primary transition-colors">
                <i class="ri-palette-line text-lg"></i> 个性化
              </a>
              <div class="h-px bg-gray-100 my-1 mx-4"></div>
              <a href="#" @click.prevent="handleLogout" class="flex items-center gap-3 px-5 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                <i class="ri-logout-box-r-line text-lg"></i> 退出登录
              </a>
            </div>
          </div>
        </n-popover>

        <n-button @click="goToUpload" type="primary" size="large" class="shadow-[0_4px_12px_rgba(255,133,162,0.3)] hover:-translate-y-0.5 transition-transform duration-200" style="z-index: 10; cursor: pointer;">
          <template #icon>
            <i class="ri-upload-cloud-2-line pointer-events-none"></i>
          </template>
          <span class="hidden sm:inline-block font-bold pointer-events-none">投稿</span>
        </n-button>
      </div>
    </div>
  </header>
</template>