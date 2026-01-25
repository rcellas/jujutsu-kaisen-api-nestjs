import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScraperService } from './service/scraper.service';
import { ScraperController } from './controller/scraper.controller';
import { Character, CharacterSchema } from '../character/schema/characters.schema';
import { Location, LocationSchema } from '../location/schema/location.schema';
import { Technique, TechniqueSchema } from '../technique/schema/technique.schema';
import { Shikigami, ShikigamiSchema } from '../shikigami/schema/shikigami.schema';
import { CharacterScraper } from './strategies/character.scraper';
import { LocationScraper } from './strategies/location.scraper';
import { TechniqueScraper } from './strategies/technique.scraper';
import { ShikigamiScraper } from './strategies/shikigami.scraper';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Character.name, schema: CharacterSchema },
            { name: Location.name, schema: LocationSchema },
            { name: Technique.name, schema: TechniqueSchema },
            { name: Shikigami.name, schema: ShikigamiSchema }
        ]),
    ],
    controllers: [ScraperController],
    providers: [
        ScraperService,
        CharacterScraper,
        LocationScraper,
        TechniqueScraper,
        ShikigamiScraper
    ],
})
export class ScraperModule { }
