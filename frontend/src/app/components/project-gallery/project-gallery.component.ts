import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ProjectListComponent } from '../project-list/project-list.component';

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectListComponent],
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.css']
})
export class ProjectGalleryComponent implements OnInit {
  projects: any[] = [];
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProjects().subscribe({
      next: (p) => {
        this.projects = p.filter(proj => proj.active);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
