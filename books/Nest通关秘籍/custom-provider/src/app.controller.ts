import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(AppService)
  private readonly appService2: AppService;

  @Inject('person')
  private readonly person2: { name: string; desc: string };

  @Get()
  getHello(): string {
    console.log(this.person2);
    console.log(this.appService2);

    return this.appService.getHello();
  }
}
