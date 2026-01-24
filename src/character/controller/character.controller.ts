import { Controller, Get, Param } from '@nestjs/common';
import { Character } from 'src/character/schema/characters.schema';
import { CharacterService } from '../service/character.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('character')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async getCharacters() {
    return this.characterService.AllCharacters();
  }

  @Get(':id')
  async getCharacterId(@Param('id') id: string): Promise<Character> {
    return this.characterService.CharacterId(id);
  }
}
