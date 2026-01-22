import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScraperService } from './service/scraper.service';
import { ScraperController } from './controller/scraper.controller';
import { Character, CharacterSchema } from '../character/schema/characters.schema';
import { Manga, MangaSchema } from '../manga/schema/manga.schema';
import { Episode, EpisodeSchema } from '../episode/schema/episode.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Character.name, schema: CharacterSchema },
            { name: Manga.name, schema: MangaSchema },
            { name: Episode.name, schema: EpisodeSchema },
        ]),
    ],
    controllers: [ScraperController],
    providers: [ScraperService],
})
export class ScraperModule { }
