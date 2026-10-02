# Documentación Técnica: Actualización del Dashboard Ambiental LUWA

**Proyecto:** Plataforma Web de Monitoreo - LUWA Consultancy Group  
**Módulo:** Dashboard Unificado (Sensing Network, Hardware & ISO Calculator)  
**Autor:** Juan Jesús Valdez Vásquez  
**Fecha de Actualización:** 18 de agosto de 2026  

---

## 1. Resumen de la Actualización
El archivo principal de la plataforma ha sido reestructurado para funcionar como un **Dashboard Integral**. Se unificó la visualización de datos satelitales, la red de telemetría IoT en tiempo real, la exhibición de prototipos de hardware y una herramienta de cuantificación de emisiones de gases de efecto invernadero (GEI). Todo el sistema mantiene la identidad visual corporativa de LUWA de forma completamente responsiva.

---

## 2. Red de Sensores IoT (Sensing Network)

Se resolvió el problema de posicionamiento de los marcadores en el mapa y la lectura de variables anidadas desde el clúster EMQX.

### 2.1. Decodificación de Coordenadas (Geohash)
* **Problema:** Los dispositivos de campo no enviaban las coordenadas (`lat` y `lng`) dentro del cuerpo del mensaje JSON para optimizar el consumo de datos. En su lugar, las coordenadas se codificaban dentro de la ruta de publicación (topic MQTT).
* **Solución:** Se implementó el algoritmo `decodificarGeohash(geohash)`. Este script intercepta la ruta de conexión (ej. `tele/d3478e8cmh1n/aqa-sp-98F...`), extrae la segunda sección correspondiente al Geohash y lo traduce matemáticamente a coordenadas geoespaciales.
* **Resultado:** Los pines ahora se ubican automáticamente en el mapa de Leaflet (ej. en la zona de Medellín) en cuanto el sensor emite su primer pulso.

### 2.2. Algoritmo de Extracción "Excavadora" (Parser Recursivo)
* **Problema:** La estructura JSON enviada por los sensores presentaba arreglos u objetos anidados con índices numéricos (ej. `{"0": {"co2": 541}}`), lo que provocaba que el mapa imprimiera el error `[object Object]`.
* **Solución:** Se programó la función recursiva `extraerDatos(dato)`. Esta función explora cualquier nivel de profundidad del JSON entrante. Al detectar un objeto, entra en él; al detectar un valor final, verifica que la llave no sea un número de índice (`isNaN(llave)`).
* **Resultado:** Se extraen e imprimen únicamente los valores útiles (como `co2`, `pm25`, `temp`, `hum`) dentro de la ventana emergente de cada sensor.

---

## 3. Módulo de Galería de Hardware

Se integró una sección visual para documentar el progreso de ingeniería de los dispositivos físicos.

* **Cuadrícula Responsiva (CSS Grid):** Se utilizó la propiedad `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))` para asegurar que las tarjetas de imágenes se ajusten automáticamente sin importar si se visualizan en monitores de PC o dispositivos móviles.
* **Integración de Lightbox2:** Se enlazó la librería `lightbox.min.js` y `lightbox.min.css`. Al agregar el atributo `data-lightbox="hardware"` a los enlaces de las imágenes, se habilitó la visualización en pantalla completa con fondo oscuro al hacer clic sobre cualquier fotografía de los nodos sensores o del laboratorio de baterías.

---

## 4. Calculadora de Huella de Carbono (ISO 14064)

Se incorporó una herramienta de estimación de emisiones corporativas operando bajo la lógica local del navegador del usuario (JavaScript).

* **Ecuación Base:** El motor de cálculo opera bajo el principio estándar de la Norma ISO 14064:  
  *Emisiones GEI = Dato de Actividad × Factor de Emisión*
* **Alcances Contemplados:**
  * **Alcance 2 (Electricidad):** Conversión de kWh anuales a equivalentes de CO2.
  * **Alcance 1 (Combustible):** Conversión de consumo de gasolina (flotilla) en litros.
  * **Residuos:** Estimación de impacto por tonelada de residuos sólidos generados.
* **Interfaz de Resultados:** Un script captura las entradas numéricas del DOM, ejecuta el balance de materia y despliega dinámicamente un resumen en kilogramos y toneladas métricas (Ton CO2e) junto con el desglose por categorías.

---

## 5. Correcciones de UI/UX y Navegación

* **Navegación Interna Smooth Scroll:** Se habilitó `scroll-behavior: smooth` en el CSS global. La barra superior de navegación ahora cuenta con un enlace directo (`href="#carbon-calculator"`) que desliza la pantalla suavemente hacia la calculadora.
* **Aislamiento de CSS en Leaflet:** Se identificó que las reglas globales para las imágenes de las tarjetas (`.card img { width: 100% }`) estaban deformando los cuadrantes base (*tiles*) del mapa de OpenStreetMap. Se aplicó un bloque de aislamiento `#mapa-sensores img { max-width: none !important; }` para proteger la renderización del mapa.
* **Responsividad de Cabecera:** Se corrigió el choque visual del logotipo y el título en pantallas pequeñas, alineándolos en formato de columna vertical para mejorar la legibilidad móvil.

---

## 6. Flujo de Control de Versiones

Para consolidar todos los cambios realizados, el despliegue hacia el repositorio central se ejecutó mediante los siguientes pasos en la terminal de Git:

1. **Indexación:** `git add .` (para capturar las modificaciones en el HTML y la adición de las nuevas fotografías en la carpeta `assets`).
2. **Commit:** `git commit -m "feat: integración de mapa MQTT con geohash, galería de hardware y calculadora ISO 14064"`.
3. **Despliegue:** `git push origin main`.