import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from '../../location/schema/location.schema';
import { ScraperUtil } from '../utils/scraper.util';

@Injectable()
export class LocationScraper {
    private readonly logger = new Logger(LocationScraper.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(@InjectModel(Location.name) private locationModel: Model<Location>) { }

    async scrape(): Promise<void> {
        this.logger.log('Starting Location Scraping...');
        const $ = await ScraperUtil.fetchPage(`${this.baseUrl}/es/wiki/Categor%C3%ADa:Lugares`);
        if (!$) return;

        const locationLinks: Set<string> = new Set();
        $('.category-page__member-link').each((_, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('Categor%C3%ADa:')) {
                locationLinks.add(`${this.baseUrl}${href}`);
            }
        });

        this.logger.log(`Found ${locationLinks.size} locations.`);

        for (const link of locationLinks) {
            await this.scrapeSingleLocation(link);
        }
        this.logger.log('Location scraping completed.');
    }

    private async scrapeSingleLocation(url: string) {
        const $ = await ScraperUtil.fetchPage(url);
        if (!$) return;

        const name = $('h1#firstHeading, h1.page-header__title').text().trim();
        const infobox = $('aside.portable-infobox');

        let description = '';
        $('#mw-content-text p').each((_, el) => {
            const text = $(el).text().trim();
            if (!description && text.length > 20 && !text.includes('se refiere a')) {
                description = ScraperUtil.cleanText(text);
            }
        });

        const image = ScraperUtil.extractImage(infobox.find('figure.pi-image'));
        let type = ScraperUtil.getInfoboxValue(infobox, 'tipo');

        await this.locationModel.updateOne(
            { name },
            { name, description, image, type },
            { upsert: true }
        );
        this.logger.log(`Upserted location: ${name}`);
    }
}
