import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Configuration } from './entities/config.schema';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
    @InjectModel(Configuration.name) private configModel: Model<Configuration>,
  ) {}

  async onModuleInit() {
    const count = await this.configModel.countDocuments().exec();
    if (count === 0) {
      const defaultConfig = new this.configModel({});
      await defaultConfig.save();
    }
  }

  async getConfig() {
    return this.configModel.findOne().exec();
  }

  async updateConfig(updateConfigDto: any) {
    return this.configModel.findOneAndUpdate({}, updateConfigDto, { new: true }).exec();
  }
}
