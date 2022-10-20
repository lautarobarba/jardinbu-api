import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { DatabaseModule } from 'database/database.module';
import { UserModule } from 'modules/user/user.module';
import { AuthModule } from 'modules/auth/auth.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { SpecimenModule } from './modules/specimen/specimen.module';
import { GenreModule } from './modules/genre/genre.module';
import { SpeciesModule } from './modules/species/species.module';

@Module({
	imports: [DatabaseModule, AuthModule, UserModule, MailerModule, SpecimenModule, GenreModule, SpeciesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	static port: number | string;

	constructor() {
		AppModule.port = process.env.APP_PORT || 3000;
	}
}
