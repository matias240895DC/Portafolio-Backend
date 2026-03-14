import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class ThemeSettings {
  @ApiProperty()
  @Prop({ default: '#6366f1' })
  primaryColor: string;

  @ApiProperty()
  @Prop({ default: '#a855f7' })
  secondaryColor: string;

  @ApiProperty()
  @Prop({ default: '#22d3ee' })
  accentColor: string;

  @ApiProperty()
  @Prop({ default: '#0a0a0c' })
  backgroundColor: string;

  @ApiProperty()
  @Prop({ default: '#f8fafc' })
  textColor: string;

  @ApiProperty()
  @Prop({ default: 'solid' })
  backgroundType: 'solid' | 'gradient';

  @ApiProperty()
  @Prop({ default: '' })
  backgroundGradient: string;
}

@Schema()
export class Configuration extends Document {
  @ApiProperty()
  @Prop({ default: 'Portafolio' })
  logoText: string;

  @ApiProperty()
  @Prop()
  logoUrl: string;

  @ApiProperty()
  @Prop({ default: 'Hola, soy Matías' })
  heroTitle1: string;

  @ApiProperty()
  @Prop({ default: 'Back-end Developer' })
  heroTitle2: string;

  @ApiProperty()
  @Prop({ default: 'Especializado en arquitecturas escalables, NestJS y servicios en la nube.' })
  heroDescription: string;

  @ApiProperty()
  @Prop({ default: 'dark' })
  themeMode: 'light' | 'dark';

  @ApiProperty()
  @Prop({ type: ThemeSettings, default: () => ({}) })
  lightTheme: ThemeSettings;

  @ApiProperty()
  @Prop({ type: ThemeSettings, default: () => ({}) })
  darkTheme: ThemeSettings;
}


export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
