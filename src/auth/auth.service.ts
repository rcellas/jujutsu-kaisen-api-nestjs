import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash,compare } from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private jwtService: JwtService
  ) {}

  async register(userObject: RegisterAuthDto) {
    const {password} = userObject;
    const hashedPassword = await hash(password, 10);
    userObject = {...userObject, password: hashedPassword};
    return this.userModel.create(userObject);
  }

  async login(loginAuthDto:LoginAuthDto){
    const {email, password} = loginAuthDto;
    const findUser = await this.userModel.findOne({email});
    if(!findUser) new HttpException('USER_NOT_FOUND', 404);

    const isMatch = await compare(password, findUser.password);
    if(!isMatch) throw new HttpException('PASSWORD_INCORRECT', 400);

    const payload = {id: findUser._id, name: findUser.name};

    const token = await this.jwtService.signAsync(payload);
    
    const data = {
      user:findUser,
      token
    }

    return data;
  }
}
