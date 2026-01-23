import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technique } from '../../technique/schema/technique.schema';
import { FandomScraperUtil } from '../utils/fandom-scraper.util';

@Injectable()
export class TechniqueScraper {
    private readonly logger = new Logger(TechniqueScraper.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(@InjectModel(Technique.name) private techniqueModel: Model<Technique>) { }

    async scrape(): Promise<void> {
        this.logger.log('Starting Technique Scraping...');
        const $ = await FandomScraperUtil.fetchPage(`${this.baseUrl}/es/wiki/Categor%C3%ADa:T%C3%A9cnicas`);
        if (!$) return;

        const links: Set<string> = new Set();
        $('.category-page__member-link').each((_, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('Categor%C3%ADa:')) {
                links.add(`${this.baseUrl}${href}`);
            }
        });

        this.logger.log(`Found ${links.size} techniques.`);

        for (const link of links) {
            await this.scrapeSingleTechnique(link);
        }
        this.logger.log('Technique scraping completed.');
    }

    private async scrapeSingleTechnique(url: string) {
        const $ = await FandomScraperUtil.fetchPage(url);
        if (!$) return;

        const name = $('h1#firstHeading, h1.page-header__title').text().trim();
        const infobox = $('aside.portable-infobox');

        let description = '';
        $('#mw-content-text p').each((_, el) => {
            const text = $(el).text().trim();
            if (!description && text.length > 20) {
                description = FandomScraperUtil.cleanText(text);
            }
        });

        let type = FandomScraperUtil.getInfoboxValue(infobox, 'class');
        if (type === 'Unknown') type = FandomScraperUtil.getInfoboxValue(infobox, 'clase');

        let user = FandomScraperUtil.getInfoboxValue(infobox, 'usuario');

        await this.techniqueModel.updateOne(
            { name },
            { name, description, type, user },
            { upsert: true }
        );
        this.logger.log(`Upserted technique: ${name}`);
    }
}
