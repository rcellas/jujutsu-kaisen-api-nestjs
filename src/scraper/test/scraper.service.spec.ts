import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from '../service/scraper.service';
import { CharacterScraper } from '../strategies/character.scraper';
import { LocationScraper } from '../strategies/location.scraper';
import { TechniqueScraper } from '../strategies/technique.scraper';
import { ShikigamiScraper } from '../strategies/shikigami.scraper';

describe('ScraperService', () => {
    let service: ScraperService;
    let characterScraper: CharacterScraper;
    let locationScraper: LocationScraper;
    let techniqueScraper: TechniqueScraper;
    let shikigamiScraper: ShikigamiScraper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScraperService,
                {
                    provide: CharacterScraper,
                    useValue: { scrape: jest.fn() },
                },
                {
                    provide: LocationScraper,
                    useValue: { scrape: jest.fn() },
                },
                {
                    provide: TechniqueScraper,
                    useValue: { scrape: jest.fn() },
                },
                {
                    provide: ShikigamiScraper,
                    useValue: { scrape: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<ScraperService>(ScraperService);
        characterScraper = module.get<CharacterScraper>(CharacterScraper);
        locationScraper = module.get<LocationScraper>(LocationScraper);
        techniqueScraper = module.get<TechniqueScraper>(TechniqueScraper);
        shikigamiScraper = module.get<ShikigamiScraper>(ShikigamiScraper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call characterScraper.scrape', async () => {
        await service.scrapeCharacters();
        expect(characterScraper.scrape).toHaveBeenCalled();
    });

    it('should call locationScraper.scrape', async () => {
        await service.scrapeLocations();
        expect(locationScraper.scrape).toHaveBeenCalled();
    });

    it('should call techniqueScraper.scrape', async () => {
        await service.scrapeTechniques();
        expect(techniqueScraper.scrape).toHaveBeenCalled();
    });

    it('should call shikigamiScraper.scrape', async () => {
        await service.scrapeShikigamis();
        expect(shikigamiScraper.scrape).toHaveBeenCalled();
    });
});
