import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project, ProjectSchema } from './entities/project.schema';
import { Comment, CommentSchema } from './entities/comment.schema';

import { TestRunnerService } from './test-runner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Comment.name, schema: CommentSchema }
    ])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, TestRunnerService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
