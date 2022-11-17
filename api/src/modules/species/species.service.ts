import {
	ConflictException,
	Injectable,
	Logger,
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
	) { }
	private readonly _logger = new Logger(SpeciesService.name);

	async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
		// TODO: falta guardar imagenes
		this._logger.debug('create()');
		const {
			scientificName,
			commonName,
			description,
			genusId,
			status,
			origin,
			exampleImg,
			foliageType,
			foliageImg,
		} = createSpeciesDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que la nueva especie no exista
		const exists: Species = await this._speciesRepository.findOne({
			where: { scientificName },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.scientificName = scientificName;
			exists.commonName = commonName;
			exists.description = description;
			exists.genus = await this._genusService.findOne(genusId);
			exists.status = status;
			exists.origin = origin;
			exists.foliageType = foliageType;
			exists.updatedAt = timestamp;
			exists.deleted = false;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._speciesRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const species: Species = this._speciesRepository.create();
		species.scientificName = scientificName;
		species.commonName = commonName;
		species.description = description;
		species.genus = await this._genusService.findOne(genusId);
		species.status = status;
		species.origin = origin;
		species.foliageType = foliageType;
		species.createdAt = timestamp;
		species.updatedAt = timestamp;
		species.deleted = false;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(species);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._speciesRepository.save(species);
	}

	async findAll(): Promise<Species[]> {
		this._logger.debug('findAll()');
		return this._speciesRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
			relations: ['genus'],
		});
	}

	async findOne(id: number): Promise<Species> {
		this._logger.debug('findOne()');
		const species: Species = await this._speciesRepository.findOne({
			where: { id },
			relations: ['genus'],
		});

		if (!species) throw new NotFoundException();
		return species;
	}

	async update(updateSpeciesDto: UpdateSpeciesDto): Promise<Species> {
		this._logger.debug('update()');
		const {
			id,
			scientificName,
			commonName,
			description,
			genusId,
			status,
			origin,
			exampleImg,
			foliageType,
			foliageImg,
		} = updateSpeciesDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const species: Species = await this._speciesRepository.findOne({
			where: { id },
		});

		if (!species) throw new NotFoundException();

		// Controlo que las claves no estén en uso
		if (scientificName) {
			const exists: Species = await this._speciesRepository.findOne({
				where: { scientificName },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (scientificName) species.scientificName = scientificName;
		if (commonName) species.commonName = commonName;
		if (description) species.description = description;
		if (genusId) species.genus = await this._genusService.findOne(genusId);
		if (status) species.status = status;
		if (origin) species.origin = origin;
		if (foliageType) species.foliageType = foliageType;
		species.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(species);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._speciesRepository.save(species);
	}

	async delete(id: number) {
		this._logger.debug('delete()');
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
