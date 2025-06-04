export interface SearchFolderRequest {
  query: string;
  parentId?: string | null;
}

export interface CreateFolderRequest {
    name: string;
    parentId?: string;
}