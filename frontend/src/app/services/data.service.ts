import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Profile
  getProfile() { return this.http.get<any>(`${this.apiUrl}/profile`); }
  updateProfile(data: any) { return this.http.patch<any>(`${this.apiUrl}/profile`, data, { headers: this.getHeaders() }); }

  // Projects
  getProjects() { return this.http.get<any[]>(`${this.apiUrl}/projects`); }
  createProject(data: any) { return this.http.post<any>(`${this.apiUrl}/projects`, data, { headers: this.getHeaders() }); }
  updateProject(id: string, data: any) { return this.http.patch<any>(`${this.apiUrl}/projects/${id}`, data, { headers: this.getHeaders() }); }
  deleteProject(id: string) { return this.http.delete<any>(`${this.apiUrl}/projects/${id}`, { headers: this.getHeaders() }); }
  likeProject(id: string) { return this.http.patch<any>(`${this.apiUrl}/projects/${id}/like`, {}); }
  addProjectComment(projectId: string, data: any) { return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/comments`, data); }
  getProjectComments(projectId: string) { return this.http.get<any[]>(`${this.apiUrl}/projects/${projectId}/comments`); }
  getAdminComments() { return this.http.get<any[]>(`${this.apiUrl}/projects/admin/comments`, { headers: this.getHeaders() }); }
  deleteProjectComment(commentId: string) { return this.http.delete<any>(`${this.apiUrl}/projects/comments/${commentId}`, { headers: this.getHeaders() }); }

  // Testimonials
  getTestimonials() { return this.http.get<any[]>(`${this.apiUrl}/testimonials`); }
  submitTestimonial(data: any) { return this.http.post<any>(`${this.apiUrl}/testimonials`, data); }
  adminGetTestimonials() { return this.http.get<any[]>(`${this.apiUrl}/testimonials/admin`, { headers: this.getHeaders() }); }
  approveTestimonial(id: string) { return this.http.patch<any>(`${this.apiUrl}/testimonials/${id}`, { approved: true }, { headers: this.getHeaders() }); }
  deleteTestimonial(id: string) { return this.http.delete<any>(`${this.apiUrl}/testimonials/${id}`, { headers: this.getHeaders() }); }

  // Contact
  sendMessage(data: any) { return this.http.post<any>(`${this.apiUrl}/contact`, data); }
  getMessages() { return this.http.get<any[]>(`${this.apiUrl}/contact`, { headers: this.getHeaders() }); }
  markMessageRead(id: string) { return this.http.patch<any>(`${this.apiUrl}/contact/${id}/read`, {}, { headers: this.getHeaders() }); }
  deleteMessage(id: string) { return this.http.delete<any>(`${this.apiUrl}/contact/${id}`, { headers: this.getHeaders() }); }

  // Soft Skills
  getSoftSkills() { return this.http.get<any[]>(`${this.apiUrl}/soft-skills`); }
  createSoftSkill(data: any) { return this.http.post<any>(`${this.apiUrl}/soft-skills`, data, { headers: this.getHeaders() }); }
  updateSoftSkill(id: string, data: any) { return this.http.patch<any>(`${this.apiUrl}/soft-skills/${id}`, data, { headers: this.getHeaders() }); }
  deleteSoftSkill(id: string) { return this.http.delete<any>(`${this.apiUrl}/soft-skills/${id}`, { headers: this.getHeaders() }); }

  // Stacks
  getStacks() { return this.http.get<any[]>(`${this.apiUrl}/stacks`); }
  createStack(data: any) { return this.http.post<any>(`${this.apiUrl}/stacks`, data, { headers: this.getHeaders() }); }
  updateStack(id: string, data: any) { return this.http.patch<any>(`${this.apiUrl}/stacks/${id}`, data, { headers: this.getHeaders() }); }
  deleteStack(id: string) { return this.http.delete<any>(`${this.apiUrl}/stacks/${id}`, { headers: this.getHeaders() }); }

  // Icons Library
  getIcons() { return this.http.get<any[]>(`${this.apiUrl}/icons`); }
  createIcon(data: any) { return this.http.post<any>(`${this.apiUrl}/icons`, data, { headers: this.getHeaders() }); }
  updateIcon(id: string, data: any) { return this.http.patch<any>(`${this.apiUrl}/icons/${id}`, data, { headers: this.getHeaders() }); }
  deleteIcon(id: string) { return this.http.delete<any>(`${this.apiUrl}/icons/${id}`, { headers: this.getHeaders() }); }

  // Upload
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload/image`, formData, { headers: this.getHeaders() });
  }

  uploadPdf(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload/pdf`, formData, { headers: this.getHeaders() });
  }

  // Config
  getConfig() { return this.http.get<any>(`${this.apiUrl}/config`); }
  updateConfig(data: any) { return this.http.patch<any>(`${this.apiUrl}/config`, data, { headers: this.getHeaders() }); }
}

