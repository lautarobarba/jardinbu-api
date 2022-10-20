import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from 'app.service';

@Controller()
export class AppController {
	constructor(private readonly _appService: AppService) {}

	@Get()
	@ApiTags('Bienvenida')
	async getWelcome(): Promise<string> {
		const mensaje = await this._appService.getWelcome();
		return mensaje;
	}
}
