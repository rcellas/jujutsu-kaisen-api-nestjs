import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechniqueDocument = Technique & Document;

@Schema()
export class Technique {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    type: string;

    @Prop()
    user: string; // User of the technique
}

export const TechniqueSchema = SchemaFactory.createForClass(Technique);
