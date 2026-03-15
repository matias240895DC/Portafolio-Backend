import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    // 1. Creamos un "Spía" (Mock) del servicio
    // Le decimos: "Si alguien llama a getProjects, devuelve esto:"
    const spy = jasmine.createSpyObj('DataService', ['getProjects']);
    spy.getProjects.and.returnValue(of([
      { id: 1, title: 'Proyecto Demo', description: 'Test', active: true }
    ]));

    TestBed.configureTestingModule({
      imports: [HomeComponent], // Importamos el componente a probar
      providers: [
        { provide: DataService, useValue: spy } // Le inyectamos el espía al sistema
      ]
    });

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    component.ngOnInit();
    // Verificamos que el servicio fue llamado
    expect(dataServiceSpy.getProjects).toHaveBeenCalled();
    // Verificamos que la variable interna tiene el dato simulado
    expect(component.projects.length).toBe(1);
  });

  it('debería fallar a propósito (Demo Live Test)', () => {
    // Este test está diseñado para fallar y mostrarte cómo se ve el error
    const nombreEsperado = 'Matias El Grande';
    expect('Matias').toBe(nombreEsperado); 
  });
});