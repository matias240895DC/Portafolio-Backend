import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './entities/testimonial.schema';

@Injectable()
export class TestimonialsService {
  constructor(@InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>) {}

  async create(createTestimonialDto: any) {
    const testimonial = new this.testimonialModel({
      ...createTestimonialDto,
      approved: false,
    });
    return testimonial.save();
  }

  async findAll() {
    return this.testimonialModel.find().populate('projectId').exec();
  }

  async findApproved() {
    return this.testimonialModel.find({ approved: true }).populate('projectId').exec();
  }

  async findByProject(projectId: string) {
    return this.testimonialModel.find({ projectId, approved: true }).exec();
  }

  async update(id: string, updateTestimonialDto: any) {
    const updated = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { returnDocument: 'after' })
      .exec();
    if (!updated) throw new NotFoundException('Testimonial not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Testimonial not found');
    return deleted;
  }

  async addLike(id: string) {
    const testimonial = await this.testimonialModel.findById(id);
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    testimonial.likes += 1;
    return testimonial.save();
  }
}
