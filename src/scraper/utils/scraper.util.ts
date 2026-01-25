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

    static getInfoboxValue(infobox: cheerio.Cheerio<any>, source: string | string[]): string {
        const sources = Array.isArray(source) ? source : [source];

        for (const s of sources) {
            const el = infobox.find(`[data-source="${s}"] .pi-data-value`);
            if (el.length) {
                const text = this.cleanText(el.text());
                if (text) return text;
            }
        }
        return 'Unknown';
    }

    static extractImage(container: cheerio.Cheerio<any>): string {
        return container.find('a.image').attr('href') || container.find('img').attr('src') || '';
    }

    static async getNextId(model: any): Promise<number> {
        const lastEntry = await model.findOne().sort({ id: -1 });
        return lastEntry && lastEntry.id ? lastEntry.id + 1 : 1;
    }
}
