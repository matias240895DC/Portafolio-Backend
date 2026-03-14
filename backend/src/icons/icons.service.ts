import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Icon } from './entities/icon.schema';

@Injectable()
export class IconsService implements OnModuleInit {
  constructor(@InjectModel(Icon.name) private iconModel: Model<Icon>) {}

  async onModuleInit() {
    await this.seedIcons();
  }

  private async seedIcons() {
    const devIconBase = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
    const defaultIcons = [
      { name: 'Angular', url: `${devIconBase}angularjs/angularjs-original.svg`, category: 'tech' },
      { name: 'NestJS', url: `https://cdn.svgporn.com/logos/nestjs.svg`, category: 'tech' },
      { name: 'Node.js', url: `${devIconBase}nodejs/nodejs-original.svg`, category: 'tech' },
      { name: 'React', url: `${devIconBase}react/react-original.svg`, category: 'tech' },
      { name: 'TypeScript', url: `${devIconBase}typescript/typescript-original.svg`, category: 'tech' },
      { name: 'JavaScript', url: `${devIconBase}javascript/javascript-original.svg`, category: 'tech' },
      { name: 'MongoDB', url: `${devIconBase}mongodb/mongodb-original.svg`, category: 'tech' },
      { name: 'PostgreSQL', url: `${devIconBase}postgresql/postgresql-original.svg`, category: 'tech' },
      { name: 'MySQL', url: `${devIconBase}mysql/mysql-original.svg`, category: 'tech' },
      { name: 'Docker', url: `${devIconBase}docker/docker-original.svg`, category: 'tech' },
      { name: 'AWS', url: `${devIconBase}amazonwebservices/amazonwebservices-original-wordmark.svg`, category: 'tech' },
      { name: 'Git', url: `${devIconBase}git/git-original.svg`, category: 'tech' },
      { name: 'Python', url: `${devIconBase}python/python-original.svg`, category: 'tech' },
      { name: 'Java', url: `${devIconBase}java/java-original.svg`, category: 'tech' },
      { name: 'Spring', url: `${devIconBase}spring/spring-original.svg`, category: 'tech' },
      
      // Soft Skills / Habilidades
      { name: 'Liderazgo', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png', category: 'habilidad' },
      { name: 'Trabajo en Equipo', url: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png', category: 'habilidad' },
      { name: 'Comunicación', url: 'https://cdn-icons-png.flaticon.com/512/2343/2343694.png', category: 'habilidad' },
      { name: 'Resolución de Problemas', url: 'https://cdn-icons-png.flaticon.com/512/9525/9525147.png', category: 'habilidad' },
      { name: 'Empatía', url: 'https://cdn-icons-png.flaticon.com/512/3429/3429380.png', category: 'habilidad' },
      { name: 'Gestión del Tiempo', url: 'https://cdn-icons-png.flaticon.com/512/2950/2950137.png', category: 'habilidad' },
      { name: 'Creatividad', url: 'https://cdn-icons-png.flaticon.com/512/3132/3132030.png', category: 'habilidad' },
      { name: 'Adaptabilidad', url: 'https://cdn-icons-png.flaticon.com/512/10041/10041432.png', category: 'habilidad' },
      
      // DevOps & Infraestructura
      { name: 'Docker', url: `https://cdn.svgporn.com/logos/docker-icon.svg`, category: 'tech' },
      { name: 'GitHub Actions', url: `https://cdn.svgporn.com/logos/github-actions.svg`, category: 'tech' },
      { name: 'Linux', url: `https://cdn.svgporn.com/logos/tux.svg`, category: 'tech' },
      { name: 'MongoDB Atlas', url: `https://cdn.svgporn.com/logos/mongodb-icon.svg`, category: 'tech' },
      { name: 'Render', url: `https://cdn.svgporn.com/logos/render.svg`, category: 'tech' },
      { name: 'Nginx', url: `https://cdn.svgporn.com/logos/nginx.svg`, category: 'tech' },
      { name: 'Redis', url: `https://cdn.svgporn.com/logos/redis.svg`, category: 'tech' },
      { name: 'Jest', url: `https://cdn.svgporn.com/logos/jest.svg`, category: 'tech' },
      { name: 'Cloudinary', url: `https://cdn.svgporn.com/logos/cloudinary-icon.svg`, category: 'tech' },
    ];

    for (const icon of defaultIcons) {
      const exists = await this.iconModel.findOne({ name: icon.name });
      if (!exists) {
        await new this.iconModel(icon).save();
      } else if (exists.url !== icon.url) {
        // Update URL if it changed in the seed data
        await this.iconModel.findByIdAndUpdate(exists._id, { url: icon.url });
      }
    }
  }

  async findAll() {
    return this.iconModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string) {
    return this.iconModel.findById(id).exec();
  }

  async create(data: any) {
    return new this.iconModel(data).save();
  }

  async update(id: string, data: any) {
    return this.iconModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.iconModel.findByIdAndDelete(id).exec();
  }
}
