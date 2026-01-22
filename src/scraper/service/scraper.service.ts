import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Character } from '../../character/schema/characters.schema';
import { Manga } from '../../manga/schema/manga.schema';
import { Episode } from '../../episode/schema/episode.schema';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    private readonly baseUrl = 'https://jujutsu-kaisen.fandom.com';

    constructor(
        @InjectModel(Character.name) private characterModel: Model<Character>,
        @InjectModel(Manga.name) private mangaModel: Model<Manga>,
        @InjectModel(Episode.name) private episodeModel: Model<Episode>,
    ) { }

    async scrapeCharacters() {
        this.logger.log('Starting Character Scraping...');
        try {
            const listUrl = `${this.baseUrl}/es/wiki/Lista_de_Personajes`;
            const { data } = await axios.get(listUrl);
            const $ = cheerio.load(data);

            const characterLinks: Set<string> = new Set();
            // Select links from the main content area, excluding navigational/system links
            $('#mw-content-text a').each((_, el) => {
                const href = $(el).attr('href');
                const title = $(el).attr('title');
                if (href && href.startsWith('/es/wiki/') && title) {
                    // Filter out non-character pages roughly
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

        } catch (error) {
            this.logger.error('Error scraping characters', error);
        }
    }

    private async scrapeSingleCharacter(url: string) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const name = $('h1#firstHeading, h1.page-header__title').text().trim();
            const infobox = $('aside.portable-infobox');

            if (!infobox.length) return;

            // Helper to clean text method
            const getInfo = (source: string) => {
                const el = infobox.find(`[data-source="${source}"] .pi-data-value`);
                return el.length ? el.text().trim().replace(/\[.*?\]/g, '') : 'Unknown';
            };

            const cleanText = (text: string) => text.replace(/\[.*?\]/g, '').trim();

            // Extract Status
            let status = 'Unknown';
            const statusEl = infobox.find('[data-source="estado"], [data-source="status"]');
            if (statusEl.length) {
                const collapsible = statusEl.find('.mw-collapsible-content');
                if (collapsible.length) {
                    status = cleanText(collapsible.text());
                } else {
                    status = cleanText(statusEl.find('.pi-data-value').text());
                }
            }

            // Extract other fields
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
                    let imgUrl = content.find('a.image').attr('href');
                    if (!imgUrl) imgUrl = content.find('img').attr('src');

                    if (label.includes('anime')) {
                        animeImage = imgUrl || '';
                    } else if (label.includes('manga')) {
                        mangaImage = imgUrl || '';
                    }
                });
            } else {
                // Fallback single image
                const singleImg = infobox.find('figure.pi-image a.image').attr('href') || infobox.find('figure.pi-image img').attr('src');
                animeImage = singleImg || '';
            }

            await this.characterModel.updateOne(
                { name },
                {
                    name,
                    status,
                    gender,
                    specie,
                    kanji,
                    romaji,
                    occupation,
                    firstAppearanceManga,
                    firstAppearanceAnime,
                    animeImage,
                    mangaImage
                },
                { upsert: true }
            );
            this.logger.log(`Upserted character: ${name}`);

        } catch (e) {
            this.logger.error(`Failed to scrape ${url}: ${e.message}`);
        }
    }

    async scrapeManga() {
        this.logger.log('Starting Manga Scraping...');
        try {
            const url = `${this.baseUrl}/es/wiki/Lista_de_Volúmenes`;
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Assuming volumes are listed in a table or similar structure. 
            // Often wikis use "wikitable" or "volume-list".
            // Let's look for Volume headers or table rows.
            // Simplified logic: Look for volume info. 
            // If complex, might need specific selectors.

            // Allow fail basic implementation for now
            const rows = $('.wikitable tr').toArray();
            for (const el of rows) {
                // Skip header (often th, but check index or content)
                const title = $(el).find('td').first().text().trim();
            }
            this.logger.log('Manga scraping structure needs verification. Implemented placeholder.');

        } catch (error) {
            this.logger.error('Error scraping manga', error);
        }
    }

    async scrapeEpisodes() {
        this.logger.log('Starting Episode Scraping...');
        try {
            // https://jujutsu-kaisen.fandom.com/es/wiki/Lista_de_Episodios
            const url = `${this.baseUrl}/es/wiki/Lista_de_Episodios`;
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Usually tables for seasons
            const rows = $('.wikitable tr').toArray();
            for (const el of rows) {
                const cols = $(el).find('td');
                if (cols.length > 1) {
                    const episodeNumberRaw = $(cols[0]).text().trim();
                    const title = $(cols[1]).text().replace(/"/g, '').trim();
                    const airDate = $(cols[2]).text().trim();

                    const episodeNumber = parseInt(episodeNumberRaw);
                    if (!isNaN(episodeNumber)) {
                        await this.episodeModel.updateOne(
                            { episodeNumber },
                            { title, episodeNumber, airDate },
                            { upsert: true }
                        );
                    }
                }
            }
            this.logger.log('Episode scraping completed.');
        } catch (error) {
            this.logger.error('Error scraping episodes', error);
        }
    }
}
