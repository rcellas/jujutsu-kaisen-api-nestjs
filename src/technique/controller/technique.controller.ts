import { Controller, Get, Post, Body } from '@nestjs/common';
import { TechniqueService } from '../service/technique.service';
import { CreateTechniqueDto } from '../dto/create-technique.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('technique')
@Controller('technique')
export class TechniqueController {
    constructor(private readonly techniqueService: TechniqueService) { }

    @Post()
    create(@Body() createTechniqueDto: CreateTechniqueDto) {
        return this.techniqueService.create(createTechniqueDto);
    }

    @Get()
    findAll() {
        return this.techniqueService.findAll();
    }
}
