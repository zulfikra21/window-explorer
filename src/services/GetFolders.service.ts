import { GetFoldersRequest } from "../controllers/GetFolders.controller";
import { PrismaClient } from "../generated/prisma";
import { HttpResponseInterface } from "../interfaces/global";

const prisma = new PrismaClient();

const tree = {
    root: "",
    children: []
}

interface FolderTree {
    root: any;
    children: FolderTree[];
}

function findParentFolder(parentId: string, folders: FolderTree[]): FolderTree | null {
    for (const folder of folders) {
        if (folder.root.id === parentId) {
            return folder;
        }
        const child = findParentFolder(parentId, folder.children);
        if (child) {
            return child;
        }
    }
    return null;

}

export function constructFolderTree(folders: any[]): FolderTree[] {
    let folderTree: FolderTree[] = [];
    for (const folder of folders) {
        if (!folder.parent_id) {
            folderTree.push({
                root: folder,
                children: []
            });
        } else {
            let parentFolder = findParentFolder(folder.parent_id, folderTree);
            if (parentFolder) {
                if (!parentFolder.children) {
                    parentFolder.children = [];
                }
                parentFolder.children.push({
                    root: folder,
                    children: []
                });
            } else {
                // If parent not found, add to root
                folderTree.push({
                    root: folder,
                    children: []
                });
            }
        }
    }
    return folderTree;
}


export default async function getFoldersService(data: GetFoldersRequest): Promise<HttpResponseInterface<any>> {
    try {
        const folders = await prisma.folderFiles.findMany();
        let folderTree: FolderTree[] = constructFolderTree(folders);
        return {
            status: 200,
            message: "Folders retrieved successfully",
            success: true,
            data: folderTree
        };
    } catch (error) {
        console.error("Error getting folders:", error);
        return {
            status: 500,
            message: "Internal server error",
            success: false
        };
    }
}
