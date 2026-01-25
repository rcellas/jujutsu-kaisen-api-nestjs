import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CharacterModule } from './character/character.module';
import { LocationModule } from './location/location.module';
import { TechniqueModule } from './technique/technique.module';
import { ShikigamiModule } from './shikigami/shikigami.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CharacterModule,
    LocationModule,
    TechniqueModule,
    ShikigamiModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
