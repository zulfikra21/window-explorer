-- CreateTable
CREATE TABLE "FolderFiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isFolder" BOOLEAN NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,

    CONSTRAINT "FolderFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FolderFiles_parentId_idx" ON "FolderFiles"("parentId");

-- CreateIndex
CREATE INDEX "FolderFiles_name_idx" ON "FolderFiles"("name");

-- AddForeignKey
ALTER TABLE "FolderFiles" ADD CONSTRAINT "FolderFiles_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FolderFiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
