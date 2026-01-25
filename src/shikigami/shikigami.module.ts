import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shikigami, ShikigamiSchema } from './schema/shikigami.schema';
import { ShikigamiController } from './controller/shikigami.controller';
import { ShikigamiService } from './service/shikigami.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Shikigami.name, schema: ShikigamiSchema }])],
    controllers: [ShikigamiController],
    providers: [ShikigamiService],
    exports: [ShikigamiService, MongooseModule],
})
export class ShikigamiModule { }
