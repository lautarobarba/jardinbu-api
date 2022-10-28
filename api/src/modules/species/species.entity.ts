import { ApiProperty } from '@nestjs/swagger';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Genus } from '../genus/genus.entity';

@Entity('species')
export class Species extends BaseEntity {
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

	// Relation
	@ApiProperty({
		type: () => Genus,
	})
	@ManyToOne(() => Genus, genus => genus.species)
	@JoinColumn({
		name: 'genus_id',
	})
	genus: Genus;

	@ApiProperty()
	@Column({
		name: 'distribution',
		type: 'varchar',
		nullable: true,
		unique: false,
		length: 255,
	})
	distribution: string;

	// @ApiProperty()
	// @Column({
	// 	name: 'example_img',
	// 	type: 'varchar',
	// 	nullable: true,
	// 	unique: false,
	// 	length: 255,
	// })
	// example_img: string;

	// @ApiProperty()
	// @Column({
	// 	name: 'foliage_img',
	// 	type: 'varchar',
	// 	nullable: true,
	// 	unique: false,
	// 	length: 255,
	// })
	// foliage_img: string;

	@ApiProperty()
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@ApiProperty()
	@Column({ name: 'deleted', type: 'boolean', default: false })
	deleted: boolean;
}
