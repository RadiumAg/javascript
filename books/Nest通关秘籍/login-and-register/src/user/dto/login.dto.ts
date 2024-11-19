import { IsEmpty, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
