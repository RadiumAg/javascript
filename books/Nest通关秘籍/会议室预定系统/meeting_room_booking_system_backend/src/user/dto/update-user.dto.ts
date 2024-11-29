import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  headPic: string;

  nickName: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '验证码不正确' })
  captcha: string;
}
