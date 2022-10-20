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
import { Genre } from './genre.entity';
import { CreateGenreDto, UpdateGenreDto } from './genre.dto';

@Injectable()
export class GenreService {
	constructor(
		@InjectRepository(Genre)
		private readonly _genreRepository: Repository<Genre>
	) {}

	async create(createGenreDto: CreateGenreDto): Promise<Genre> {
		const { name } = createGenreDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que el nuevo genero no exista
		const exists: Genre = await this._genreRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.deleted = false;
			exists.updatedAt = timestamp;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._genreRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const genre: Genre = await this._genreRepository.create();
		genre.name = name;
		genre.updatedAt = timestamp;
		genre.createdAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genre);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genreRepository.save(genre);
	}

	async findAll(): Promise<Genre[]> {
		return this._genreRepository.find({
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number): Promise<Genre> {
		const genre: Genre = await this._genreRepository.findOne({
			where: { id },
		});

		if (!genre) throw new NotFoundException();
		return genre;
	}

	async update(updateGenreDto: UpdateGenreDto): Promise<Genre> {
		const { id, name } = updateGenreDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genre: Genre = await this._genreRepository.findOne({
			where: { id },
		});

		if (!genre) throw new NotFoundException();

		if (name) {
			// Controlo que las claves no esten en uso
			const exists: Genre = await this._genreRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) genre.name = name;
		genre.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genre);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genreRepository.save(genre);
	}

	async delete(id: number) {
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genre: Genre = await this._genreRepository.findOne({
			where: { id },
		});

		if (!genre) throw new NotFoundException();

		genre.deleted = true;
		genre.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genre);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		this._genreRepository.save(genre);
	}
}
