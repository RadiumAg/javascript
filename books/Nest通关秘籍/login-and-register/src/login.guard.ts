import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'] || '';

    const bearerToken = authorization.split(' ');
    if (!bearerToken || bearerToken.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }

    try {
      const info = this.jwtService.verify(bearerToken);
      request.user = info.user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('登录 token 失效， 请重新登录');
    }
  }
}
