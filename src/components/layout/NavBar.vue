<script setup lang="ts">
import { NInput, NButton, NAvatar } from 'naive-ui'
const navLinks = [
  { name: '首页', icon: 'ri-home-smile-2-line', active: true },
  { name: '番剧', icon: 'ri-tv-2-line', active: false },
  { name: '游戏', icon: 'ri-gamepad-line', active: false },
  { name: '直播', icon: 'ri-live-line', active: false },
  { name: '舞蹈', icon: 'ri-star-smile-line', active: false },
]
</script>

<template>
  <header class="sticky top-0 z-50 h-16 bg-white shadow-sm flex items-center">
    <div class="max-w-[2000px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4 lg:gap-8">
      <!-- Logo -->
      <div class="text-xl sm:text-2xl font-extrabold text-acg-primary flex items-center gap-1 sm:gap-2 cursor-pointer font-['Nunito'] shrink-0">
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
        <n-avatar
          round
          size="large"
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luno&backgroundColor=ffdfbf"
          class="cursor-pointer transition-transform duration-200 hover:scale-110 shadow-sm border-2 border-white"
        />
        <n-button type="primary" size="large" class="shadow-[0_4px_12px_rgba(255,133,162,0.3)] hover:-translate-y-0.5 transition-transform duration-200">
          <template #icon>
            <i class="ri-upload-cloud-2-line"></i>
          </template>
          <span class="hidden sm:inline-block font-bold">投稿</span>
        </n-button>
      </div>
    </div>
  </header>
</template>