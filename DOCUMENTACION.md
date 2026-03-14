# 📘 THE BLUEPRINT: PORTAFOLIO BACKEND CORE

Bienvenidos a la documentación técnica definitiva (El Libro) del "Portafolio Backend-Core". Este no es un portafolio común; es una **Aplicación Full-Stack de Nivel Producción** construida con estándares empresariales de arquitectura, rendimiento y User Experience (UX).

Esta guía está redactada como un libro de texto para que tú (el creador) entiendas **absolutamente todo** lo que hace mover a este ecosistema, desde el rincón más oscuro del Backend en Node.js, hasta la animación más sutil de la UI en CSS. Léelo con paciencia, domÍnalo, y tendrás el argumento técnico para cualquier entrevista de trabajo.

---

# 📖 ÍNDICE

1. [El Ecosistema (La Perspectiva Global)](#1-el-ecosistema-la-perspectiva-global)
2. [El Backend (El Cerebro)](#2-el-backend-el-cerebro)
3. [El Frontend (Los Ojos y las Manos)](#3-el-frontend-los-ojos-y-las-manos)
4. [La Magia Técnica Nivel Senior](#4-la-magia-técnica-nivel-senior)
5. [Seguridad y Control de Acceso](#5-seguridad-y-control-de-acceso)
6. [Resumen del Estilo (Aesthetics & CSS)](#6-resumen-del-estilo-aesthetics--css)
7. [Guías de Implementación Paso a Paso (Tutoriales Core)](#7-guías-de-implementación-paso-a-paso-tutoriales-core) 🆕

---

# 1. El Ecosistema (La Perspectiva Global)

Nuestra aplicación está dividida literalmente en dos mundos computacionales distintos:
- **`\backend` (NestJS / Node.js)**: Escucha peticiones silenciosamente en un puerto (ej. `3000`). Su trabajo exclusivo es hablar con la Base de Datos (Mongoose/MongoDB), aplicar Reglas de Negocio (¿Tiene permiso? ¿Es válido?), conectar funciones nativas de la computadora (correr ejecutables) y devolver datos en formato JSON.
- **`\frontend` (Angular 16+)**: Corre en el navegador del usuario (cliente) en un puerto distinto (ej. `4200`). Es un lienzo en blanco (SPA - Single Page Application) que usa TypeScript y CSS moderno. A medida que el usuario hace clic o scrollea, Angular manda llamadas secretas (`fetch` / `HttpClient`) por debajo de la mesa al Backend, pide los JSON, y repinta la pantalla en un milisegundo.

**El Pegamento:**
Todo se conecta por **HTTP/REST**. Y las configuraciones delicadas (contraseñas, puertos db) nunca se escriben en el código abierto, se esconden en un archivo llamado **`.env`** (Environment Variables).

---

# 2. El Backend (El Cerebro)

El Backend fue fabricado con [NestJS](https://nestjs.com/), el cual nos obliga a portarnos como desarrolladores serios dividiendo la responsabilidad de cada función en 3 capas. Imagina un Restaurante:

### A. Controladores (Los Meseros `*.controller.ts`)
Solo toman el pedido de internet (`GET`, `POST`, `PATCH`) y se lo pasan a la cocina.
- Ejemplo: `ProjectsController` escucha `GET /api/projects`. Cuando alguien visita la página, este mesero delega el trabajo al servicio.

### B. Servicios (Los Cocineros `*.service.ts`)
Tienen la receta pesada. Agarran las bases de datos de Mongo, hacen los `.find()`, los `.save()` y las actualizaciones de arrays internas. Cero interacción con el diseño web o HTTP, solo lógica de sistema.
- Ejemplo `ProjectsService.create()`: Revisa si el nombre es válido, revisa URLs y guarda el esquema de Mongoose en la DB.

### C. Módulos (`*.module.ts` y schemas)
La caja lógica. El `ProjectsModule` envuelve a sus Meseros (Controllers), Cocineros (Services) e Ingredientes (Schemas de Mongoose) en un paquete. Si mañana quieres quitar "Proyectos", borras esa caja y el resto de la app es intocable. Ese concepto se llama "Arquitectura Modular y Escalable".

---

# 3. El Frontend (Los Ojos y las Manos)

Fabricado sobre [Angular](https://angular.io/) en modo de **Standalone Components**. Tradicionalmente Angular era muy burocrático, necesitabas registrarlos en `NgModule`. Aquí usamos la modernidad de declarar un Componente de forma aislada.

### Estructura Vital
Todo el Frontend se inyecta desde:
`src/app/services/data.service.ts`: **El Enlace Supremo**.
Este es el único archivo de todo Frontend que sabe cómo comunicarse con el mundo exterior. Concentramos aquí todas las llamadas al Backend (axios / httpClient) y añadimos inyecciones de Cabeceras como nuestros Tokens Jwt en el aire.

### La División de Páginas Principales
- **Home (`home.component.ts`)**: Es un "Smart Component". Al inicializar (`ngOnInit`), llama al `DataService` múltiple veces al mismo momento para pedir el "Perfil", los "Proyectos", los "Testimonios" (filtrando solo los que dicen `approved: true`), y las "Skills". Luego delega la visualización a cosas más pequeñas.
- **Project Gallery (`project-gallery.component`)**: Un sub-módulo con un buscador incorporado para cuando la lista de tus proyectos crezca e impida ensuciar la "Home".
- **Admin Panel (Todo lo que empieza por `admin-*`)**: El cuarto cerrado al que accedes por `/login`. Cargas tus formularios sin tocar el backend.

---

# 4. La Magia Técnica (Nivel Senior)

Aquí es donde subimos el proyecto de "Fácil y Regular" a nivel de **Sistemas Complejos**.

### El "Live Test" (SSE y Node Spawn)
La funcionalidad más avanzada técnica del ecosistema. 

**El Problema:** Tú quieres hacer `npm run test` (algo que demora 6 segundos). Tradicionalmente el Frontend espera un POST y el Backend no devuelve respuesta hasta pasados los 6 segundos enteros, mostrando un resultado estático final (es aburrido y se bloquean las conexiones).

**Nuestra Solución (Ingeniería de Flujo de Datos):**
1. **El Mesero SSE**: Usamos `Server-Sent Events` (`@Sse` en NestJS). Es un puente HTTP especial (`text/event-stream`) que **se queda intencionadamente abierto** y responde por trozos, línea por línea.
2. **El Cocinero `spawn` (`TestRunnerService`)**: No importamos librerías raras. Usamos `child_process.spawn()` (Módulo nativo de NodeJS) para llamar secretamente al terminal oculta en Windows/Linux y ejecutar a Jest.
3. El `spawn` nos arroja un objeto `Buffer` por cada letra que manda la consola de Node. Construimos un **Limpiador (`cleanOutput()`)** para quitar códigos raros (colores de terminal en modo Windows ANSI como `\x1b[1m`) y enviamos las líneas súper limpias y decodificadas usando un `Observable de RxJS`.
4. **Respuesta Frontend (`EventSource`)**: Nuestro modal de Angular en lugar de hacer `HTTP.post`, abre la API nativa del navegador `EventSource`. Esto es como suscribirse al Twitch del backend. Lo inyecta línea a línea al array visual hasta que reciba señal de cierre.

### El Ecosistema Dinámico de Iconos
En lugar de forzarte a cargar Base64 kilométrico o buscar fotos cada rato. Creamos una librería central interconectada.
- MongoDB modela las Colecciones: `Stack`, `Habilidades Blandas`. Todas ellas tienen una referencia `Types.ObjectId` (como una Llave foránea) a la colección `IconLibrary`.
- Si tú actualizas el "Icono de React" en la librería del admin, **todos tus proyectos y pantallas se actualizarán automáticamente** porque usamos `populate('icon')` en el backend para hacer un JOIN dinámico a Mongoose.

---

# 5. Seguridad y Control de Acceso

El Backend es de acceso libre solo de lectura (Cualquiera hace `GET`), pero escribir o modificar (los Admin Panels vacíos, el POST, PATCH) debe estar bloqueado.

**Nuestra Solución (JWT - Json Web Tokens)**
1. En `/login`, el Backend verifica tu password. Si coincide, emite un string criptográfico firmado.
2. Cada vez que tocas "Crear Testimonio", Angular (`getHeaders()`) pega este token a la petición HTTP.
3. El Decorador global `@UseGuards(JwtAuthGuard)` expulsa las peticiones sin token (401 Unauthorized), protegiendo tus datos.

---

# 6. Resumen del Estilo (Aesthetics & CSS)

Tu portafolio emana una presencia High-End/Tech y "Premium", apoyándose fuertemente en el UI Pattern conocido como **Dark Glassmorphism & Neon Shadows:**

#### Atributos de tu Interfaz Gráfica:
- **Efecto Glass (`.glass` y `backdrop-filter: blur()`)**: Se usa intensivamente sobre capas traseras. Crea ese aire 3D Apple VisionOS moderno.
- **Microinteracciones (`.card:hover` / `transform: translateY`)**: Generar feedback constante al cursor (hover = elemento flotando suave).
- **Flexbox y Grid Systems**: Nada flota suelto. Usamos Flexbox para centrar barras y CSS Grid para el "Project Gallery", permitiendo responsividad elástica.

---

# 7. Guías de Implementación Paso a Paso (Tutoriales Core)

Cualquier reclutador te preguntará: *"¿Y cómo hiciste exactamente el Live Test o la seguridad?"*. Aquí tienes el guion de cómo replicar lo que hicimos, paso a paso, desde cero.

## 🛠️ Guía 1: Implementando Seguridad JWT (Autenticación)

El objetivo es asegurar que nadie pueda borrar o añadir proyectos en tu base de datos excepto tú.

**Paso 1: ¿Qué necesitamos instalar? (Backend)**
Necesitamos el ecosistema de Passport y JWT para NestJS:
`npm install @nestjs/jwt @nestjs/passport passport passport-jwt`

**Paso 2: Crear el AuthModule y AuthService**
El código del `auth.service.ts` se encarga de fabricar el billete de entrada (Token).
```typescript
// auth.service.ts
import { JwtService } from '@nestjs/jwt';

async login(userDto) {
  // 1. Verificamos la contraseña (idealmente comparando hashes de Bcrypt)
  if (userDto.password === process.env.ADMIN_PASSWORD) {
    // 2. Firmamos un Token criptográfico in-hackeable.
    return {
      access_token: this.jwtService.sign({ email: userDto.email, role: 'admin' }),
    };
  }
}
```

**Paso 3: Crear el Escudo Protector (Guard)**
Creas un archivo `jwt-auth.guard.ts`. Este archivo se pone en medio de las llamadas HTTP. Si tratas de acceder sin token, actúa de barrera.
```typescript
import { AuthGuard } from '@nestjs/passport';
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Paso 4: Aplicar el Escudo a tus Controladores**
En `projects.controller.ts`, proteges rutas críticas importando el Guard:
```typescript
@Post()
@UseGuards(JwtAuthGuard) // <--- ESTO ES LA MAGIA. Bloquea la ruta.
createProject(@Body() body) {
  return this.projectService.create(body);
}
```

**Paso 5: Conectar el Frontend**
Angular, tras hacer login exitoso, guarda ese chorro de texto en la memoria del navegador.
```typescript
// En tu login.component.ts
localStorage.setItem('token', response.access_token);
```
Luego, en tu `data.service.ts`, lo inyectas en cada llamada:
```typescript
const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
return this.http.post('/api/projects', data, { headers });
```

---

## 🚀 Guía 2: Construyendo la Terminal Live Test (Server-Sent Events)

El objetivo es correr un proceso en el servidor y ver su comportamiento línea por línea en el navegador, sin usar Websockets (ahorrando memoria).

**Paso 1: El Servicio que Invade la Consola (Backend)**
Usamos `child_process.spawn`. No instalas librerías, Node lo trae de fábrica.
```typescript
// test-runner.service.ts
import { spawn } from 'child_process';
import { Subject } from 'rxjs';

runTests() {
  const subject = new Subject(); // Canal de emisión contínuo
  
  // Abrimos la terminal invisible del servidor y escribimos npm run test
  const child = spawn('npm', ['run', 'test'], { shell: true });

  // Cada vez que npm arroja una línea de texto...
  child.stdout.on('data', (data) => {
    // La limpiamos y la mandamos por el tubo hacia Angular
    const text = data.toString();
    subject.next({ data: { text: text } });
  });

  child.on('close', () => {
    subject.next({ data: { done: true } }); // Avisamos que terminó
    subject.complete();
  });

  return subject.asObservable(); // Convertimos a Observable para SSE
}
```

**Paso 2: El Endpoint SSE (Backend)**
Cualquier controlador en NestJS puede transformarse en un Endpoint de Streaming usando `@Sse`:
```typescript
// projects.controller.ts
import { Sse } from '@nestjs/common';

@Sse(':id/test-stream') // <--- Cambia el formato de JSON a Event-Stream
streamTests() {
  return this.testRunnerService.runTests();
}
```

**Paso 3: El Mega Modal del Frontend (Angular)**
El Frontend tradicional espera peticiones simples. Para escuchar flujos asincrónicos, usamos Javascript Nativo puro (`EventSource`).
```typescript
// test-runner-modal.component.ts
import { ChangeDetectorRef } from '@angular/core';

// 1. Abrimos conexión directa al canal de NestJS
this.eventSource = new EventSource(`/api/projects/123/test-stream`);

// 2. Nos quedamos escuchando infinitamente
this.eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.done) {
     this.eventSource.close(); // Cerramos para evitar bugs de red
  } else {
     this.logs.push(data.text); // Empujamos la línea al HTML
     this.cdr.detectChanges();  // <--- CRUCIAL: Obligamos a Angular a repintar la vista al instante
  }
};
```
**Paso 4: El HTML y CSS (Frontend)**
Simplemente hacemos un `*ngFor="let log of logs"` en un `<div class="terminal">` negro con tipografía *Courier New*, forzando el contenedor a hacer *scroll to bottom* dinámico. ¡Listo! Has constrido un pipeline real en tiempo real.
