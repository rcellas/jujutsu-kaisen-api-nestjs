import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechniqueController } from './controller/technique.controller';
import { TechniqueService } from './service/technique.service';
import { Technique, TechniqueSchema } from './schema/technique.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Technique.name, schema: TechniqueSchema }]),
    ],
    controllers: [TechniqueController],
    providers: [TechniqueService],
})
export class TechniqueModule { }
