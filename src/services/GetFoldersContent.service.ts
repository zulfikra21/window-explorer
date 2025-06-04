import { PrismaClient } from '../generated/prisma'
import { HttpResponseInterface } from '../interfaces/global'
import { constructFolderTree } from './GetFolders.service'
const prisma = new PrismaClient()



export default async function getFolderContentService(
  folderId?: string | null
): Promise<HttpResponseInterface<any[]>> {
  try {
    const contents = await prisma.folderFiles.findMany({
      where: {
        parent_id: folderId
      },
      orderBy: {
        is_folder: 'desc' // Folders first
      }
    })
    let folders = constructFolderTree (contents)
    return {
      status: 200,
      message: 'Folder contents retrieved successfully',
      success: true,
      data: folders
    }
  } catch (error) {
    console.error('Error getting folder contents:', error)
    return {
      status: 500,
      message: 'Internal server error',
      success: false
    }
  } finally {
    await prisma.$disconnect()
  }
}
