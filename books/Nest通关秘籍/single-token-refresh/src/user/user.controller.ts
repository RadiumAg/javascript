import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  create(@Body() loginDto: LoginUserDto) {
    if (loginDto.username !== 'radium' || loginDto.password !== '1234556') {
      throw new Error('用户名或密码错误');
    }

    const jwt = this.jwtService.sign(
      {
        username: loginDto.username,
      },
      {
        secret: 'radium',
        expiresIn: '7d',
      },
    );

    return jwt;
  }
}
