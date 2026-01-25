import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shikigami } from '../../shikigami/schema/shikigami.schema';
import { ScraperUtil } from '../utils/scraper.util';

@Injectable()
export class ShikigamiScraper {
    private readonly logger = new Logger(ShikigamiScraper.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(@InjectModel(Shikigami.name) private shikigamiModel: Model<Shikigami>) { }

    async scrape(): Promise<void> {
        this.logger.log('Starting Shikigami Scraping...');

        const categories = [
            'Shikigami',
            'Ten_Shadows_Shikigami'
        ];

        const links: Set<string> = new Set();

        for (const category of categories) {
            this.logger.log(`Scraping category: ${category}`);
            const $ = await ScraperUtil.fetchPage(`${this.baseUrl}/wiki/Category:${category}`);
            if (!$) continue;

            $('.category-page__member-link').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('Category:')) {
                    links.add(`${this.baseUrl}${href}`);
                }
            });
        }

        this.logger.log(`Found ${links.size} shikigami.`);

        for (const link of links) {
            await this.scrapeSingleShikigami(link);
        }
        this.logger.log('Shikigami scraping completed.');
    }

    private async scrapeSingleShikigami(url: string) {
        const $ = await ScraperUtil.fetchPage(url);
        if (!$) return;

        const name = $('h1#firstHeading, h1.page-header__title').text().trim();
        const infobox = $('aside.portable-infobox');

        const getInfo = (source: string) => ScraperUtil.getInfoboxValue(infobox, source);

        const kanji = getInfo('kanji');
        const romaji = getInfo('rōmaji');
        const user = getInfo('user');
        const firstAppearanceManga = getInfo('debut');
        const firstAppearanceAnime = getInfo('debutanime');

        let description = '';
        $('#mw-content-text p').each((_, el) => {
            const text = $(el).text().trim();
            if (!description && text.length > 20) {
                description = ScraperUtil.cleanText(text);
            }
        });

        // Images
        let animeImage = '';
        let mangaImage = '';

        const imageCollection = infobox.find('.pi-image-collection');
        if (imageCollection.length) {
            const tabs = imageCollection.find('.wds-tabs__tab');
            const contents = imageCollection.find('.wds-tab__content');

            tabs.each((i, el) => {
                const label = $(el).text().trim().toLowerCase();
                const content = contents.eq(i);
                const imgUrl = ScraperUtil.extractImage(content);

                if (label.includes('anime')) {
                    animeImage = imgUrl;
                } else if (label.includes('manga')) {
                    mangaImage = imgUrl;
                }
            });
        } else {
            const singleImage = ScraperUtil.extractImage(infobox.find('figure.pi-image'));

            // If only one image exists, determine if it's manga or anime based on debut info
            const isMangaOnly = (firstAppearanceAnime === 'NA' || !firstAppearanceAnime || firstAppearanceAnime === 'Unknown') && !!firstAppearanceManga;

            if (isMangaOnly) {
                mangaImage = singleImage;
            } else {
                animeImage = singleImage;
            }
        }

        const existing = await this.shikigamiModel.findOne({ name });
        let id = existing ? existing.id : await ScraperUtil.getNextId(this.shikigamiModel);

        await this.shikigamiModel.findOneAndUpdate(
            { name },
            {
                id, name, kanji, romaji, user, description,
                animeImage, mangaImage,
                firstAppearanceManga, firstAppearanceAnime
            },
            { upsert: true, new: true }
        );
        this.logger.log(`Upserted shikigami: ${name}`);
    }
}
