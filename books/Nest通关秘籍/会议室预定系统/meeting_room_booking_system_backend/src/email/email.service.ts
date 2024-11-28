import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: 'xxxxxx@qq.com',
        pass: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
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
