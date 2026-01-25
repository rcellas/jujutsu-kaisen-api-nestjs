import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
})
export class Location {
    @Prop({ unique: true })
    id: number;
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
