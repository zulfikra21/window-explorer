# API Documentation

## Base URL
`http://localhost:3000/api/v1`

## Endpoints

### 1. Get Folders
**Endpoint:** `/folders`  
**Method:** `GET`  
**Description:** Retrieves folders with optional search and parent filtering

#### Request Parameters
```typescript
interface GetFoldersRequest {
  search?: string;  // Optional search query
  parentId?: string | null;  // Optional parent folder ID
}
```

#### Success Response (200)
```typescript
{
  status: 200,
  message: string,
  success: true,
  data: Array<Folder>  // List of folders
}
```

#### Error Responses
- **400 Bad Request** - Invalid search query
- **500 Internal Server Error** - Server error

#### Example
```bash
curl -X GET "http://localhost:3000/api/v1/folders?search=projects&parentId=123"
```

---

### 2. Create Folder
**Endpoint:** `/folders`  
**Method:** `POST`  
**Description:** Creates a new folder

#### Request Body
```typescript
interface CreateFolderRequest {
  name: string;  // Folder name
  parentId?: string | null;  // Optional parent folder ID
}
```

#### Success Response (201)
```typescript
{
  status: 201,
  message: string,
  success: true,
  data: Folder  // Created folder details
}
```

#### Error Responses
- **400 Bad Request** - Invalid folder name
- **500 Internal Server Error** - Server error

#### Example
```bash
curl -X POST "http://localhost:3000/api/v1/folders" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Folder", "parentId": "123"}'
```

## Data Types

### Folder
```typescript
interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  is_folder: boolean;
  created_at: Date;
  updated_at: Date;
  path: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  status: number;
  message: string;
  success: false;
}
```

## Rate Limiting
- 100 requests per minute per IP address

## Authentication
Currently uses simple API key authentication (to be implemented)
