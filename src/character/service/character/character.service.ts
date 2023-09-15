import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCharacterDto } from 'src/character/dto/CreateCharacter';
import { Character } from 'src/character/schema/characters.schema';
import { isURL } from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CharacterService {
    constructor(@InjectModel(Character.name) private readonly characterModel: Model<Character>) {}

    async AllCharacters(): Promise<Character[]>{
        return this.characterModel.find().exec();
    }

    async CharacterId(characterId: string): Promise<Character> {
      const character = await this.characterModel.findById(characterId).exec();
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      return character;
    }


    async createCharacter(createCharacterDto: CreateCharacterDto): Promise<Character> {
      if (createCharacterDto.imagen && !isURL(createCharacterDto.imagen)) {
        throw new BadRequestException('La imagen debe ser una URL válida.');
      } else if (!createCharacterDto.imagen) {
        // Establecer una URL por defecto si no se proporciona una imagen
        createCharacterDto.imagen = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
      }
      const character = new this.characterModel(createCharacterDto);
      return character.save();
    }

    async updateCharacter(id: string, characterData: Character): Promise<Character>{
        const existingCharacter = await this.characterModel.findById(id).exec();
        if (!existingCharacter) {
          throw new NotFoundException(`Character with ID ${id} not found`);
        }
        existingCharacter.set(characterData);
        return existingCharacter.save();
    }

    async deleteCharacter(id: string): Promise<Character>{
        // haz que se elimine todos los datos incluido la imagen
        const character = await this.characterModel.findByIdAndDelete(id);
        if (!character) {
            throw new NotFoundException(`Character with ID ${id} not found`);
            }
        const imagePath = path.join(__dirname, '..', 'uploads', character.imagen);
        fs.unlinkSync(imagePath);
        return character;
    }

}
