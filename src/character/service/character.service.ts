import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCharacterDto } from 'src/character/dto/CreateCharacter';
import { Character } from 'src/character/schema/characters.schema';

@Injectable()
export class CharacterService {
  constructor(@InjectModel(Character.name) private readonly characterModel: Model<Character>) { }

  async AllCharacters(): Promise<Character[]> {
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
    const character = new this.characterModel(createCharacterDto);
    return character.save();
  }

  async updateCharacter(id: string, characterData: Character): Promise<Character> {
    const existingCharacter = await this.characterModel.findById(id).exec();
    if (!existingCharacter) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    existingCharacter.set(characterData);
    return existingCharacter.save();
  }

  async deleteCharacter(id: string): Promise<Character> {
    const character = await this.characterModel.findByIdAndDelete(id);
    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character;
  }

}
