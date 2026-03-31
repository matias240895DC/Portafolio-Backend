import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { ProjectListComponent } from '../project-list/project-list.component';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProjectListComponent, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  profile: any;
  projects: any[] = [];
  testimonials: any[] = [];
  softSkills: any[] = [];
  stacks: any[] = [];
  activeTab: string = 'SYSTEM';
  showMobileTabs: boolean = false;

  // Stacks Pagination
  currentPageStacks = 1;
  pageSizeStacks = 10;
  get totalPagesStacks() { return Math.ceil(this.stacks.length / this.pageSizeStacks); }
  get paginatedStacks() {
    const start = (this.currentPageStacks - 1) * this.pageSizeStacks;
    return this.stacks.slice(start, start + this.pageSizeStacks);
  }

  // Soft Skills Pagination (Console)
  currentPageSoftSkills = 1;
  pageSizeSoftSkills = 10;
  get totalPagesSoftSkills() { return Math.ceil(this.softSkills.length / this.pageSizeSoftSkills); }
  get paginatedSoftSkills() {
    const start = (this.currentPageSoftSkills - 1) * this.pageSizeSoftSkills;
    return this.softSkills.slice(start, start + this.pageSizeSoftSkills);
  }

  // Testimonials Pagination
  currentPageTestimonials = 1;
  pageSizeTestimonials = 4;
  get totalPagesTestimonials() { return Math.ceil(this.testimonials.length / this.pageSizeTestimonials); }
  get paginatedTestimonials() {
    const start = (this.currentPageTestimonials - 1) * this.pageSizeTestimonials;
    return this.testimonials.slice(start, start + this.pageSizeTestimonials);
  }

  constructor(private dataService: DataService, public configService: ConfigService) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.showMobileTabs = false;
  }

  toggleMobileTabs() {
    this.showMobileTabs = !this.showMobileTabs;
  }


  ngOnInit() {
    this.dataService.getProfile().subscribe(p => this.profile = p);
    this.dataService.getProjects().subscribe(p => this.projects = p.filter(proj => proj.active));
    this.dataService.getTestimonials().subscribe(t => this.testimonials = t);
    this.dataService.getSoftSkills().subscribe(s => this.softSkills = s.filter(x => x.status));
    this.dataService.getStacks().subscribe(s => this.stacks = s.filter(x => x.status));
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  getStars(rating: number): string {
    return '⭐'.repeat(rating || 5);
  }

  toggleFeedbackModal() {
    // No longer needed, logic moved to feedback component
  }

  getSkillColor(skill: any): string {
    if (skill.color) return skill.color;
    
    const nameLower = skill.name.toLowerCase();
    if (nameLower.includes('angular')) return '#dd0031';
    if (nameLower.includes('nest')) return '#e0234e';
    if (nameLower.includes('node')) return '#68a063';
    if (nameLower.includes('react')) return '#61dafb';
    if (nameLower.includes('typescript')) return '#3178c6';
    if (nameLower.includes('javascript')) return '#f7df1e';
    if (nameLower.includes('mongo')) return '#47a248';
    if (nameLower.includes('sql') || nameLower.includes('postgres')) return '#336791';
    if (nameLower.includes('docker')) return '#2496ed';
    if (nameLower.includes('aws')) return '#ff9900';
    if (nameLower.includes('liderazgo')) return '#fbbf24';
    if (nameLower.includes('proactivo') || nameLower.includes('impulso')) return '#3b82f6';
    if (nameLower.includes('comunicación')) return '#10b981';
    return '#6366f1'; // Default primary
  }

  getStackIcon(skill: any): string {
    if (skill.iconLibrary?.url) return skill.iconLibrary.url;
    if (skill.icon) return skill.icon;
    
    const nameLower = skill.name.toLowerCase();
    const devIconBase = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
    
    if (nameLower.includes('angular')) return `${devIconBase}angularjs/angularjs-original.svg`;
    if (nameLower.includes('nest')) return `https://cdn.svgporn.com/logos/nestjs.svg`;
    if (nameLower.includes('node')) return `${devIconBase}nodejs/nodejs-original.svg`;
    if (nameLower.includes('react')) return `${devIconBase}react/react-original.svg`;
    if (nameLower.includes('typescript')) return `${devIconBase}typescript/typescript-original.svg`;
    if (nameLower.includes('javascript')) return `${devIconBase}javascript/javascript-original.svg`;
    if (nameLower.includes('mongo')) return `${devIconBase}mongodb/mongodb-original.svg`;
    if (nameLower.includes('postgres')) return `${devIconBase}postgresql/postgresql-original.svg`;
    if (nameLower.includes('mysql')) return `${devIconBase}mysql/mysql-original.svg`;
    if (nameLower.includes('docker')) return `${devIconBase}docker/docker-original.svg`;
    if (nameLower.includes('aws')) return `${devIconBase}amazonwebservices/amazonwebservices-original-wordmark.svg`;
    if (nameLower.includes('git')) return `${devIconBase}git/git-original.svg`;
    
    return ''; // No fallback
  }

  get orbitImageUrl(): string {
    if (!this.profile) return '';

    const lightUrl = this.profile.orbitImageLightUrl || '';
    const darkUrl = this.profile.orbitImageDarkUrl || '';
    const isLightMode = this.configService.themeMode === 'light';

    if (isLightMode) {
      return lightUrl || darkUrl;
    }

    return darkUrl || lightUrl;
  }
}
