import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechniqueDocument = Technique & Document;

@Schema({
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
})
export class Technique {
    @Prop({ unique: true })
    id: number;
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    type: string;

    @Prop()
    user: string;
}

export const TechniqueSchema = SchemaFactory.createForClass(Technique);
