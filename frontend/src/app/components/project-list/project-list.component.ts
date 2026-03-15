import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TestRunnerModalComponent } from '../test-runner-modal/test-runner-modal.component';

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

  constructor(private dataService: DataService) {}

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
