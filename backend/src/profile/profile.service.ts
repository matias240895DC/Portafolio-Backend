import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './entities/profile.schema';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async findProfile() {
    try {
      const profile = await this.profileModel.findOne().exec();
      return profile;
    } catch (error) {
      throw error; // Re-throw to see the 500 in logs and understand cause
    }
  }

  async update(updateProfileDto: any) {
    try {
      let profile = await this.profileModel.findOne().exec();
      if (!profile) {
        profile = new this.profileModel({
          about: '',
          experience: [],
          education: [],
          languages: [],
          yearsOfExperience: 0,
          socialLinks: {
            linkedin: '',
            phone: '',
            email: '',
            cvUrl: ''
          }
        });
      }
      
      profile.set(updateProfileDto);
      const saved = await profile.save();
      return saved;
    } catch (error) {
      throw error;
    }
  }

  async uploadCv(buffer: Buffer) {
    let profile = await this.profileModel.findOne().exec();
    if (!profile) {
      profile = new this.profileModel({ socialLinks: {} });
    }
    profile.cvFile = buffer;
    await profile.save();
    return { url: '/api/profile/cv' };
  }

  async downloadCv() {
    const profile = await this.profileModel.findOne().select('+cvFile').exec();
    if (!profile || !profile.cvFile) {
      throw new NotFoundException('CV not found');
    }
    return profile.cvFile;
  }
}
