import { MigrationInterface, QueryRunner } from "typeorm";

export class initMigration1666927297211 implements MigrationInterface {
    name = 'initMigration1666927297211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "species" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "distribution" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "genus_id" integer, CONSTRAINT "UQ_1adf701cac3b2c0f8bacb54774b" UNIQUE ("name"), CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genera" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "family_id" integer, CONSTRAINT "UQ_abda9bd66d53d5f348840c6782c" UNIQUE ("name"), CONSTRAINT "PK_50b2676d5cd7908032d9dd61339" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "families" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_083e295fc64ec128618c5e37139" UNIQUE ("name"), CONSTRAINT "PK_70414ac0c8f45664cf71324b9bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "refresh_token" character varying(255), "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "species" ADD CONSTRAINT "FK_6a3e0e686d5625250af46a3d2cd" FOREIGN KEY ("genus_id") REFERENCES "genera"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genera" ADD CONSTRAINT "FK_327745e62b7bd9bc475f2ee37e8" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genera" DROP CONSTRAINT "FK_327745e62b7bd9bc475f2ee37e8"`);
        await queryRunner.query(`ALTER TABLE "species" DROP CONSTRAINT "FK_6a3e0e686d5625250af46a3d2cd"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "families"`);
        await queryRunner.query(`DROP TABLE "genera"`);
        await queryRunner.query(`DROP TABLE "species"`);
    }

}
