🎓 Tagama - Plataforma de Talleres

Una aplicación web moderna para la gestión y participación en talleres tecnológicos, desarrollada con JavaScript vanilla, Tailwind CSS y APIs externas.
Proyecto que forma parte del Bootcamp experta en JavaScript de HerTech.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de Uso](#-guía-de-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [APIs y Servicios Externos](#-apis-y-servicios-externos)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Contribución](#-contribución)

## ✨ Características

### 🎨 Interfaz de Usuario
- **Diseño Responsivo**: Adaptable a dispositivos móviles y desktop
- **Tema Claro/Oscuro**: Soporte completo para ambos temas
- **UI Moderna**: Interfaz intuitiva con Tailwind CSS
- **Modales Dinámicos**: Formularios y confirmaciones en tiempo real

### 🔐 Autenticación y Usuarios
- **Registro/Login**: Sistema completo de autenticación
- **Perfiles de Usuario**: Gestión de información personal
- **Avatares**: Subida de imágenes de perfil con Cloudinary
- **Sesiones**: Persistencia de datos de usuario

### 📚 Gestión de Talleres
- **CRUD Completo**: Crear, leer, actualizar y eliminar talleres
- **Categorías y Subcategorías**: Organización jerárquica
- **Niveles de Dificultad**: Principiante, Intermedio, Avanzado
- **Modos de Impartición**: Online y Presencial
- **Geocodificación**: Conversión automática de direcciones a coordenadas
- **Mapas Interactivos**: Visualización de ubicaciones con Leaflet

### 🖼️ Gestión de Contenido
- **Subida de Imágenes**: Integración con Cloudinary
- **Previsualización**: Vista previa de imágenes antes de subir
- **Validación de Archivos**: Verificación de tipos y tamaños

### 📧 Comunicación
- **Formulario de Contacto**: Integración con EmailJS
- **Notificaciones Toast**: Feedback en tiempo real
- **Confirmaciones**: Modales de confirmación personalizados

## 🏗️ Arquitectura Técnica

### 📁 Estructura de Carpetas

```
src/
├── api/                    # Capa de acceso a datos
│   ├── apiCategories.js    # API para categorías
│   ├── apiUsers.js        # API para usuarios
│   └── apiWorkshops.js    # API para talleres
├── components/            # Componentes reutilizables
│   ├── cards.js          # Tarjetas de talleres
│   └── modals/           # Modales del sistema
│       └── formModal.js  # Modal de formularios
├── utils/                # Utilidades y helpers
│   ├── day.js           # Configuración de fechas
│   ├── leaflet.js       # Configuración de mapas
│   └── toastify.js      # Sistema de notificaciones
├── views/               # Vistas principales
│   ├── contact.js       # Página de contacto
│   ├── detail.js        # Detalle de taller
│   ├── login.js         # Página de login
│   ├── profile.js       # Perfil de usuario
│   ├── signup.js        # Página de registro
│   └── workshops.js     # Lista de talleres
└── assets/              # Recursos estáticos
    └── styles/
        └── main.css     # Variables CSS globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Navegador web moderno
- Conexión a internet (para APIs externas)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd her-tech-workshops
   ```

2. **Abrir el proyecto**
   ```bash
   # Usar un servidor local (recomendado)
   python -m http.server 8000
   # O usar Live Server en VS Code
   ```

3. **Acceder a la aplicación**
   ```
   http://localhost:8000
   ```


## 🔧 APIs y Servicios Externos

### **MockAPI**
- **Propósito**: Base de datos para usuarios, talleres y categorías
- **Configuración**: URLs en archivos `api/*.js`
- **Estructura**:
  ```json
  {
    "users": [
      {
        "id": "1",
        "name": "Usuario",
        "email": "usuario@email.com",
        "avatar": "url_imagen"
      }
    ],
    "workshops": [
      {
        "id": "1",
        "title": "Taller de JavaScript",
        "instructorName": "Instructor",
        "coordinates": {"lat": 28.4636, "lng": -16.2518}
      }
    ]
  }
  ```

### **Cloudinary**
- **Propósito**: Almacenamiento de imágenes
- **Configuración**: Upload preset y cloud name
- **Uso**: Subida automática de imágenes de talleres y avatares

### **EmailJS**
- **Propósito**: Envío de emails de contacto
- **Configuración**: Template y credenciales
- **Uso**: Formulario de contacto en tiempo real

### **Nominatim (OpenStreetMap)**
- **Propósito**: Geocodificación de direcciones
- **Configuración**: No requiere configuración
- **Uso**: Conversión automática de direcciones a coordenadas

### **Leaflet**
- **Propósito**: Visualización de mapas interactivos
- **Configuración**: CDN incluido en HTML
- **Uso**: Mostrar ubicaciones de talleres presenciales

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **JavaScript ES6+**: Lógica de aplicación
- **Tailwind CSS**: Framework de estilos
- **HTML5**: Estructura semántica
- **CSS3**: Variables

### **APIs y Servicios**
- **MockAPI**: Base de datos simulada
- **Cloudinary**: Gestión de imágenes
- **EmailJS**: Servicio de emails
- **Nominatim**: Geocodificación
- **Leaflet**: Mapas interactivos

### **Utilidades**
- **Day.js**: Manejo de fechas
- **Toastify**: Notificaciones


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autores

- **Desarrolladores Principales**: Carolina, Yesenia Medina, Tracy Medina

