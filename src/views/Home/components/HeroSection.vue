<script setup lang="ts">
const banners = [
  { id: 1, img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800', title: '春季新番大放送' },
]

defineProps<{
  recommendations: Array<{
    id: number
    title: string
    cover: string
  }>
}>()
</script>

<template>
  <section class="flex flex-col lg:grid lg:grid-cols-[2.5fr_1fr] gap-4 md:gap-6 mb-8 md:mb-12">
    <!-- Main Banner -->
    <div class="rounded-2xl overflow-hidden relative shadow-sm cursor-pointer group aspect-[16/9] lg:aspect-auto lg:h-[400px]">
      <img :src="banners[0].img" alt="Banner" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div class="absolute bottom-0 left-0 right-0 pt-16 pb-6 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
        <h2 class="text-xl md:text-2xl font-bold tracking-wide">{{ banners[0].title }}</h2>
      </div>
    </div>
    
    <!-- Side Recommendations -->
    <div class="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 md:gap-6 h-auto lg:h-[400px]">
      <div 
        v-for="i in 2" 
        :key="i"
        class="rounded-xl overflow-hidden relative shadow-sm cursor-pointer group aspect-[16/9] lg:aspect-auto"
      >
        <img :src="recommendations[i]?.cover" alt="Rec Cover" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute bottom-0 left-0 right-0 pt-10 pb-3 px-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
          <span class="text-sm md:text-base font-semibold line-clamp-2 leading-tight drop-shadow-md">{{ recommendations[i]?.title }}</span>
        </div>
      </div>
    </div>
  </section>
</template>