# 📄 CHANGELOG & Reporte Técnico: Refactorización Integral de Frontend - LUWA Consulting

**Fecha de ejecución:** Julio 2026  
**Ingeniero a cargo:** Juan Jesús Valdez Vásquez  
**Archivos impactados:** `index.html`, `about.html`, `consultancy-services.html`, `data-methods.html`, `contact.html`, `assets/Cascading_Style_Sheets/style.css`

---

## 1. Reestructuración de Arquitectura de Directorios (Assets)
Se eliminó la estructura plana en la raíz para implementar una arquitectura modular escalable.
* **Hojas de estilo:** Migradas a `assets/Cascading_Style_Sheets/`
* **Imágenes generales y Logotipos:** Migrados a `assets/imagenes/imagenes_generales/`
* **Recursos de Video (MP4):** Migrados a `assets/Videos/`
* **Refactorización de Rutas:** Se actualizaron todos los atributos `src=""` y `href=""` en los 5 archivos HTML para enlazar correctamente los recursos.

## 2. Inyección del Sistema de Diseño Global (CSS Variables)
Se abandonó el esquema de alto contraste (negros puros) para implementar una paleta institucional científica. Se añadió el siguiente bloque en la raíz de `style.css` y en la etiqueta `<style>` de `index.html`:

```css
:root {
  --azul-luwa: #0056b3;     /* Color principal para Títulos, Botones y Logos */
  --cian-acento: #0ea5e9;   /* Color de interacción (Hover) y delineados */
  --blanco-fondo: #ffffff;  /* Background para legibilidad de mapas/datos */
  --gris-niebla: #f0f4f8;   /* Reemplazo de oscuros en Header/Footer */
  --texto-carbon: #334155;  /* Mejora ergonómica de legibilidad técnica */
  --sombra-suave: rgba(0, 0, 0, 0.05); /* Sombra base para tarjetas */
}

3. Reescritura Total del Archivo style.css
El archivo global de estilos fue reescrito para acoplarse dinámicamente a las variables :root.

Sustitución de background-color: #222 por var(--gris-niebla) en <header> y <footer>.

Inyección de border-bottom: 2px solid var(--azul-luwa) y border-top en áreas de navegación.

Tarjetas (.card, .service-card, etc.): Se modificó el box-shadow y el border: 1px solid #e2e8f0 para darle un efecto de elevación limpia sobre el fondo blanco.

Tipografía Global: Se forzó el uso de color: var(--texto-carbon) en todos los párrafos y listas.

4. Modificaciones Estructurales en HTML (Multi-archivo)
Se intervinieron líneas de código específicas en los 5 archivos HTML (index, about, consultancy-services, data-methods, contact):

A. Logotipo como Home-Link:
Se localizó la etiqueta del logo en el <header> y se envolvió en una etiqueta de anclaje para mejorar el flujo UX.
Antes: 
<img src="assets/imagenes/imagenes_generales/LOGO.png" alt="Logo" class="logo">
Después:
<a href="index.html">
  <img src="assets/imagenes/imagenes_generales/LOGO.png" alt="Logo" class="logo">
</a>
5. Refactorización Exclusiva del index.html
Dado que la página principal contenía estilos en línea (<style>), se realizó una cirugía de código extensa para alinearla al nuevo diseño:

A. Corrección de la tarjeta .announce (Data Assimilation):
Se removió el fondo #2a3544 y se inyectó código para asimilarla a la paleta clara, añadiendo un borde de acento.
CSS
.announce {
  background-color: var(--blanco-fondo);
  color: var(--texto-carbon);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 2px solid var(--cian-acento);
}
.announce strong {
  color: var(--azul-luwa);
}
B. Ajuste de Layout en el Footer Action Card:
Se reescribió el contenedor del botón final ("Calculate Simulation Domain...") para centrarlo e integrarlo limpiamente antes del footer.
HTML
<section style="padding-top: 0; padding-bottom: 0;">
  <div class="card" style="width: 100%; max-width: 800px; margin: auto;">
    <p>Integration of emission estimation using Data Assimilation and lightweight methods...</p>
    <button class="btn" onclick="window.open('leaflet_hpc_estimate.html','_blank')">
      Calculate Simulation Domain & CPU Time
    </button>
  </div>
</section>
C. Programación de Botones (Hover States):
Todos los componentes interactivos (.btn, .cloud-btn) fueron recalibrados para emitir feedback visual:
CSS
.cloud-btn:hover, .btn:hover {
  background-color: var(--cian-acento);
  transform: translateY(-2px); /* Desplazamiento táctil */
}
6. Resolución Crítica de Diseño Responsivo (Mobile Fix)
Se detectó un fallo de colisión (overflow) en dispositivos móviles, donde el logo con position: absolute aplastaba el título principal <h1>. Se añadieron las siguientes líneas de código en el bloque CSS del index.html:
CSS
@media (max-width: 850px) {
  header img.logo {
    position: static; /* Libera el logo de la orilla */
    display: block;
    margin: 0 auto 10px auto; /* Lo centra horizontalmente */
    height: 80px;
  }
  header h1 {
    padding-left: 0;
    padding-right: 0;
    font-size: 1.4rem;
  }
  nav {
    display: flex;
    flex-direction: column; /* Apila los enlaces uno sobre otro */
    align-items: center;
    gap: 10px;
  }
  .cloud-btn {
    margin-left: 0;
  }
}
Con esta modificación, la estructura de la cabecera ahora se adapta y colapsa de manera ordenada en formato de columna vertical para tablets y smartphones.