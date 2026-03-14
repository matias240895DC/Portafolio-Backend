import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrls: ['./admin-testimonials.component.css']
})
export class AdminTestimonialsComponent implements OnInit {
  testimonials: any[] = [];

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.dataService.adminGetTestimonials().subscribe({
      next: (t) => this.testimonials = t,
      error: () => this.toast.error('Error al cargar testimonios')
    });
  }

  approve(id: string) {
    this.dataService.approveTestimonial(id).subscribe({
      next: () => {
        this.toast.success('Testimonio aprobado');
        this.loadTestimonials();
      },
      error: () => this.toast.error('Error al aprobar testimonio')
    });
  }

  delete(id: string) {
    if (confirm('¿Eliminar este testimonio?')) {
      this.dataService.deleteTestimonial(id).subscribe({
        next: () => {
          this.toast.success('Testimonio eliminado');
          this.loadTestimonials();
        },
        error: () => this.toast.error('Error al eliminar testimonio')
      });
    }
  }

  getStars(rating: number): string {
    return '⭐'.repeat(rating || 5);
  }
}
