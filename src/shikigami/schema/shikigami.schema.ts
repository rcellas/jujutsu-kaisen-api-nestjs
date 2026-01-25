import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShikigamiDocument = Shikigami & Document;

@Schema({
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
})
export class Shikigami {
    @Prop({ unique: true })
    id: number;

    @Prop({ required: true })
    name: string;

    @Prop()
    kanji: string;

    @Prop()
    romaji: string;

    @Prop()
    user: string;

    @Prop()
    mangaImage: string;

    @Prop()
    animeImage: string;

    @Prop()
    description: string;

    @Prop()
    firstAppearanceManga: string;

    @Prop()
    firstAppearanceAnime: string;
}

export const ShikigamiSchema = SchemaFactory.createForClass(Shikigami);
