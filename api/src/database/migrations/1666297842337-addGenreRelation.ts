import { MigrationInterface, QueryRunner } from "typeorm";

export class addGenreRelation1666297842337 implements MigrationInterface {
    name = 'addGenreRelation1666297842337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species" RENAME COLUMN "genre" TO "genre_id"`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "genre_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" ADD CONSTRAINT "FK_1959588d9740e226fbe9bea4cd0" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species" DROP CONSTRAINT "FK_1959588d9740e226fbe9bea4cd0"`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "genre_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" RENAME COLUMN "genre_id" TO "genre"`);
    }

}
