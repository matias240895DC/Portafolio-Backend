import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './entities/contact.schema';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  buildContactHtmlEmail,
  buildContactTextEmail,
} from './templates/contact-email.template';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMessage(contactDto: any) {
    // Save to DB
    const contact = new this.contactModel(contactDto);
    await contact.save();

    // Send Email
    try {
      const subject = `Nuevo mensaje de ${contactDto.name} - Portfolio`;
      const text = buildContactTextEmail(contactDto);
      const html = buildContactHtmlEmail(contactDto);

      await this.transporter.sendMail({
        from: `"Portfolio Contact" <${this.configService.get('MAIL_FROM')}>`,
        to: this.configService.get('ADMIN_EMAIL'),
        replyTo: `"${contactDto.name}" <${contactDto.email}>`,
        subject,
        text,
        html,
      });
      this.logger.log(`Email sent from ${contactDto.email}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }

    return { message: 'Message sent successfully' };
  }

  async findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async markAsRead(id: string) {
    return this.contactModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.contactModel.findByIdAndDelete(id).exec();
  }
}
