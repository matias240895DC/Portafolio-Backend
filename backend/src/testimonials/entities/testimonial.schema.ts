import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Testimonial extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  company: string;

  @ApiProperty()
  @Prop({ required: true })
  message: string;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: Types.ObjectId, ref: 'Project', default: null })
  projectId: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: 0 })
  likes: number;

  @ApiProperty()
  @Prop({ default: 5, min: 1, max: 5 })
  rating: number;

  @ApiProperty()
  @Prop({ default: false })
  approved: boolean;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
