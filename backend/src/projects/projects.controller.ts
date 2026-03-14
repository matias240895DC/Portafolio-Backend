import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TestRunnerService } from './test-runner.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Observable } from 'rxjs';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly testRunnerService: TestRunnerService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: any) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('admin/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comments for admin' })
  findAllComments() {
    return this.projectsService.findAllComments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id, false);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  async update(@Param('id') id: string, @Body() updateProjectDto: any) {
    const project = await this.projectsService.update(id, updateProjectDto);
    // Return decrypted version for admin UI consistency after save
    return this.projectsService.findOne(id, true);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/like')
  @ApiOperation({ summary: 'Like a project' })
  like(@Param('id') id: string) {
    return this.projectsService.like(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a project' })
  addComment(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.addComment(id, body);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a project' })
  getComments(@Param('id') id: string) {
    return this.projectsService.getComments(id);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  removeComment(@Param('commentId') commentId: string) {
    return this.projectsService.removeComment(commentId);
  }

  @Sse(':id/test-stream')
  @ApiOperation({ summary: 'Run live tests for a project via SSE' })
  async testStream(@Param('id') id: string, @Query('target') target?: 'backend' | 'frontend'): Promise<Observable<MessageEvent>> {
    const project = await this.projectsService.findOne(id, true); // Admin fetch for secrets
    const repoUrl = project ? project.githubUrl : undefined;
    const envVars = project ? project.envVariables : undefined;
    
    return this.testRunnerService.runTests([], target || 'backend', repoUrl, envVars);
  }
}
