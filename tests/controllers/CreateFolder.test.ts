import { describe, it, expect } from 'bun:test'
import createFolderController from '../../src/controllers/CreateFolder.controller'

describe('CreateFolder Controller', () => {
  describe('validator', () => {
    it('should reject when name is missing', async () => {
      const invalidRequest = { parentId: '123' } as any;
      const result = await createFolderController({
        body: invalidRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.message).toBe('Folder name is required')
    })

    it('should reject when name is empty string', async () => {
      const invalidRequest = { name: '', parentId: '123' }
      const result = await createFolderController({
        body: invalidRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.message).toBe('Invalid folder name')
    })

    it('should reject when name is only whitespace', async () => {
      const invalidRequest = { name: '   ', parentId: '123' }
      const result = await createFolderController({
        body: invalidRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.message).toBe('Invalid folder name')
    })

    it('should reject when name is not a string', async () => {
      const invalidRequest = { name: 123 as any, parentId: '123' }
      const result = await createFolderController({
        body: invalidRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.message).toBe('Invalid folder name')
    })

    it('should reject when parentId is not a string', async () => {
      const invalidRequest = { name: 'test', parentId: 123 as any }
      const result = await createFolderController({
        body: invalidRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.message).toBe('Invalid parent ID')
    })

    it('should accept valid request without parentId', async () => {
      const validRequest = { name: 'test' }
      const result = await createFolderController({
        body: validRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
    })

    it('should accept valid request with parentId', async () => {
      // First create a parent folder to get a valid ID
      const parentResult = await createFolderController({
        body: { name: 'Parent Folder' },
        set: { status: 0 }
      })
      
      if (!parentResult.success || !parentResult.data?.id) {
        throw new Error('Failed to create parent folder for test')
      }

      const validRequest = { 
        name: 'Child Folder', 
        parentId: parentResult.data.id 
      }
      
      const result = await createFolderController({
        body: validRequest,
        set: { status: 0 }
      })
      
      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
      expect(result.data?.parent_id).toBe(parentResult.data.id)
    })
  })

  describe('createFolderController', () => {
    it('should return 201 status on success', async () => {
      const validRequest = { name: 'test' }
      const result = await createFolderController({
        body: validRequest,
        set: { status: 0 }
      })
      
      expect(result.status).toBe(201)
      expect(result.message).toBe('Folder created successfully')
    })

    it('should set status code on validation failure', async () => {
      const set = { status: 0 }
      const invalidRequest = { name: '' }
      await createFolderController({
        body: invalidRequest,
        set
      })
      
      expect(set.status).toBe(400)
    })
  })
})
