import {
	ConflictException,
	Injectable,
	NotAcceptableException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { validate } from 'class-validator';
import { CreateFamilyDto, UpdateFamilyDto } from './family.dto';
import { Family } from './family.entity';

@Injectable()
export class FamilyService {
	constructor(
		@InjectRepository(Family)
		private readonly _familyRepository: Repository<Family>
	) {}

	async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
		const { name, description } = createFamilyDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que el nuevo genero no exista
		const exists: Family = await this._familyRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.deleted = false;
			exists.description = description;
			exists.updatedAt = timestamp;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._familyRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const family: Family = await this._familyRepository.create();
		family.name = name;
		family.description = description;
		family.updatedAt = timestamp;
		family.createdAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(family);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._familyRepository.save(family);
	}

	async findAll(): Promise<Family[]> {
		return this._familyRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number): Promise<Family> {
		const family: Family = await this._familyRepository.findOne({
			where: { id },
		});

		if (!family) throw new NotFoundException();
		return family;
	}

	async update(updateFamilyDto: UpdateFamilyDto) {
		const { id, name, description } = updateFamilyDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const family: Family = await this._familyRepository.findOne({
			where: { id },
		});

		if (!family) throw new NotFoundException();

		if (name) {
			// Controlo que las claves no estén en uso
			const exists: Family = await this._familyRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) family.name = name;
		if (description) family.description = description;
		family.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(family);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._familyRepository.save(family);
	}

	async delete(id: number) {
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const family: Family = await this._familyRepository.findOne({
			where: { id },
		});

		if (!family) throw new NotFoundException();

		family.deleted = true;
		family.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(family);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		this._familyRepository.save(family);
	}
}
