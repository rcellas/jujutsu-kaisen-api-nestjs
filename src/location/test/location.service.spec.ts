import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../service/location.service';
import { getModelToken } from '@nestjs/mongoose';
import { Location } from '../schema/location.schema';

const mockLocation = {
    id: 1,
    name: 'Shibuya',
    description: 'A major city ward in Tokyo.',
};

describe('LocationService', () => {
    let service: LocationService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationService,
                {
                    provide: getModelToken(Location.name),
                    useValue: {
                        find: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([mockLocation]),
                        }),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<LocationService>(LocationService);
        model = module.get(getModelToken(Location.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of locations', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockLocation]);
        });
    });

    describe('LocationId', () => {
        it('should find location by numeric ID', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockLocation),
            });

            const result = await service.LocationId('1');
            expect(result).toEqual(mockLocation);
            expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
        });

        it('should find location by name', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockLocation),
            });

            const result = await service.LocationId('Shibuya');
            expect(result).toEqual(mockLocation);
            expect(model.findOne).toHaveBeenCalledWith({ name: 'Shibuya' });
        });

        it('should throw Error if location not found', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.LocationId('999')).rejects.toThrow('Location with identifier 999 not found');
        });
    });
});
