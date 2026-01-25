import { Controller, Get, Param } from '@nestjs/common';
import { TechniqueService } from '../service/technique.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('technique')
@Controller('technique')
export class TechniqueController {
    constructor(private readonly techniqueService: TechniqueService) { }

    @Get()
    findAll() {
        return this.techniqueService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.techniqueService.TechniqueId(id);
    }
}
