import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TestRunnerModalComponent } from '../test-runner-modal/test-runner-modal.component';
import { ConfigService, SiteConfig } from '../../services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TestRunnerModalComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {
  @Input() projects: any[] = [];
  activeProjectComments: string | null = null;
  comments: any[] = [];
  newComment = { name: '', content: '' };

  // New states for High-End features
  showTestRunner = false;
  showArchitecture = false;
  selectedProject: any = null;
  expandedSectionPerProject: { [key: string]: string | null } = {};
  
  // New: Simple Active Category instead of multiple accordions for space
  activeCategoryPerProject: { [key: string]: 'analysis' | 'stack' | 'links' | 'actions' } = {};
  
  config: SiteConfig | null = null;
  private sub: Subscription | null = null;

  // Pagination for Console
  currentPage = 1;
  pageSize = 3;

  get totalPages() {
    return Math.ceil(this.projects.length / this.pageSize);
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.projects.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  constructor(private dataService: DataService, private configService: ConfigService) {}

  ngOnInit() {
    this.sub = this.configService.config$.subscribe(c => this.config = c);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  setActiveCategory(projectId: string, category: 'analysis' | 'stack' | 'links' | 'actions') {
    this.activeCategoryPerProject[projectId] = category;
  }

  getActiveCategory(projectId: string): string {
    const project = this.projects.find(p => p._id === projectId);
    if (!project) return 'analysis';

    if (this.activeCategoryPerProject[projectId]) {
      return this.activeCategoryPerProject[projectId]!;
    }

    // Default priority: Analysis > Stack > Links > Actions
    if (project.challenge || project.solution || project.impact) return 'analysis';
    if ((project.stacks && project.stacks.length > 0) || (project.languages && project.languages.length > 0)) return 'stack';
    if (project.deployUrl || project.githubUrl || project.swaggerUrl) return 'links';
    if (project.architectureUrl || (project.showTests && project.testSuite && project.testSuite.length > 0)) return 'actions';

    return 'analysis';
  }

  likeProject(project: any) {
    this.dataService.likeProject(project._id).subscribe(res => {
      project.likes = res.likes;
    });
  }

  toggleComments(projectId: string) {
    if (this.activeProjectComments === projectId) {
      this.activeProjectComments = null;
    } else {
      this.activeProjectComments = projectId;
      this.loadComments(projectId);
    }
  }

  loadComments(projectId: string) {
    this.dataService.getProjectComments(projectId).subscribe(res => {
      this.comments = res;
    });
  }

  addComment(projectId: string) {
    if (!this.newComment.name || !this.newComment.content) return;
    this.dataService.addProjectComment(projectId, this.newComment).subscribe(() => {
      this.newComment = { name: '', content: '' };
      this.loadComments(projectId);
    });
  }

  testTarget: 'backend' | 'frontend' = 'backend';

  runTests(project: any, target: 'backend' | 'frontend' = 'backend') {
    this.selectedProject = project;
    this.testTarget = target;
    this.showTestRunner = true;
  }

  viewArchitecture(project: any) {
    this.selectedProject = project;
    this.showArchitecture = true;
  }

  toggleSection(projectId: string, section: string) {
    if (this.expandedSectionPerProject[projectId] === section) {
      this.expandedSectionPerProject[projectId] = null;
    } else {
      this.expandedSectionPerProject[projectId] = section;
    }
  }

  isSectionActive(projectId: string, section: string): boolean {
    return this.expandedSectionPerProject[projectId] === section;
  }
}
