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
import { CreateSpeciesDto, UpdateSpeciesDto } from './species.dto';
import { Species } from './species.entity';
import { GenusService } from '../genus/genus.service';

@Injectable()
export class SpeciesService {
	constructor(
		@InjectRepository(Species)
		private readonly _speciesRepository: Repository<Species>,
		private readonly _genusService: GenusService
	) {}

	async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
		const { name, description, genusId, distribution } = createSpeciesDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que la nueva especie no exista
		const exists: Species = await this._speciesRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.description = description;
			exists.genus = await this._genusService.findOne(genusId);
			exists.distribution = distribution;
			exists.deleted = false;
			exists.updatedAt = timestamp;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._speciesRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const species: Species = await this._speciesRepository.create();
		species.name = name;
		species.description = description;
		species.genus = await this._genusService.findOne(genusId);
		species.distribution = distribution;
		species.updatedAt = timestamp;
		species.createdAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(species);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._speciesRepository.save(species);
	}

	async findAll(): Promise<Species[]> {
		return this._speciesRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
			relations: ['genus'],
		});
	}

	async findOne(id: number): Promise<Species> {
		const species: Species = await this._speciesRepository.findOne({
			where: { id },
			relations: ['genus'],
		});

		if (!species) throw new NotFoundException();
		return species;
	}

	async update(updateSpeciesDto: UpdateSpeciesDto): Promise<Species> {
		const { id, name, genusId, description, distribution } = updateSpeciesDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const species: Species = await this._speciesRepository.findOne({
			where: { id },
		});

		if (!species) throw new NotFoundException();

		// Controlo que las claves no estén en uso
		if (name) {
			const exists: Species = await this._speciesRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) species.name = name;
		if (description) species.description = description;
		if (genusId) species.genus = await this._genusService.findOne(genusId);
		if (distribution) species.distribution = distribution;
		species.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(species);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._speciesRepository.save(species);
	}

	async delete(id: number) {
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const species: Species = await this._speciesRepository.findOne({
			where: { id },
		});

		if (!species) throw new NotFoundException();

		species.deleted = true;
		species.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(species);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		this._speciesRepository.save(species);
	}
}
