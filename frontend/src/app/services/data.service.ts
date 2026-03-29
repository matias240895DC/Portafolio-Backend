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
  getProfile() { return this.http.get<any>('/api/profile'); }
  updateProfile(data: any) { return this.http.patch<any>('/api/profile', data, { headers: this.getHeaders() }); }

  // Projects
  getProjects() { return this.http.get<any[]>('/api/projects'); }
  createProject(data: any) { return this.http.post<any>('/api/projects', data, { headers: this.getHeaders() }); }
  updateProject(id: string, data: any) { return this.http.patch<any>(`/api/projects/${id}`, data, { headers: this.getHeaders() }); }
  deleteProject(id: string) { return this.http.delete<any>(`/api/projects/${id}`, { headers: this.getHeaders() }); }
  likeProject(id: string) { return this.http.patch<any>(`/api/projects/${id}/like`, {}); }
  addProjectComment(projectId: string, data: any) { return this.http.post<any>(`/api/projects/${projectId}/comments`, data); }
  getProjectComments(projectId: string) { return this.http.get<any[]>(`/api/projects/${projectId}/comments`); }
  getAdminComments() { return this.http.get<any[]>('/api/projects/admin/comments', { headers: this.getHeaders() }); }
  deleteProjectComment(commentId: string) { return this.http.delete<any>(`/api/projects/comments/${commentId}`, { headers: this.getHeaders() }); }

  // Testimonials
  getTestimonials() { return this.http.get<any[]>('/api/testimonials'); }
  submitTestimonial(data: any) { return this.http.post<any>('/api/testimonials', data); }
  adminGetTestimonials() { return this.http.get<any[]>('/api/testimonials/admin', { headers: this.getHeaders() }); }
  approveTestimonial(id: string) { return this.http.patch<any>(`/api/testimonials/${id}`, { approved: true }, { headers: this.getHeaders() }); }
  deleteTestimonial(id: string) { return this.http.delete<any>(`/api/testimonials/${id}`, { headers: this.getHeaders() }); }

  // Contact
  sendMessage(data: any) { return this.http.post<any>('/api/contact', data); }
  getMessages() { return this.http.get<any[]>('/api/contact', { headers: this.getHeaders() }); }
  markMessageRead(id: string) { return this.http.patch<any>(`/api/contact/${id}/read`, {}, { headers: this.getHeaders() }); }
  deleteMessage(id: string) { return this.http.delete<any>(`/api/contact/${id}`, { headers: this.getHeaders() }); }

  // Soft Skills
  getSoftSkills() { return this.http.get<any[]>('/api/soft-skills'); }
  createSoftSkill(data: any) { return this.http.post<any>('/api/soft-skills', data, { headers: this.getHeaders() }); }
  updateSoftSkill(id: string, data: any) { return this.http.patch<any>(`/api/soft-skills/${id}`, data, { headers: this.getHeaders() }); }
  deleteSoftSkill(id: string) { return this.http.delete<any>(`/api/soft-skills/${id}`, { headers: this.getHeaders() }); }

  // Stacks
  getStacks() { return this.http.get<any[]>('/api/stacks'); }
  createStack(data: any) { return this.http.post<any>('/api/stacks', data, { headers: this.getHeaders() }); }
  updateStack(id: string, data: any) { return this.http.patch<any>(`/api/stacks/${id}`, data, { headers: this.getHeaders() }); }
  deleteStack(id: string) { return this.http.delete<any>(`/api/stacks/${id}`, { headers: this.getHeaders() }); }

  // Icons Library
  getIcons() { return this.http.get<any[]>('/api/icons'); }
  createIcon(data: any) { return this.http.post<any>('/api/icons', data, { headers: this.getHeaders() }); }
  updateIcon(id: string, data: any) { return this.http.patch<any>(`/api/icons/${id}`, data, { headers: this.getHeaders() }); }
  deleteIcon(id: string) { return this.http.delete<any>(`/api/icons/${id}`, { headers: this.getHeaders() }); }

  // Upload
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('/api/upload/image', formData, { headers: this.getHeaders() });
  }

  uploadPdf(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('/api/upload/pdf', formData, { headers: this.getHeaders() });
  }

  // Config
  getConfig() { return this.http.get<any>('/api/config'); }
  updateConfig(data: any) { return this.http.patch<any>('/api/config', data, { headers: this.getHeaders() }); }
}

