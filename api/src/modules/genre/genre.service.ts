import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
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
			throw new ConflictException('Error: Attributes already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.deleted = false;
			exists.updatedAt = timestamp;
			return this._genreRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const genre: Genre = await this._genreRepository.create();
		genre.name = name;
		genre.updatedAt = timestamp;
		genre.createdAt = timestamp;

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

		// Controlo que el nombre no este en uso
		const exists: Genre = await this._genreRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted && exists.id !== id)
			throw new ConflictException('Error: Attributes already in use');

		genre.name = name;
		genre.updatedAt = timestamp;
		return this._genreRepository.save(genre);
	}

	async delete(id: number) {
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genre: Genre = await this._genreRepository.findOne({
			where: { id },
		});

<<<<<<< HEAD
		if (!genre) throw new NotFoundException();

=======
>>>>>>> 2f41dafbfddc1a3e95c91c4550b9730d1b1f021e
		genre.deleted = true;
		genre.updatedAt = timestamp;
		this._genreRepository.save(genre);
	}
}
