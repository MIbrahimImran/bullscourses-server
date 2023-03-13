import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'info@bullscourses.com', // e.g. smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: 'your-email-address',
        pass: 'your-email-password',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'your-email-address',
      to,
      subject,
      text,
    };
    const info = await this.transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  }
}
