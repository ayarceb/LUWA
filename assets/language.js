(() => {
  'use strict';

  const STORAGE_KEY = 'luwa-language';

  const es = {
    // Global navigation and site chrome
    'Home': 'Inicio',
    'About': 'Nosotros',
    'Services': 'Servicios',
    'Consultancy Services': 'Servicios de Consultoría',
    'Data & Methods': 'Datos y Métodos',
    'Sensing Network': 'Red de Sensores',
    'Contact': 'Contacto',
    'Carbon Calculator': 'Calculadora de Carbono',
    'Visits': 'Visitas',
    '☁️ Connect to Cloud': '☁️ Conectar a la Nube',
    '← Back to Home': '← Volver al Inicio',
    '© 2026 LUWA - Satellite Data & Environmental Monitoring': '© 2026 LUWA - Datos Satelitales y Monitoreo Ambiental',
    '© 2025 LUWA - Satellite Data & Environmental Monitoring': '© 2025 LUWA - Datos Satelitales y Monitoreo Ambiental',
    'Environmental Consultancy Services of LUWA Consultancy Group': 'Servicios de Consultoría Ambiental de LUWA Consultancy Group',

    // Page titles
    'LUWA Consulting: Environmental Consultancy Branch': 'LUWA Consulting: Área de Consultoría Ambiental',
    'About - LUWA Consulting': 'Nosotros - LUWA Consulting',
    'About LUWA Consulting': 'Acerca de LUWA Consulting',
    'Consultancy Services - LUWA Consulting': 'Servicios de Consultoría - LUWA Consulting',
    'Data & Methods - LUWA Consulting': 'Datos y Métodos - LUWA Consulting',
    'Contact - LUWA Consulting': 'Contacto - LUWA Consulting',
    'Contact LUWA Consulting': 'Contactar a LUWA Consulting',
    'Sensing Network & Dashboard - LUWA Consulting': 'Red de Sensores y Panel - LUWA Consulting',
    'Carbon Calculator - LUWA Consulting': 'Calculadora de Carbono - LUWA Consulting',
    'Visits - LUWA Consulting': 'Visitas - LUWA Consulting',
    'Authenticate - LUWA Cloud': 'Autenticación - LUWA Cloud',
    'Authenticate to LUWA Cloud': 'Autenticarse en LUWA Cloud',

    // Home
    'Satellite Observations': 'Observaciones Satelitales',
    'Explore our TROPOMI-based observations:': 'Explora nuestras observaciones basadas en TROPOMI:',
    'Visit the Satellite NL webpage database': 'Visitar la base de datos web Satellite NL',
    'Monitoring refineries, pig/chicken farms, emission estimation, plume transport and deposition impacts, air quality (NOx, NH3), and nitrogen impact.': 'Monitoreo de refinerías, granjas porcinas y avícolas, estimación de emisiones, transporte de plumas e impactos por deposición, calidad del aire (NOx, NH3) e impacto del nitrógeno.',
    'Low-Cost Sensor Networks + Data Assimilation Integrated Systems': 'Redes de Sensores de Bajo Costo + Sistemas Integrados de Asimilación de Datos',
    'Emission Estimation': 'Estimación de Emisiones',
    'Emission estimation combining data assimilation, satellite observations and cloud-based atmospheric chemistry-transport modelling.': 'Estimación de emisiones mediante la combinación de asimilación de datos, observaciones satelitales y modelación atmosférica de química y transporte en la nube.',
    'IMI System': 'Sistema IMI',
    'Enhance Monitoring with Data Assimilation Tools': 'Mejorar el Monitoreo con Herramientas de Asimilación de Datos',
    'Colombia Observations': 'Observaciones de Colombia',
    'Prior Emissions Colombia': 'Emisiones Previas de Colombia',
    'Visualization': 'Visualización',
    'Click thumbnail to watch the video.': 'Haz clic en la miniatura para ver el video.',
    'Gulf Observations': 'Observaciones del Golfo',
    'Integration of emission estimation using Data Assimilation and lightweight methods...': 'Integración de la estimación de emisiones mediante asimilación de datos y métodos ligeros...',
    'Calculate Simulation Domain & CPU Time': 'Calcular Dominio de Simulación y Tiempo de CPU',
    'Your browser does not support the video tag.': 'Tu navegador no admite la etiqueta de video.',

    // About
    'Specialist in satellite data processing and emission inversion methods. Focused on integrating high-resolution atmospheric data with advanced computational models.': 'Especialista en procesamiento de datos satelitales y métodos de inversión de emisiones. Enfocado en integrar datos atmosféricos de alta resolución con modelos computacionales avanzados.',
    'Expert in environmental consultancy and policy assessment. Dedicated to bridging scientific modeling and decision-making frameworks for sustainable management.': 'Experto en consultoría ambiental y evaluación de políticas. Dedicado a vincular la modelación científica con marcos de toma de decisiones para una gestión sostenible.',
    'Developer dedicated to the scientific study of environmental pollution.': 'Desarrollador dedicado al estudio científico de la contaminación ambiental.',
    'Scientific Advisor': 'Asesor Científico',
    'Atmospheric scientist specializing in atmospheric composition, air quality, climate interactions, and satellite observations.': 'Científico atmosférico especializado en composición atmosférica, calidad del aire, interacciones climáticas y observaciones satelitales.',
    'Systems Engineer focused on Backend and QA. I develop scalable, clean-code backend solutions, applying unit and manual tests to ensure stable, functional, and defect-free software in various types of projects.': 'Ingeniero de Sistemas enfocado en Backend y QA. Desarrollo soluciones backend escalables y con código limpio, aplicando pruebas unitarias y manuales para garantizar software estable, funcional y libre de defectos en distintos tipos de proyectos.',
    'About LUWA': 'Acerca de LUWA',
    'LUWA is an atmospheric intelligence platform that integrates numerical modeling, satellite observations, ground-based sensors, and cloud computing to generate information on air quality, emissions, and atmospheric dynamics. Its infrastructure enables on-demand atmospheric simulations and transforms complex scientific data into accessible products for public institutions, researchers, businesses, and communities.': 'LUWA es una plataforma de inteligencia atmosférica que integra modelación numérica, observaciones satelitales, sensores terrestres y computación en la nube para generar información sobre calidad del aire, emisiones y dinámica atmosférica. Su infraestructura permite realizar simulaciones atmosféricas bajo demanda y transformar datos científicos complejos en productos accesibles para instituciones públicas, investigadores, empresas y comunidades.',
    'Mission': 'Misión',
    'To democratize access to advanced atmospheric information to improve the understanding and management of air quality and emissions, especially in areas where monitoring infrastructure is limited. LUWA seeks to transform high-level scientific capabilities into operational tools that support public health, environmental management, research, and regional decision-making.': 'Democratizar el acceso a información atmosférica avanzada para mejorar la comprensión y la gestión de la calidad del aire y las emisiones, especialmente en áreas donde la infraestructura de monitoreo es limitada. LUWA busca transformar capacidades científicas de alto nivel en herramientas operativas que apoyen la salud pública, la gestión ambiental, la investigación y la toma de decisiones regionales.',
    "Learn more about LUWA's capabilities, services and areas of application.": 'Conoce más sobre las capacidades, servicios y áreas de aplicación de LUWA.',
    '↓ Download Brochure': '↓ Descargar Folleto',

    // Consultancy services
    'LUWA provides environmental consultancy services based on satellite observations, atmospheric modelling, emission estimation and decision-oriented air-quality analysis. The service focuses on industrial, agricultural and urban emission sources where spatial monitoring is needed to understand plume transport, deposition and exposure patterns.': 'LUWA ofrece servicios de consultoría ambiental basados en observaciones satelitales, modelación atmosférica, estimación de emisiones y análisis de calidad del aire orientado a la toma de decisiones. El servicio se enfoca en fuentes de emisión industriales, agrícolas y urbanas donde se requiere monitoreo espacial para comprender el transporte de plumas, la deposición y los patrones de exposición.',
    'Industrial Source Monitoring': 'Monitoreo de Fuentes Industriales',
    'Monitoring of refineries, power plants and large industrial facilities using satellite observations, meteorological information and atmospheric transport analysis.': 'Monitoreo de refinerías, centrales eléctricas y grandes instalaciones industriales mediante observaciones satelitales, información meteorológica y análisis del transporte atmosférico.',
    'Agricultural Emissions': 'Emisiones Agrícolas',
    'Assessment of emissions related to pig farms, chicken farms and nitrogen-intensive activities, with attention to NH': 'Evaluación de emisiones relacionadas con granjas porcinas, granjas avícolas y actividades intensivas en nitrógeno, con atención a NH',
    ', NOx and deposition impacts.': ', NOx e impactos por deposición.',
    'Plume Transport Analysis': 'Análisis del Transporte de Plumas',
    'Identification of pollution plumes, transport pathways and meteorological conditions controlling dispersion, accumulation and source influence.': 'Identificación de plumas de contaminación, trayectorias de transporte y condiciones meteorológicas que controlan la dispersión, acumulación e influencia de las fuentes.',
    'Air-Quality Impact Assessment': 'Evaluación del Impacto en la Calidad del Aire',
    'Evaluation of surface concentration patterns, nitrogen impacts and air-quality behaviour using integrated observational and modelling approaches.': 'Evaluación de patrones de concentración superficial, impactos del nitrógeno y comportamiento de la calidad del aire mediante enfoques integrados de observación y modelación.',
    'Sensor Networks': 'Redes de Sensores',
    'Design and interpretation of low-cost sensor networks supported by data assimilation and atmospheric modelling workflows.': 'Diseño e interpretación de redes de sensores de bajo costo apoyadas por asimilación de datos y flujos de trabajo de modelación atmosférica.',
    'Technical Reports': 'Informes Técnicos',
    'Preparation of technical reports, visual diagnostics and decision-support material for environmental management, permitting and policy discussions.': 'Preparación de informes técnicos, diagnósticos visuales y material de apoyo a la toma de decisiones para gestión ambiental, permisos y discusión de políticas.',

    // Contact
    'Send us a message': 'Envíanos un mensaje',
    'Name:': 'Nombre:',
    'Email:': 'Correo electrónico:',
    'Message:': 'Mensaje:',
    'Send Message': 'Enviar Mensaje',
    'Sending message...': 'Enviando mensaje...',
    '✅ Message sent successfully!': '✅ ¡Mensaje enviado correctamente!',

    // Sensing
    'Real-Time Sensor Network': 'Red de Sensores en Tiempo Real',
    'Interactive geospatial telemetry and live environmental monitoring, powered by LUWA.': 'Telemetría geoespacial interactiva y monitoreo ambiental en tiempo real, impulsados por LUWA.',
    'Loading telemetry...': 'Cargando telemetría...',
    'Current Value': 'Valor Actual',
    'Hardware Development & Facilities': 'Desarrollo de Hardware e Instalaciones',
    'Laboratory-Coupled Device': 'Dispositivo Acoplado al Laboratorio',
    'Testing setup in the battery laboratory and sensing device.': 'Configuración de pruebas en el laboratorio de baterías y dispositivo de sensado.',
    'Fully Assembled Device': 'Dispositivo Completamente Ensamblado',
    'Wall-mounted sensor node with protective cover.': 'Nodo sensor montado en pared con cubierta protectora.',
    'Internal Architecture': 'Arquitectura Interna',
    'PCB, microcontroller, and air quality sensors.': 'PCB, microcontrolador y sensores de calidad del aire.',
    'Field Assembly': 'Ensamblaje de Campo',
    'Final enclosure ready for field deployment.': 'Gabinete final listo para despliegue en campo.',

    // Carbon calculator
    'GHG Inventory Platform (ISO 14064)': 'Plataforma de Inventario de GEI (ISO 14064)',
    'Corporate tool for the parametric quantification of greenhouse gas emissions by operational scope.': 'Herramienta corporativa para la cuantificación paramétrica de emisiones de gases de efecto invernadero por alcance operativo.',
    'Scope 1: Direct Emissions': 'Alcance 1: Emisiones Directas',
    'Fleet Fuel (Gasoline - Liters):': 'Combustible de Flotilla (Gasolina - Litros):',
    'Stationary Combustion (Natural Gas - m³):': 'Combustión Estacionaria (Gas Natural - m³):',
    'Scope 2: Indirect Energy Emissions': 'Alcance 2: Emisiones Indirectas por Energía',
    'Grid Electricity Consumption (kWh):': 'Consumo de Electricidad de la Red (kWh):',
    'Includes emissions generated at power plants during the production of purchased electricity.': 'Incluye las emisiones generadas en las centrales eléctricas durante la producción de la electricidad adquirida.',
    'Scope 3: Value Chain Emissions': 'Alcance 3: Emisiones de la Cadena de Valor',
    'Solid Waste (Metric Tons):': 'Residuos Sólidos (Toneladas Métricas):',
    'Business Travel (Flight Hours):': 'Viajes de Negocios (Horas de Vuelo):',
    'Calculate Emissions Inventory': 'Calcular Inventario de Emisiones',
    'Total CO₂-Equivalent Emissions': 'Emisiones Totales Equivalentes de CO₂',
    '0 kg CO₂e calculated': '0 kg CO₂e calculados',
    'Scope 1 (Direct)': 'Alcance 1 (Directas)',
    'Scope 2 (Electricity)': 'Alcance 2 (Electricidad)',
    'Scope 3 (Indirect)': 'Alcance 3 (Indirectas)',


    // Visits / privacy-friendly public-IP preview
    'LUWA Visit Map': 'Mapa de Visitas de LUWA',
    'Approximate visitor locations': 'Ubicaciones aproximadas de visitantes',
    'This page uses public IP geolocation to estimate city and country. In this static version, history is stored only in this browser.': 'Esta página usa geolocalización pública por IP para estimar ciudad y país. En esta versión estática, el historial se guarda únicamente en este navegador.',
    'Period': 'Periodo',
    'Last 24 hours': 'Últimas 24 horas',
    'Last 7 days': 'Últimos 7 días',
    'Last 30 days': 'Últimos 30 días',
    'All local history': 'Todo el historial local',
    'Visits on this browser': 'Visitas en este navegador',
    'Countries': 'Países',
    'Cities': 'Ciudades',
    'Last activity': 'Última actividad',
    'Approximate locations recorded by this browser': 'Ubicaciones aproximadas registradas por este navegador',
    'Point size represents the number of locally recorded visits.': 'El tamaño del punto representa el número de visitas registradas localmente.',
    'Top countries': 'Principales países',
    'Top cities': 'Principales ciudades',
    'Privacy by design.': 'Privacidad desde el diseño.',
    'No GPS permission is requested. The page uses approximate IP geolocation and stores only city, country, coarse coordinates, count and time in this browser. The IP address itself is not stored by LUWA.': 'No se solicita permiso de GPS. La página usa geolocalización aproximada por IP y guarda únicamente ciudad, país, coordenadas aproximadas, conteo y fecha en este navegador. LUWA no almacena la dirección IP.',
    'Location detected': 'Ubicación detectada',
    'Location service unavailable': 'Servicio de ubicación no disponible',
    'Local-only analytics': 'Analítica solo local',
    'Global aggregation requires a shared analytics service.': 'La agregación global requiere un servicio de analítica compartido.',

    // Authentication
    'Sign in': 'Iniciar sesión',
    'Username': 'Usuario',
    'Password': 'Contraseña',
    'Connect': 'Conectar',
    'Authenticated. Redirecting…': 'Autenticado. Redirigiendo…',
    'Authentication failed. Check credentials.': 'Falló la autenticación. Verifica las credenciales.',
    'This signs in to the LUWA Cloud API. After success, the session token is stored in your browser for subsequent calls.': 'Esto inicia sesión en la API de LUWA Cloud. Tras una autenticación exitosa, el token de sesión se almacena en tu navegador para las llamadas posteriores.',

    // Data & Methods - overview and workflow
    'LUWA integrates satellite observations, atmospheric transport modelling and lightweight emission-estimation methods. The workflow combines TROPOMI-based products, meteorological data, data assimilation and LOTOS-EUROS simulations to support source-level environmental analysis.': 'LUWA integra observaciones satelitales, modelación del transporte atmosférico y métodos ligeros de estimación de emisiones. El flujo de trabajo combina productos basados en TROPOMI, datos meteorológicos, asimilación de datos y simulaciones LOTOS-EUROS para apoyar el análisis ambiental a nivel de fuente.',
    'Data Assimilation': 'Asimilación de Datos',
    'Integration of observations and model outputs to improve the representation of atmospheric composition, transport and source influence.': 'Integración de observaciones y resultados del modelo para mejorar la representación de la composición atmosférica, el transporte y la influencia de las fuentes.',
    'Use of satellite products, including TROPOMI-based observations, to detect spatial patterns of NO': 'Uso de productos satelitales, incluidas observaciones basadas en TROPOMI, para detectar patrones espaciales de NO',
    'and related atmospheric signals.': 'y señales atmosféricas relacionadas.',
    'Application of lightweight methods and inverse-modelling concepts to estimate emissions from point sources, industrial areas and agricultural systems.': 'Aplicación de métodos ligeros y conceptos de modelación inversa para estimar emisiones de fuentes puntuales, zonas industriales y sistemas agrícolas.',
    'Cloud-based Atmospheric Modelling': 'Modelación Atmosférica en la Nube',
    'Atmospheric chemistry-transport simulations deployed in cloud infrastructure for controlled environmental scenarios.': 'Simulaciones de química y transporte atmosférico desplegadas en infraestructura de nube para escenarios ambientales controlados.',
    'Plume Diagnostics': 'Diagnóstico de Plumas',
    'Analysis of plume direction, dispersion, source attribution and meteorological drivers using satellite data and wind fields.': 'Análisis de la dirección y dispersión de plumas, atribución de fuentes y forzantes meteorológicos mediante datos satelitales y campos de viento.',
    'Computational Planning': 'Planificación Computacional',
    'Configuration of simulation domain size, grid resolution, simulation period and output cadence for cloud-based atmospheric modelling experiments.': 'Configuración del tamaño del dominio de simulación, resolución de malla, periodo de simulación y frecuencia de salida para experimentos de modelación atmosférica en la nube.',
    'Configure Simulation Domain': 'Configurar Dominio de Simulación',
    'View LOTOS-EUROS input-output table': 'Ver tabla de entrada-salida de LOTOS-EUROS',
    'LOTOS-EUROS simulation: input → output table': 'Simulación LOTOS-EUROS: tabla de entrada → salida',
    'This section explains the simulation workflow from the client request to the delivered products.': 'Esta sección explica el flujo de simulación desde la solicitud del cliente hasta los productos entregados.',
    'What it means for Humath': 'Qué significa para Humath',
    'Domain selection': 'Selección del dominio',
    'Resolution and period': 'Resolución y periodo',
    'Species of interest': 'Especies de interés',
    'Output type and launch': 'Tipo de salida y lanzamiento',
    '1. What Humath configures': '1. Qué configura Humath',
    '2. LOTOS-EUROS input': '2. Entrada de LOTOS-EUROS',
    '3. LOTOS-EUROS output': '3. Salida de LOTOS-EUROS',
    'Europe / MACC domain': 'Dominio Europa / MACC',
    'Mexico pilot box': 'Caja piloto de México',
    'Simulation window:': 'Ventana de simulación:',
    'Preset:': 'Preajuste:',
    'Bounds:': 'Límites:',
    'Preset grid:': 'Malla predefinida:',
    'Configurable output resolution:': 'Resolución de salida configurable:',
    'Output cadence:': 'Frecuencia de salida:',
    'How to read this table:': 'Cómo leer esta tabla:',
    'Simulation component': 'Componente de simulación',
    'LOTOS-EUROS input': 'Entrada de LOTOS-EUROS',
    'Native input resolution / variability': 'Resolución nativa de entrada / variabilidad',
    'Reference URL / where to check': 'URL de referencia / dónde verificar',
    'LOTOS-EUROS output': 'Salida de LOTOS-EUROS',
    'Humath request / use': 'Solicitud / uso de Humath',
    'Run configuration': 'Configuración de la corrida',
    'Meteorology': 'Meteorología',
    'Technical role': 'Función técnica',
    'Derived meteorology': 'Meteorología derivada',
    'Derived fields': 'Campos derivados',
    'Physical diagnostics': 'Diagnósticos físicos',
    'Boundary and initial conditions': 'Condiciones de frontera e iniciales',
    'Boundary meaning': 'Significado de las condiciones de frontera',
    'Background concentration fields': 'Campos de concentración de fondo',
    'Anthropogenic emissions': 'Emisiones antropogénicas',
    'Human-source emissions': 'Emisiones de origen humano',
    'Technical mapping': 'Mapeo técnico',
    'Land cover, topography and surface': 'Cobertura del suelo, topografía y superficie',
    'Proper land-use names': 'Nombres de uso del suelo',
    'Surface parameter fields': 'Campos de parámetros de superficie',
    'Biogenic emissions': 'Emisiones biogénicas',
    'Proper module names': 'Nombres de módulos',
    'Natural aerosol and soil sources': 'Fuentes naturales de aerosoles y suelo',
    'Proper formulation names': 'Nombres de formulaciones',
    'Fire emissions': 'Emisiones de incendios',
    'Fire variables': 'Variables de incendios',
    'Chemistry and aerosols': 'Química y aerosoles',
    'Model species': 'Especies del modelo',
    'Concentration maps and time series': 'Mapas de concentración y series temporales',
    'Deposition and removal': 'Deposición y remoción',
    'Wet-removal names': 'Procesos de remoción húmeda',
    'Dry deposition, wet deposition and atmospheric loss fields': 'Campos de deposición seca, deposición húmeda y pérdida atmosférica',
    'Delivery layer': 'Capa de entrega',
    'Completed LOTOS-EUROS outputs': 'Resultados completados de LOTOS-EUROS',
    'Run QA/QC': 'QA/QC de la corrida',
    'Run-control report': 'Informe de control de la corrida',
    'Output principle:': 'Principio de salida:',
    'Items to configure before production launch:': 'Elementos a configurar antes del lanzamiento en producción:',
    'Scientific reference:': 'Referencia científica:'
  };

  const nl = {

    // Global navigation and site chrome
    'Home': 'Home',
    'About': 'Over ons',
    'Services': 'Diensten',
    'Consultancy Services': 'Adviesdiensten',
    'Data & Methods': 'Data & Methoden',
    'Sensing Network': 'Sensornetwerk',
    'Contact': 'Contact',
    'Carbon Calculator': 'CO₂-calculator',
    'Visits': 'Bezoeken',
    '☁️ Connect to Cloud': '☁️ Verbinden met Cloud',
    '← Back to Home': '← Terug naar Home',
    '© 2026 LUWA - Satellite Data & Environmental Monitoring': '© 2026 LUWA - Satellietdata & Milieumonitoring',
    '© 2025 LUWA - Satellite Data & Environmental Monitoring': '© 2025 LUWA - Satellietdata & Milieumonitoring',
    'Environmental Consultancy Services of LUWA Consultancy Group': 'Milieuadviesdiensten van LUWA Consultancy Group',

    // Page titles
    'LUWA Consulting: Environmental Consultancy Branch': 'LUWA Consulting: Afdeling Milieuadvies',
    'About - LUWA Consulting': 'Over ons - LUWA Consulting',
    'About LUWA Consulting': 'Over LUWA Consulting',
    'Consultancy Services - LUWA Consulting': 'Adviesdiensten - LUWA Consulting',
    'Data & Methods - LUWA Consulting': 'Data & Methoden - LUWA Consulting',
    'Contact - LUWA Consulting': 'Contact - LUWA Consulting',
    'Contact LUWA Consulting': 'Contact opnemen met LUWA Consulting',
    'Sensing Network & Dashboard - LUWA Consulting': 'Sensornetwerk & Dashboard - LUWA Consulting',
    'Carbon Calculator - LUWA Consulting': 'CO₂-calculator - LUWA Consulting',
    'Visits - LUWA Consulting': 'Bezoeken - LUWA Consulting',
    'Authenticate - LUWA Cloud': 'Inloggen - LUWA Cloud',
    'Authenticate to LUWA Cloud': 'Inloggen bij LUWA Cloud',

    // Home
    'Satellite Observations': 'Satellietwaarnemingen',
    'Explore our TROPOMI-based observations:': 'Ontdek onze op TROPOMI gebaseerde waarnemingen:',
    'Visit the Satellite NL webpage database': 'Bezoek de Satellite NL-webpagina database',
    'Monitoring refineries, pig/chicken farms, emission estimation, plume transport and deposition impacts, air quality (NOx, NH3), and nitrogen impact.': 'Monitoring van raffinaderijen, varkens-/pluimveehouderijen, emissieschatting, pluimtransport en depositie-impact, luchtkwaliteit (NOx, NH3) en stikstofimpact.',
    'Low-Cost Sensor Networks + Data Assimilation Integrated Systems': 'Lowcost sensornetwerken + geïntegreerde data-assimilatiesystemen',
    'Emission Estimation': 'Emissieschatting',
    'Emission estimation combining data assimilation, satellite observations and cloud-based atmospheric chemistry-transport modelling.': 'Emissieschatting door combinatie van data-assimilatie, satellietwaarnemingen en cloudgebaseerde atmosferische chemie-transportmodellering.',
    'IMI System': 'IMI-systeem',
    'Enhance Monitoring with Data Assimilation Tools': 'Verbeter monitoring met data-assimilatietools',
    'Colombia Observations': 'Waarnemingen Colombia',
    'Prior Emissions Colombia': 'Prior-emissies Colombia',
    'Visualization': 'Visualisatie',
    'Click thumbnail to watch the video.': 'Klik op de miniatuur om de video te bekijken.',
    'Gulf Observations': 'Waarnemingen van de Golf',
    'Integration of emission estimation using Data Assimilation and lightweight methods...': 'Integratie van emissieschatting met data-assimilatie en lichtgewicht methoden...',
    'Calculate Simulation Domain & CPU Time': 'Bereken simulatiedomein & CPU-tijd',
    'Your browser does not support the video tag.': 'Uw browser ondersteunt de videotag niet.',

    // About
    'Specialist in satellite data processing and emission inversion methods. Focused on integrating high-resolution atmospheric data with advanced computational models.': 'Specialist in satellietgegevensverwerking en emissie-inversiemethoden. Gericht op de integratie van atmosferische data met hoge resolutie in geavanceerde rekenmodellen.',
    'Expert in environmental consultancy and policy assessment. Dedicated to bridging scientific modeling and decision-making frameworks for sustainable management.': 'Expert in milieuadvies en beleidsevaluatie. Toegewijd aan het overbruggen van wetenschappelijke modellering en besluitvormingskaders voor duurzaam beheer.',
    'Developer dedicated to the scientific study of environmental pollution.': 'Ontwikkelaar toegewijd aan het wetenschappelijk onderzoek naar milieuvervuiling.',
    'Scientific Advisor': 'Wetenschappelijk Adviseur',
    'Atmospheric scientist specializing in atmospheric composition, air quality, climate interactions, and satellite observations.': 'Atmosferisch wetenschapper gespecialiseerd in atmosferische samenstelling, luchtkwaliteit, klimaatinteracties en satellietwaarnemingen.',
    'Systems Engineer focused on Backend and QA. I develop scalable, clean-code backend solutions, applying unit and manual tests to ensure stable, functional, and defect-free software in various types of projects.': 'Systeemingenieur gericht op backend en QA. Ik ontwikkel schaalbare backend-oplossingen met schone code en pas unit- en handmatige tests toe om stabiele, functionele en foutloze software te garanderen.',
    'About LUWA': 'Over LUWA',
    'LUWA is an atmospheric intelligence platform that integrates numerical modeling, satellite observations, ground-based sensors, and cloud computing to generate information on air quality, emissions, and atmospheric dynamics. Its infrastructure enables on-demand atmospheric simulations and transforms complex scientific data into accessible products for public institutions, researchers, businesses, and communities.': 'LUWA is een platform voor atmosferische intelligentie dat numerieke modellering, satellietwaarnemingen, grondsensoren en cloudcomputing integreert om informatie te genereren over luchtkwaliteit, emissies en atmosferische dynamiek. De infrastructuur maakt atmosferische simulaties op aanvraag mogelijk en zet complexe wetenschappelijke data om in toegankelijke producten voor overheidsinstanties, onderzoekers, bedrijven en gemeenschappen.',
    'Mission': 'Missie',
    'To democratize access to advanced atmospheric information to improve the understanding and management of air quality and emissions, especially in areas where monitoring infrastructure is limited. LUWA seeks to transform high-level scientific capabilities into operational tools that support public health, environmental management, research, and regional decision-making.': 'Het democratiseren van de toegang tot geavanceerde atmosferische informatie om het begrip en beheer van luchtkwaliteit en emissies te verbeteren, vooral in gebieden met beperkte monitoringinfrastructuur. LUWA streeft ernaar hoogwaardige wetenschappelijke capaciteiten om te zetten in operationele hulpmiddelen ter ondersteuning van volksgezondheid, milieubeheer, onderzoek en regionale besluitvorming.',
    'Learn more about LUWA\'s capabilities, services and areas of application.': 'Ontdek meer over de capaciteiten, diensten en toepassingsgebieden van LUWA.',
    '↓ Download Brochure': '↓ Brochure downloaden',

    // Consultancy services
    'LUWA provides environmental consultancy services based on satellite observations, atmospheric modelling, emission estimation and decision-oriented air-quality analysis. The service focuses on industrial, agricultural and urban emission sources where spatial monitoring is needed to understand plume transport, deposition and exposure patterns.': 'LUWA levert milieuadviesdiensten op basis van satellietwaarnemingen, atmosferische modellering, emissieschatting en besluitvormingsgerichte luchtkwaliteitsanalyses. De dienst richt zich op industriële, agrarische en stedelijke emissiebronnen waar ruimtelijke monitoring nodig is om pluimtransport, depositie en blootstellingspatronen te begrijpen.',
    'Industrial Source Monitoring': 'Monitoring van Industriële Bronnen',
    'Monitoring of refineries, power plants and large industrial facilities using satellite observations, meteorological information and atmospheric transport analysis.': 'Monitoring van raffinaderijen, energiecentrales en grote industriële installaties met behulp van satellietwaarnemingen, meteorologische informatie en atmosferische transportanalyse.',
    'Agricultural Emissions': 'Landbouwemissies',
    'Assessment of emissions related to pig farms, chicken farms and nitrogen-intensive activities, with attention to NH': 'Beoordeling van emissies gerelateerd aan varkenshouderijen, pluimveehouderijen en stikstofintensieve activiteiten, met aandacht voor NH',
    ', NOx and deposition impacts.': ', NOx en depositie-impact.',
    'Plume Transport Analysis': 'Pluimtransportanalyse',
    'Identification of pollution plumes, transport pathways and meteorological conditions controlling dispersion, accumulation and source influence.': 'Identificatie van verontreinigingspluimen, transporttrajecten en meteorologische omstandigheden die verspreiding, accumulatie en broninvloed bepalen.',
    'Air-Quality Impact Assessment': 'Luchtkwaliteitseffectbeoordeling',
    'Evaluation of surface concentration patterns, nitrogen impacts and air-quality behaviour using integrated observational and modelling approaches.': 'Evaluatie van concentratiepatronen aan het oppervlak, stikstofeffecten en luchtkwaliteitsgedrag met behulp van geïntegreerde observatie- en modelleringsbenaderingen.',
    'Sensor Networks': 'Sensornetwerken',
    'Design and interpretation of low-cost sensor networks supported by data assimilation and atmospheric modelling workflows.': 'Ontwerp en interpretatie van lowcost sensornetwerken ondersteund door data-assimilatie en atmosferische modelleringsworkflows.',
    'Technical Reports': 'Technische Rapporten',
    'Preparation of technical reports, visual diagnostics and decision-support material for environmental management, permitting and policy discussions.': 'Opstellen van technische rapporten, visuele diagnostiek en besluitvormingsondersteunend materiaal voor milieubeheer, vergunningverlening en beleidsdiscussies.',

    // Contact
    'Send us a message': 'Stuur ons een bericht',
    'Name:': 'Naam:',
    'Email:': 'E-mailadres:',
    'Message:': 'Bericht:',
    'Send Message': 'Bericht verzenden',
    'Sending message...': 'Bericht wordt verzonden...',
    '✅ Message sent successfully!': '✅ Bericht succesvol verzonden!',

    // Sensing
    'Real-Time Sensor Network': 'Realtime Sensornetwerk',
    'Interactive geospatial telemetry and live environmental monitoring, powered by LUWA.': 'Interactieve geospatiale telemetrie en live milieumonitoring, aangedreven door LUWA.',
    'Loading telemetry...': 'Telemetrie laden...',
    'Current Value': 'Huidige waarde',
    'Hardware Development & Facilities': 'Hardware-ontwikkeling & Faciliteiten',
    'Laboratory-Coupled Device': 'Laboratoriumgekoppeld Apparaat',
    'Testing setup in the battery laboratory and sensing device.': 'Testopstelling in het batterijlaboratorium en meetapparaat.',
    'Fully Assembled Device': 'Volledig Geassembleerd Apparaat',
    'Wall-mounted sensor node with protective cover.': 'Wandgemonteerde sensornode met beschermkap.',
    'Internal Architecture': 'Interne Architectuur',
    'PCB, microcontroller, and air quality sensors.': 'Printplaat, microcontroller en luchtkwaliteitssensoren.',
    'Field Assembly': 'Veldmontage',
    'Final enclosure ready for field deployment.': 'Definitieve behuizing gereed voor plaatsing in het veld.',

    // Carbon calculator
    'GHG Inventory Platform (ISO 14064)': 'BKG-inventarisatieplatform (ISO 14064)',
    'Corporate tool for the parametric quantification of greenhouse gas emissions by operational scope.': 'Zakelijke tool voor de parametrische kwantificering van broeikasgasemissies per operationele scope.',
    'Scope 1: Direct Emissions': 'Scope 1: Directe Emissies',
    'Fleet Fuel (Gasoline - Liters):': 'Wagenparkbrandstof (Benzine - Liters):',
    'Stationary Combustion (Natural Gas - m³):': 'Stationaire Verbranding (Aardgas - m³):',
    'Scope 2: Indirect Energy Emissions': 'Scope 2: Indirecte Energie-emissies',
    'Grid Electricity Consumption (kWh):': 'Elektriciteitsverbruik van het Net (kWh):',
    'Includes emissions generated at power plants during the production of purchased electricity.': 'Omvat emissies gegenereerd door elektriciteitscentrales tijdens de productie van aangekochte elektriciteit.',
    'Scope 3: Value Chain Emissions': 'Scope 3: Waardeketenemissies',
    'Solid Waste (Metric Tons):': 'Vast Afval (Metrische Ton):',
    'Business Travel (Flight Hours):': 'Zakenreizen (Vlieguren):',
    'Calculate Emissions Inventory': 'Emissie-inventaris berekenen',
    'Total CO₂-Equivalent Emissions': 'Totale CO₂-equivalente emissies',
    '0 kg CO₂e calculated': '0 kg CO₂e berekend',
    'Scope 1 (Direct)': 'Scope 1 (Direct)',
    'Scope 2 (Electricity)': 'Scope 2 (Elektriciteit)',
    'Scope 3 (Indirect)': 'Scope 3 (Indirect)',


    // Visits / privacy-friendly public-IP preview
    'LUWA Visit Map': 'LUWA Bezoekerskaart',
    'Approximate visitor locations': 'Geschatte bezoekerslocaties',
    'This page uses public IP geolocation to estimate city and country. In this static version, history is stored only in this browser.': 'Deze pagina gebruikt openbare IP-geolocatie om stad en land te schatten. In deze statische versie wordt de geschiedenis alleen in deze browser opgeslagen.',
    'Period': 'Periode',
    'Last 24 hours': 'Afgelopen 24 uur',
    'Last 7 days': 'Afgelopen 7 dagen',
    'Last 30 days': 'Afgelopen 30 dagen',
    'All local history': 'Alle lokale geschiedenis',
    'Visits on this browser': 'Bezoeken op deze browser',
    'Countries': 'Landen',
    'Cities': 'Steden',
    'Last activity': 'Laatste activiteit',
    'Approximate locations recorded by this browser': 'Geschatte locaties vastgelegd door deze browser',
    'Point size represents the number of locally recorded visits.': 'Puntgrootte vertegenwoordigt het aantal lokaal geregistreerde bezoeken.',
    'Top countries': 'Belangrijkste landen',
    'Top cities': 'Belangrijkste steden',
    'Privacy by design.': 'Privacy by design.',
    'No GPS permission is requested. The page uses approximate IP geolocation and stores only city, country, coarse coordinates, count and time in this browser. The IP address itself is not stored by LUWA.': 'Er wordt geen gps-toestemming gevraagd. De pagina gebruikt globale IP-geolocatie en slaat alleen stad, land, globale coördinaten, aantal en tijd op in deze browser. Het IP-adres zelf wordt niet door LUWA opgeslagen.',
    'Location detected': 'Locatie gedetecteerd',
    'Location service unavailable': 'Locatiedienst niet beschikbaar',
    'Local-only analytics': 'Alleen lokale statistieken',
    'Global aggregation requires a shared analytics service.': 'Wereldwijde aggregatie vereist een gedeelde analysedienst.',

    // Authentication
    'Sign in': 'Inloggen',
    'Username': 'Gebruikersnaam',
    'Password': 'Wachtwoord',
    'Connect': 'Verbinden',
    'Authenticated. Redirecting…': 'Geauthenticeerd. Doorsturen…',
    'Authentication failed. Check credentials.': 'Authenticatie mislukt. Controleer inloggegevens.',
    'This signs in to the LUWA Cloud API. After success, the session token is stored in your browser for subsequent calls.': 'Hiermee logt u in op de LUWA Cloud API. Na succes wordt het sessietoken in uw browser opgeslagen voor volgende verzoeken.',

    // Data & Methods - overview and workflow
    'LUWA integrates satellite observations, atmospheric transport modelling and lightweight emission-estimation methods. The workflow combines TROPOMI-based products, meteorological data, data assimilation and LOTOS-EUROS simulations to support source-level environmental analysis.': 'LUWA integreert satellietwaarnemingen, atmosferische transportmodellering en lichtgewicht emissieschattingsmethoden. De workflow combineert op TROPOMI gebaseerde producten, meteorologische data, data-assimilatie en LOTOS-EUROS-simulaties om milieuanalyses op bronniveau te ondersteunen.',
    'Data Assimilation': 'Data-assimilatie',
    'Integration of observations and model outputs to improve the representation of atmospheric composition, transport and source influence.': 'Integratie van waarnemingen en modelresultaten om de weergave van atmosferische samenstelling, transport en broninvloed te verbeteren.',
    'Use of satellite products, including TROPOMI-based observations, to detect spatial patterns of NO': 'Gebruik van satellietproducten, inclusief op TROPOMI gebaseerde waarnemingen, om ruimtelijke patronen van NO te detecteren',
    'and related atmospheric signals.': 'en gerelateerde atmosferische signalen.',
    'Application of lightweight methods and inverse-modelling concepts to estimate emissions from point sources, industrial areas and agricultural systems.': 'Toepassing van lichtgewicht methoden en inverse modelleringsconcepten om emissies van puntbronnen, industrieterreinen en landbouwsystemen te schatten.',
    'Cloud-based Atmospheric Modelling': 'Cloudgebaseerde Atmosferische Modellering',
    'Atmospheric chemistry-transport simulations deployed in cloud infrastructure for controlled environmental scenarios.': 'Atmosferische chemie-transportsimulaties ingezet op cloudinfrastructuur voor gecontroleerde milieuscenario\'s.',
    'Plume Diagnostics': 'Pluimdiagnostiek',
    'Analysis of plume direction, dispersion, source attribution and meteorological drivers using satellite data and wind fields.': 'Analyse van pluimrichting, dispersie, brontoewijzing en meteorologische drijfveren met behulp van satellietdata en windvelden.',
    'Computational Planning': 'Rekenplanning',
    'Configuration of simulation domain size, grid resolution, simulation period and output cadence for cloud-based atmospheric modelling experiments.': 'Configuratie van simulatiedomeingrootte, roosterresolutie, simulatieperiode en uitvoerfrequentie voor cloudgebaseerde atmosferische modelleringsexperimenten.',
    'Configure Simulation Domain': 'Simulatiedomein configureren',
    'View LOTOS-EUROS input-output table': 'Bekijk LOTOS-EUROS invoer-uitvoertabel',
    'LOTOS-EUROS simulation: input → output table': 'LOTOS-EUROS simulatie: invoer → uitvoertabel',
    'This section explains the simulation workflow from the client request to the delivered products.': 'In dit gedeelte wordt de simulatieworkflow uitgelegd, van de klantvraag tot de geleverde producten.',
    'What it means for Humath': 'Wat het betekent voor Humath',
    'Domain selection': 'Domeinselectie',
    'Resolution and period': 'Resolutie en periode',
    'Species of interest': 'Relevante stoffen',
    'Output type and launch': 'Uitvoertype en start',
    '1. What Humath configures': '1. Wat Humath configureert',
    '2. LOTOS-EUROS input': '2. LOTOS-EUROS invoer',
    '3. LOTOS-EUROS output': '3. LOTOS-EUROS uitvoer',
    'Europe / MACC domain': 'Europa / MACC-domein',
    'Mexico pilot box': 'Mexico-pilotgebied',
    'Simulation window:': 'Simulatievenster:',
    'Preset:': 'Voorinstelling:',
    'Bounds:': 'Grenzen:',
    'Preset grid:': 'Voorgedefinieerd rooster:',
    'Configurable output resolution:': 'Configureerbare uitvoerresolutie:',
    'Output cadence:': 'Uitvoerfrequentie:',
    'How to read this table:': 'Hoe deze tabel te lezen:',
    'Simulation component': 'Simulatiecomponent',
    'LOTOS-EUROS input': 'LOTOS-EUROS invoer',
    'Native input resolution / variability': 'Oorspronkelijke invoerresolutie / variabiliteit',
    'Reference URL / where to check': 'Referentie-URL / waar te controleren',
    'LOTOS-EUROS output': 'LOTOS-EUROS uitvoer',
    'Humath request / use': 'Humath-verzoek / gebruik',
    'Run configuration': 'Run-configuratie',
    'Meteorology': 'Meteorologie',
    'Technical role': 'Technische rol',
    'Derived meteorology': 'Afgeleide meteorologie',
    'Derived fields': 'Afgeleide velden',
    'Physical diagnostics': 'Fysische diagnostiek',
    'Boundary and initial conditions': 'Rand- en beginvoorwaarden',
    'Boundary meaning': 'Betekenis van randvoorwaarden',
    'Background concentration fields': 'Achtergrondconcentratievelden',
    'Anthropogenic emissions': 'Antropogene emissies',
    'Human-source emissions': 'Emissies van menselijke oorsprong',
    'Technical mapping': 'Technische koppeling',
    'Land cover, topography and surface': 'Landbedekking, topografie en oppervlak',
    'Proper land-use names': 'Officiële landgebruiknamen',
    'Surface parameter fields': 'Oppervlakteparameterelden',
    'Biogenic emissions': 'Biogene emissies',
    'Proper module names': 'Officiële modulonamen',
    'Natural aerosol and soil sources': 'Natuurlijke aerosol- en bodembronnen',
    'Proper formulation names': 'Officiële formuleringnamen',
    'Fire emissions': 'Brandemissies',
    'Fire variables': 'Brandvariabelen',
    'Chemistry and aerosols': 'Chemie en aerosolen',
    'Model species': 'Modelstoffen',
    'Concentration maps and time series': 'Concentratiekaarten en tijdreeksen',
    'Deposition and removal': 'Depositie en verwijdering',
    'Wet-removal names': 'Natte verwijderingsprocessen',
    'Dry deposition, wet deposition and atmospheric loss fields': 'Droge depositie, natte depositie en atmosferische verliesvelden',
    'Delivery layer': 'Opleveringslaag',
    'Completed LOTOS-EUROS outputs': 'Voltooide LOTOS-EUROS resultaten',
    'Run QA/QC': 'Run QA/QC',
    'Run-control report': 'Run-control rapport',
    'Output principle:': 'Uitgangspunt voor uitvoer:',
    'Items to configure before production launch:': 'Onderdelen te configureren vóór productiestart:',
    'Scientific reference:': 'Wetenschappelijke referentie:',
  };

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const reverse = {
    ...Object.fromEntries(Object.entries(es).map(([en, spa]) => [normalize(spa), en])),
    ...Object.fromEntries(Object.entries(nl).map(([en, dut]) => [normalize(dut), en]))
  };
  const originals = new WeakMap();

  function getSavedLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'nl') return saved;
    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('nl')) return 'nl';
    if (browserLang.startsWith('es')) return 'es';
    return 'en';
  }

  function translateTextValue(value, lang) {
    const trimmed = normalize(value);
    if (!trimmed) return value;

    if (lang === 'es') {
      if (es[trimmed]) return preserveWhitespace(value, es[trimmed]);
      const dynamicKg = trimmed.match(/^([\d.,]+) kg CO₂e (?:calculated|calculados|berekend)$/i);
      if (dynamicKg) return preserveWhitespace(value, `${dynamicKg[1]} kg CO₂e calculados`);
      return value;
    }

    if (lang === 'nl') {
      if (nl[trimmed]) return preserveWhitespace(value, nl[trimmed]);
      const dynamicKg = trimmed.match(/^([\d.,]+) kg CO₂e (?:calculated|calculados|berekend)$/i);
      if (dynamicKg) return preserveWhitespace(value, `${dynamicKg[1]} kg CO₂e berekend`);
      return value;
    }

    if (reverse[trimmed]) return preserveWhitespace(value, reverse[trimmed]);
    const dynamicKgEn = trimmed.match(/^([\d.,]+) kg CO₂e (?:calculated|calculados|berekend)$/i);
    if (dynamicKgEn) return preserveWhitespace(value, `${dynamicKgEn[1]} kg CO₂e calculated`);
    return value;
  }

  function preserveWhitespace(original, translated) {
    const start = (original.match(/^\s*/) || [''])[0];
    const end = (original.match(/\s*$/) || [''])[0];
    return start + translated + end;
  }

  function translateNode(node, lang) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (!node.parentElement || node.parentElement.closest('script, style, code, pre')) return;

    if (!originals.has(node)) {
      const current = normalize(node.nodeValue);
      const english = reverse[current] || current;
      originals.set(node, { raw: node.nodeValue, english });
    }

    const meta = originals.get(node);
    if (!meta || !meta.english) return;
    const target = lang === 'es' ? (es[meta.english] || meta.english)
                 : lang === 'nl' ? (nl[meta.english] || meta.english)
                 : meta.english;
    const nextValue = preserveWhitespace(meta.raw, target);
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  }

  function translateAttributes(root, lang) {
    root.querySelectorAll('[placeholder], [title], [aria-label]').forEach((el) => {
      ['placeholder', 'title', 'aria-label'].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        const store = `luwaI18n${attr.replace(/(^.|-.)/g, x => x.replace('-', '').toUpperCase())}`;
        if (!el.dataset[store]) {
          const current = normalize(el.getAttribute(attr));
          el.dataset[store] = reverse[current] || current;
        }
        const english = el.dataset[store];
        const target = lang === 'es' ? (es[english] || english)
                     : lang === 'nl' ? (nl[english] || english)
                     : english;
        el.setAttribute(attr, target);
      });
    });
  }

  function walkAndTranslate(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateNode(node, lang));
    translateAttributes(root, lang);
    document.documentElement.lang = lang;
    // Keep the Visits navigation label synchronized on every LUWA page.
    document.querySelectorAll('a[href="visits.html"]').forEach(link => {
      link.textContent = lang === 'es' ? 'Visitas' : lang === 'nl' ? 'Bezoeken' : 'Visits';
    });
    updateSwitcher(lang);
  }

  function switchLanguage(lang) {
    if (lang !== 'en' && lang !== 'es' && lang !== 'nl') return;
    localStorage.setItem(STORAGE_KEY, lang);
    walkAndTranslate(document.body, lang);
    document.title = translateTextValue(document.title, lang).trim();
    window.dispatchEvent(new CustomEvent('luwa:languagechange', { detail: { language: lang } }));
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('.luwa-language-switcher button').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function addStyles() {
    if (document.getElementById('luwa-language-styles')) return;
    const style = document.createElement('style');
    style.id = 'luwa-language-styles';
    style.textContent = `
      /* Stable LUWA navigation: identical positions on every main page */
      nav.luwa-main-nav {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 0 !important;
      }
      nav.luwa-main-nav > a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 4px 6px !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
      }
      nav.luwa-main-nav > a:hover,
      nav.luwa-main-nav > a.active {
        font-weight: 600 !important;
      }
      nav.luwa-main-nav > a:nth-of-type(1) { width: 68px; }
      nav.luwa-main-nav > a:nth-of-type(2) { width: 78px; }
      nav.luwa-main-nav > a:nth-of-type(3) { width: 166px; }
      nav.luwa-main-nav > a:nth-of-type(4) { width: 130px; }
      nav.luwa-main-nav > a:nth-of-type(5) { width: 140px; }
      nav.luwa-main-nav > a:nth-of-type(6) { width: 86px; }
      nav.luwa-main-nav > a:nth-of-type(7) { width: 86px; }
      nav.luwa-main-nav > a:nth-of-type(8) { width: 88px; }
      nav.luwa-main-nav > .cloud-btn {
        position: static !important;
        inset: auto !important;
        margin: 0 0 0 10px !important;
        flex: 0 0 auto !important;
        white-space: nowrap !important;
      }
      .luwa-language-switcher {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 10px;
        padding: 3px;
        border: 1px solid rgba(0, 86, 179, .28);
        border-radius: 999px;
        background: rgba(255,255,255,.9);
        vertical-align: middle;
      }
      .luwa-language-switcher .luwa-lang-icon { font-size: 14px; padding-left: 5px; }
      .luwa-language-switcher button {
        appearance: none;
        border: 0;
        background: transparent;
        color: #334155;
        min-width: 34px;
        min-height: 30px;
        border-radius: 999px;
        padding: 4px 8px;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color .2s ease, color .2s ease;
      }
      .luwa-language-switcher button.active {
        background: #0056b3;
        color: #fff;
      }
      .luwa-language-switcher button:focus-visible {
        outline: 3px solid rgba(14,165,233,.3);
        outline-offset: 2px;
      }
      @media (max-width: 850px) {
        nav.luwa-main-nav {
          flex-direction: column !important;
          flex-wrap: nowrap !important;
          gap: 8px !important;
        }
        nav.luwa-main-nav > a {
          width: auto !important;
          min-width: 210px !important;
        }
        nav.luwa-main-nav > .cloud-btn {
          margin: 4px 0 0 !important;
        }
        .luwa-language-switcher { margin: 6px 0 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function addSwitcher() {
    if (document.querySelector('.luwa-language-switcher')) return;
    const nav = document.querySelector('nav');
    if (!nav) return;

    const wrapper = document.createElement('span');
    wrapper.className = 'luwa-language-switcher';
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-label', 'Language / Idioma / Taal');
    wrapper.innerHTML = `
      <span class="luwa-lang-icon" aria-hidden="true">🌐</span>
      <button type="button" data-lang="en" aria-label="English">EN</button>
      <button type="button" data-lang="es" aria-label="Español">ES</button>
      <button type="button" data-lang="nl" aria-label="Nederlands">NL</button>
    `;
    nav.appendChild(wrapper);
    wrapper.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });
  }

  function observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      const lang = getSavedLanguage();
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            // Treat newly generated text as English source if possible.
            const current = normalize(node.nodeValue);
            originals.delete(node);
            if (reverse[current]) originals.set(node, { raw: node.nodeValue, english: reverse[current] });
            translateNode(node, lang);
          } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('.luwa-language-switcher')) {
            walkAndTranslate(node, lang);
          }
        });
        if (mutation.type === 'characterData') {
          const node = mutation.target;
          const current = normalize(node.nodeValue);
          originals.delete(node);
          if (reverse[current]) originals.set(node, { raw: node.nodeValue, english: reverse[current] });
          translateNode(node, lang);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    addStyles();
    addSwitcher();
    const lang = getSavedLanguage();
    walkAndTranslate(document.body, lang);
    document.title = translateTextValue(document.title, lang).trim();
    observeDynamicContent();

    window.LUWA_i18n = {
      setLanguage: switchLanguage,
      getLanguage: getSavedLanguage,
      t: (englishText) => {
        const lang = getSavedLanguage();
        if (lang === 'es') return es[englishText] || englishText;
        if (lang === 'nl') return nl[englishText] || englishText;
        return englishText;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
