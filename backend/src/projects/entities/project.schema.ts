import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Project extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Prop({ default: 5, required: true })
  ranking: number;

  @ApiProperty({ type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Stack' }] })
  stacks: Types.ObjectId[];

  @ApiProperty()
  @Prop({ required: true })
  githubUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  swaggerUrl: string;

  @ApiProperty()
  @Prop()
  docUrl: string;

  @ApiProperty()
  @Prop()
  imageUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  deployUrl: string;

  @ApiProperty()
  @Prop({ default: 0 })
  likes: number;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;

  @ApiProperty()
  @Prop()
  challenge: string;

  @ApiProperty()
  @Prop()
  solution: string;

  @ApiProperty()
  @Prop()
  impact: string;

  @Prop()
  architectureUrl: string;

  @Prop()
  repositoryUrl: string;

  @Prop({ type: [String] })
  testSuite: string[];

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop()
  envVariables: string;
}


export const ProjectSchema = SchemaFactory.createForClass(Project);
