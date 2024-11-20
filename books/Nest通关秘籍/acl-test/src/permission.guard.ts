import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUserName(user.username);
    const permission = this.reflector.get('permission', context.getHandler());

    if (foundUser.permission.some((item) => item.name === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限');
    }

    return true;
  }
}
