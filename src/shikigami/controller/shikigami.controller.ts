import { Controller, Get, Param } from '@nestjs/common';
import { ShikigamiService } from '../service/shikigami.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shikigami')
@Controller('shikigami')
export class ShikigamiController {
    constructor(private readonly shikigamiService: ShikigamiService) { }

    @Get()
    findAll() {
        return this.shikigamiService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shikigamiService.ShikigamiId(id);
    }
}
