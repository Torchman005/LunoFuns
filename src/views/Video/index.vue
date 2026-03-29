<template>
  <div class="video-page-wrapper">
    <NavBar @open-auth="() => {}" />
    
    <div class="video-detail-container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="video" class="video-content">
        <!-- 视频播放器 -->
        <div class="player-wrapper">
          <video 
            :src="getImageUrl(video.video_url)" 
            :poster="getImageUrl(video.cover_url)"
            controls 
            autoplay
            class="video-player">
            您的浏览器不支持 HTML5 视频播放。
          </video>
        </div>

        <!-- 视频信息 -->
        <div class="video-info">
          <h1 class="title">{{ video.title }}</h1>
          <div class="meta">
            <span class="date">{{ formatDate(video.created_at) }}</span>
            <span class="views">{{ video.view_count }} 播放</span>
          </div>
          <div class="description">
            {{ video.description || '暂无简介' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { videoApi, type Video } from '@/api/video'
import NavBar from '@/components/layout/NavBar.vue'

const route = useRoute()
const video = ref<Video | null>(null)
const loading = ref(true)
const error = ref('')

const fetchVideoDetail = async () => {
  const id = route.params.id as string
  if (!id) return
  
  try {
    loading.value = true
    error.value = ''
    const res = await videoApi.getVideoDetail(id)
    video.value = res.data.data
  } catch (err: any) {
    error.value = err.message || '获取视频详情失败'
  } finally {
    loading.value = false
  }
}

const getImageUrl = (url: string) => {
  if (!url) return ''
  return url
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}

onMounted(() => {
  fetchVideoDetail()
})
</script>

<style scoped>
.video-page-wrapper {
  min-height: 100vh;
  background-color: #f4f5f7;
}

.video-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 50px;
  font-size: 16px;
  color: #666;
}

.error {
  color: #f56c6c;
}

.player-wrapper {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  outline: none;
}

.video-info {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.title {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #222;
}

.meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.description {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}
</style>
