import { describe, it, expect } from 'bun:test'
import getFoldersController from '../../src/controllers/GetFolders.controller'
import { HttpResponseInterface } from '../../src/interfaces/global'

describe('GetFolders Controller', () => {
    describe('validator', () => {
        it('should always pass validation', async () => {
            const result = await getFoldersController({
                query: {},
                set: { status: 0 }
            })

            expect(result.success).toBe(true)
            expect(result.status).toBe(200)
        })

        it('should reject XSS attack patterns', async () => {
            const xssTestCases = [
                { input: '<script>alert(1)</script>', description: 'script tags' },
                { input: 'javascript:alert(1)', description: 'javascript URI' },
                { input: '"><img src=x onerror=alert(1)>', description: 'HTML injection' },
                { input: 'eval(alert(1))', description: 'eval function' },
                { input: 'expression(alert(1))', description: 'CSS expression' },
                { input: 'onload=alert(1)', description: 'event handler' },
                { input: 'test<script>test', description: 'partial script tag' },
                { input: 'test;DROP TABLE folders', description: 'SQL injection attempt' }
            ]

            for (const testCase of xssTestCases) {
                const result = await getFoldersController({
                    query: { search: testCase.input },
                    set: { status: 0 }
                })
                
                expect(result.success).toBe(false)
                expect(result.status).toBe(400)
                expect(result.message).toBe('Search query contains invalid characters or patterns')
            }
        })

        it('should reject too short search queries', async () => {
            const result = await getFoldersController({
                query: { search: 'a' },
                set: { status: 0 }
            })
            
            expect(result.success).toBe(false)
            expect(result.status).toBe(400)
            expect(result.message).toBe('Search query must be at least 2 characters')
        })

        it('should reject too long search queries', async () => {
            const longString = 'a'.repeat(101)
            const result = await getFoldersController({
                query: { search: longString },
                set: { status: 0 }
            })
            
            expect(result.success).toBe(false)
            expect(result.status).toBe(400)
            expect(result.message).toBe('Search query too long (max 100 characters)')
        })
    })

    describe('getFoldersController', () => {
        it('should get root folders when no query params', async () => {
            const result = await getFoldersController({
                query: {},
                set: { status: 0 }
            }) as HttpResponseInterface<any>

            expect(result.success).toBe(true)
            expect(result.status).toBe(200)
            expect(Array.isArray(result.data)).toBe(true)
        })

        it('should get folders with parentId', async () => {
            // First create a test parent folder
            const parentResult = await getFoldersController({
                query: { parentId: 'test_parent_id' },
                set: { status: 0 }
            }) as HttpResponseInterface<any>

            expect(parentResult.success).toBe(true)
            expect(parentResult.status).toBe(200)
        })

        it('should search folders when search query provided', async () => {
            const result = await getFoldersController({
                query: { search: 'test' },
                set: { status: 0 }
            }) as HttpResponseInterface<any>

            expect(result.success).toBe(true)
            expect(result.status).toBe(200)
            expect(Array.isArray(result.data)).toBe(true)
        })

        it('should search within parent folder when both params provided', async () => {
            const result = await getFoldersController({
                query: { search: 'test', parentId: 'test_parent_id' },
                set: { status: 0 }
            }) as HttpResponseInterface<any>

            expect(result.success).toBe(true)
            expect(result.status).toBe(200)
            expect(Array.isArray(result.data)).toBe(true)
        })

        it('should set status code on service failure', async () => {
            const set = { status: 0 }
            const res = await getFoldersController({
                query: { search: '21329183012_))(2-1//' }, // Assuming this would trigger failure
                set
            })
            console.log(res)
            expect(res.status).toBeGreaterThanOrEqual(400)
        })
    })
})
