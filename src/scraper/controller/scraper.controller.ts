import { Controller, Post } from '@nestjs/common';
import { ScraperService } from '../service/scraper.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) { }

    @Post('run')
    async scrapeAll() {
        await this.scraperService.scrapeCharacters();
        await this.scraperService.scrapeLocations();
        await this.scraperService.scrapeTechniques();
        return { message: 'Scraping initiated' };
    }
}
