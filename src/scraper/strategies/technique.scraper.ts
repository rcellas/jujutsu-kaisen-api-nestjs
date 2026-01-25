import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technique } from '../../technique/schema/technique.schema';
import { ScraperUtil } from '../utils/scraper.util';

@Injectable()
export class TechniqueScraper {
    private readonly logger = new Logger(TechniqueScraper.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(@InjectModel(Technique.name) private techniqueModel: Model<Technique>) { }

    async scrape(): Promise<void> {
        this.logger.log('Starting Technique Scraping...');

        const categories = [
            'Innate_Techniques',
            'Anti-Domain_Techniques',
            'New_Shadow_Style_Techniques',
            'Barrier_Techniques',
            'Domain_Expansion',
            'Cursed_Tools',
            'Cursed_Objects'
        ];

        const links: Map<string, string> = new Map();

        for (const category of categories) {
            this.logger.log(`Scraping category: ${category}`);
            const $ = await ScraperUtil.fetchPage(`${this.baseUrl}/wiki/Category:${category}`);
            if (!$) continue;

            // Generate clean type from category name
            const type = category.replace(/_/g, ' ').replace(/-/g, ' ');

            $('.category-page__member-link').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('Category:')) {
                    const fullUrl = `${this.baseUrl}${href}`;
                    // Store link with its associated type
                    links.set(fullUrl, type);
                }
            });
        }

        this.logger.log(`Found ${links.size} unique techniques.`);

        for (const [link, type] of links) {
            await this.scrapeSingleTechnique(link, type);
        }
        this.logger.log('Technique scraping completed.');
    }

    private async scrapeSingleTechnique(url: string, type: string) {
        const $ = await ScraperUtil.fetchPage(url);
        if (!$) return;

        const name = $('h1#firstHeading, h1.page-header__title').text().trim();
        const infobox = $('aside.portable-infobox');

        let description = '';
        $('#mw-content-text p').each((_, el) => {
            const text = $(el).text().trim();
            if (!description && text.length > 20) {
                description = ScraperUtil.cleanText(text);
            }
        });

        const user = ScraperUtil.getInfoboxValue(infobox, 'user');

        const existingTechnique = await this.techniqueModel.findOne({ name });
        let id = existingTechnique ? existingTechnique.id : await ScraperUtil.getNextId(this.techniqueModel);

        await this.techniqueModel.findOneAndUpdate(
            { name },
            { id, name, description, type, user },
            { upsert: true, new: true }
        );
        this.logger.log(`Upserted technique: ${name} (Type: ${type})`);
    }
}
