-- AlterTable
ALTER TABLE "Departments" RENAME CONSTRAINT "departments_pkey" TO "Departments_pkey";
ALTER TABLE "Departments" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EventTypes" RENAME CONSTRAINT "eventTypes_pkey" TO "EventTypes_pkey";

-- AlterTable
ALTER TABLE "Events" RENAME CONSTRAINT "events_pkey" TO "Events_pkey";

-- AlterTable
ALTER TABLE "Roles" RENAME CONSTRAINT "roles_pkey" TO "Roles_pkey";
ALTER TABLE "Roles" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Members" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Members_email_key" ON "Members"("email");

-- RenameForeignKey
ALTER TABLE "Events" RENAME CONSTRAINT "events_eventTypeId_fkey" TO "Events_eventTypeId_fkey";

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
