<template>
  <div>
    <!-- 使用复用的导航栏 -->
    <NavBar @open-auth="() => {}" />
    
    <div class="upload-container">
      <div class="upload-card">
      <h2>视频投稿</h2>
      
      <form @submit.prevent="submitUpload" class="upload-form">
        <!-- 视频文件选择 -->
        <div class="form-group">
          <label>选择视频文件 (必填)</label>
          <input type="file" accept="video/*" @change="handleVideoChange" :disabled="uploading" required />
          <div v-if="videoFile" class="file-info">
            已选择: {{ videoFile.name }} ({{ (videoFile.size / 1024 / 1024).toFixed(2) }} MB)
          </div>
        </div>

        <!-- 封面图片选择 -->
        <div class="form-group">
          <label>选择封面图片 (必填)</label>
          <input type="file" accept="image/*" @change="handleCoverChange" :disabled="uploading" required />
          <div v-if="coverFile" class="file-info">
            已选择: {{ coverFile.name }}
          </div>
        </div>

        <!-- 标题 -->
        <div class="form-group">
          <label>视频标题 (必填)</label>
          <input type="text" v-model="form.title" placeholder="请输入标题" :disabled="uploading" required />
        </div>

        <!-- 描述 -->
        <div class="form-group">
          <label>视频描述</label>
          <textarea v-model="form.description" rows="4" placeholder="请输入描述" :disabled="uploading"></textarea>
        </div>

        <!-- 进度条 -->
        <div v-if="uploading" class="progress-container">
          <div class="progress-text">{{ uploadStatus }}</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <div class="progress-percent">{{ uploadProgress.toFixed(1) }}%</div>
        </div>

        <button type="submit" class="submit-btn" :disabled="uploading || !videoFile || !coverFile">
          {{ uploading ? '上传中...' : '开始上传' }}
        </button>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { uploadApi } from '@/api/upload'
import { videoApi } from '@/api/video'
import axios from 'axios'
import NavBar from '@/components/layout/NavBar.vue'

const router = useRouter()

const form = reactive({
  title: '',
  description: ''
})

const videoFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)

const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('')

const handleVideoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    videoFile.value = target.files[0] || null
    if (!form.title && videoFile.value) {
      form.title = videoFile.value.name.replace(/\.[^/.]+$/, "") // 默认使用文件名作为标题
    }
  }
}

const handleCoverChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    coverFile.value = target.files[0] || null
  }
}

// 简单的封面上传逻辑
const uploadCover = async (): Promise<string> => {
  if (!coverFile.value) throw new Error('未选择封面')
  uploadStatus.value = '正在上传封面...'
  
  // 1. 获取上传 URL
  const { data: tokenRes } = await uploadApi.getToken({
    filename: coverFile.value.name,
    content_type: coverFile.value.type
  })
  
  // The API response is wrapped in 'data' from axios, but our backend might also wrap it
  // Let's get the actual response body safely
  const responseData = (tokenRes as any).data || tokenRes

  // 2. PUT 请求上传文件
  await axios.put(responseData.upload_url, coverFile.value, {
    headers: {
      'Content-Type': coverFile.value.type
    }
  })

  return responseData.file_url
}

// 视频分片上传逻辑
const uploadVideoChunks = async (): Promise<string> => {
  if (!videoFile.value) throw new Error('未选择视频')
  
  const file = videoFile.value
  const chunkSize = 5 * 1024 * 1024 // 5MB
  const chunks = Math.ceil(file.size / chunkSize)
  
  uploadStatus.value = '初始化视频上传...'
  
  // 1. 初始化分片上传
  const { data: initRes } = await uploadApi.initMultipart({
    filename: file.name,
    content_type: file.type || 'video/mp4',
    part_count: chunks
  })
  
  const responseData = (initRes as any).data || initRes
  const { upload_id, upload_urls, object_name } = responseData
  const parts: { PartNumber: number, ETag: string }[] = []
  
  let uploadedSize = 0

  // 2. 逐个上传分片
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    uploadStatus.value = `正在上传视频分片 (${i + 1}/${chunks})...`
    
    const res = await axios.put(upload_urls[i]!, chunk, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    })
    
    const etag = res.headers.etag
    if (!etag) {
      throw new Error(`分片 ${i + 1} 上传失败，未返回 ETag`)
    }
    
    parts.push({
      PartNumber: i + 1,
      ETag: etag.replace(/"/g, '') // 去除 ETag 的引号
    })
    
    uploadedSize += chunk.size
    uploadProgress.value = (uploadedSize / file.size) * 100
  }
  
  uploadStatus.value = '正在合并视频分片...'
  
  // 3. 完成分片上传
  const { data: completeRes } = await uploadApi.completeMultipart({
    upload_id,
    object_name,
    parts
  })
  
  const completeData = (completeRes as any).data || completeRes
  return completeData.file_url
}

const submitUpload = async () => {
  if (!videoFile.value || !coverFile.value) return
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    // 1. 上传封面
    const coverUrl = await uploadCover()
    
    // 2. 上传视频
    const videoUrl = await uploadVideoChunks()
    
    // 3. 提交视频信息
    uploadStatus.value = '正在保存视频信息...'
    
    await videoApi.uploadVideo({
      title: form.title,
      description: form.description,
      cover_url: coverUrl,
      video_url: videoUrl,
      duration: 1, // 这里给一个大于0的默认值，因为后端binding:required对于0可能会判定为空
      size: videoFile.value.size,
      format: videoFile.value.type || 'video/mp4'
    })
    
    uploadStatus.value = '发布成功！'
    alert('视频投稿成功！')
    
    // 返回主页
    router.push('/')
    
  } catch (error: any) {
    console.error('上传失败', error)
    alert(error.message || '上传失败，请重试')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 64px); /* 减去 NavBar 的高度 */
  padding: 40px 20px;
  background-color: #f4f5f7;
}

.upload-card {
  background: white;
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #00a1d6;
  outline: none;
}

.file-info {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.progress-container {
  margin-bottom: 20px;
}

.progress-text {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background-color: #00a1d6;
  transition: width 0.3s ease;
}

.progress-percent {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #00a1d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #00b5e5;
}

.submit-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}
</style>
