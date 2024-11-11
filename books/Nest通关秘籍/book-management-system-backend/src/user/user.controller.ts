import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  register(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);

    return 'done';
  }
}
