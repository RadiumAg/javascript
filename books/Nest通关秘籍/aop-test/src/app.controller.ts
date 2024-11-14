import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LoginGuard)
  @Get()
  getHello(): string {
    console.log('handler...');
    return this.appService.getHello();
  }
}
