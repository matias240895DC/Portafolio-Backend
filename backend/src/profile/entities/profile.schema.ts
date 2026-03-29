import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @ApiProperty()
  @Prop()
  about: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @Prop({ type: [{ title: String, company: String, period: String, description: String }] })
  experience: { title: string, company: string, period: string, description: string }[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @Prop({ type: [{ degree: String, institution: String, year: String }] })
  education: { degree: string, institution: string, year: string }[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @Prop({ type: [{ name: String, level: String, icon: String }] })
  languages: { name: string, level: string, icon: string }[];

  @ApiProperty()
  @Prop({ default: 0 })
  yearsOfExperience: number;

  @ApiProperty()
  @Prop({ type: { linkedin: String, phone: String, email: String, cvUrl: String }, _id: false })
  socialLinks: { linkedin: string, phone: string, email: string, cvUrl: string };
  @ApiProperty()
  @Prop()
  avatarUrl: string;

  @Prop({ type: Buffer, select: false })
  cvFile: Buffer;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
