import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.schema';
import { Comment } from './entities/comment.schema';
import { encrypt, decrypt } from '../utils/encryption.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>
  ) {}

  private async checkUniqueness(data: any, id?: string) {
    const fields = ['name', 'githubUrl', 'swaggerUrl', 'deployUrl'];
    for (const field of fields) {
      if (data[field]) {
        const query: any = { [field]: data[field] };
        if (id) query._id = { $ne: id };
        
        const existing = await this.projectModel.findOne(query).exec();
        if (existing) {
          const fieldLabels: any = {
            name: 'nombre',
            githubUrl: 'URL de GitHub',
            swaggerUrl: 'URL de Swagger',
            deployUrl: 'URL de Deploy'
          };
          throw new ConflictException(`El ${fieldLabels[field]} "${data[field]}" ya se encuentra registrado`);
        }
      }
    }
  }

  async create(createProjectDto: any) {
    if (createProjectDto.envVariables) {
      createProjectDto.envVariables = encrypt(createProjectDto.envVariables);
    }
    await this.checkUniqueness(createProjectDto);
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll() {
    // Public findAll should NOT return envVariables
    return this.projectModel.find().select('-envVariables').populate('stacks').exec();
  }

  async findOne(id: string, isForAdmin: boolean = false) {
    const project = await this.projectModel.findById(id).populate('stacks').exec();
    if (!project) throw new NotFoundException(`Project with ID ${id} not found`);
    
    // Convert to plain object to modify
    const projectObj = project.toObject();
    
    if (isForAdmin && projectObj.envVariables) {
      projectObj.envVariables = decrypt(projectObj.envVariables);
    } else if (!isForAdmin) {
      delete projectObj.envVariables; // Never leak secret to public
    }
    
    return projectObj;
  }

  async update(id: string, updateProjectDto: any) {
    if (updateProjectDto.envVariables) {
      updateProjectDto.envVariables = encrypt(updateProjectDto.envVariables);
    }
    await this.checkUniqueness(updateProjectDto, id);
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { returnDocument: 'after' })
      .populate('stacks')
      .exec();
    if (!updatedProject) throw new NotFoundException(`Project with ID ${id} not found`);
    return updatedProject;
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) throw new NotFoundException(`Project with ID ${id} not found`);
    // Also delete comments for this project
    await this.commentModel.deleteMany({ projectId: id }).exec();
    return deletedProject;
  }

  async like(id: string) {
    return this.projectModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).exec();
  }

  async addComment(projectId: string, data: any) {
    const comment = new this.commentModel({ ...data, projectId });
    return comment.save();
  }

  async getComments(projectId: string) {
    return this.commentModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async removeComment(commentId: string) {
    return this.commentModel.findByIdAndDelete(commentId).exec();
  }

  async findAllComments() {
    return this.commentModel.find().populate('projectId', 'name').sort({ createdAt: -1 }).exec();
  }
}
