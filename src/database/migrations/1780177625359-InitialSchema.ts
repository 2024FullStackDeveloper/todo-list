import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780177625359 implements MigrationInterface {
    name = 'InitialSchema1780177625359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!await queryRunner.hasTable("users")) {
            await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "otpExpiresAt" TIMESTAMP, "otp" character varying, "loginAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        }
        
        const hasEnum = await queryRunner.query(`SELECT 1 FROM pg_type WHERE typname = 'tasks_priority_enum'`);
        if (hasEnum.length === 0) {
            await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        }

        if (!await queryRunner.hasTable("tasks")) {
            await queryRunner.query(`CREATE TABLE "tasks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'low', "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "dueDate" TIMESTAMP, "taskTypeId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        }

        if (!await queryRunner.hasTable("task_types")) {
            await queryRunner.query(`CREATE TABLE "task_types" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "freeze" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "UQ_82231175ab7d4a8acd363eae667" UNIQUE ("name"), CONSTRAINT "PK_232576669c4df1f0a15e1300ce2" PRIMARY KEY ("id"))`);
        }

        // For foreign keys, we only add them if the tables didn't exist before, or we could just skip if they might already exist.
        // It's safer to check if the constraints exist.
        const constraints = await queryRunner.query(`SELECT conname FROM pg_constraint WHERE conname IN ('FK_87fc96ddd3cf917315d4c69bdc3', 'FK_166bd96559cb38595d392f75a35', 'FK_d01fc07335f6220719ddda9b730')`);
        const constraintNames = constraints.map((c: any) => c.conname);

        if (!constraintNames.includes('FK_87fc96ddd3cf917315d4c69bdc3')) {
            await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_87fc96ddd3cf917315d4c69bdc3" FOREIGN KEY ("taskTypeId") REFERENCES "task_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
        if (!constraintNames.includes('FK_166bd96559cb38595d392f75a35')) {
            await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
        if (!constraintNames.includes('FK_d01fc07335f6220719ddda9b730')) {
            await queryRunner.query(`ALTER TABLE "task_types" ADD CONSTRAINT "FK_d01fc07335f6220719ddda9b730" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_types" DROP CONSTRAINT "FK_d01fc07335f6220719ddda9b730"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_87fc96ddd3cf917315d4c69bdc3"`);
        await queryRunner.query(`DROP TABLE "task_types"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
