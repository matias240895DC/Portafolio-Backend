import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StacksService } from './stacks.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('stacks')
@Controller('stacks')
export class StacksController {
  constructor(private readonly stacksService: StacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stack' })
  create(@Body() createStackDto: any) {
    return this.stacksService.create(createStackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stacks' })
  findAll() {
    return this.stacksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stack by ID' })
  findOne(@Param('id') id: string) {
    return this.stacksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stack' })
  update(@Param('id') id: string, @Body() updateStackDto: any) {
    return this.stacksService.update(id, updateStackDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a stack' })
  remove(@Param('id') id: string) {
    return this.stacksService.remove(id);
  }
}
