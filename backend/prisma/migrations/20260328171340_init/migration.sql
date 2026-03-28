-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "bio" TEXT DEFAULT '',
ADD COLUMN     "branch" TEXT DEFAULT '',
ADD COLUMN     "college" TEXT DEFAULT '',
ADD COLUMN     "email" TEXT DEFAULT '',
ADD COLUMN     "phone" TEXT DEFAULT '',
ADD COLUMN     "profile_photo_url" TEXT DEFAULT '',
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "social_links" TEXT DEFAULT '',
ADD COLUMN     "year" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "leaders" ADD COLUMN     "bio" TEXT DEFAULT '',
ADD COLUMN     "branch" TEXT DEFAULT '',
ADD COLUMN     "college" TEXT DEFAULT '',
ADD COLUMN     "email" TEXT DEFAULT '',
ADD COLUMN     "phone" TEXT DEFAULT '',
ADD COLUMN     "profile_photo_url" TEXT DEFAULT '',
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "social_links" TEXT DEFAULT '',
ADD COLUMN     "team_role" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "year" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "bio" TEXT DEFAULT '',
ADD COLUMN     "branch" TEXT DEFAULT '',
ADD COLUMN     "college" TEXT DEFAULT '',
ADD COLUMN     "email" TEXT DEFAULT '',
ADD COLUMN     "phone" TEXT DEFAULT '',
ADD COLUMN     "profile_photo_url" TEXT DEFAULT '',
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "social_links" TEXT DEFAULT '',
ADD COLUMN     "team_role" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "year" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "due_date" TIMESTAMP(3),
    "assigned_member_id" INTEGER NOT NULL,
    "created_by_role" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_member_id_fkey" FOREIGN KEY ("assigned_member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
