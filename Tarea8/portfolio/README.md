# Portafolio FrontEnd FullStack

Este repositorio contiene una colección de aplicaciones web desarrolladas con **Next.js**, demostrando competencias en diseño UI/UX, lógica compleja y consumo de APIs.

## Módulos Incluidos

### 1. Arcade Zone (Videojuegos)
Tres juegos interactivos desarrollados desde cero:
- **Neon Tetris**: Lógica completa con hooks de React, sistema de niveles y rotación de piezas.
- **Space Dodge**: Juego arcade utilizando HTML5 Canvas para renderizado de alto rendimiento.
- **Cyber Memory**: Puzzle de memoria con efectos 3D CSS y gestión de estados.

### 2. Data Visualizer
Motor de gráficos dinámico utilizando **Recharts**.
- Tipos soportados: Barras, Líneas, Pastel.
- Edición de datos en tiempo real.
- Diseño responsive.

### 3. Task Master (Microsoft To-Do Integration)
Gestor de tareas con doble modalidad:
- **Modo Demo**: Completamente funcional sin conexión, utilizando estado local.
- **Modo Conectado**: Integración real con Microsoft Graph API (requiere configuración Azure).

## Instrucciones de Instalación

1.  Clonar el repositorio o descargar los archivos.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abrir [http://localhost:3000](http://localhost:3000).

## Configuración Opcional (Azure AD)

Para habilitar la integración real con Microsoft To-Do:

1.  Registrar una aplicación en [Azure Portal](https://portal.azure.com/).
2.  Crear un archivo `.env.local` en la raíz del proyecto `portfolio/`.
3.  Añadir las siguientes variables:

    ```env
    AZURE_AD_CLIENT_ID=tu_client_id
    AZURE_AD_CLIENT_SECRET=tu_client_secret
    AZURE_AD_TENANT_ID=tu_tenant_id
    NEXTAUTH_SECRET=una_cadena_secreta_aleatoria
    NEXTAUTH_URL=http://localhost:3000
    ```

## Tecnologías Usadas
- **Next.js 15+** (App Router)
- **TypeScript**
- **Sass (SCSS Modules)**
- **Recharts**
- **NextAuth.js**
