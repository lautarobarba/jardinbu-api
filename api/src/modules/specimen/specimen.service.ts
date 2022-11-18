import { ConflictException, Injectable, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { validate } from 'class-validator';
import { SpeciesService } from 'modules/species/species.service';
import { Repository } from 'typeorm';
import { CreateSpecimenDto, UpdateSpecimenDto } from './specimen.dto';
import { Specimen } from './specimen.entity';

@Injectable()
export class SpecimenService {
	constructor(
		@InjectRepository(Specimen)
		private readonly _specimenRepository: Repository<Specimen>,
		private readonly _speciesService: SpeciesService
	) { }
	private readonly _logger = new Logger(SpecimenService.name);

	async create(createSpecimenDto: CreateSpecimenDto): Promise<Specimen> {
		// TODO: falta guardar imagenes
		this._logger.debug('create()');
		const {
			name,
			description,
			speciesId,
			coordLat,
			coordLon,
		} = createSpecimenDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que el nuevo ejemplar no exista
		const exists: Specimen = await this._specimenRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.name = name;
			exists.description = description;
			if (speciesId && (speciesId !== 0)) exists.species = await this._speciesService.findOne(speciesId);
			else exists.species = null;
			exists.coordLat = coordLat;
			exists.coordLon = coordLon;
			exists.updatedAt = timestamp;
			exists.deleted = false;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._specimenRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const specimen: Specimen = this._specimenRepository.create();
		specimen.name = name;
		specimen.description = description;
		if (speciesId && (speciesId !== 0)) specimen.species = await this._speciesService.findOne(speciesId);
		else specimen.species = null;
		specimen.coordLat = coordLat;
		specimen.coordLon = coordLon;
		specimen.createdAt = timestamp;
		specimen.updatedAt = timestamp;
		specimen.deleted = false;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(specimen);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._specimenRepository.save(specimen);
	}

	async findAll(): Promise<Specimen[]> {
		this._logger.debug('findAll()');
		return this._specimenRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number): Promise<Specimen> {
		this._logger.debug('findOne()');
		const specimen: Specimen = await this._specimenRepository.findOne({
			where: { id },
		});

		if (!specimen) throw new NotFoundException();
		return specimen;
	}

	async update(updateSpecimenDto: UpdateSpecimenDto): Promise<Specimen> {
		this._logger.debug('update()');
		const {
			id,
			name,
			description,
			speciesId,
			coordLat,
			coordLon,
		} = updateSpecimenDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const specimen: Specimen = await this._specimenRepository.findOne({
			where: { id },
		});

		if (!specimen) throw new NotFoundException();

		// Controlo que las claves no estén en uso
		if (name) {
			const exists: Specimen = await this._specimenRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) specimen.name = name;
		if (description) specimen.description = description;
		if (speciesId && (speciesId !== 0)) specimen.species = await this._speciesService.findOne(speciesId);
		else specimen.species = null;
		if (coordLat) specimen.coordLat = coordLat;
		if (coordLon) specimen.coordLon = coordLon;
		specimen.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(specimen);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._specimenRepository.save(specimen);
	}

	async delete(id: number) {
		this._logger.debug('delete()');
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const specimen: Specimen = await this._specimenRepository.findOne({
			where: { id },
		});

		if (!specimen) throw new NotFoundException();

		specimen.deleted = true;
		specimen.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(specimen);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		this._specimenRepository.save(specimen);
	}
}
