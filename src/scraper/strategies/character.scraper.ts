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
        const $ = await ScraperUtil.fetchPage(`${this.baseUrl}/es/wiki/Lista_de_Personajes`);
        if (!$) return;

        const characterLinks: Set<string> = new Set();
        $('#mw-content-text a').each((_, el) => {
            const href = $(el).attr('href');
            const title = $(el).attr('title');
            if (href && href.startsWith('/es/wiki/') && title) {
                if (!href.includes(':') && !href.includes('Lista_de') && !href.includes('Anexo:')) {
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
        const statusEl = infobox.find('[data-source="estado"], [data-source="status"]');
        if (statusEl.length) {
            const collapsible = statusEl.find('.mw-collapsible-content');
            status = ScraperUtil.cleanText(collapsible.length ? collapsible.text() : statusEl.find('.pi-data-value').text());
        }

        const getInfo = (source: string) => ScraperUtil.getInfoboxValue(infobox, source);

        let gender = getInfo('gender');
        if (gender === 'Unknown') gender = getInfo('género');

        let specie = getInfo('species');
        if (specie === 'Unknown') specie = getInfo('especie');

        const kanji = getInfo('kanji');
        const romaji = getInfo('rōmaji');
        const occupation = getInfo('ocupación');
        const firstAppearanceManga = getInfo('manga');
        const firstAppearanceAnime = getInfo('anime');

        // Images using Tabs
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
            animeImage = ScraperUtil.extractImage(infobox.find('figure.pi-image'));
        }

        await this.characterModel.updateOne(
            { name },
            {
                name, status, gender, specie, kanji, romaji,
                occupation, firstAppearanceManga, firstAppearanceAnime,
                animeImage, mangaImage
            },
            { upsert: true }
        );
        this.logger.log(`Upserted character: ${name}`);
    }
}
