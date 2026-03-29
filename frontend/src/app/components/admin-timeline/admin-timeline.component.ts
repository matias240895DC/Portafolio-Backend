import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-timeline.component.html',
  styleUrls: ['./admin-timeline.component.css']
})
export class AdminTimelineComponent implements OnInit {
  profile: any = {};
  
  // Modals state
  showExpModal = false;
  showEduModal = false;
  
  // Selected items for editing/adding
  currentExp: any = { title: '', company: '', period: '', description: '' };
  currentEdu: any = { degree: '', institution: '', year: '' };
  
  // To track if we are adding or editing
  editingExpIndex: number = -1;
  editingEduIndex: number = -1;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.dataService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile || {};
        if (!this.profile.experience) this.profile.experience = [];
        if (!this.profile.education) this.profile.education = [];
      },
      error: (err) => console.error('Error cargando perfil:', err)
    });
  }

  // --- EXPERIENCE CRUD --- //
  openAddExpModal() {
    this.currentExp = { title: '', company: '', period: '', description: '' };
    this.editingExpIndex = -1;
    this.showExpModal = true;
  }

  openEditExpModal(exp: any, index: number) {
    this.currentExp = { ...exp }; // Clone
    this.editingExpIndex = index;
    this.showExpModal = true;
  }

  saveExperience() {
    if (this.editingExpIndex >= 0) {
      this.profile.experience[this.editingExpIndex] = this.currentExp;
    } else {
      this.profile.experience.push(this.currentExp);
    }
    this.saveProfileToDb('Experiencia guardada exitosamente');
    this.showExpModal = false;
  }

  deleteExperience(index: number) {
    if (confirm('¿Estás seguro de eliminar esta experiencia?')) {
      this.profile.experience.splice(index, 1);
      this.saveProfileToDb('Experiencia eliminada');
    }
  }

  // --- EDUCATION CRUD --- //
  openAddEduModal() {
    this.currentEdu = { degree: '', institution: '', year: '' };
    this.editingEduIndex = -1;
    this.showEduModal = true;
  }

  openEditEduModal(edu: any, index: number) {
    this.currentEdu = { ...edu }; // Clone
    this.editingEduIndex = index;
    this.showEduModal = true;
  }

  saveEducation() {
    if (this.editingEduIndex >= 0) {
      this.profile.education[this.editingEduIndex] = this.currentEdu;
    } else {
      this.profile.education.push(this.currentEdu);
    }
    this.saveProfileToDb('Formación guardada exitosamente');
    this.showEduModal = false;
  }

  deleteEducation(index: number) {
    if (confirm('¿Estás seguro de eliminar esta formación?')) {
      this.profile.education.splice(index, 1);
      this.saveProfileToDb('Formación eliminada');
    }
  }

  saveProfileToDb(successMessage: string) {
    this.dataService.updateProfile(this.profile).subscribe({
      next: (res) => {
        alert(successMessage);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar los cambios');
      }
    });
  }
}
