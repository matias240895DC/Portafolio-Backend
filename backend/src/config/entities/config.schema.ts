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

  @ApiProperty()
  @Prop({ default: true })
  blueprintLinesEnabled: boolean;

  @ApiProperty()
  @Prop({ default: true })
  tiltEffectEnabled: boolean;

  @ApiProperty()
  @Prop({ default: true })
  codeShadowEnabled: boolean;

  @ApiProperty()
  @Prop({ default: 0.1 })
  blueprintOpacity: number;

  @ApiProperty()
  @Prop({ default: 'rgba(255, 255, 255, 0.03)' })
  consoleCardBg: string;

  @ApiProperty()
  @Prop({ default: 'rgba(255, 255, 255, 0.1)' })
  consoleCardBorder: string;

  @ApiProperty()
  @Prop({ default: '#10b981' })
  successColor: string;

  @ApiProperty()
  @Prop({ default: '#ef4444' })
  errorColor: string;

  @ApiProperty()
  @Prop({ default: '#fbbf24' })
  warningColor: string;
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
  @Prop({ default: 'Experiencia Laboral' })
  consoleTitleExperience: string;

  @ApiProperty()
  @Prop({ default: 'Formación Académica' })
  consoleTitleEducation: string;

  @ApiProperty()
  @Prop({ default: 'TECNOLOGÍAS CENTRALES' })
  consoleTitleStacksCentral: string;

  @ApiProperty()
  @Prop({ default: 'COMPETENCIAS ESTRATÉGICAS' })
  consoleTitleStacksSoft: string;

  @ApiProperty()
  @Prop({ default: 'TERMINAL_ARQUITECTÓNICA' })
  consoleTitleTerminal: string;

  @ApiProperty()
  @Prop({ default: 'ANÁLISIS TÉCNICO' })
  projectTitleAnalysis: string;

  @ApiProperty()
  @Prop({ default: 'ARQUITECTURA & STACK' })
  projectTitleStack: string;

  @ApiProperty()
  @Prop({ default: 'ENLACES DEL PROYECTO' })
  projectTitleLinks: string;

  @ApiProperty()
  @Prop({ default: 'COMANDO & CONTROL' })
  projectTitleActions: string;

  @ApiProperty()
  @Prop({ default: 'DESAFÍO' })
  projectLabelChallenge: string;

  @ApiProperty()
  @Prop({ default: 'SOLUCIÓN' })
  projectLabelSolution: string;

  @ApiProperty()
  @Prop({ default: 'IMPACTO' })
  projectLabelImpact: string;

  @ApiProperty()
  @Prop({ default: 'SISTEMA' })
  consoleTitleTab1: string;

  @ApiProperty()
  @Prop({ default: 'HISTORIAL' })
  consoleTitleTab2: string;

  @ApiProperty()
  @Prop({ default: 'TECNOLOGÍAS' })
  consoleTitleTab3: string;

  @ApiProperty()
  @Prop({ default: 'PROYECTOS' })
  consoleTitleTab4: string;

  @ApiProperty()
  @Prop({ default: 'FEEDBACK' })
  consoleTitleTab5: string;

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
