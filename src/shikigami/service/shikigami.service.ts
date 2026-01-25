import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shikigami, ShikigamiDocument } from '../schema/shikigami.schema';
import { CreateShikigamiDto } from '../dto/create-shikigami.dto';

@Injectable()
export class ShikigamiService {
    constructor(@InjectModel(Shikigami.name) private shikigamiModel: Model<ShikigamiDocument>) { }

    async create(createShikigamiDto: CreateShikigamiDto): Promise<Shikigami> {
        const createdShikigami = new this.shikigamiModel(createShikigamiDto);
        return createdShikigami.save();
    }

    async findAll(): Promise<Shikigami[]> {
        return this.shikigamiModel.find().exec();
    }

    async ShikigamiId(identifier: string): Promise<Shikigami> {
        let shikigami;

        if (!isNaN(Number(identifier))) {
            shikigami = await this.shikigamiModel.findOne({ id: Number(identifier) }).exec();
        } else {
            shikigami = await this.shikigamiModel.findOne({ name: identifier }).exec();
        }

        if (!shikigami) {
            if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
                shikigami = await this.shikigamiModel.findById(identifier).exec();
            }
        }

        if (!shikigami) {
            throw new Error(`Shikigami with identifier ${identifier} not found`);
        }
        return shikigami;
    }
}
