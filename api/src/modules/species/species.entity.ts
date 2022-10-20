import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../genre/genre.entity';

@Entity('species')
export class Species extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({
		name: 'name',
		type: 'varchar',
		nullable: false,
		unique: true,
		length: 255,
	})
	name: string;

	@Column({
		name: 'family',
		type: 'varchar',
		nullable: false,
		unique: false,
		length: 255,
	})
	family: string;

	@Column({
		name: 'genre',
		type: 'int',
		nullable: false,
		unique: false,
	})
	genre: Genre;

	@Column({
		name: 'description',
		type: 'text',
		nullable: true,
		unique: false,
	})
	description: string;

	@Column({
		name: 'distribution',
		type: 'varchar',
		nullable: true,
		unique: false,
		length: 255,
	})
	distribution: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@Column({ name: 'deleted', type: 'boolean', default: false })
	deleted: boolean;
}
