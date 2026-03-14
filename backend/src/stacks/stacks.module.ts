import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StacksService } from './stacks.service';
import { StacksController } from './stacks.controller';
import { Stack, StackSchema } from './entities/stack.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Stack.name, schema: StackSchema }])],
  controllers: [StacksController],
  providers: [StacksService],
  exports: [StacksService],
})
export class StacksModule {}
