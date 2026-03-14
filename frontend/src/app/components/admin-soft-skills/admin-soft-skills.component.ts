import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-soft-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-soft-skills.component.html',
  styleUrls: ['./admin-soft-skills.component.css']
})
export class AdminSoftSkillsComponent implements OnInit {
  skills: any[] = [];
  libraryIcons: any[] = [];
  showAddForm = false;
  showIconPicker = false;
  
  newSkill = {
    name: '',
    icon: '',
    iconLibrary: null as string | null,
    status: true,
    color: '#6366f1'
  };
  editingId: string | null = null;
  iconSearch = '';

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadSkills();
    this.loadLibraryIcons();
  }

  filteredIcons() {
    if (!this.iconSearch) return this.libraryIcons;
    return this.libraryIcons.filter(i => i.name.toLowerCase().includes(this.iconSearch.toLowerCase()));
  }

  getSelectedIconName() {
    const icon = this.libraryIcons.find(i => i._id === this.newSkill.iconLibrary);
    return icon ? icon.name : '';
  }

  loadSkills() {
    this.dataService.getSoftSkills().subscribe({
      next: (s) => this.skills = s,
      error: () => this.toast.error('Error al cargar habilidades')
    });
  }

  loadLibraryIcons() {
    this.dataService.getIcons().subscribe(res => this.libraryIcons = res);
  }

  onIconSelected(icon: any) {
    this.newSkill.iconLibrary = icon._id;
    this.newSkill.icon = icon.url;
    this.showIconPicker = false;
    this.toast.success(`Icono ${icon.name} seleccionado`);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo icono...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.newSkill.icon = res.url;
          this.newSkill.iconLibrary = null;
          this.toast.success('Icono subido');
        },
        error: () => this.toast.error('Error al subir icono')
      });
    }
  }

  addSkill() {
    this.editingId = null;
    this.newSkill = { name: '', icon: '', iconLibrary: null, status: true, color: '#6366f1' };
    this.showAddForm = true;
  }

  editSkill(skill: any) {
    this.editingId = skill._id;
    this.newSkill = { 
      ...skill,
      iconLibrary: skill.iconLibrary?._id || skill.iconLibrary || null
    };
    this.showAddForm = true;
  }

  saveSkill() {
    if (!this.newSkill.name) {
      this.toast.error('El nombre es obligatorio');
      return;
    }

    const obs = this.editingId 
      ? this.dataService.updateSoftSkill(this.editingId, this.newSkill)
      : this.dataService.createSoftSkill(this.newSkill);
      
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingId ? 'Habilidad actualizada' : 'Habilidad creada');
        this.showAddForm = false;
        this.loadSkills();
      },
      error: (error: any) => {
        const message = error.error?.message || 'Error al procesar habilidad';
        this.toast.error(message);
      }
    });
  }

  toggleSkill(skill: any) {
    this.dataService.updateSoftSkill(skill._id, { status: !skill.status }).subscribe({
      next: () => {
        this.toast.success('Estado actualizado');
        this.loadSkills();
      },
      error: () => this.toast.error('Error al actualizar estado')
    });
  }

  deleteSkill(id: string) {
    if (confirm('¿Eliminar esta skill?')) {
      this.dataService.deleteSoftSkill(id).subscribe({
        next: () => {
          this.toast.success('Habilidad eliminada');
          this.loadSkills();
        },
        error: () => this.toast.error('Error al eliminar habilidad')
      });
    }
  }
}
