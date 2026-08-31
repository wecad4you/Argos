# Handoff: Argos — Plataforma Alumni (SaaS) + Landing

## Overview
Argos es una plataforma B2B de **Data Enrichment & Monitoring**. El producto documentado aquí es **Argos Alumni**: universidades chilenas cargan su base de egresados y Argos la enriquece con datos profesionales públicos (LinkedIn y fuentes GDPR/CCPA-compliant), entregando cargo actual, empresa, área, seniority, ciudad e historial laboral, y monitoreando cambios de trabajo en tiempo real.

Este bundle contiene dos diseños:

1. **`Argos Platform.dc.html`** — la aplicación SaaS (4 pantallas navegables). Es el foco de la implementación.
2. **`Argos Landing.dc.html`** — la landing page pública de marketing.

## About the Design Files
Los archivos `.dc.html` de este bundle son **referencias de diseño creadas en HTML**: prototipos que muestran el look & feel y el comportamiento previsto. **No son código de producción para copiar directamente.**

La tarea es **recrear estos diseños en el entorno existente del codebase destino** (React, Next.js, Vue, etc.), usando sus patrones, su router, su librería de componentes y su capa de datos. Si todavía no existe un codebase, elegir el stack apropiado (recomendado: **React + TypeScript + Tailwind o CSS Modules**, con TanStack Table para la grilla de egresados y Recharts/visx si se quieren gráficos reales) e implementar allí.

Notas técnicas sobre los prototipos, para leerlos correctamente:
- Todo el estilo es **inline**, sin clases CSS. En producción, extraer a tokens/utilidades.
- Los datos son *mock* definidos en la clase `Component` al final de cada archivo (arrays `PEOPLE`, `alerts`, `companies`, `profile`, etc.). Sirven como **contrato de datos**: los nombres de campo son los que se esperan de la API.
- La navegación entre pantallas es un `state.screen` local. En producción debe ser rutas reales.
- Los avatares son iniciales sobre color sólido porque el prototipo no tiene fotos. **En producción se usa la foto de LinkedIn**, con fallback a iniciales.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciado, radios y estados están definidos. Recrear la UI con fidelidad usando las librerías del codebase. Las excepciones — donde el prototipo es indicativo y no final — están marcadas explícitamente más abajo (paginación, filtros como texto estático, export, "Contactar").

---

## Design Tokens

### Colores
| Token | Hex | Uso |
|---|---|---|
| `purple-900` | `#26215C` | Color principal. Botones primarios, cifras destacadas, tarjeta KPI inversa, chips activos |
| `purple-600` | `#534AB7` | Acento interactivo. Links, barras de gráficos, badges, hover de primario |
| `purple-300` | `#AFA9EC` | Lavanda. Flechas de transición, barras secundarias, isotipo sobre fondo oscuro, acentos sobre navy |
| `navy-900` | `#0D1B2A` | Sidebar, secciones oscuras, texto principal |
| `cream-50` | `#F8F7F2` | Fondo de la app y texto sobre fondos oscuros |
| `white` | `#FFFFFF` | Superficie de tarjetas y filas de tabla |

Escala derivada para el gráfico de seniority (8 niveles, de mayor a menor):
`#26215C` · `#3B3392` · `#534AB7` · `#6A62C4` · `#8079D0` · `#9992DD` · `#AFA9EC` · `#CFCBF4`

Avatares (rotación de 5 tonos): `#26215C`, `#534AB7`, `#7C74C9`, `#0D1B2A`, `#8079D0`

Alphas usadas con frecuencia (definir como tokens semánticos):
- Texto secundario: `rgba(13,27,42,.68)` · terciario `.55` · débil `.5` · deshabilitado `.4`
- Bordes: `rgba(13,27,42,.08)` (tarjetas) · `.14` (inputs, botones secundarios) · `.06`–`.07` (separadores de fila)
- Superficie tenue púrpura: `rgba(38,33,92,.04)` (header de tabla) · `.06`–`.07` (chips) · `.08`–`.09` (tracks de barra)
- Acento tenue: `rgba(83,74,183,.12)` (badge/botón secundario) · `rgba(175,169,236,.09)` (hover de fila)
- Sidebar: item activo `rgba(175,169,236,.16)`, texto inactivo `rgba(248,247,242,.62)`

### Tipografía
- **UI y números: `Instrument Sans`** (Google Fonts, pesos 400/500/600/700).
- **Wordmark "Argos" únicamente: `Georgia, 'Times New Roman', serif`.** No usar serif en ningún otro lugar.
- **Todos los números** (KPIs, porcentajes, conteos, fechas, años, IDs) llevan `font-variant-numeric: tabular-nums`. Los datos numéricos en tablas y listas van en `font-weight: 500`; las cifras KPI grandes en `font-weight: 700` con `letter-spacing: -.03em`.
- `-webkit-font-smoothing: antialiased` en `body`.

Escala:
| Rol | Size / weight / tracking |
|---|---|
| Wordmark sidebar | 22px serif, `-.01em` |
| Título de pantalla (header) | 20px / 600 / `-.01em` |
| Nombre en perfil | 25px / 600 / `-.015em` |
| KPI grande | 40px / 700 / `-.03em`, line-height 1 |
| KPI de alerta | 30px / 700 / `-.03em` |
| Título de tarjeta | 15.5px / 600 |
| Cuerpo / celda de tabla | 13.5–14px / 400 (nombre 500) |
| Meta secundaria | 12.5–13px |
| Label de header de tabla | 11.5px, `letter-spacing: .07em`, `uppercase`, color `rgba(13,27,42,.5)` |
| Label de sección de filtros | 11.5px, `letter-spacing: .1em`, `uppercase` |
| Anotación numérica de tarjeta | 11px / 500 tabular, color `rgba(13,27,42,.4)` |
| Badge | 10.5px / 600 |

### Espaciado, radios, sombras
- Padding de contenido: `24px 32px 56px`. Header: `16px 32px`. Sidebar: `22px 16px`.
- Gaps de grilla: 14–20px entre tarjetas; 16–18px dentro de tarjetas.
- Padding interno de tarjeta: `22px 24px` (KPI) · `24px 26px 28px` (gráficos) · `16px 22px` (fila de alerta).
- Radios: `9px` botones/nav items · `10px` inputs y botones grandes · `13px` tarjetas de alerta · `14px` tarjetas · `16px` tarjetas de perfil · `999px` chips, pills y tracks de barra · `50%` avatares.
- Sombra: la app **no usa sombras** salvo la sticky del header (que resuelve con `backdrop-filter: blur(12px)` + fondo `rgba(248,247,242,.92)`). Las tarjetas se separan por borde de 1px, no por sombra.
- Alturas de barra: 12px la barra apilada de seniority; 8px las barras de área; 7px las del ranking de empresas; 6px las de progreso.

---

## Layout global (shell)

Grid raíz: `grid-template-columns: 236px 1fr`, `min-height: 100vh`, fondo `#F8F7F2`.

### Sidebar (236px, `position: sticky; top: 0; height: 100vh`)
Fondo `#0D1B2A`, texto crema. De arriba a abajo:
1. **Marca**: isotipo (ojo SVG 26px, trazo `#AFA9EC`, iris `#AFA9EC`, pupila `#0D1B2A`, brillo `#F8F7F2`) + wordmark "Argos" 22px serif. Isotipo y wordmark son **elementos separados**; el isotipo nunca contiene el wordmark.
2. **Nav** (gap 3px): Dashboard · Egresados · Alertas · Reportes · Configuración. Cada item: icono 17px stroke 1.8 + label 14.5px. Activo: fondo `rgba(175,169,236,.16)`, texto `#F8F7F2`, weight 600. Inactivo: transparente, `rgba(248,247,242,.62)`, weight 400. **Alertas lleva badge de conteo** (pill `#534AB7`, texto crema, 11.5px/600) con la cantidad sin revisar. "Egresados" queda activo también cuando se está en el perfil de un egresado.
3. **Widget de sincronización** (`margin-top: auto`): tarjeta `rgba(175,169,236,.1)` con borde `rgba(175,169,236,.16)`, radio 12px. Texto "Enriquecimiento del mes / 33.428 / 42.317 registros", barra de progreso 6px al 79% en `#AFA9EC`, y línea de estado con punto pulsante `#AFA9EC` (animación `argosDot`, 1.6s ease-in-out infinite, opacidad 1 → .25 → 1) + "Sincronizado hoy 06:40".

### Header (sticky, `top: 0`, z-index 20)
Fondo `rgba(248,247,242,.92)` + `backdrop-filter: blur(12px)`, borde inferior `1px rgba(13,27,42,.09)`.
- Izquierda: título de la pantalla activa (20px/600) · divisor vertical 1px×20px · **pill de tenant**: cuadro 22px radio 6px fondo `#26215C` con las siglas ("UDD") en 11px/700 crema + nombre completo de la universidad 13.5px `#26215C`, sobre fondo `rgba(38,33,92,.06)`, radio 999px.
- Derecha: botón **Exportar** (secundario: fondo blanco, borde `rgba(13,27,42,.14)`, icono de descarga 15px; hover borde y texto `#534AB7`) + **pill de usuario** (avatar 26px circular `#534AB7` con iniciales + nombre 13.5px, borde 1px, fondo blanco).

> **Multi-tenancy:** el tenant del header determina el scope de *todos* los datos. Una universidad solo puede ver sus propios egresados; el filtro por `tenant_id` debe estar en el servidor, nunca solo en el cliente.

### Transición de pantalla
Cada pantalla entra con `argosFade`: `opacity 0 → 1`, `translateY(6px) → 0`, 300ms `ease-out`, `both`.

---

## Screens / Views

### 1. Dashboard
**Ruta sugerida:** `/dashboard` · **Propósito:** estado general de la base y qué cambió recientemente.

**Layout** (columna, gap 20px):

**a) Filtro por facultad** — fila de chips: label "Facultad" 13px `rgba(13,27,42,.5)` + chips `Todas · Ingeniería · Economía y Negocios · Derecho · Medicina · Comunicaciones`. Chip activo: fondo `#26215C`, texto crema, borde del mismo color. Inactivo: fondo blanco, texto `rgba(13,27,42,.7)`, borde `rgba(13,27,42,.14)`. Padding `7px 14px`, radio 999px, 13.5px.
> En el prototipo el chip cambia de estado visual pero **no re-filtra los datos**. En producción debe filtrar todos los widgets de la pantalla.

**b) Fila de 3 KPIs** (`repeat(3, 1fr)`, gap 16px):
| KPI | Valor | Detalle |
|---|---|---|
| Egresados en la base | `42.317` | subtexto "cohortes 1998 — 2024" |
| Match LinkedIn | `79,0%` | valor en `#26215C` + barra de progreso 6px al 79% en `#534AB7` sobre track `rgba(38,33,92,.09)` |
| Cambios de trabajo · agosto | `1.164` | **tarjeta inversa**: fondo `#26215C`, texto crema; subtexto "+14% vs. julio · 312 sin revisar" en `#AFA9EC` |

Formato de números en **es-CL**: punto como separador de miles, coma decimal.

**c) Dos gráficos** (`1.15fr 1fr`, gap 16px, alineados al top):

*Distribución por seniority* — barra apilada de 12px, radio 999px, sin gaps entre segmentos, seguida de leyenda en 2 columnas (gap `12px 30px`): cuadro de color 9px radio 3px + label 14px + porcentaje tabular a la derecha en `#26215C`. Anotación de esquina: "33.428 con match".

Datos: C-Level 4% · Director 8% · Gerente 12% · Subgerente 11% · Jefatura 15% · Profesional Senior 23% · Profesional 21% · Trainee 6%.

*Área de trabajo* — lista de 11 filas, grid `118px 1fr 40px` gap 12px: label + barra horizontal 8px (relleno `#534AB7`, ancho = pct / máximo × 100%) + porcentaje alineado a la derecha.

Datos: Tecnología 16 · Finanzas 14 · Ventas 13 · Operaciones 11 · Marketing 9 · Educación 8 · Legal 7 · RRHH 6 · Estrategia 6 · Emprendimiento 5 · Salud 5.

**d) Feed "Últimos cambios detectados"** — tarjeta con botón "Ver todas las alertas" (secundario, texto `#534AB7`) que navega a Alertas. Filas grid `40px 1.1fr 1.5fr 150px 96px`, gap 16px, padding vertical 14px, separadas por borde superior `rgba(13,27,42,.07)`:
1. Avatar 36px circular.
2. Nombre (botón, hover `#534AB7`, navega al perfil) + línea meta "carrera · año".
3. **Transición de cargo**: cargo anterior en `rgba(13,27,42,.45)` con `text-decoration: line-through` → flecha `→` en `#AFA9EC` → cargo nuevo en `#26215C`/500.
4. Empresa.
5. Fecha, tabular, alineada a la derecha, `rgba(13,27,42,.45)`.

---

### 2. Egresados (vista tabla)
**Ruta:** `/egresados` · **Propósito:** explorar, filtrar y exportar la base enriquecida.

**Layout:** grid `238px 1fr`. Panel de filtros a la izquierda con `position: sticky; top: 69px` y borde derecho `rgba(13,27,42,.09)`.

**a) Panel de filtros** — header "Filtros" (13.5px/600) + "Limpiar" (`#534AB7`, 12.5px). Grupos separados por borde inferior, `padding-bottom: 20px; margin-bottom: 20px`:

| Grupo | Opciones (con conteo) |
|---|---|
| Seniority | C-Level 1.337 ✓ · Director 2.674 ✓ · Gerente 4.011 · Subgerente 3.677 |
| Área | Tecnología 5.348 ✓ · Finanzas 4.680 · Ventas 4.345 · Operaciones 3.677 |
| Empresa | Banco de Chile 1.284 · Falabella 967 · Codelco 803 |
| Carrera | Ing. Comercial 6.212 · Derecho 4.108 · Ing. Civil Industrial 3.940 · Medicina 2.611 |
| Año de egreso | dos campos de rango: `2005` — `2024` |

Checkbox: 15px, radio 4px, borde 1.5px. Sin marcar: borde `rgba(13,27,42,.24)`, fondo blanco. Marcado: borde y fondo `#534AB7`, check SVG blanco stroke 3.5. Conteos en tabular 11.5px `rgba(13,27,42,.38)`.
> Los grupos deben ser colapsables y, en listas largas (Empresa, Carrera), llevar buscador interno y "ver más". Los conteos son facetas del backend y deben recalcularse con cada filtro aplicado. En el prototipo los estados son estáticos.

**b) Barra de acciones** — buscador que crece (`flex: 1`, mín 260px): icono de lupa 16px + input "Buscar por nombre…" en tarjeta blanca borde `rgba(13,27,42,.14)` radio 10px. A la derecha: conteo de resultados ("33.428 egresados"), botón **CSV** (secundario) y **Exportar Excel** (primario `#26215C`, hover `#534AB7`).
> Búsqueda con debounce ~250ms, contra nombre y apellido, sin sensibilidad a acentos. El export debe ser asíncrono (job + descarga) porque son decenas de miles de filas, y debe respetar los filtros activos.

**c) Tabla** — dentro de un contenedor con `overflow-x: auto`; la grilla tiene `min-width: 980px`. Columnas (idénticas en header y filas):

```
minmax(268px,2.1fr)  Egresado
minmax(140px,1.4fr)  Cargo actual
minmax(110px,1fr)    Empresa
minmax(92px,.85fr)   Área
minmax(112px,.95fr)  Seniority
minmax(88px,.8fr)    Ciudad
70px                 Egreso
92px                 Actualizado
```

Header: fondo `rgba(38,33,92,.04)`, borde inferior `rgba(13,27,42,.09)`, labels 11.5px uppercase tracking `.07em`.
Fila: `align-items: center`, borde inferior `rgba(13,27,42,.06)`, `cursor: pointer`, **hover `rgba(175,169,236,.09)`**, click → perfil.
- Celda *Egresado*: avatar 34px (foto de LinkedIn en producción; fallback iniciales sobre color rotado) + nombre 14px/500 + **badge "nuevo cargo"** cuando el cambio es de los últimos 30 días (pill `rgba(83,74,183,.13)` / `#534AB7`, 10.5px/600, empujado con `margin-left: auto`) + segunda línea con la carrera 12px `rgba(13,27,42,.48)`.
- Celda *Seniority*: chip `rgba(38,33,92,.07)` / `#26215C`, radio 6px, 12px.
- *Egreso* y *Actualizado*: tabular; "Actualizado" alineado a la derecha en `rgba(13,27,42,.42)`.
- Todas las celdas de texto: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`.

Pie: "Mostrando 1–9 de 33.428" + paginación (Anterior · 1 · 2 · 3 · Siguiente; página activa `#26215C` con texto crema).
> La paginación es **estática** en el prototipo. Implementar server-side pagination o scroll virtualizado (33k+ filas). Se recomienda además: ordenamiento por columna, selección múltiple con acciones en lote, y columna configurable.

Datos de ejemplo (9 filas): Camila Rojas Vergara · Matías Fuenzalida Soto · Antonia Silva Lagos · Joaquín Pérez Undurraga · Laura Méndez Cifuentes · Diego Tapia Bravo · Francisca Navarro Ríos · Sebastián Contreras Díaz · Valeria Arriagada Muñoz. Las tres primeras llevan badge "nuevo cargo".

**d) Tarjeta "Empresas con más egresados"** — ranking top 10, contenedor con `overflow-x: auto`. Filas grid `34px minmax(180px,1.6fr) minmax(70px,200px) 76px`, gap 14px, `min-width: 440px`: rank tabular (`01`…`10`, `rgba(13,27,42,.35)`) + nombre + barra 7px (`#AFA9EC`, ancho relativo al primero) + conteo tabular `#26215C` a la derecha. Anotación: "top 10 de 8.412".

Datos: Banco de Chile 1.284 · Falabella 967 · Codelco 803 · Accenture 742 · BCI 688 · Deloitte 641 · Entel 597 · Sonda 512 · Cencosud 486 · Google 318.

---

### 3. Perfil individual de egresado
**Ruta:** `/egresados/:id` · **Propósito:** ficha completa de una persona.

Botón "Volver a egresados" (chevron 15px + texto `#534AB7` 13.5px) arriba. Layout `1.35fr 1fr`, gap 18px, alineado al top.

**Columna izquierda:**

*Tarjeta de identidad* — banda superior de 92px con `linear-gradient(110deg, #26215C, #534AB7)`; el contenido sube con `margin-top: -38px`. Avatar 84px circular con borde blanco de 4px. Nombre 25px/600 `-.015em`; bajo él "cargo · empresa" 15px `rgba(13,27,42,.68)`. A la derecha, botón **Ver en LinkedIn** (fondo `#26215C`, texto crema, icono de link externo, hover `#534AB7`) que abre la URL de LinkedIn en nueva pestaña.
Fila de tags (gap 8px, wrap, todos radio 999px, 12.5px): seniority (fondo `#26215C`, crema) · área (`rgba(83,74,183,.12)` / `#534AB7`) · ciudad y "Egreso YYYY" (`rgba(13,27,42,.06)`) · **score de match** (borde `rgba(83,74,183,.3)`, texto `#534AB7`, punto de 6px, "match 0,96").

*Historial laboral* — timeline vertical. Cada entrada: grid `30px 1fr` gap 16px; en la canaleta un punto de 11px con anillo de 2.5px y una línea de 1.5px `rgba(38,33,92,.14)` que rellena el resto. Puesto actual: punto `#534AB7` con anillo `rgba(83,74,183,.25)`; anteriores: `#26215C` con anillo `rgba(38,33,92,.14)`. Contenido: cargo 15px/600 + período tabular a la derecha + "empresa · duración" 13.5px. `padding-bottom: 22px` por entrada. Anotación: "5 posiciones · 13 años".

Datos: Head of Data Science · Falabella · 2026 — actual (1 mes) / Lead Analytics · Cencosud · 2022 — 2026 (3 a 8 m) / Data Scientist Senior · Cencosud · 2020 — 2022 (2 a 2 m) / Analista de datos · Entel · 2017 — 2020 (2 a 9 m) / Analista Jr. · Everis · 2014 — 2017 (2 a 6 m).

**Columna derecha:**

*Datos de contacto* — 4 filas: icono 15px en cuadro de 32px radio 9px fondo `rgba(38,33,92,.06)` + label 11.5px `rgba(13,27,42,.45)` + valor 13.5px. Dato disponible: valor en `#534AB7`. **Dato no disponible: icono de candado, valor "No disponible" en `rgba(13,27,42,.4)`, icono en el mismo gris.** Ejemplo: correo personal `camila.rojas@gmail.com`, corporativo `crojas@falabella.com`, teléfono *no disponible*, LinkedIn `linkedin.com/in/camilarojasv`.

*Educación* — pregrado (siempre la universidad tenant) + postgrados si existen. Cada uno: badge cuadrado 34px radio 9px con las siglas (11px/700, crema) + título 14px/500 + institución 13px + período tabular 11.5px. Tonos de badge: `#26215C`, `#534AB7`, `#8079D0`.
Datos: UDD · Ingeniería Civil Industrial · 2008 — 2014 / MIT · MicroMasters en Data Science · 2019 — 2020 / UAI · Diplomado en Analítica Avanzada · 2021.

*Señales de Argos* — tarjeta **navy** (`#0D1B2A`, texto crema). Título 13px `rgba(248,247,242,.6)` + 4 pares label/valor: Último cambio `4 ago 2026` · Permanencia promedio `31 meses` · Trayectoria `ascendente` (en `#AFA9EC`) · Verificado `28 ago 2026`.

---

### 4. Alertas / cambios de trabajo
**Ruta:** `/alertas` · **Propósito:** revisar y accionar los cambios detectados.

**a) Barra superior** — a la izquierda, segmented control (contenedor `rgba(38,33,92,.07)`, radio 11px, padding 4px): **Último mes · Último trimestre · Último semestre**. Activo: fondo blanco, texto `#26215C`, weight 600. Inactivo: transparente, `rgba(13,27,42,.6)`.
A la derecha: dos dropdowns ("Área: todas", "Seniority: Gerente y superior") y botón primario **Marcar todo como visto**.
> Los dropdowns son **estáticos** en el prototipo: implementar como multiselect real. "Marcar todo como visto" debe pedir confirmación y ser un update en lote.

**b) 4 KPIs** (`repeat(4, 1fr)`, gap 14px, tarjetas radio 13px, cifras 30px/700 tabular) que **cambian con el período seleccionado**:

| | Último mes | Último trimestre | Último semestre |
|---|---|---|---|
| Cambios en el período | 1.164 | 3.402 | 6.815 |
| Sin revisar *(en `#534AB7`)* | 312 | 912 | 1.744 |
| Ascensos | 486 | 1.388 | 2.803 |
| Nuevos C-Level | 24 | 71 | 142 |

**c) Lista de alertas** — tarjetas apiladas (gap 10px), grid `44px 1.15fr 1.7fr auto`, gap 18px, padding `16px 22px`, radio 13px:
1. Avatar 40px.
2. Nombre (botón → perfil) + badge **"nuevo"** si no está visto + meta "carrera · seniority · área".
3. **Transición de empresa**: empresa anterior `rgba(13,27,42,.45)` → `→` en `#AFA9EC` → empresa nueva `#26215C`/600. Bajo eso: "cargo nuevo · detectado {fecha}".
4. Acciones: botón **Marcar visto** (secundario) y **Contactar** (`rgba(83,74,183,.12)` / `#534AB7`, hover se invierte a fondo `#534AB7` con texto crema).

**Estado no leído:** borde de la tarjeta `rgba(83,74,183,.35)` + badge "nuevo". Al marcar visto: borde vuelve a `rgba(13,27,42,.08)`, el badge desaparece, y el botón pasa a decir "Visto" en `rgba(13,27,42,.4)`. **El toggle es reversible** en el prototipo.
> "Contactar" no tiene comportamiento definido. Decidir: abrir mailto, crear tarea en el CRM, o abrir un panel de composición.

Datos (7 alertas): Camila Rojas (Cencosud → Falabella, Head of Data Science, 27 ago 2026, nueva) · Matías Fuenzalida (Carey Abogados → Bain & Company, Principal, 26 ago, nueva) · Antonia Silva (Rappi → Cornershop, VP Operations, 24 ago, nueva) · Laura Méndez (Universidad de Chile → Genosur, Research Lead, 22 ago) · Diego Tapia (Banco de Chile → Banco de Chile, Gerente de Finanzas (ascenso), 21 ago) · Francisca Navarro (Watt's → CCU, Brand Manager, 19 ago) · Joaquín Pérez (LarrainVial → Sierra Capital, Socio fundador, 16 ago).

Nota: un ascenso interno se representa con la misma empresa en ambos lados y "(ascenso)" en el cargo. Considerar un tratamiento visual distinto para ascensos vs. cambios de empresa.

---

### 5. Reportes y Configuración
**No diseñadas.** En el prototipo son un estado vacío (isotipo al 50% de opacidad + título + "Módulo fuera del alcance de este prototipo."). Requieren diseño antes de implementarse.

---

## Interactions & Behavior

### Navegación
- Sidebar → cambia de pantalla. Debe ser rutas reales con URL propia y estado compartible.
- Click en cualquier fila de la tabla, nombre del feed o nombre de alerta → perfil del egresado.
- "Volver a egresados" y "Ver todas las alertas" → navegación explícita.
- Los filtros, la búsqueda, el período y la página deben vivir en la query string para que la vista sea compartible y sobreviva un refresh.

### Hover
- Filas de tabla: fondo `rgba(175,169,236,.09)`.
- Botones secundarios: borde y texto pasan a `#534AB7`.
- Botón primario `#26215C` → `#534AB7`.
- "Contactar": fondo tenue → `#534AB7` con texto crema.
- Nombres clickeables: color → `#534AB7`.

### Animaciones
- `argosFade`: entrada de pantalla, 300ms ease-out (`opacity` + `translateY(6px)`).
- `argosDot`: punto de estado, 1.6s ease-in-out infinite, opacidad 1 → .25 → 1.
- Sin otras animaciones. Respetar `prefers-reduced-motion`.

### Estados faltantes (definir en implementación)
El prototipo no cubre: **loading** (usar skeletons con la geometría de cada tarjeta/fila, no spinners), **vacío** (sin resultados de filtro, base sin enriquecer aún, sin alertas en el período), **error** (fallo de API, export fallido), y **sin permisos**. También falta el flujo de carga inicial de la base y el manejo de registros **sin match** (¿se muestran en la tabla con campos vacíos, o se separan en una pestaña "sin enriquecer"?). Definir con el equipo de producto.

### Responsive
Optimizado para desktop (≥1280px), modo claro por defecto. Comportamiento actual: las tablas scrollean horizontalmente con `min-width`; las grillas de KPI y gráficos son de columnas fijas y **no colapsan** — hay que añadir breakpoints. Bajo ~1100px: KPIs a 2 columnas, gráficos apilados, panel de filtros a un drawer, sidebar colapsada a iconos. Móvil no está diseñado; si se necesita, requiere diseño aparte (probablemente lista de tarjetas en vez de tabla).

---

## State Management

Estado del prototipo (todo local, en `Component`):
```
screen    "dashboard" | "people" | "profile" | "alerts" | "reports" | "settings"
faculty   string  — chip de facultad activo en el dashboard
period    "Último mes" | "Último trimestre" | "Último semestre"
query     string  — texto del buscador
seen      { [alertIndex]: boolean } — toggle de alerta vista
```

En producción esto se descompone en:
- **URL/router**: pantalla, id del egresado, filtros, búsqueda, período, página, orden.
- **Server state** (React Query / SWR): egresados paginados, facetas de filtro, KPIs por facultad y período, feed de cambios, ranking de empresas, perfil individual, alertas. Todo scopeado por tenant.
- **Mutaciones**: marcar alerta como vista (optimista, reversible), marcar todo como visto, crear job de export.
- **Sesión**: usuario, tenant (universidad), permisos.

### Contrato de datos (derivado de los mocks)
```ts
type Alumnus = {
  id: string; photoUrl?: string; name: string; career: string;
  title: string; company: string; area: Area; seniority: Seniority;
  city: string; graduationYear: number;
  updatedAt: string;        // ISO — se muestra como "hace N d"
  changedRecently: boolean; // cambio en los últimos 30 días → badge
  linkedinUrl?: string; matchScore: number; // 0–1
  contacts: { personalEmail?: string; workEmail?: string; phone?: string };
  education: { badge: string; degree: string; school: string; period: string }[];
  history: { title: string; company: string; from: string; to: string | null }[];
};

type Seniority = "C-Level" | "Director" | "Gerente" | "Subgerente"
  | "Jefatura" | "Profesional Senior" | "Profesional" | "Trainee";

type Area = "Ventas" | "Tecnología" | "Finanzas" | "Marketing" | "Operaciones"
  | "RRHH" | "Legal" | "Estrategia" | "Emprendimiento" | "Educación" | "Salud";

type JobChange = {
  id: string; alumnusId: string;
  fromCompany: string; toCompany: string;
  fromTitle?: string; newTitle: string;
  detectedAt: string; isPromotion: boolean; seen: boolean;
};
```
Los enums de `Seniority` y `Area` son cerrados y su **orden importa** (define el orden de la barra apilada y de la leyenda). Toda cifra se formatea con `Intl.NumberFormat("es-CL")` y las fechas con locale `es-CL`.

---

## Privacidad y compliance
Requisito de producto, no cosmético: Argos solo trabaja con datos profesionales de acceso público, bajo GDPR, CCPA y **Ley 21.719 (Chile)**. La implementación necesita: registro de la fuente y fecha de verificación por cada campo (ya visible en "Señales de Argos"), soporte de derecho de acceso y supresión, honrar opt-outs a lo largo de la cadena, y auditoría de quién consultó qué. Los datos de contacto son el material más sensible: registrar todo acceso.

---

## Assets
- **Fuente**: `Instrument Sans` desde Google Fonts (400/500/600/700). En producción, self-host para evitar el FOUT y la dependencia externa. Georgia es fuente de sistema.
- **Isotipo Argos**: SVG inline (ojo con iris, pupila y brillo), viewBox `0 0 32 32`. Aparece en dos versiones — sobre navy con trazo/iris `#AFA9EC`, y sobre crema con trazo `#26215C` e iris `#534AB7`. Extraerlo a un componente con prop de variante. El wordmark es texto, no imagen, y es un elemento **separado** del isotipo.
- **Iconos**: SVG inline, 24×24 viewBox, `stroke-width` 1.8–2, `stroke-linecap: round`. Sustituibles por Lucide (nombres equivalentes: `layout-dashboard`, `users`, `bell`, `trending-up`, `settings`, `search`, `download`, `chevron-left`, `arrow-up-right`, `mail`, `lock`, `linkedin`, `check`).
- **Fotos de egresados**: no hay en el prototipo (se usan iniciales). En producción vienen de LinkedIn; se necesita política de caché/proxy y fallback a iniciales sobre la paleta de 5 tonos.
- **Logos de empresas**: no se usan. Si se agregan al ranking, definir fuente.

---

## Files
| Archivo | Contenido |
|---|---|
| `Argos Platform.dc.html` | Las 4 pantallas de la app (Dashboard, Egresados, Perfil, Alertas) + shell. **Foco principal.** |
| `Argos Landing.dc.html` | Landing pública: hero, problema, solución, producto Argos Alumni, sección de reportería con dashboard de ejemplo, cómo funciona, API, compliance, CTA. |
| `support.js` | Runtime del prototipo. **No es parte del diseño ni de la entrega** — no portar. |

Para leer los prototipos: abrir los `.dc.html` en un navegador. El markup está entre `<x-dc>` y `</x-dc>`; los datos mock y la lógica de estado en el `<script>` final, en `class Component`.
