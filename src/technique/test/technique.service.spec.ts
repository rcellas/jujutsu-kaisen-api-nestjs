import { Test, TestingModule } from '@nestjs/testing';
import { TechniqueService } from '../service/technique.service';
import { getModelToken } from '@nestjs/mongoose';
import { Technique } from '../schema/technique.schema';

const mockTechnique = {
    id: 1,
    name: 'Black Flash',
    type: 'Innate Technique',
    user: 'Yuji Itadori',
};

describe('TechniqueService', () => {
    let service: TechniqueService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TechniqueService,
                {
                    provide: getModelToken(Technique.name),
                    useValue: {
                        find: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([mockTechnique]),
                        }),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TechniqueService>(TechniqueService);
        model = module.get(getModelToken(Technique.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of techniques', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockTechnique]);
        });
    });

    describe('TechniqueId', () => {
        it('should find technique by numeric ID', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTechnique),
            });

            const result = await service.TechniqueId('1');
            expect(result).toEqual(mockTechnique);
            expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
        });

        it('should find technique by name', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTechnique),
            });

            const result = await service.TechniqueId('Black Flash');
            expect(result).toEqual(mockTechnique);
            expect(model.findOne).toHaveBeenCalledWith({ name: 'Black Flash' });
        });

        it('should throw Error if technique not found', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.TechniqueId('999')).rejects.toThrow('Technique with identifier 999 not found');
        });
    });
});
