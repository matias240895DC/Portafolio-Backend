import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new testimonial/comment' })
  create(@Body() createTestimonialDto: any) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved testimonials' })
  findApproved(@Query('projectId') projectId?: string) {
    if (projectId) return this.testimonialsService.findByProject(projectId);
    return this.testimonialsService.findApproved();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ALL testimonials (for admin)' })
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update/Approve a testimonial' })
  update(@Param('id') id: string, @Body() updateTestimonialDto: any) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a testimonial' })
  addLike(@Param('id') id: string) {
    return this.testimonialsService.addLike(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a testimonial' })
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
