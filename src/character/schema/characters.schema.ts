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

export enum GenderEnum{
  MALE="Male",
  FEMALE='Female',
  UNKNOWN='Unknown'
}

@Schema()
export class Character extends Document {
  @Prop({required: true})
  name: string;

  @Prop({required: true, enum:GenderEnum,default:GenderEnum.UNKNOWN})
  gender: string;

  @Prop({required: true,enum:StatusEnum,default:StatusEnum.UNKNOWN})
  status: string;

  @Prop()
  imagen: string;

  @Prop()
  specie: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
