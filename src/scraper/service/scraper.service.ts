import { Injectable, Logger } from '@nestjs/common';
import { CharacterScraper } from '../strategies/character.scraper';
import { LocationScraper } from '../strategies/location.scraper';
import { TechniqueScraper } from '../strategies/technique.scraper';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        private readonly characterScraper: CharacterScraper,
        private readonly locationScraper: LocationScraper,
        private readonly techniqueScraper: TechniqueScraper
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
}
