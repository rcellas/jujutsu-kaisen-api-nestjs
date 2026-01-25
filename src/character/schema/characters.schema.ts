import { Document, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type } from 'os';
import exp from 'constants';

export type CharacterDocument = HydratedDocument<Character>;
export enum StatusEnum {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  UNKNOWN = 'Unknown'
}

export enum GenderEnum {
  MALE = "Male",
  FEMALE = 'Female',
  UNKNOWN = 'Unknown'
}

@Schema({
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
})
export class Character extends Document {
  @Prop({ unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: GenderEnum, default: GenderEnum.UNKNOWN })
  gender: string;

  @Prop({ enum: StatusEnum, default: StatusEnum.UNKNOWN })
  status: string;

  @Prop()
  mangaImage: string;

  @Prop()
  animeImage: string;

  @Prop()
  specie: string;

  @Prop()
  kanji: string;

  @Prop()
  romaji: string;

  @Prop()
  occupation: string;

  @Prop()
  firstAppearanceManga: string;

  @Prop()
  firstAppearanceAnime: string;

  @Prop()
  location: string;

  @Prop()
  techniques: string[];

  @Prop()
  shikigamis: string[];
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
