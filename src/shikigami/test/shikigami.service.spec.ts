import { Test, TestingModule } from '@nestjs/testing';
import { ShikigamiService } from '../service/shikigami.service';
import { getModelToken } from '@nestjs/mongoose';
import { Shikigami } from '../schema/shikigami.schema';

const mockShikigami = {
    id: 1,
    name: 'Divine Dog',
    user: 'Megumi Fushiguro',
};

describe('ShikigamiService', () => {
    let service: ShikigamiService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShikigamiService,
                {
                    provide: getModelToken(Shikigami.name),
                    useValue: {
                        find: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([mockShikigami]),
                        }),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ShikigamiService>(ShikigamiService);
        model = module.get(getModelToken(Shikigami.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of shikigami', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockShikigami]);
        });
    });

    describe('ShikigamiId', () => {
        it('should find shikigami by numeric ID', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockShikigami),
            });

            const result = await service.ShikigamiId('1');
            expect(result).toEqual(mockShikigami);
            expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
        });

        it('should find shikigami by name', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockShikigami),
            });

            const result = await service.ShikigamiId('Divine Dog');
            expect(result).toEqual(mockShikigami);
            expect(model.findOne).toHaveBeenCalledWith({ name: 'Divine Dog' });
        });

        it('should throw Error if shikigami not found', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.ShikigamiId('999')).rejects.toThrow('Shikigami with identifier 999 not found');
        });
    });
});
