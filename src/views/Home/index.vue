<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import NavBar from '@/components/layout/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import VideoCard from '@/components/video/VideoCard.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { videoApi } from '@/api/video'

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('login')

const handleOpenAuth = (mode: 'login' | 'register') => {
  authMode.value = mode
  showAuthModal.value = true
}

const videoList = ref<any[]>([])
const loading = ref(true)

const getImageUrl = (url: string) => {
  if (!url) return ''
  // 修正后端返回的url。有时候 minio 返回的 url 是 localhost:9000 开头，但在前端如果用了代理，可能需要处理。
  // 不过通常情况下如果是完整的 http URL，可以直接使用
  return url
}

const fetchVideos = async () => {
  try {
    loading.value = true
    const res = await videoApi.getVideoList({ page: 1, page_size: 20 })
    videoList.value = res.data.data.items.map(v => ({
      id: v.id,
      title: v.title,
      cover: getImageUrl(v.cover_url),
      author: 'Up主_' + v.user_id, // TODO: replace with real user info if available
      plays: v.view_count,
      date: new Date(v.created_at).toLocaleDateString(),
      duration: formatDuration(v.duration)
    }))
  } catch (error) {
    console.error('获取视频列表失败:', error)
  } finally {
    loading.value = false
  }
}

const formatDuration = (seconds: number) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchVideos()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-acg-bg">
    <NavBar @open-auth="handleOpenAuth" />

    <!-- Changed from max-w-[1400px] to full width with max constraints only on ultrawide -->
    <main class="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex-1">
      <HeroSection v-if="videoList.length > 0" :recommendations="videoList" />

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