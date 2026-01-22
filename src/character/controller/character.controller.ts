import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { CreateCharacterDto } from 'src/character/dto/CreateCharacter';
import { Character } from 'src/character/schema/characters.schema';
import { CharacterService } from '../service/character.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('character')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Get()
  async getCharacters() {
    return this.characterService.AllCharacters();
  }

  @Get(':id')
  async getCharacterId(@Param('id') id: string): Promise<Character> {
    return this.characterService.CharacterId(id);
  }

  @Post()
  async createCharacter(@Body() createCharacterDTO: CreateCharacterDto): Promise<Character> {
    return this.characterService.createCharacter(createCharacterDTO);
  }

  @Put(':id')
  async updateCharacter(@Param('id') id: string, @Body() characterData: Character): Promise<Character> {
    return this.characterService.updateCharacter(id, characterData);
  }

  @Delete(':id')
  async deleteCharacter(@Param('id') id: string): Promise<Character> {
    return this.characterService.deleteCharacter(id);
  }
}
