import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SoftSkillsService } from './soft-skills.service';
import { SoftSkillsController } from './soft-skills.controller';
import { SoftSkill, SoftSkillSchema } from './entities/soft-skill.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SoftSkill.name, schema: SoftSkillSchema }])],
  controllers: [SoftSkillsController],
  providers: [SoftSkillsService],
  exports: [SoftSkillsService],
})
export class SoftSkillsModule {}
