import { PrismaClient } from "../generated/prisma";
import { SearchFolderRequest } from "../interfaces/folders";
import { HttpResponseInterface } from "../interfaces/global";
import { constructFolderTree } from "./GetFolders.service";

const prisma = new PrismaClient();

export default async function searchFolderService(
    data: SearchFolderRequest
): Promise<HttpResponseInterface<any>> {
    try {
        console.log("Searching folders with query:", data.query, "and parentId:", data.parentId);
        let folders: any = await prisma.folderFiles.findMany({
            where: {
                name: {
                    contains: data.query,
                    mode: 'insensitive'
                },
                is_folder: true,
            },
        });
         folders = constructFolderTree(folders);
        return {
            status: 200,
            message: "Folders found successfully",
            success: true,
            data: folders
        };
    } catch (error) {
        console.error("Error searching folders:", error);
        return {
            status: 500,
            message: "Internal server error",
            success: false
        };
    }
}
