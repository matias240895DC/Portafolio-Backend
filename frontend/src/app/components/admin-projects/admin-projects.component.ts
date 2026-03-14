import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent],
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.css']
})
export class AdminProjectsComponent implements OnInit {
  projects: any[] = [];
  showForm = false;
  selectedProject: any = null;

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dataService.getProjects().subscribe({
      next: (p) => {
        this.projects = p;
        this.showForm = false;
        this.selectedProject = null;
      },
      error: () => this.toast.error('Error al cargar proyectos')
    });
  }

  openForm(project: any = null) {
    this.selectedProject = project;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedProject = null;
  }

  toggleActive(project: any) {
    this.dataService.updateProject(project._id, { active: !project.active }).subscribe({
      next: () => {
        this.toast.success(`Proyecto ${project.active ? 'desactivado' : 'activado'}`);
        this.refresh();
      },
      error: () => this.toast.error('Error al cambiar estado')
    });
  }

  deleteProject(id: string) {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      this.dataService.deleteProject(id).subscribe({
        next: () => {
          this.toast.success('Proyecto eliminado');
          this.refresh();
        },
        error: () => this.toast.error('Error al eliminar proyecto')
      });
    }
  }
}
