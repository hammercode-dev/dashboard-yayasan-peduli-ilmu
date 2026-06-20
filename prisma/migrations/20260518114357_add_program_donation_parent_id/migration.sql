-- AlterTable
ALTER TABLE "program_donation" ADD COLUMN     "parent_id" BIGINT;

-- AddForeignKey
ALTER TABLE "program_donation" ADD CONSTRAINT "program_donation_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "program_donation"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
