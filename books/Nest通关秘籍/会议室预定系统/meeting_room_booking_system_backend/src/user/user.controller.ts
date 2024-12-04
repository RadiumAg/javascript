import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UnauthorizedException,
  DefaultValuePipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { generateParseIntPip } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: Number,
  })
  @ApiQuery({
    name: 'nickname',
    description: '昵称',
    type: Number,
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: Number,
  })
  @ApiResponse({
    description: '用户列表',
    type: UserListVo,
  })
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPip('pageNo'))
    pageNo: number,
    @Query('pageSize', new DefaultValuePipe(2), generateParseIntPip('pageSize'))
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsers(
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    );
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number,
  })
  @ApiResponse({
    type: String,
    description: 'success',
  })
  @RequireLogin()
  @Get('freeze')
  async freeze(@Query('userId') userId: number) {
    return await this.userService.freezeUserById(userId);
  }

  @Get('update/captcha')
  async updateCaptcha(@Query('address') address) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `您的验证码是${code}`,
    });

    return '发送成功';
  }

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxx',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登陆',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.id, false);
      const access_token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      const vo = new RefreshTokenVo();
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;

      return {
        access_token,
        refresh_token,
      };
    } catch {
      throw new UnauthorizedException('token 已失效，请重新登陆');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.id, true);
      const access_token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登陆');
    }
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: String,
  })
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async captcha(@Query('address') address) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 60 * 5);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `您的验证码是${code}`,
    });
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    return vo;
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    return vo;
  }

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  async aaa(@UserInfo('username') username: string, @UserInfo() userInfo) {
    console.log(username);
    console.log(userInfo);

    return 'aaa';
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo,
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确',
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @RequireLogin()
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`update_password_captcha_${address}`, code);

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}`,
    });

    return '发送成功';
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}
