import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-stacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-stacks.component.html',
  styleUrls: ['./admin-stacks.component.css']
})
export class AdminStacksComponent implements OnInit {
  stacks: any[] = [];
  libraryIcons: any[] = [];
  showAddForm = false;
  showIconPicker = false;
  
  newStack = {
    name: '',
    icon: '',
    iconLibrary: null as string | null,
    color: '#6366f1',
    status: true
  };
  editingId: string | null = null;
  iconSearch = '';
  currentPage = 1;
  pageSize = 5;

  get totalPages() {
    return Math.ceil(this.stacks.length / this.pageSize);
  }

  get paginatedStacks() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.stacks.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadStacks();
    this.loadLibraryIcons();
  }

  filteredIcons() {
    if (!this.iconSearch) return this.libraryIcons;
    return this.libraryIcons.filter(i => i.name.toLowerCase().includes(this.iconSearch.toLowerCase()));
  }

  getSelectedIconName() {
    const icon = this.libraryIcons.find(i => i._id === this.newStack.iconLibrary);
    return icon ? icon.name : '';
  }

  loadStacks() {
    this.dataService.getStacks().subscribe({
      next: (s) => this.stacks = s,
      error: () => this.toast.error('Error al cargar tecnologías')
    });
  }

  loadLibraryIcons() {
    this.dataService.getIcons().subscribe(res => this.libraryIcons = res);
  }

  onIconSelected(icon: any) {
    this.newStack.iconLibrary = icon._id;
    this.newStack.icon = icon.url;
    this.showIconPicker = false;
    this.toast.success(`Icono ${icon.name} seleccionado`);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.toast.info('Subiendo icono...');
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.newStack.icon = res.url;
          this.newStack.iconLibrary = null;
          this.toast.success('Icono subido');
        },
        error: () => this.toast.error('Error al subir icono')
      });
    }
  }

  addStack() {
    this.editingId = null;
    this.newStack = { name: '', icon: '', iconLibrary: null, color: '#6366f1', status: true };
    this.showAddForm = true;
  }

  editStack(stack: any) {
    this.editingId = stack._id;
    this.newStack = { 
      ...stack,
      iconLibrary: stack.iconLibrary?._id || stack.iconLibrary || null 
    };
    this.showAddForm = true;
  }

  saveStack() {
    if (!this.newStack.name) {
      this.toast.error('El nombre es obligatorio');
      return;
    }

    const obs = this.editingId 
      ? this.dataService.updateStack(this.editingId, this.newStack)
      : this.dataService.createStack(this.newStack);
      
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingId ? 'Tecnología actualizada' : 'Tecnología agregada');
        this.showAddForm = false;
        this.loadStacks();
      },
      error: (error: any) => {
        const message = error.error?.message || 'Error al procesar tecnología';
        this.toast.error(message);
      }
    });
  }

  toggleStack(stack: any) {
    this.dataService.updateStack(stack._id, { status: !stack.status }).subscribe({
      next: () => {
        this.toast.success('Estado actualizado');
        this.loadStacks();
      },
      error: () => this.toast.error('Error al actualizar estado')
    });
  }

  deleteStack(id: string) {
    if (confirm('¿Eliminar esta tecnología?')) {
      this.dataService.deleteStack(id).subscribe({
        next: () => {
          this.toast.success('Tecnología eliminada');
          this.loadStacks();
        },
        error: () => this.toast.error('Error al eliminar tecnología')
      });
    }
  }
}
