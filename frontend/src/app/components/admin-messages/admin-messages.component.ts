import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {
  messages: any[] = [];

  constructor(
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.dataService.getMessages().subscribe({
      next: (m) => this.messages = m,
      error: () => this.toast.error('Error al cargar mensajes')
    });
  }

  markRead(id: string) {
    this.dataService.markMessageRead(id).subscribe({
      next: () => this.loadMessages(),
      error: () => this.toast.error('Error al actualizar mensaje')
    });
  }

  delete(id: string) {
    if (confirm('¿Eliminar este mensaje?')) {
      this.dataService.deleteMessage(id).subscribe({
        next: () => {
          this.toast.success('Mensaje eliminado');
          this.loadMessages();
        },
        error: () => this.toast.error('Error al eliminar mensaje')
      });
    }
  }
}
