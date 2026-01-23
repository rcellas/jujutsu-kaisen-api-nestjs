import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from 'src/character/schema/characters.schema';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) {}

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
}
