import { Injectable, Logger } from '@nestjs/common';
import { CharacterScraper } from '../strategies/character.scraper';
import { LocationScraper } from '../strategies/location.scraper';
import { TechniqueScraper } from '../strategies/technique.scraper';
import { ShikigamiScraper } from '../strategies/shikigami.scraper';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../../character/schema/characters.schema';
import { Technique } from '../../technique/schema/technique.schema';
import { Shikigami } from '../../shikigami/schema/shikigami.schema';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        private readonly characterScraper: CharacterScraper,
        private readonly locationScraper: LocationScraper,
        private readonly techniqueScraper: TechniqueScraper,
        private readonly shikigamiScraper: ShikigamiScraper,
        @InjectModel(Character.name) private characterModel: Model<Character>,
        @InjectModel(Technique.name) private techniqueModel: Model<Technique>,
        @InjectModel(Shikigami.name) private shikigamiModel: Model<Shikigami>
    ) { }

    async scrapeCharacters() {
        await this.characterScraper.scrape();
    }

    async scrapeLocations() {
        await this.locationScraper.scrape();
    }

    async scrapeTechniques() {
        await this.techniqueScraper.scrape();
    }

    async scrapeShikigamis() {
        await this.shikigamiScraper.scrape();
    }

    async linkRelationships() {
        this.logger.log('Linking relationships...');
        const characters = await this.characterModel.find().exec();

        for (const character of characters) {
            const techniques = await this.techniqueModel.find({
                user: { $regex: character.name, $options: 'i' }
            }).exec();

            const techniqueNames = techniques.map(t => t.name);
            
            const shikigamis = await this.shikigamiModel.find({
                user: { $regex: character.name, $options: 'i' }
            }).exec();

            const shikigamiNames = shikigamis.map(s => s.name);

            if (techniqueNames.length > 0 || shikigamiNames.length > 0) {
                await this.characterModel.updateOne(
                    { _id: character._id },
                    {
                        techniques: techniqueNames,
                        shikigamis: shikigamiNames
                    }
                );
                this.logger.log(`Updated ${character.name} with ${techniqueNames.length} techniques and ${shikigamiNames.length} shikigamis.`);
            }
        }
        this.logger.log('Relationship linking completed.');
    }
}
