import { ApiProperty } from '@nestjs/swagger';
import { Genus } from 'modules/genus/genus.entity';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Species } from '../species/species.entity';

@Entity('families')
export class Family extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ApiProperty()
	@Column({
		name: 'name',
		type: 'varchar',
		nullable: false,
		unique: true,
		length: 255,
	})
	name: string;

	@ApiProperty()
	@Column({
		name: 'description',
		type: 'text',
		nullable: true,
		unique: false,
	})
	description: string;

	@ApiProperty()
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@ApiProperty()
	@Column({ name: 'deleted', type: 'boolean', default: false })
	deleted: boolean;

	// Relation
	@ApiProperty()
	@OneToMany(() => Genus, genus => genus.family)
	genera: Genus[];
}
