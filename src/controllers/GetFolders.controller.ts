import { HttpResponseInterface } from "../interfaces/global";
import getFoldersService from "../services/GetFolders.service";
import searchFolderService from "../services/SearchFolder.service";

export interface GetFoldersRequest {
    // No parameters needed for getting root folders
    search?: string; // Optional search query
    parentId?: string | null; // Optional parent ID for nested folders
}

function validator(data: GetFoldersRequest): HttpResponseInterface<any> {
    if (data.search) {
        // Check for script tags and XSS patterns
        const xssPatterns = [
            /<script.*?>.*?<\/script>/gi, // Script tags
            /javascript:/gi, // JavaScript URIs
            /on\w+\s*=/gi, // Event handlers
            /eval\(/gi, // eval()
            /expression\(/gi, // CSS expressions
            /<[^>]*>/gi, // Any HTML tags
            /[<>'"\\;//]/,
             // Special chars
        ];

        for (const pattern of xssPatterns) {
            if (pattern.test(data.search)) {
                return {
                    status: 400,
                    message: "Search query contains invalid characters or patterns",
                    success: false
                };
            }
        }

        // Check minimum length
        if (data.search.trim().length < 2) {
            return {
                status: 400,
                message: "Search query must be at least 2 characters",
                success: false
            };
        }

        // Check maximum length
        if (data.search.length > 100) {
            return {
                status: 400,
                message: "Search query too long (max 100 characters)",
                success: false
            };
        }
    }

    if (data.parentId && typeof data.parentId !== 'string') {
        return {
            status: 400,
            message: "Invalid parent ID format",
            success: false
        };
    }

    return {
        status: 200,
        message: "Validation successful",
        success: true
    };
}

export default async function getFoldersController({ query, set }: { query: GetFoldersRequest, set: any }): Promise<HttpResponseInterface<any>> {
    const validate = validator(query);
    if (!validate.success) {
        set.status = validate.status;
        return Promise.resolve(validate);
    }

    if(query.search) {
        return searchFolderService({
            query: query.search,
            parentId: query.parentId || null
        })
    }

    return getFoldersService({
        parentId: query.parentId || null
    })
    // if(!query)
}
