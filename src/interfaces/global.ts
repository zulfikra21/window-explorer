export interface FolderContentResponse {
  id: string
  name: string
  is_folder: boolean
  parent_id: string | null
  path: string
  created_at: Date
  updated_at: Date
  mime_type: string | null
  size: number | null
}

export interface HttpResponseInterface<T = any> {
  status: number
  message: string
  success: boolean
  data?: T
}
