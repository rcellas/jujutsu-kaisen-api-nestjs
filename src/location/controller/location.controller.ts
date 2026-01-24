import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationService } from '../service/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Post()
    create(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.create(createLocationDto);
    }

    @Get()
    findAll() {
        return this.locationService.findAll();
    }
}
