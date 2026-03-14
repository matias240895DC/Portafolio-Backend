import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.css']
})
export class AdminCommentsComponent implements OnInit {
  comments: any[] = [];

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dataService.getAdminComments().subscribe({
      next: (c) => this.comments = c,
      error: () => this.toast.error('Error al cargar comentarios')
    });
  }

  deleteComment(id: string) {
    if (confirm('¿Eliminar este comentario?')) {
      this.dataService.deleteProjectComment(id).subscribe({
        next: () => {
          this.toast.success('Comentario eliminado');
          this.refresh();
        },
        error: () => this.toast.error('Error al eliminar')
      });
    }
  }
}
