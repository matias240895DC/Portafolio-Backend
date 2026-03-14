import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class SoftSkill extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  icon: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Icon' })
  iconLibrary?: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: true })
  status: boolean;

  @ApiProperty()
  @Prop({ default: '#6366f1' })
  color: string;
}

export const SoftSkillSchema = SchemaFactory.createForClass(SoftSkill);
