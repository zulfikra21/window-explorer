/*
  Warnings:

  - Added the required column `path` to the `FolderFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FolderFiles" ADD COLUMN     "path" TEXT NOT NULL;
