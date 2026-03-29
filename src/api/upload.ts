import api from './index'

export interface UploadTokenRequest {
  filename: string
  content_type: string
}

export interface UploadTokenResponse {
  upload_url: string
  file_url: string
}

export interface MultipartInitRequest {
  filename: string
  content_type: string
  part_count: number
}

export interface MultipartInitResponse {
  upload_id: string
  upload_urls: string[]
  object_name: string
}

export interface MultipartCompleteRequest {
  upload_id: string
  object_name: string
  parts: {
    PartNumber: number
    ETag: string
  }[]
}

export interface MultipartCompleteResponse {
  message: string
  file_url: string
}

export const uploadApi = {
  // 获取简单上传Token（例如封面图片）
  getToken(data: UploadTokenRequest) {
    return api.post<{ data: UploadTokenResponse }>('/upload/token', data)
  },

  // 初始化分片上传
  initMultipart(data: MultipartInitRequest) {
    return api.post<{ data: MultipartInitResponse }>('/upload/multipart/init', data)
  },

  // 完成分片上传
  completeMultipart(data: MultipartCompleteRequest) {
    return api.post<{ data: MultipartCompleteResponse }>('/upload/multipart/complete', data)
  }
}
