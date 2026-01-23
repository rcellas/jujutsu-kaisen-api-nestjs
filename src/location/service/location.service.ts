import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schema/location.schema';
import { CreateLocationDto } from '../dto/create-location.dto';

@Injectable()
export class LocationService {
    constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) { }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const createdLocation = new this.locationModel(createLocationDto);
        return createdLocation.save();
    }

    async findAll(): Promise<Location[]> {
        return this.locationModel.find().exec();
    }
}
