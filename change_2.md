# Documentación Técnica: Refactorización y Separación de Módulos

**Proyecto:** Plataforma Web de Monitoreo - LUWA Consultancy Group  
**Autor:** Juan Jesús Valdez Vásquez  
**Rama de Desarrollo:** `Juan-Jesus`  
**Fecha de Actualización:** Septiembre 2026  

---

## 1. Resumen de la Arquitectura
Para mejorar los tiempos de carga, el mantenimiento del código y la experiencia del usuario (UX), se aplicó el principio de "Separación de Responsabilidades" (Separation of Concerns). Las herramientas complejas se dividieron en archivos HTML independientes, unificados a través de la barra de navegación principal.

## 2. Módulo de IoT y Hardware (`sensing.html`)
Este archivo ahora funciona exclusivamente como el **Dashboard Operativo y de Campo**.
* **Mapa IoT en Vivo:** Mantiene la conexión WebSocket (WSS) con el clúster EMQX. Sigue utilizando el algoritmo de decodificación de `Geohash` para la ubicación automática y la función "Excavadora" (Parser Recursivo) para leer JSON anidados sin errores.
* **Galería de Hardware:** Se conservó la cuadrícula responsiva (CSS Grid) con las 4 imágenes de los prototipos (test de laboratorio, circuito interno, ensamblaje y carcasa final).
* **Limpieza de Código:** Se eliminaron las librerías, estilos y lógicas matemáticas de la calculadora de carbono, reduciendo drásticamente el peso del archivo.

## 3. Nuevo Módulo: Plataforma de Inventario GEI (`carbono.html`)
Se creó un archivo completamente nuevo dedicado a la **Cuantificación de Gases de Efecto Invernadero (Norma ISO 14064)**. Esta herramienta ahora es mucho más robusta y profesional:
* **Estructura por Alcances:**
  * **Alcance 1 (Emisiones Directas):** Combustible de flotillas (litros) y gas natural (m³).
  * **Alcance 2 (Energía Indirecta):** Consumo eléctrico de la red (kWh).
  * **Alcance 3 (Cadena de Valor):** Generación de residuos sólidos (toneladas) y viajes de negocios (horas de vuelo).
* **Panel de Resultados Avanzado (Dashboard Visual):**
  * Cálculo dinámico de equivalentes en kilogramos y toneladas métricas ($\text{Ton CO}_2\text{e}$).
  * Implementación de **barras de progreso animadas** que calculan automáticamente el porcentaje de contribución de cada alcance al total de la huella de carbono.
* **Diseño UI:** Interfaz limpia con tarjetas independientes para cada alcance, codificadas por color (Rojo, Amarillo y Verde) para una lectura intuitiva.

## 4. Actualización de Navegación
Todos los archivos del proyecto (incluyendo `index.html`) deben tener su barra de navegación (`<nav>`) actualizada para apuntar correctamente al nuevo archivo `<a href="carbono.html">Carbon Calculator</a>`.