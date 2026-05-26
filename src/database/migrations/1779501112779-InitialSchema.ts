import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1779501112779 implements MigrationInterface {
    name = 'InitialSchema1779501112779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$\nBEGIN\n   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_priority_enum') THEN\n     CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent');\n   END IF;\nEND$$;`);
        await queryRunner.query(`DO $$\nBEGIN\n   IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN\n     CREATE TABLE "tasks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'low', "isCompleted" boolean NOT NULL DEFAULT false, "dueDate" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"));\n   END IF;\nEND$$;`);
        await queryRunner.query(`DO $$\nBEGIN\n   IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN\n     CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "otpExpiresAt" TIMESTAMP, "otp" character varying, "loginAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"));\n   END IF;\nEND$$;`);
        await queryRunner.query(`DO $$\nBEGIN\n   IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_166bd96559cb38595d392f75a35') THEN\n     ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;\n   END IF;\nEND$$;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."tasks_priority_enum"`);
    }

}
