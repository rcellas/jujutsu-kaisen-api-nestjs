import { Document, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export type UserDocument = HydratedDocument<User>;
@Schema()
export class User extends Document {
    @Prop()
    name: string;
    
    @Prop({unique: true})
    email: string;
    
    @Prop()
    password: string;
    }

export const UserSchema = SchemaFactory.createForClass(User);
