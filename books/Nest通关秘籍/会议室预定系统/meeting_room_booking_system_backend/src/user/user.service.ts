import { Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(private userRepository: Repository<User>) {}

  register(user: RegisterUserDto) {}
}
