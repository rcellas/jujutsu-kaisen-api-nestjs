import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CharacterModule } from './character/character.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    CharacterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
