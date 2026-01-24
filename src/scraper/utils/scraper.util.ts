import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class ScraperUtil {
    private static readonly logger = new Logger(ScraperUtil.name);

    static async fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
        try {
            const { data } = await axios.get(url);
            return cheerio.load(data);
        } catch (error) {
            this.logger.error(`Error fetching page ${url}: ${error.message}`);
            return null;
        }
    }

    static cleanText(text: string): string {
        return text.replace(/\[.*?\]/g, '').trim();
    }

    static getInfoboxValue(infobox: cheerio.Cheerio<any>, source: string): string {
        const el = infobox.find(`[data-source="${source}"] .pi-data-value`);
        return el.length ? this.cleanText(el.text()) : 'Unknown';
    }

    static extractImage(container: cheerio.Cheerio<any>): string {
        return container.find('a.image').attr('href') || container.find('img').attr('src') || '';
    }
}
