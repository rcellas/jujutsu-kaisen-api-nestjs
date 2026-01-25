import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from '../service/character.service';
import { getModelToken } from '@nestjs/mongoose';
import { Character } from '../schema/characters.schema';
import { NotFoundException } from '@nestjs/common';

const mockCharacter = {
    id: 1,
    name: 'Yuji Itadori',
    location: 'Tokyo',
    techniques: ['Divergent Fist'],
    shikigamis: [],
};

describe('CharacterService', () => {
    let service: CharacterService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CharacterService,
                {
                    provide: getModelToken(Character.name),
                    useValue: {
                        find: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([mockCharacter]),
                        }),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CharacterService>(CharacterService);
        model = module.get(getModelToken(Character.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('AllCharacters', () => {
        it('should return an array of characters', async () => {
            const result = await service.AllCharacters();
            expect(result).toEqual([mockCharacter]);
        });
    });

    describe('CharacterId', () => {
        it('should find character by numeric ID', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCharacter),
            });

            const result = await service.CharacterId('1');
            expect(result).toEqual(mockCharacter);
            expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
        });

        it('should find character by name', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCharacter),
            });

            const result = await service.CharacterId('Yuji Itadori');
            expect(result).toEqual(mockCharacter);
            expect(model.findOne).toHaveBeenCalledWith({ name: 'Yuji Itadori' });
        });

        it('should throw NotFoundException if character not found', async () => {
            model.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.CharacterId('999')).rejects.toThrow(NotFoundException);
        });
    });
});
