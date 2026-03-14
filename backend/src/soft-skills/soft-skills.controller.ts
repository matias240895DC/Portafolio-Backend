import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SoftSkillsService } from './soft-skills.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('soft-skills')
@Controller('soft-skills')
export class SoftSkillsController {
  constructor(private readonly softSkillsService: SoftSkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new soft skill' })
  create(@Body() createSoftSkillDto: any) {
    return this.softSkillsService.create(createSoftSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all soft skills' })
  findAll() {
    return this.softSkillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a soft skill by ID' })
  findOne(@Param('id') id: string) {
    return this.softSkillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a soft skill' })
  update(@Param('id') id: string, @Body() updateSoftSkillDto: any) {
    return this.softSkillsService.update(id, updateSoftSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a soft skill' })
  remove(@Param('id') id: string) {
    return this.softSkillsService.remove(id);
  }
}
