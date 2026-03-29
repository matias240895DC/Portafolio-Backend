import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [ProfileModule],
  providers: [CloudinaryProvider, UploadService],
  controllers: [UploadController],
  exports: [CloudinaryProvider, UploadService],
})
export class UploadModule {}
