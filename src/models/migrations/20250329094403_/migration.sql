-- DropForeignKey
ALTER TABLE "borrows" DROP CONSTRAINT "borrows_bookId_fkey";

-- AddForeignKey
ALTER TABLE "borrows" ADD CONSTRAINT "borrows_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
