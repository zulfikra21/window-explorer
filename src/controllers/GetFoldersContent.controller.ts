import { HttpResponseInterface, FolderContentResponse } from '../interfaces/global'
import getFolderContentService from '../services/GetFoldersContent.service'

export default async function getFolderContent(
  { params }: { params: { parentId?: string | null } }
): Promise<HttpResponseInterface<FolderContentResponse[]>> {
  const parentId = params.parentId || null;
  if (!parentId) {
    return {
      status: 400,
      message: 'Folder ID is required',
      success: false,
      data: []
    }
  }
  return await getFolderContentService(parentId)
}
