import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop()
    type: string; // e.g., School, City, Domain
}

export const LocationSchema = SchemaFactory.createForClass(Location);
