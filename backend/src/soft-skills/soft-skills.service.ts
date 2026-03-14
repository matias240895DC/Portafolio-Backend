import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoftSkill } from './entities/soft-skill.schema';

@Injectable()
export class SoftSkillsService {
  constructor(@InjectModel(SoftSkill.name) private softSkillModel: Model<SoftSkill>) {}

  async create(createSoftSkillDto: any) {
    if (createSoftSkillDto.name) {
      const nameTrimmed = createSoftSkillDto.name.trim();
      const existing = await this.softSkillModel.findOne({ 
        name: { $regex: new RegExp(`^${nameTrimmed}$`, 'i') } 
      }).exec();
      if (existing) {
        throw new ConflictException(`La habilidad "${createSoftSkillDto.name}" ya se encuentra registrada`);
      }
    }
    const createdSoftSkill = new this.softSkillModel(createSoftSkillDto);
    return createdSoftSkill.save();
  }

  async findAll() {
    return this.softSkillModel.find().populate('iconLibrary').exec();
  }

  async findOne(id: string) {
    const softSkill = await this.softSkillModel.findById(id).populate('iconLibrary').exec();
    if (!softSkill) throw new NotFoundException(`Soft skill with ID ${id} not found`);
    return softSkill;
  }

  async update(id: string, updateSoftSkillDto: any) {
    if (updateSoftSkillDto.name) {
      const nameTrimmed = updateSoftSkillDto.name.trim();
      const existing = await this.softSkillModel.findOne({ 
        name: { $regex: new RegExp(`^${nameTrimmed}$`, 'i') },
        _id: { $ne: id }
      }).exec();
      if (existing) {
        throw new ConflictException(`El nombre de la habilidad "${updateSoftSkillDto.name}" ya se encuentra registrado`);
      }
    }

    const updatedSoftSkill = await this.softSkillModel
      .findByIdAndUpdate(id, updateSoftSkillDto, { returnDocument: 'after' })
      .populate('iconLibrary')
      .exec();
    if (!updatedSoftSkill) throw new NotFoundException(`Soft skill with ID ${id} not found`);
    return updatedSoftSkill;
  }

  async remove(id: string) {
    const deletedSoftSkill = await this.softSkillModel.findByIdAndDelete(id).exec();
    if (!deletedSoftSkill) throw new NotFoundException(`Soft skill with ID ${id} not found`);
    return deletedSoftSkill;
  }
}
