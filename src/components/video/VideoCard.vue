<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  video: {
    id: number
    title: string
    cover: string
    author: string
    plays: string | number
    date: string
    duration: string
  }
}>()

const router = useRouter()
const goToDetail = () => {
  router.push(`/video/${props.video.id}`)
}
</script>

<template>
  <div @click="goToDetail" class="bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm cursor-pointer flex flex-col group hover:-translate-y-1.5 hover:shadow-md">
    <!-- Cover Image & Duration -->
    <div class="relative aspect-video overflow-hidden">
      <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div class="absolute bottom-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-['Nunito']">
        {{ video.duration }}
      </div>
    </div>
    
    <!-- Video Info -->
    <div class="p-3 flex flex-col flex-1">
      <h3 class="text-[15px] font-semibold text-acg-text-main leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-acg-primary" :title="video.title">
        {{ video.title }}
      </h3>
      
      <div class="mt-auto flex flex-col gap-1.5 text-xs text-acg-text-muted">
        <span class="flex items-center gap-1 transition-colors duration-200 hover:text-acg-secondary">
          <i class="ri-user-smile-line"></i> {{ video.author }}
        </span>
        <div class="flex justify-between items-center">
          <span class="flex items-center gap-1"><i class="ri-play-circle-line"></i> {{ video.plays }}</span>
          <span class="flex items-center gap-1"><i class="ri-time-line"></i> {{ video.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>