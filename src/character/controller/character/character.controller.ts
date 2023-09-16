import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  Put,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateCharacterDto } from '../../dto/CreateCharacter';
import { Character } from '../../schema/characters.schema';
import { CharacterService } from '../../service/character/character.service';

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

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async createCharacter(
    @Body() createCharacterDTO: CreateCharacterDto,
    // @UploadedFile() imagen,
  ): Promise<Character> {
    // if (imagen) {
    //   createCharacterDTO.imagen = imagen.filename; // Asigna el nombre del archivo al campo de imagen
    // }
    // comprueba si el personaje ya existe
    // const character = await this.characterService.CharacterName(createCharacterDTO.name);
    // if (character) {
    //   throw new BadRequestException('El personaje ya existe');
    // }
    return this.characterService.createCharacter(createCharacterDTO);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateCharacter(@Param('id') id: string, @Body() characterData: Character, @UploadedFile() imagen): Promise<Character> {
    if (imagen) {
      characterData.imagen = imagen.filename; // Asigna el nombre del archivo al campo de imagen
    }
    return this.characterService.updateCharacter(id, characterData);
  }

  @Delete(':id')
  async deleteCharacter(@Param('id') id: string): Promise<Character> {
    return this.characterService.deleteCharacter(id);
  }
}
