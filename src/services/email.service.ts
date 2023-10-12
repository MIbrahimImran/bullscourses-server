import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Course } from 'src/interfaces/course.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const senderEmail = this.configService.get<string>('EMAIL');
    const senderPassword = this.configService.get<string>('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });
  }

  async sendSubscribeNotification(course: Course, userEmail: string) {
    try {
      const subject = `CRN:${course.CRN} Title:"${course.TITLE}" is now subscribed!`;
      const courseSubscriptionMessage = `You have successfully subscribed to ${course.CRN} ${course.TITLE}. You will receive email notifications when the course status changes.`;

      await this.sendEmail(userEmail, subject, courseSubscriptionMessage);
    } catch (error) {
      Logger.error(
        `Failed to send course subscription notification for CRN: ${course.CRN}, user email: ${userEmail}`,
        error,
      );
    }
  }

  async sendUnsubscribeNotification(course: Course, userEmail: string) {
    try {
      const subject = `CRN:${course.CRN} Title:"${course.TITLE}" is now unsubscribed!`;
      const courseUnsubscriptionMessage = `You have successfully unsubscribed from ${course.CRN} ${course.TITLE}. You will no longer receive email notifications when the course status changes.`;

      await this.sendEmail(userEmail, subject, courseUnsubscriptionMessage);
    } catch (error) {
      Logger.error(
        `Failed to send course unsubscription notification for CRN: ${course.CRN}, user email: ${userEmail}`,
        error,
      );
    }
  }

  async sendUnsubscribeAllNotification(userEmail: string) {
    try {
      const subject = `You have unsubscribed from all courses`;
      const courseUnsubscriptionAllMessage = `You have successfully unsubscribed from all courses. You will no longer receive email notifications when the course status changes.`;

      await this.sendEmail(userEmail, subject, courseUnsubscriptionAllMessage);
    } catch (error) {
      Logger.error(
        `Failed to send course unsubscription all notification for user email: ${userEmail}`,
        error,
      );
    }
  }

  async sendStatusChangeNotification(course: Course, userEmail: string) {
    try {
      const subject = `${course.TITLE} is now ${course.STATUS}`;
      const courseStatusMessage = `You are subscribed to course Title: ${course.TITLE} | CRN: ${course.CRN} and its status has changed to ${course.STATUS}. 
            To view all of your subscribed courses, please visit https://bullscourses.com/
            To unsubscribe from all courses, please visit https://bullscourses.com/subscription/unsubscribeAll`;

      await this.sendEmail(userEmail, subject, courseStatusMessage);
    } catch (error) {
      Logger.error(
        `Failed to send course status change notification for CRN: ${course.CRN}, user email: ${userEmail}`,
        error,
      );
    }
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.verify();
    } catch (error) {
      Logger.error('Failed to verify email transporter', error);
      return;
    }

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL'),
        to,
        subject,
        text,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      Logger.error(
        `Failed to send email to: ${to}, subject: ${subject}`,
        error,
      );
    }
  }
}
