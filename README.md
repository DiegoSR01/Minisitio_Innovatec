# InnovaTECNM 2025 - Minisitio Web

![InnovaTECNM 2025](main/src/assets/icons/innovatec_icon.png)

## Descripción del Proyecto

Este es el sitio web oficial para **InnovaTECNM 2025**, un evento del Tecnológico Nacional de México (TecNM) que se llevará a cabo en la Etapa Regional en el Instituto Tecnológico de Toluca.

**InnovaTECNM 2025** es un evento que reúne a estudiantes, emprendedores e investigadores para desarrollar y presentar proyectos tecnológicos y creativos con potencial de crecimiento. Su propósito es impulsar la investigación aplicada, la innovación y el emprendimiento, ofreciendo un espacio de colaboración con la industria, el sector público y la sociedad para convertir ideas en soluciones reales y de impacto.

## Características del Evento

### Actividades Principales
- **Certamen de Proyectos**: Presentación de proyectos tecnológicos innovadores
- **HackaTec**: Competencia de programación y desarrollo
- **Cortometraje InnovAcción**: Concurso de videos creativos
- **InnoBótica**: Competencias de robótica que incluyen:
  - Minisumo (robots de combate)
  - Seguidor de línea
  - Competencia de drones
  - Lego Robotics

## Estructura del Proyecto

```
Minisitio_Innovatec/
├── main/
│   ├── index.html          # Página de carga principal
│   └── src/
│       ├── html/           # Páginas del sitio
│       │   ├── inicio.html      # Página principal
│       │   ├── programa.html    # Programa del evento
│       │   ├── estancia.html    # Información de alojamiento
│       │   ├── info.html        # Información general
│       │   └── noticias.html    # Noticias del evento
│       ├── css/            # Estilos CSS
│       │   ├── inicio.css
│       │   └── estancia.css
│       ├── js/             # Scripts JavaScript
│       │   └── inicio.js        # Funcionalidad del carousel y navegación
│       └── assets/         # Recursos multimedia
│           ├── icons/           # Iconos y logos
│           └── images/          # Imágenes del sitio
└── README.md              # Este archivo
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo con CSS Grid y Flexbox
- **JavaScript (ES6+)**: Interactividad y carousels mejorados
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografías (Inter y Poppins)

## Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DiegoSR01/Minisitio_Innovatec.git
   cd Minisitio_Innovatec
   ```

2. **Abrir el proyecto:**
   
   **Opción 1 - Directamente en el navegador:**
   ```bash
   # Abrir main/index.html en tu navegador
   open main/index.html  # macOS
   # o
   start main/index.html # Windows
   # o
   xdg-open main/index.html # Linux
   ```

   **Opción 2 - Con servidor local (recomendado):**
   ```bash
   # Usar Python (si está instalado)
   cd main
   python -m http.server 8000
   # Luego abrir http://localhost:8000 en el navegador
   
   # O usar Node.js con live-server
   npx live-server main
   ```

3. **Navegación:**
   - El sitio cargará automáticamente desde `index.html`
   - Después de 2 segundos, redirigirá a la página principal

## Funcionalidades

### Diseño Responsivo
- Adaptable a dispositivos móviles, tablets y desktop
- Navegación optimizada para diferentes tamaños de pantalla

### Carousels Interactivos
- Navegación automática y manual
- Controles de navegación intuitivos
- Indicadores visuales

### Accesibilidad
- Etiquetas ARIA para lectores de pantalla
- Navegación por teclado
- Contraste de colores optimizado

## Páginas del Sitio

1. **Inicio** (`inicio.html`): Página principal con información general del evento
2. **Programa** (`programa.html`): Detalles del programa y actividades
3. **Estancia** (`estancia.html`): Información sobre alojamiento
4. **Información General** (`info.html`): Detalles adicionales del evento
5. **Noticias** (`noticias.html`): Actualizaciones y noticias relacionadas

## Información del Evento

**Sede:** Instituto Tecnológico de Toluca  
**Dirección:** Av. Tecnológico s/n. Colonia Agrícola Bellavista, Metepec, Edo. de México, México C.P. 52149  
**Teléfono:** 722 208 7200  

## Contribución

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Desarrollo

### Estructura CSS
- Variables CSS personalizadas para consistencia en colores y espaciado
- Metodología de diseño móvil primero (mobile-first)
- Sistema de grid responsive

### JavaScript
- Clase `EnhancedCarousel` para manejo de carousels
- Event listeners para interactividad
- Navegación suave y transiciones

## Soporte y Contacto

Para más información sobre el evento InnovaTECNM 2025:
- **Institución:** Instituto Tecnológico de Toluca
- **Teléfono:** 722 208 7200

## Licencia

© InnovaTECNM 2025 - Instituto Tecnológico de Toluca. Todos los derechos reservados.

---

*Desarrollado con ❤️ para InnovaTECNM 2025*