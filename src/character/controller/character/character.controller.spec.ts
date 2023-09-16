import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './character.controller';
import { CreateCharacterDto } from 'src/character/dto/CreateCharacter';
import { CharacterService } from 'src/character/service/character/character.service';

describe('CharacterController', () => {
  let controller: CharacterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [CharacterService],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCharacters', () => {
    it('should return an array of characters', async () => {
      // Crea un personaje de prueba
      const createCharacterDTO = new CreateCharacterDto();
      createCharacterDTO.name = 'Sukuna (Yuji Itadori)';

      const characters = await controller.getCharacters();
      expect(characters).toEqual([createCharacterDTO]);
    });
  });

  describe('getCharacterId', () => {
    it('should return a character', async () => {
      const characterId = '5f6c8b3d3c2a7d0a1c5e2d0a'; // Reemplaza con un ID válido

      const character = await controller.getCharacterId(characterId);
      expect(character).toBeDefined();
    });
  });

  describe('createCharacter', () => {
    it('should create a valid DTO object', async () => {
      const createCharacterDTO = new CreateCharacterDto();
      createCharacterDTO.name = 'Sukuna (Yuji Itadori)';
      createCharacterDTO.gender = 'Male';
      createCharacterDTO.status = 'Alive';
      createCharacterDTO.specie = 'Cursed Spirit';
      createCharacterDTO.imagen =
        'https://www.mundodeportivo.com/alfabeta/hero/2022/11/sukuna-pacto.jpeg?width=1200';

      const createdCharacter =
        await controller.createCharacter(createCharacterDTO);

      expect(createdCharacter).toBeDefined();
      expect(createdCharacter.name).toBe('Sukuna (Yuji Itadori)');
      expect(createdCharacter.gender).toBe('Male');
      expect(createdCharacter.status).toBe('Alive');
      expect(createdCharacter.specie).toBe('Cursed Spirit');
      expect(createdCharacter.imagen).toBe(
        'https://www.mundodeportivo.com/alfabeta/hero/2022/11/sukuna-pacto.jpeg?width=1200',
      );
    });

    it('should create a character with default image', async () => {
      const createCharacterDTO = new CreateCharacterDto();
      createCharacterDTO.name = 'Sukuna (Yuji Itadori)';
      createCharacterDTO.gender = 'Male';
      createCharacterDTO.status = 'Alive';
      createCharacterDTO.specie = 'Cursed Spirit';
      createCharacterDTO.imagen = '';

      const createdCharacter =
        await controller.createCharacter(createCharacterDTO);

      expect(createdCharacter).toBeDefined();
      expect(createdCharacter.name).toBe('Sukuna (Yuji Itadori)');
      expect(createdCharacter.gender).toBe('Male');
      expect(createdCharacter.imagen).toBe(
        'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      );
      expect(createdCharacter.status).toBe('Alive');
      expect(createdCharacter.specie).toBe('Cursed Spirit');
    });
  });
});
