import api from './index'

export interface Video {
  id: number
  user_id: number
  title: string
  description: string
  cover_url: string
  video_url: string
  duration: number
  size: number
  format: string
  width: number
  height: number
  view_count: number
  danmaku_count: number
  like_count: number
  favorite_count: number
  coin_count: number
  status: number
  category_id: number
  tags: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface UploadVideoRequest {
  title: string
  description: string
  cover_url: string
  video_url: string
  duration: number
  size: number
  format: string
  width?: number
  height?: number
  category_id?: number
  tags?: string
}

export interface VideoListRequest {
  page?: number
  page_size?: number
  category_id?: number
}

export interface VideoListResponse {
  total: number
  items: Video[]
}

export const videoApi = {
  // 发布视频信息
  uploadVideo(data: UploadVideoRequest) {
    return api.post<{ data: Video }>('/videos', data)
  },

  // 获取视频列表
  getVideoList(params: VideoListRequest) {
    return api.get<{ data: VideoListResponse }>('/videos', { params })
  },

  // 获取视频详情
  getVideoDetail(id: number | string) {
    return api.get<{ data: Video }>(`/videos/${id}`)
  }
}
