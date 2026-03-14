import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-form.component.html',

  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  @Input() project: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  projectForm!: FormGroup;
  activeTab: 'general' | 'case-study' | 'tech-stack' | 'cicd' = 'general';
  availableStacks: any[] = [];
  selectedStackIds: string[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private toast: ToastService) {}

  ngOnInit() {
    this.loadStacks();
    this.initForm();
  }

  loadStacks() {
    this.dataService.getStacks().subscribe({
      next: (stacks) => {
        this.availableStacks = stacks;
      },
      error: (err) => {
        console.error('Error loading stacks', err);
      }
    });
  }

  initForm() {
    this.selectedStackIds = this.project?.stacks?.map((s: any) => s._id) || [];
    
    this.projectForm = this.fb.group({
      name: [this.project?.name || '', Validators.required],
      description: [this.project?.description || '', Validators.required],
      imageUrl: [this.project?.imageUrl || ''],
      deployUrl: [this.project?.deployUrl || '', Validators.required],
      ranking: [this.project?.ranking || 5, [Validators.required, Validators.min(1), Validators.max(5)]],
      githubUrl: [this.project?.githubUrl || '', Validators.required],
      swaggerUrl: [this.project?.swaggerUrl || '', Validators.required],
      active: [this.project?.active ?? true],
      challenge: [this.project?.challenge || ''],
      solution: [this.project?.solution || ''],
      impact: [this.project?.impact || ''],
      architectureUrl: [this.project?.architectureUrl || ''],
      languagesRaw: [this.project?.languages?.join(', ') || ''],
      envVariables: [this.project?.envVariables || '']
    });
  }

  toggleStack(stackId: string) {
    const index = this.selectedStackIds.indexOf(stackId);
    if (index > -1) {
      this.selectedStackIds.splice(index, 1);
    } else {
      this.selectedStackIds.push(stackId);
    }
  }

  isStackSelected(stackId: string): boolean {
    return this.selectedStackIds.includes(stackId);
  }

  addStackById(stackId: string) {
    if (!stackId) return;
    if (!this.selectedStackIds.includes(stackId)) {
      this.selectedStackIds.push(stackId);
    }
  }


  getStackName(stackId: string): string {
    const stack = this.availableStacks.find(s => s._id === stackId);
    return stack ? stack.name : 'Cargando...';
  }

  onFileSelected(event: any) {


    const file: File = event.target.files[0];
    if (file) {
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          this.projectForm.patchValue({ imageUrl: res.url });
          this.toast.success('Imagen subida correctamente');
        },
        error: (err) => {
          this.toast.error('Error al subir la imagen');
        }
      });
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.toast.warning('Todos los campos son obligatorios (excepto la imagen)');
      return;
    }

    const data = { ...this.projectForm.value };
    
    // Convert comma-separated languages to array
    if (data.languagesRaw) {
      data.languages = data.languagesRaw.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
    } else {
      data.languages = [];
    }
    delete data.languagesRaw;

    // Add selected stacks
    data.stacks = this.selectedStackIds;

    const request = this.project 
      ? this.dataService.updateProject(this.project._id, data)
      : this.dataService.createProject(data);

    request.subscribe({
      next: () => {
        this.toast.success(this.project ? 'Proyecto actualizado' : 'Proyecto creado');
        this.save.emit();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al guardar el proyecto';
        this.toast.error(msg);
      }
    });
  }

  setTab(tab: 'general' | 'case-study' | 'tech-stack' | 'cicd') {
    this.activeTab = tab;
  }


  onClose() {
    this.close.emit();
  }
}
