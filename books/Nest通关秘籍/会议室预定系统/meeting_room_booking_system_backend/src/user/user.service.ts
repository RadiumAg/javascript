import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;

  private readonly logger = new Logger();

  constructor(private userRepository: Repository<User>) {}

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = user.password;
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
    } catch (e) {}
  }
}
