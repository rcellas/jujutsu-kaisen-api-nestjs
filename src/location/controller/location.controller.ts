import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from '../service/location.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    findAll() {
        return this.locationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationService.LocationId(id);
    }
}
