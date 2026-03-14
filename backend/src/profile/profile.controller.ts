import { Controller, Get, Body, Patch, UseGuards, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the personal profile' })
  async findProfile() {
    const profile = await this.profileService.findProfile();
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the personal profile' })
  async update(@Body() updateProfileDto: any) {
    return await this.profileService.update(updateProfileDto);
  }
}
