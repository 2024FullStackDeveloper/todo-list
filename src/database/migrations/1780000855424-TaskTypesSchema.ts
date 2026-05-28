import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskTypesSchema1780000855424 implements MigrationInterface {
    name = 'TaskTypesSchema1780000855424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "task_types" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "freeze" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_82231175ab7d4a8acd363eae667" UNIQUE ("name"), CONSTRAINT "PK_232576669c4df1f0a15e1300ce2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE column_name = 'taskTypeId' AND table_name = 'tasks') THEN ALTER TABLE "tasks" ADD "taskTypeId" uuid NOT NULL; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_87fc96ddd3cf917315d4c69bdc3') THEN ALTER TABLE "tasks" ADD CONSTRAINT "FK_87fc96ddd3cf917315d4c69bdc3" FOREIGN KEY ("taskTypeId") REFERENCES "task_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_87fc96ddd3cf917315d4c69bdc3"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "taskTypeId"`);
        await queryRunner.query(`DROP TABLE "task_types"`);
    }

}
