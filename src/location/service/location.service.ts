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

    async LocationId(identifier: string): Promise<Location> {
        let location;

        if (!isNaN(Number(identifier))) {
            location = await this.locationModel.findOne({ id: Number(identifier) }).exec();
        } else {
            location = await this.locationModel.findOne({ name: identifier }).exec();
        }

        if (!location) {
            if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
                location = await this.locationModel.findById(identifier).exec();
            }
        }

        if (!location) {
            throw new Error(`Location with identifier ${identifier} not found`);
        }
        return location;
    }
}
