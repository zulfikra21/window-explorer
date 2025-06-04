import { CreateFolderRequest } from "../interfaces/folders";
import { HttpResponseInterface } from "../interfaces/global";
import createFolderServices from "../services/CreateFolders.service";



function validator(data: CreateFolderRequest): HttpResponseInterface<any> {
    
    if (data.name === undefined || data.name === null) {
        console.error("Folder name is required");
        return {
            status: 400,
            message: "Folder name is required",
            success: false
        };
    }
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        console.error("Invalid folder name");
        return {
            status: 400,
            message: "Invalid folder name",
            success: false
        };
    }
    if (data.parentId && typeof data.parentId !== 'string') {
        console.error("Invalid parent ID");
        return {
            status: 400,
            message: "Invalid parent ID",
            success: false
        };
    }

    return {
        status: 200,
        message: "Validation successful",
        success: true
    };
}

export default async function createFolderController({ body, set }: { body: CreateFolderRequest, set: any }): Promise<HttpResponseInterface<any>> {
  // Function to create a folder
    const { name, parentId } = body;
    
    let validate = validator(body);
    if (!validate.success) {
        set.status = validate.status; 
        return Promise.resolve(validate);
    }
    return createFolderServices({ name, parentId });

}
