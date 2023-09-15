import { Module } from '@nestjs/common';
import { CharacterController } from './controller/character/character.controller';
import { CharacterService } from './service/character/character.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './schema/characters.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Character.name, schema: CharacterSchema }])],
  controllers: [CharacterController],
  providers: [CharacterService]
})
export class CharacterModule {}
