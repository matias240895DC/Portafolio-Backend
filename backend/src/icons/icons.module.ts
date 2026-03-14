import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IconsService } from './icons.service';
import { IconsController } from './icons.controller';
import { Icon, IconSchema } from './entities/icon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Icon.name, schema: IconSchema }])
  ],
  controllers: [IconsController],
  providers: [IconsService],
  exports: [IconsService]
})
export class IconsModule {}
