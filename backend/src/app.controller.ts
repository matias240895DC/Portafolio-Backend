import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): any {
    console.log(`[${new Date().toISOString()}] ⚡ CRON PING RECEIVED - Server kept alive`);
    return {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      message: 'Server is active and monitored by cron-job.org'
    };
  }
}
