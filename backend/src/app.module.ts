import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { StacksModule } from './stacks/stacks.module';
import { SoftSkillsModule } from './soft-skills/soft-skills.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { IconsModule } from './icons/icons.module';
import { AppConfigModule } from './config/config.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return { uri };
      },
    }),
    AuthModule,
    ProfileModule,
    ProjectsModule,
    StacksModule,
    SoftSkillsModule,
    TestimonialsModule,
    ContactModule,
    UploadModule,
    IconsModule,
    AppConfigModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
