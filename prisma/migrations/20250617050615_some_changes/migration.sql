/*
  Warnings:

  - The values [CRITICAL] on the enum `IssuePriority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IssuePriority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
ALTER TABLE "Issue" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Issue" ALTER COLUMN "priority" TYPE "IssuePriority_new" USING ("priority"::text::"IssuePriority_new");
ALTER TYPE "IssuePriority" RENAME TO "IssuePriority_old";
ALTER TYPE "IssuePriority_new" RENAME TO "IssuePriority";
DROP TYPE "IssuePriority_old";
ALTER TABLE "Issue" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';
COMMIT;

-- AlterEnum
ALTER TYPE "IssuesStatus" ADD VALUE 'IN_REVIEW';
