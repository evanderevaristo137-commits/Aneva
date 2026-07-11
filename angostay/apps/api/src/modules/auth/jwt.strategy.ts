import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../../common/decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  type: 'access' | 'challenge';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'dev-only-secret',
    });
  }

  validate(payload: JwtPayload): AuthUser | null {
    if (payload.type !== 'access') return null; // tokens de desafio 2FA não autenticam rotas
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
