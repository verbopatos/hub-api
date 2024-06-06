-- CreateTable
CREATE TABLE "EventTypes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL UNIQUE,

    CONSTRAINT "eventTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER,
    "datetime" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL UNIQUE,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventTypeNames_key" ON "EventTypes"("name");
CREATE UNIQUE INDEX "roleNames_key" ON "Roles"("name");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
