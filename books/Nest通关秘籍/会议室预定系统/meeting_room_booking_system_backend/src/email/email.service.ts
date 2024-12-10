import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('nodemailer_host'),
      port: configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: configService.get('nodemailer_auth_user'),
        pass: configService.get('nodemailer_auth_pass'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: { name: '会议预定系统', address: '你的邮箱地址' },
      to,
      subject,
      html,
    });
  }
}
