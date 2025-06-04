import { CreateFolderRequest } from "../controllers/CreateFolder.controller";
import { PrismaClient } from "../generated/prisma"
import { HttpResponseInterface } from "../interfaces/global";
const prisma = new PrismaClient();

export default async  function createFolderServices(data: CreateFolderRequest): Promise<HttpResponseInterface<any>>{
    try {
        const res = await prisma.$transaction(async (tx) => {
        const { name, parentId } = data;

        // Create the folder
        const folder = await tx.folderFiles.create({
            data: {
                name,
                parent_id: parentId ? parentId : null,
                is_folder: true,
                created_at: new Date(),
                updated_at: new Date(),
                path: parentId ? `${parentId}/${name}` : name
            }
        });

        return {
            status: 201,
            message: "Folder created successfully",
            success: true,
            data: folder
        };
    });

    return res;
    
    } catch (error) {
        console.error("Error creating folder:", error);
        return {
            status: 500,
            message: "Internal server error",
            success: false
        };    
    }
}
