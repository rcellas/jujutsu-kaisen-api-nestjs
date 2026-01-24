import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technique, TechniqueDocument } from '../schema/technique.schema';
import { CreateTechniqueDto } from '../dto/create-technique.dto';

@Injectable()
export class TechniqueService {
    constructor(@InjectModel(Technique.name) private techniqueModel: Model<TechniqueDocument>) { }

    async create(createTechniqueDto: CreateTechniqueDto): Promise<Technique> {
        const createdTechnique = new this.techniqueModel(createTechniqueDto);
        return createdTechnique.save();
    }

    async findAll(): Promise<Technique[]> {
        return this.techniqueModel.find().exec();
    }
}
