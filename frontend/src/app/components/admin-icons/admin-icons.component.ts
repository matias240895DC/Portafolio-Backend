import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-icons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-icons.component.html',
  styleUrls: ['./admin-icons.component.css']
})
export class AdminIconsComponent implements OnInit {
  icons: any[] = [];
  showAddForm = false;
  editingId: string | null = null;
  newIcon = {
    name: '',
    url: '',
    category: 'tech'
  };

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadIcons();
  }

  loadIcons() {
    this.dataService.getIcons().subscribe({
      next: (res) => this.icons = res,
      error: () => this.toast.error('Error al cargar la librería de iconos')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo icono...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.newIcon.url = res.url;
          this.toast.success('Icono subido con éxito');
        },
        error: () => this.toast.error('Error al cargar la imagen')
      });
    }
  }

  addIcon() {
    this.editingId = null;
    this.newIcon = { name: '', url: '', category: 'tech' };
    this.showAddForm = true;
  }

  editIcon(icon: any) {
    this.editingId = icon._id;
    this.newIcon = { ...icon };
    this.showAddForm = true;
  }

  saveIcon() {
    if (!this.newIcon.name || !this.newIcon.url) {
      this.toast.error('Nombre y URL son obligatorios');
      return;
    }

    if (this.editingId) {
      this.dataService.updateIcon(this.editingId, this.newIcon).subscribe({
        next: () => {
          this.toast.success('Icono actualizado');
          this.showAddForm = false;
          this.loadIcons();
        },
        error: () => this.toast.error('Error al actualizar icono')
      });
    } else {
      this.dataService.createIcon(this.newIcon).subscribe({
        next: () => {
          this.toast.success('Icono guardado en la librería');
          this.showAddForm = false;
          this.loadIcons();
        },
        error: () => this.toast.error('Error al guardar icono')
      });
    }
  }

  deleteIcon(id: string) {
    if (confirm('¿Eliminar este icono de la librería?')) {
      this.dataService.deleteIcon(id).subscribe({
        next: () => {
          this.toast.success('Icono eliminado');
          this.loadIcons();
        },
        error: () => this.toast.error('Error al eliminar icono')
      });
    }
  }
}
