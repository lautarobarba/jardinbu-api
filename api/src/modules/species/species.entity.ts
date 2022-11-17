import { ApiProperty } from '@nestjs/swagger';
import { Picture } from '../utils/picture.entity';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Genus } from '../genus/genus.entity';
import { Specimen } from 'modules/specimen/specimen.entity';


export enum Status {
	PRESENT = 'PRESENT',
	ABSENT = 'ABSENT',
	EXTINCT = 'EXTINCT',
}

export enum Origin {
	NATIVE = 'NATIVE',
	INTRODUCED = 'INTRODUCED',
}

export enum FoliageType {
	PERENNE = 'PERENNE',
}

@Entity('species')
export class Species extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ApiProperty()
	@Column({
		name: 'scientific_name',
		type: 'varchar',
		nullable: false,
		unique: true,
		length: 255,
	})
	scientificName: string;

	@ApiProperty()
	@Column({
		name: 'common_name',
		type: 'varchar',
		nullable: false,
		unique: true,
		length: 255,
	})
	commonName: string;

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
		name: 'status',
		type: 'enum',
		enum: Status,
		default: Status.PRESENT,
		nullable: true
	})
	status: Status;

	@ApiProperty()
	@Column({
		name: 'origin',
		type: 'enum',
		enum: Origin,
		default: Origin.NATIVE,
		nullable: true
	})
	origin: Origin;

	// Relation
	@ApiProperty({
		type: () => Picture,
	})
	@OneToOne(() => Picture, picture => picture.speciesExample)
	@JoinColumn({
		name: 'example_img',
	})
	exampleImg: Picture;

	@ApiProperty()
	@Column({
		name: 'foliage_type',
		type: 'enum',
		enum: FoliageType,
		default: FoliageType.PERENNE,
		nullable: true
	})
	foliageType: FoliageType;

	// Relation
	@ApiProperty({
		type: () => Picture,
	})
	@OneToOne(() => Picture, picture => picture.speciesFoliage)
	@JoinColumn({
		name: 'foliage_img',
	})
	foliageImg: Picture;

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
	@OneToMany(() => Specimen, specimen => specimen.species)
	specimens: Specimen[];
}
