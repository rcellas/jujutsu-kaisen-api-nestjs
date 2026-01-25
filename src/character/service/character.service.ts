import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from 'src/character/schema/characters.schema';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) { }

  async AllCharacters(): Promise<Character[]> {
    return this.characterModel.find().exec();
  }

  async CharacterId(identifier: string): Promise<Character> {
    let character;

    if (!isNaN(Number(identifier))) {
      character = await this.characterModel.findOne({ id: Number(identifier) }).exec();
    } else {
      character = await this.characterModel.findOne({ name: identifier }).exec();
    }

    if (!character) {
      // Fallback to _id if it's a valid ObjectId
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        character = await this.characterModel.findById(identifier).exec();
      }
    }

    if (!character) {
      throw new NotFoundException(`Character with identifier ${identifier} not found`);
    }
    return character;
  }
}
