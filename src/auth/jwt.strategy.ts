import {Injectable} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwtContants';

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            // le decimos jwt que extraiga el token de la cabecera de autorizacion
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any){
        return {id: payload.id, name: payload.name};
    }
}