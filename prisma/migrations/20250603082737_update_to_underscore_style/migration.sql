/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FolderFiles` table. All the data in the column will be lost.
  - You are about to drop the column `isFolder` on the `FolderFiles` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `FolderFiles` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `FolderFiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FolderFiles` table. All the data in the column will be lost.
  - Added the required column `is_folder` to the `FolderFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FolderFiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FolderFiles" DROP CONSTRAINT "FolderFiles_parentId_fkey";

-- DropIndex
DROP INDEX "FolderFiles_parentId_idx";

-- AlterTable
ALTER TABLE "FolderFiles" DROP COLUMN "createdAt",
DROP COLUMN "isFolder",
DROP COLUMN "mimeType",
DROP COLUMN "parentId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_folder" BOOLEAN NOT NULL,
ADD COLUMN     "mime_type" TEXT,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "FolderFiles_parent_id_idx" ON "FolderFiles"("parent_id");

-- AddForeignKey
ALTER TABLE "FolderFiles" ADD CONSTRAINT "FolderFiles_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "FolderFiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
