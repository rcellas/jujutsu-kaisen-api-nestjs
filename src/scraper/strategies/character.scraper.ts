import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../../character/schema/characters.schema';
import { ScraperUtil } from '../utils/scraper.util';

@Injectable()
export class CharacterScraper {
    private readonly logger = new Logger(CharacterScraper.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(@InjectModel(Character.name) private characterModel: Model<Character>) { }

    async scrape(): Promise<void> {
        this.logger.log('Starting Character Scraping...');
        const $ = await ScraperUtil.fetchPage(`${this.baseUrl}/wiki/List_of_Characters`);
        if (!$) return;

        const characterLinks: Set<string> = new Set();

        $('.mw-content-ltr a[href^="/wiki/"][title]').each((_, el) => {
            const href = $(el).attr('href');
            const title = $(el).attr('title');

            if (href && title) {
                const excludePatterns = [
                    'List_of',
                    'Category:',
                    'File:',
                    'Template:',
                    'Special:',
                    'Help:',
                    'Jujutsu_Kaisen',
                    'Jujutsu_Sorcerer',
                    'Cursed_Spirit',
                    'Tokyo_Metropolitan',
                    'Kyoto_Metropolitan',
                    'Sorcerer_Clan',
                    'Zenin_Family'
                ];

                const shouldExclude = excludePatterns.some(pattern =>
                    href.includes(pattern) || title.includes(pattern)
                );

                if (!shouldExclude && !href.includes(':')) {
                    characterLinks.add(`${this.baseUrl}${href}`);
                }
            }
        });

        this.logger.log(`Found ${characterLinks.size} unique character links.`);

        for (const link of characterLinks) {
            await this.scrapeSingleCharacter(link);
        }
        this.logger.log('Character scraping completed.');
    }

    private async scrapeSingleCharacter(url: string) {
        const $ = await ScraperUtil.fetchPage(url);
        if (!$) return;

        const name = $('h1#firstHeading, h1.page-header__title').text().trim();
        const infobox = $('aside.portable-infobox');

        if (!infobox.length) return;

        let status = 'Unknown';
        const statusEl = infobox.find('[data-source="status"], [data-source="estado"]');
        if (statusEl.length) {
            const collapsible = statusEl.find('.mw-collapsible-content');
            status = ScraperUtil.cleanText(collapsible.length ? collapsible.text() : statusEl.find('.pi-data-value').text());
        }

        const getInfo = (source: string) => ScraperUtil.getInfoboxValue(infobox, source);

        const gender = getInfo('gender');
        const specie = getInfo('species') || getInfo('race');
        const kanji = getInfo('kanji');
        const romaji = getInfo('rōmaji') || getInfo('romaji');
        const occupation = getInfo('occupation');
        const firstAppearanceManga = getInfo('debut');
        const firstAppearanceAnime = getInfo('debutanime');

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

            const isMangaOnly = (firstAppearanceAnime === 'NA' || !firstAppearanceAnime || firstAppearanceAnime === 'Unknown') && !!firstAppearanceManga;

            if (isMangaOnly) {
                mangaImage = singleImage;
            } else {
                animeImage = singleImage;
            }
        }

        const existingCharacter = await this.characterModel.findOne({ name });
        let id = existingCharacter ? existingCharacter.id : await ScraperUtil.getNextId(this.characterModel);

        await this.characterModel.findOneAndUpdate(
            { name },
            {
                id, name, status, gender, specie, kanji, romaji,
                occupation, firstAppearanceManga, firstAppearanceAnime,
                animeImage, mangaImage
            },
            { upsert: true, new: true }
        );
        this.logger.log(`Upserted character: ${name}`);
    }
}
