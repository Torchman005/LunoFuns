<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import NavBar from '@/components/layout/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import VideoCard from '@/components/video/VideoCard.vue'
import AuthModal from '@/components/auth/AuthModal.vue'

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('login')

const handleOpenAuth = (mode: 'login' | 'register') => {
  authMode.value = mode
  showAuthModal.value = true
}

const videoList = ref([
  {
    id: 1,
    title: '【原神】2026交响音乐会 - 蒙德篇 完整版现场录制',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    author: 'Genshin_Official',
    plays: '124.5万',
    date: '2026-03-25',
    duration: '01:24:10'
  },
  {
    id: 2,
    title: '超甜！书记舞翻跳~❤',
    cover: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=400',
    author: '可爱小草莓',
    plays: '89.2万',
    date: '2026-03-26',
    duration: '03:15'
  },
  {
    id: 3,
    title: '《进击的巨人》最终季 高燃混剪 MAD',
    cover: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400',
    author: 'Anime_MAD',
    plays: '210万',
    date: '2026-03-27',
    duration: '04:30'
  },
  {
    id: 4,
    title: '新人UP主初投稿！请多指教~',
    cover: 'https://images.unsplash.com/photo-1580477659142-083f510ba1b6?auto=format&fit=crop&q=80&w=400',
    author: '星野Akari',
    plays: '5.6万',
    date: '昨天',
    duration: '10:02'
  },
  {
    id: 5,
    title: '【塞尔达】那些绝美的风景与瞬间',
    cover: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=400',
    author: 'Link_Explorer',
    plays: '45万',
    date: '3天前',
    duration: '08:45'
  },
  {
    id: 6,
    title: '手作Vlog：用黏土做一只可爱的星之卡比！',
    cover: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?auto=format&fit=crop&q=80&w=400',
    author: '手工小达人',
    plays: '12.3万',
    date: '03-20',
    duration: '15:20'
  },
  {
    id: 7,
    title: '【日常】秋叶原圣地巡礼！带你逛遍手办店',
    cover: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=400',
    author: 'Travel_Japan',
    plays: '34万',
    date: '1周前',
    duration: '22:15'
  },
  {
    id: 8,
    title: '治愈向环境音：夏日午后的蝉鸣与微风',
    cover: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&q=80&w=400',
    author: 'Sleep_ASMR',
    plays: '88万',
    date: '2026-03-15',
    duration: '01:00:00'
  }
])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-acg-bg">
    <NavBar @open-auth="handleOpenAuth" />

    <!-- Changed from max-w-[1400px] to full width with max constraints only on ultrawide -->
    <main class="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex-1">
      <HeroSection :recommendations="videoList" />

      <!-- Video Grid Section -->
      <section>
        <div class="flex justify-between items-center mb-5 sm:mb-6">
          <div class="flex items-center gap-2 text-xl sm:text-2xl text-acg-text-main">
            <i class="ri-fire-fill text-2xl sm:text-3xl text-acg-primary"></i>
            <h2 class="font-bold">热门推荐</h2>
          </div>
          <n-button secondary round size="medium">
            <template #icon>
              <i class="ri-refresh-line"></i>
            </template>
            换一换
          </n-button>
        </div>
        
        <!-- Expanded grid columns for larger screens to use space better -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4 sm:gap-6">
          <VideoCard 
            v-for="video in videoList" 
            :key="video.id" 
            :video="video" 
          />
        </div>
      </section>
    </main>
    
    <AuthModal v-model:show="showAuthModal" :initial-mode="authMode" />
  </div>
</template>