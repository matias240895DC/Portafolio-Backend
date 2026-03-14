import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stack } from './entities/stack.schema';

@Injectable()
export class StacksService {
  constructor(@InjectModel(Stack.name) private stackModel: Model<Stack>) {}

  async create(createStackDto: any) {
    if (createStackDto.name) {
      const nameTrimmed = createStackDto.name.trim();
      const existing = await this.stackModel.findOne({ 
        name: { $regex: new RegExp(`^${nameTrimmed}$`, 'i') } 
      }).exec();
      if (existing) {
        throw new ConflictException(`La tecnología "${createStackDto.name}" ya se encuentra registrada en el sistema`);
      }
    }
    const createdStack = new this.stackModel(createStackDto);
    return createdStack.save();
  }

  async findAll() {
    return this.stackModel.find().populate('iconLibrary').exec();
  }

  async findOne(id: string) {
    const stack = await this.stackModel.findById(id).populate('iconLibrary').exec();
    if (!stack) throw new NotFoundException(`Stack with ID ${id} not found`);
    return stack;
  }

  async update(id: string, updateStackDto: any) {
    if (updateStackDto.name) {
      const nameTrimmed = updateStackDto.name.trim();
      const existing = await this.stackModel.findOne({ 
        name: { $regex: new RegExp(`^${nameTrimmed}$`, 'i') },
        _id: { $ne: id }
      }).exec();
      if (existing) {
        throw new ConflictException(`El nombre de la tecnología "${updateStackDto.name}" ya se encuentra registrado`);
      }
    }

    const updatedStack = await this.stackModel
      .findByIdAndUpdate(id, updateStackDto, { returnDocument: 'after' })
      .populate('iconLibrary')
      .exec();
    if (!updatedStack) throw new NotFoundException(`Stack with ID ${id} not found`);
    return updatedStack;
  }

  async remove(id: string) {
    const deletedStack = await this.stackModel.findByIdAndDelete(id).exec();
    if (!deletedStack) throw new NotFoundException(`Stack with ID ${id} not found`);
    return deletedStack;
  }
}
