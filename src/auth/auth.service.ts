import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { hash,compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(userObject: RegisterAuthDto) {
    const {password} = userObject;
    const hashedPassword = await hash(password, 10);
    userObject = {...userObject, password: hashedPassword};
    return this.userModel.create(userObject);
  }

  async login(loginAuthDto:LoginAuthDto){
    const {email, password} = loginAuthDto;
    const user = await this.userModel.findOne({email});
    if(!user) new HttpException('USER_NOT_FOUND', 404);

    const isMatch = await compare(password, user.password);
    if(!isMatch) throw new HttpException('PASSWORD_INCORRECT', 400);
    return user;
  }
}
