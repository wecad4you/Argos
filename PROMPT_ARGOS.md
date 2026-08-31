# Argos Alumni — Implementación de la plataforma (piloto UDD Ing. Comercial)

> **Cómo usar este archivo:** guárdalo en la raíz del repo como `PROMPT_ARGOS.md` junto con la carpeta `design_handoff_argos_alumni/`. Luego arranca Claude Code con:
>
> `Lee PROMPT_ARGOS.md completo y design_handoff_argos_alumni/README.md antes de escribir una sola línea de código. Después ejecuta la Fase 0 y detente en el checkpoint.`

---

## 0. Qué es esto y qué hay que construir

**Argos** es un servicio B2B de *data enrichment & monitoring* para universidades chilenas. La universidad entrega su base de egresados (ID interno + nombre); Argos la cruza contra LinkedIn, la enriquece con datos profesionales públicos (cargo, empresa, área, seniority, ciudad, historial laboral, datos de contacto) y monitorea cambios de trabajo.

Hasta hoy todo el pipeline vive en **Clay**. Lo que hay que construir ahora es **la capa de producto**: una plataforma web multi-tenant donde la universidad ve, filtra, explora y exporta su base enriquecida, y recibe alertas de cambios de trabajo. Es lo que se le entrega al cliente además de la API.

**Cliente piloto:** Universidad del Desarrollo (UDD), Facultad de Economía y Negocios, carrera **Ingeniería Comercial**.
**Volumen real del piloto:** 8.120 registros en la base UDD, de los cuales **6.426 tienen match alto** con LinkedIn (~79,1%).

El diseño ya está hecho y está en `design_handoff_argos_alumni/`:
- `README.md` → **especificación de diseño. Es la fuente de verdad de la UI.** Léelo completo.
- `Argos Platform.dc.html` → prototipo de las 4 pantallas (Dashboard, Egresados, Perfil, Alertas). Ábrelo/léelo para resolver dudas visuales.
- `Argos Landing.dc.html` → landing pública de marketing (Fase 7, opcional).
- `support.js` → **runtime del prototipo. NO es parte de la entrega. No lo portes ni lo leas para copiar lógica.**

Los `.dc.html` son prototipos con estilos inline y datos mock. **No copies el HTML.** Recrea el diseño con los patrones del stack definido abajo y extrae los estilos a tokens.

---

## 1. Regla de oro

> **Ningún número del prototipo puede quedar hardcodeado en producción.**

Los mocks (42.317 egresados, 1.164 cambios, 312 sin revisar, 33.428 con match, el top 10 de empresas, los 9 egresados de ejemplo, las 7 alertas) son **contrato de datos, no contenido**. Cada cifra de la UI se calcula desde la base de datos, scopeada por tenant y por los filtros activos. Si un dato no existe todavía (por ejemplo, el monitoreo de cambios está apagado), se muestra el **estado vacío honesto**, nunca un número inventado ni un placeholder que parezca real.

Corolario: si en algún momento no tienes el dato para renderizar algo, **pregunta antes de inventar**.

---

## 2. Stack y decisiones ya tomadas

No re-litigar estas decisiones. Si crees que alguna está mal, dilo en el checkpoint, no cambies unilateralmente.

| Capa | Decisión |
|---|---|
| Framework | **Next.js 15+ (App Router) + TypeScript estricto** |
| Estilos | **Tailwind CSS** con los tokens de Argos definidos en `tailwind.config.ts` (ver §6) |
| Base de datos | **Postgres en Supabase** |
| Acceso a datos | **Drizzle ORM** para queries del servidor + migraciones versionadas en `/drizzle` |
| Auth | **Supabase Auth** (magic link por email), con `tenant_id` en el JWT |
| Server state | **TanStack Query** para todo lo que se consume en cliente |
| Tabla | **TanStack Table** (headless) para la grilla de egresados |
| Gráficos | Sin librería. La barra apilada de seniority, las barras de área y el ranking de empresas son **divs con width porcentual** — más fiel al diseño y sin dependencia. Solo introducir Recharts si aparece un gráfico que lo justifique. |
| Iconos | **Lucide React** (el handoff ya da los nombres equivalentes) |
| Fuente | **Instrument Sans self-hosted** vía `next/font/local` (400/500/600/700). Georgia solo para el wordmark. |
| Validación | **Zod** en todo borde de entrada (formularios, API, ingesta) |
| Tests | **Vitest** (unit) + **Playwright** (e2e de los flujos críticos) |
| Deploy | Vercel + Supabase. **Confirmar región de Supabase antes de crear el proyecto** (ver §12). |
| Package manager | pnpm |

**No agregues dependencias fuera de esta lista sin justificarlo en el checkpoint.**

---

## 3. Estructura del repo

```
/app
  /(marketing)/…                 landing pública (Fase 7)
  /(app)
    /dashboard/page.tsx
    /egresados/page.tsx
    /egresados/[id]/page.tsx
    /alertas/page.tsx
    /reportes/page.tsx           estado vacío documentado (fuera de alcance)
    /configuracion/page.tsx      mínimo funcional (Fase 5)
    layout.tsx                   shell: sidebar + header
  /api/…                         API interna del portal
  /v1/…                          API pública para el CRM del cliente (Fase 6)
/components
  /ui                            primitivos: Button, Chip, Checkbox, Badge, Avatar, Card, Segmented…
  /argos                         ArgosMark (isotipo), Wordmark, KpiCard, StackedBar, BarList,
                                 AlumniTable, AlertRow, Timeline, ContactRow, SyncWidget
/lib
  /db                            drizzle schema, cliente, queries
  /clay                          adaptadores de ingesta (CSV + webhook)
  /domain                        enums, normalizadores, cálculos derivados
  /auth, /audit, /export, /format
/ingest
  /mappings/udd.yaml             mapeo columnas Clay → schema
  cli.ts                         importador
/drizzle                         migraciones SQL
/design_handoff_argos_alumni     referencia (no se compila)
CLAUDE.md
```

**Primera tarea concreta:** escribe `CLAUDE.md` con el resumen del dominio, los enums canónicos, los comandos del proyecto y las reglas invariantes de §1, §11 y §12, para que sobreviva a la compactación de contexto.

---

## 4. Origen de los datos: las tres tablas de Clay

Toda la data del piloto vive hoy en Clay, en tres tablas del workbook de UDD:

### 4.1 `MVP UDD Linkedin URL` — tabla principal (una fila = un egresado)
8.120 filas. 6.426 con score de match alto (se consideran alumnos UDD confirmados). Contiene:
- Datos de origen UDD: código alumni (`id_contacto` / `id_interno`), nombre completo de la base UDD.
- Resultado del matching: `nombre_linkedin`, `linkedin_url`, `score`, `resultado` (`MATCH ALTO` / `REVISAR` / `NO ENCONTRADO`).
- Enrich Person de LinkedIn: `Headline`, `Summary`, `Location Name`, `Country`, `Jobs Count`, y de *Latest Experience*: `Title`, `Company`, `Start Date`, `Company Domain`, `Yearly Revenue Range`; de *Education (first item)*: `School Name`, `Degree`, `Field of Study`, `End Date`.
- Clasificación propia de Argos: `seniority` y `area` (generadas por `clasificar_seniority_area.py` a partir de `cargo_actual`).
- Datos de contacto enriquecidos, cuando existen: correo personal, correo corporativo, teléfono móvil.

### 4.2 `Historial laboral UDD` — una fila = una posición laboral
Generada con *"write each item to new row in other table"* desde el array `Experience` de la tabla principal. Columnas: `Title`, `Company`, `Start Date`, `End Date` (null = actual), `Summary`, `Locality`, `Is Current`, `Company Domain`, `Yearly Revenue Range`.
**Hay que resolver el vínculo fila↔egresado.** La llave esperada es la **LinkedIn URL normalizada**; si la tabla trae además el id de la fila padre de Clay, úsalo como llave primaria del match y la URL como respaldo. **Nunca descartes filas huérfanas en silencio: repórtalas.**

### 4.3 `Job change Events from MVP UDD Linkedin URL (8 July 2026)` — eventos de cambio de trabajo
**Hoy está apagada.** Es la fuente de las Alertas. Cuando se encienda, cada señal levantada genera una fila (egresado, empresa anterior, empresa nueva, cargo nuevo, fecha de detección). El vínculo con el egresado es también la LinkedIn URL.

> Consecuencia inmediata para el piloto: **la pantalla de Alertas y el KPI "Cambios de trabajo" arrancan en cero.** Deben renderizar un estado vacío bien diseñado ("El monitoreo de cambios se activa el DD/MM — aún no hay señales registradas"), con la misma geometría de las tarjetas. El badge de conteo del sidebar no se muestra si es 0.

### 4.4 Estrategia de ingesta

**No adivines los nombres de las columnas.** Los CSV de Clay traen headers con espacios, mayúsculas y prefijos de enrichment.

1. **Paso de inspección obligatorio.** El CLI debe soportar `pnpm ingest --inspect <archivo.csv>`, que imprime los headers exactos, el tipo inferido y 3 filas de muestra. Corre esto primero y **construye el mapeo desde la realidad**.
2. **Mapeo declarativo** en `/ingest/mappings/udd.yaml`: `columna_csv → campo_schema`, con transformadores nombrados (`normalizeLinkedinUrl`, `parseClayDate`, `toBool`, `trimCompany`). El código de ingesta es genérico; el YAML es lo específico del cliente. Así el segundo cliente (UNAB, Duoc) solo necesita otro YAML.
3. **Dos caminos, un mismo destino:**
   - **Carga inicial (ahora):** `pnpm ingest --tenant udd --type alumni|history|events --file ruta.csv` sobre el CSV exportado desde Clay.
   - **Incremental (después):** `POST /api/ingest/clay` autenticado con **HMAC-SHA256** sobre el body, alimentado desde una columna HTTP API / "send webhook" de Clay. Mismo mapeo, mismo upsert.
   Ambos entran por la misma función `upsertAlumni() / upsertHistory() / upsertJobChange()`. **Idempotente siempre.**
4. **Upsert, nunca insert ciego.** Llaves: `(tenant_id, id_interno)` para egresados; `(tenant_id, alumnus_id, company, title, start_date)` para historial; `(tenant_id, external_event_id)` para eventos.
5. **Toda corrida queda registrada** en `import_runs`: archivo, filas leídas / insertadas / actualizadas / rechazadas, y el detalle de los rechazos en `import_errors` (fila, columna, motivo). Al final imprime un resumen legible en consola.
6. **Normalización de LinkedIn URL** (una sola función, testeada): minúsculas, `https://`, sin `www.`, sin query string, sin fragmento, sin slash final, `/in/{handle}`. Es la llave de join de todo el sistema.
7. **Normalización de empresa:** trim, colapso de espacios, quitar sufijos societarios (`S.A.`, `SpA`, `Ltda.`, `Limitada`, `S.A.C.`) para agrupar en el ranking, guardando el nombre original para mostrar. Tabla `company_aliases` (vacía al inicio, editable) para casos que la heurística no resuelva.
8. **Duplicados:** dos registros UDD distintos pueden caer en la misma `linkedin_url`. No los fusiones. Márcalos con `has_url_conflict = true` y repórtalos en el resumen de importación.

---

## 5. Modelo de datos

Postgres. Todo con `tenant_id`, todo con RLS. Ajusta tipos si tienes una razón, pero conserva la estructura y los invariantes.

```sql
-- Multi-tenancy
tenants(id uuid pk, slug text unique, name text, siglas text,       -- 'udd', 'Universidad del Desarrollo', 'UDD'
        created_at timestamptz)

profiles(id uuid pk references auth.users, full_name text, email text)

memberships(user_id uuid, tenant_id uuid, role text check (role in
            ('owner','admin','analyst','viewer')), primary key(user_id, tenant_id))

-- Núcleo
alumni(
  id uuid pk, tenant_id uuid not null,
  id_interno text not null,                    -- llave del CRM del cliente. NUNCA el RUT.
  source_full_name text not null,              -- nombre tal como vino de la universidad
  linkedin_name text, linkedin_url text,       -- normalizada
  match_score numeric(4,3), match_status text, -- 'match_alto' | 'revisar' | 'no_encontrado'
  career text, faculty text, campus text, graduation_year int,
  headline text, summary text,
  current_title text, current_company text, current_company_raw text,
  current_company_domain text, current_start_date date,
  city text, country text, jobs_count int,
  area text, seniority text,                   -- enums canónicos, ver §7
  photo_url text,
  personal_email text, work_email text, phone text,
  enriched_at timestamptz, verified_at timestamptz,
  last_change_at timestamptz,                  -- último cambio de cargo detectado
  opt_out boolean not null default false,      -- derecho de oposición (Ley 21.719)
  deleted_at timestamptz,                      -- supresión lógica; excluida de todas las queries
  has_url_conflict boolean not null default false,
  raw jsonb,                                   -- payload original de Clay, para trazabilidad
  created_at timestamptz, updated_at timestamptz,
  unique(tenant_id, id_interno)
)

work_history(
  id uuid pk, tenant_id uuid, alumnus_id uuid references alumni,
  title text, company text, company_raw text, company_domain text,
  start_date date, end_date date, is_current boolean,
  locality text, summary text, revenue_range text,
  order_index int, source_row_id text,
  unique(tenant_id, alumnus_id, company, title, start_date)
)

job_change_events(
  id uuid pk, tenant_id uuid, alumnus_id uuid references alumni,
  external_event_id text,
  from_company text, to_company text, from_title text, to_title text,
  detected_at timestamptz not null,
  is_promotion boolean not null default false,
  seen_at timestamptz, seen_by uuid,
  raw jsonb,
  unique(tenant_id, external_event_id)
)

-- Compliance y operación
data_provenance(id uuid pk, tenant_id uuid, alumnus_id uuid,
                field text, source text, provider text,   -- 'clay:enrich_person', 'contactout', 'udd_csv'
                verified_at timestamptz)

audit_log(id bigserial pk, tenant_id uuid, user_id uuid, action text,
          entity text, entity_id text, fields text[],     -- qué campos sensibles se expusieron
          ip inet, user_agent text, created_at timestamptz)

import_runs(id uuid pk, tenant_id uuid, kind text, filename text,
            rows_read int, rows_inserted int, rows_updated int, rows_rejected int,
            started_at timestamptz, finished_at timestamptz, summary jsonb)

import_errors(id bigserial pk, run_id uuid, row_number int, column_name text,
              raw_value text, reason text)

export_jobs(id uuid pk, tenant_id uuid, user_id uuid, format text,
            filters jsonb, status text, row_count int, file_path text,
            includes_contact_data boolean, created_at timestamptz)

company_aliases(tenant_id uuid, raw text, canonical text, primary key(tenant_id, raw))

api_keys(id uuid pk, tenant_id uuid, name text, key_hash text,
         scopes text[], last_used_at timestamptz, revoked_at timestamptz)
```

**Índices mínimos:** `alumni(tenant_id, deleted_at)`, `alumni(tenant_id, linkedin_url)`, `alumni(tenant_id, seniority)`, `alumni(tenant_id, area)`, `alumni(tenant_id, current_company)`, `alumni(tenant_id, graduation_year)`, GIN trigram sobre `source_full_name` para la búsqueda, `job_change_events(tenant_id, detected_at desc)`, `work_history(alumnus_id, start_date desc)`.

**Búsqueda por nombre:** `pg_trgm` + columna generada `unaccent(lower(source_full_name))`. Debe funcionar sin tildes y por apellido.

---

## 6. Tokens de diseño

Extrae todo lo del §"Design Tokens" del handoff a `tailwind.config.ts` y a variables CSS. Nombres sugeridos: `purple-900 #26215C`, `purple-600 #534AB7`, `purple-300 #AFA9EC`, `navy-900 #0D1B2A`, `cream-50 #F8F7F2`. Los alphas frecuentes (`rgba(13,27,42,.68)`, `.55`, `.5`, `.4`, bordes `.08`/`.14`/`.06`, superficies púrpura `.04`/`.07`/`.09`, acento `rgba(83,74,183,.12)`, hover de fila `rgba(175,169,236,.09)`) van como **tokens semánticos** (`text-secondary`, `border-card`, `surface-table-head`, `hover-row`…), no como valores sueltos repetidos.

Reglas que no se negocian:
- `font-variant-numeric: tabular-nums` en **todos** los números: KPIs, porcentajes, conteos, años, fechas, IDs, scores. Datos numéricos en tabla y listas en `font-weight: 500`; cifras KPI grandes en 700 con `letter-spacing: -.03em`.
- Georgia **solo** en el wordmark "Argos". En ningún otro lugar hay serif.
- La app **no usa sombras**. Las tarjetas se separan por borde de 1px. La única excepción es el header sticky, que resuelve con `backdrop-filter: blur(12px)` sobre `rgba(248,247,242,.92)`.
- El **isotipo** (ojo, viewBox `0 0 32 32`, dos variantes: sobre navy con trazo/iris `#AFA9EC`; sobre crema con trazo `#26215C` e iris `#534AB7`) es un componente `<ArgosMark variant="navy|cream" />` **separado** del wordmark. El isotipo nunca contiene el texto.
- Animaciones: solo `argosFade` (entrada de pantalla, 300ms ease-out, opacity + translateY 6px) y `argosDot` (punto de estado, 1.6s infinite, opacidad 1→.25→1). **Respetar `prefers-reduced-motion`** y desactivar ambas.

---

## 7. Enums canónicos — hay un conflicto que debes resolver así

El handoff de diseño propone enums de `Seniority` y `Area` que **no coinciden exactamente** con los que produce el clasificador real de Argos (`clasificar_seniority_area.py`). **Manda el dato real.** Estos son los enums canónicos, y **el orden importa** (define el orden de la barra apilada y de la leyenda):

**Seniority** (9 niveles, de mayor a menor):
`C-Level` · `Director` · `Gerente` · `Subgerente` · `Jefatura` · `Profesional Senior` · `Profesional` · `Trainee` · `No identificado`

La escala de color del handoff tiene 8 tonos (`#26215C · #3B3392 · #534AB7 · #6A62C4 · #8079D0 · #9992DD · #AFA9EC · #CFCBF4`). Asigna esos 8 a los primeros 8 niveles y agrega **`No identificado` en gris neutro** `rgba(13,27,42,.18)`, siempre al final de la barra y de la leyenda. Si su porcentaje es 0, no lo dibujes.

**Área** (11 valores):
`Gerencia General` · `Emprendimiento` · `Finanzas` · `Marketing` · `Ventas` · `Tecnología` · `RRHH` · `Legal` · `Operaciones` · `Estrategia y Consultoría` · `Otro`

En la lista de área, ordena **por conteo descendente** (no por el orden del enum), como en el prototipo. `Otro` va siempre al final, aunque su conteo sea alto.

Define ambos como `const` arrays en `/lib/domain/enums.ts`, con tipos derivados, y valida contra ellos en la ingesta: **un valor fuera del enum es un error de importación, no un valor nuevo.**

---

## 8. Reglas de negocio y cálculos derivados

Todo esto vive en `/lib/domain` con tests unitarios. Nada de calcularlo dentro de un componente.

| Métrica | Definición |
|---|---|
| **Egresados en la base** | `count(alumni)` del tenant, `deleted_at is null`. Piloto: 8.120. Subtexto "cohortes AAAA — AAAA" con `min/max(graduation_year)` reales; si no hay años, omite el subtexto. |
| **Match LinkedIn** | `count(match_status = 'match_alto') / count(*)`. Piloto: 6.426 / 8.120 = **79,1%**. La barra de progreso usa ese mismo porcentaje. |
| **Cambios de trabajo · {mes}** | `count(job_change_events)` con `detected_at` en el mes en curso. Subtexto: variación vs. mes anterior (`+N%`) y `count(seen_at is null)` sin revisar. **Si no hay datos (monitoreo apagado): estado vacío, no "0" a secas ni comparación falsa.** |
| **Distribución por seniority** | Sobre los egresados **con match y enriquecidos**. Anotación de esquina: "N con match" con el conteo real. Porcentajes redondeados a entero que **sumen 100** (usa el método del resto mayor). |
| **Área de trabajo** | Ídem, porcentaje entero, barra con ancho = `pct / max(pct) × 100%`. |
| **Feed "Últimos cambios detectados"** | Últimos 5–6 `job_change_events` por `detected_at desc`. Muestra cargo anterior tachado → flecha → cargo nuevo. |
| **Empresas con más egresados** | `group by` empresa canónica sobre egresados con match, top 10 por conteo. Anotación "top 10 de N" con `count(distinct empresa)` real. |
| **Badge "nuevo cargo"** | `last_change_at` dentro de los últimos 30 días. |
| **"Actualizado hace N d"** | Días desde `enriched_at` (fallback `updated_at`), formateado `hace N d`; sobre 60 días, muestra la fecha. |
| **Es ascenso** | Mismo `company` canónico en origen y destino → `is_promotion = true`. En la UI se distingue del cambio de empresa: el prototipo usa "(ascenso)" en el cargo; súbelo a un **badge propio** en `rgba(83,74,183,.12)`/`#534AB7` y omite la flecha entre empresas idénticas. |
| **Permanencia promedio** (perfil) | Media en meses de las posiciones **cerradas** del historial (excluye la actual). |
| **Trayectoria** (perfil) | Compara el rango de seniority del cargo actual contra el de la primera posición: `ascendente` / `estable` / `lateral`. Si el historial tiene menos de 2 posiciones: `sin datos suficientes`. |
| **Último cambio** (perfil) | `start_date` más reciente del historial. |
| **Verificado** (perfil) | `verified_at`, o `enriched_at` si no hay verificación posterior. |
| **Score de match** (perfil) | `match_score` formateado es-CL con 2 decimales: `match 0,96`. |

**Formato:** absolutamente todo con `Intl.NumberFormat("es-CL")` (punto de miles, coma decimal) y `Intl.DateTimeFormat("es-CL")`. Un helper `fmt.number()`, `fmt.percent()`, `fmt.date()`, `fmt.relativeDays()` en `/lib/format`. Prohibido `toLocaleString()` suelto por ahí.

**Chips de facultad (Dashboard):** el prototipo lista facultades fijas. En producción se derivan de `select distinct faculty` del tenant. Para el piloto UDD probablemente exista **una sola** (Economía y Negocios): en ese caso **oculta la fila de chips completa** en vez de mostrar un único chip inútil. Cuando hay 2 o más, el chip filtra **todos los widgets de la pantalla**, no solo su propio estado visual.

---

## 9. Pantallas

Implementa las 4 pantallas exactamente como las especifica el handoff (§"Screens / Views"), con estas precisiones de producción:

**Shell** — grid `236px 1fr`, sidebar navy sticky, header sticky con título + divisor + pill de tenant (`UDD` + nombre completo) + Exportar + pill de usuario. El pill de tenant se lee de la sesión, no se hardcodea. El widget de sincronización del sidebar muestra datos reales del último `import_run` ("Enriquecimiento del mes: X / Y registros", barra de progreso, punto pulsante + "Sincronizado {fecha} {hora}"); si nunca se ha corrido, muestra "Sin sincronizaciones aún".

**Dashboard** (`/dashboard`) — chips de facultad, 3 KPIs (la tercera es la tarjeta inversa navy), 2 gráficos (`1.15fr 1fr`), feed de últimos cambios con "Ver todas las alertas".

**Egresados** (`/egresados`) — grid `238px 1fr`, panel de filtros sticky a `top: 69px`, barra de acciones con buscador, tabla de 8 columnas con `min-width: 980px`, pie con paginación, y tarjeta "Empresas con más egresados".
- Los **conteos de los filtros son facetas del backend** y se recalculan con cada filtro aplicado. No son estáticos.
- Grupos **colapsables**; en Empresa y Carrera, buscador interno + "ver más".
- **Paginación server-side** (el prototipo es estático). 50 filas por página. Ordenamiento por columna, al menos en Egreso, Actualizado, Nombre, Empresa.
- Búsqueda con **debounce 250ms**, contra nombre y apellido, insensible a tildes.
- Click en fila → perfil. Cursor pointer, hover `rgba(175,169,236,.09)`.
- **Filtros, búsqueda, orden y página viven en la query string.** La vista debe ser compartible por URL y sobrevivir un refresh.

**Perfil** (`/egresados/[id]`) — tarjeta de identidad con banda degradada, tags (seniority, área, ciudad, egreso, score), timeline de historial laboral, y columna derecha con contacto, educación y la tarjeta navy "Señales de Argos".
- El historial sale de `work_history` ordenado por `start_date desc`. Anotación "N posiciones · M años".
- **Datos de contacto no disponibles** se renderizan con icono de candado y "No disponible" en gris — no se ocultan. Es señal de valor del producto (y de dónde puede haber upsell).
- "Ver en LinkedIn" abre `linkedin_url` en pestaña nueva con `rel="noopener noreferrer"`.
- Educación: el pregrado siempre es la universidad tenant; los postgrados salen del enriquecimiento si existen.

**Alertas** (`/alertas`) — segmented control de período (mes/trimestre/semestre) que **recalcula los 4 KPIs**, dropdowns de área y seniority como **multiselect reales**, "Marcar todo como visto" con confirmación y update en lote, y la lista de tarjetas con estado leído/no leído reversible (mutación optimista con rollback).
- "Contactar": **decisión para el piloto → `mailto:` al correo disponible** (personal, si no corporativo) con asunto prellenado, y si no hay ningún correo, el botón queda deshabilitado con tooltip. Cada click se registra en `audit_log`. Cuando exista integración con el CRM de UDD, se reemplaza.
- El badge del sidebar = `count(seen_at is null)` del período por defecto.

**Reportes y Configuración** — no están diseñadas. `/reportes` queda como el estado vacío del prototipo (isotipo al 50% + "Módulo fuera del alcance de este prototipo"). `/configuracion` sí necesita un mínimo funcional en Fase 5: miembros del equipo y roles, API keys, y el registro de importaciones.

---

## 10. Estados que el prototipo no cubre (decídelos así)

- **Loading:** skeletons con la geometría exacta de cada tarjeta/fila. **Nunca spinners.**
- **Vacío por filtro:** "Sin resultados para estos filtros" + botón "Limpiar filtros".
- **Vacío por falta de datos:** copy específico según el caso (base sin enriquecer / monitoreo no activado / sin alertas en el período).
- **Error de API:** tarjeta con mensaje breve + "Reintentar". Nunca una pantalla en blanco ni un stack trace.
- **Sin permisos:** el recurso no se lista; no reveles su existencia.
- **Registros sin match** (1.694 en el piloto): **decisión → se muestran en la tabla**, con las celdas enriquecidas vacías (guion em `—` en gris) y un filtro "Estado de match: con match / por revisar / sin match" en el panel, con **"con match" preseleccionado**. Así el cliente ve el universo completo y entiende qué está pagando, sin ensuciar la vista por defecto. El KPI de match usa el denominador total.

---

## 11. Multi-tenancy y seguridad

- **RLS activo en todas las tablas de datos**, sin excepción. La política filtra por `tenant_id` contra la membresía del usuario. El filtro por tenant **vive en el servidor**; el cliente nunca lo elige.
- Ninguna query de la app usa la `service_role` key. Esa clave solo existe en el CLI de ingesta y en las migraciones, nunca en código que llegue al navegador.
- Todo endpoint resuelve el tenant desde la sesión y **verifica pertenencia antes de tocar la base**, aunque RLS ya lo cubra. Defensa en profundidad.
- Roles: `owner` (todo + facturación), `admin` (todo del tenant), `analyst` (ve todo, exporta, marca alertas), `viewer` (ve, no exporta datos de contacto).
- Los IDs en las URLs son UUIDs, no enteros secuenciales. Nunca expongas `id_interno` en una URL pública.
- Rate limiting en la API pública y en el endpoint de ingesta.
- Secretos por variables de entorno, `.env.example` documentado, nada de claves en el repo.

---

## 12. Privacidad y Ley 21.719 — requisito de producto, no adorno

Argos opera como **tercero mandatario (Art. 15 bis)**; la universidad es el responsable del tratamiento. La ley entra en plena vigencia el **1 de diciembre de 2026** y el abogado de privacidad de UDD está revisando la cadena de tratamiento. La implementación debe soportar:

1. **Pseudonimización:** la llave de negocio es `id_interno`. **El RUT no entra al sistema en ninguna forma:** ni columna, ni jsonb, ni logs, ni nombre de archivo. Si aparece en un CSV de ingesta, el importador lo **descarta explícitamente** y lo deja anotado en el resumen.
2. **Procedencia por campo:** cada dato enriquecido registra fuente, proveedor y fecha de verificación en `data_provenance`. Es lo que alimenta la tarjeta "Señales de Argos" y lo que se muestra si el titular ejerce derecho de acceso.
3. **Derecho de acceso y supresión:** un comando/endpoint que, dado un `id_interno`, exporta todo lo que el sistema sabe de esa persona (JSON) y otro que la suprime (borrado lógico + purga del `raw` + exclusión permanente de futuras ingestas mediante una tabla `suppression_list` por hash de `linkedin_url` e `id_interno`).
4. **Opt-out honrado en toda la cadena:** `opt_out = true` excluye al registro de la UI, de los exports, de la API pública y del re-enriquecimiento.
5. **Auditoría de acceso:** los **datos de contacto son el material más sensible**. Registra en `audit_log` toda vista de perfil que devuelva contacto (`action: 'contact_view'`, con `fields`), todo export que incluya contacto (`includes_contact_data`), y toda llamada a la API pública. Retención del log: 24 meses.
6. **Región de datos:** define y documenta dónde se alojan los datos antes de crear el proyecto Supabase. Es un punto con implicancias de transferencia internacional. **Pregúntame antes de crear el proyecto; no elijas región por default.**
7. En logs de aplicación y de error: **nunca** correos, teléfonos ni nombres completos. Solo IDs.

---

## 13. Exportación

- Respeta **exactamente** los filtros activos (incluida la búsqueda).
- CSV y Excel (`xlsx`). Encoding UTF-8 con BOM para que Excel en Windows no rompa las tildes.
- Para <25.000 filas, generación síncrona con streaming. Sobre eso, job asíncrono con notificación. Diseña la interfaz `createExportJob()` como asíncrona desde el día uno para no reescribirla con el segundo cliente.
- La inclusión de columnas de contacto depende del rol y **siempre** genera registro de auditoría.
- Nombre de archivo: `argos_{tenant}_{YYYY-MM-DD}.xlsx`.

---

## 14. API pública para el CRM del cliente (Fase 6)

Es parte de lo que se vende: la universidad conecta su propio CRM. Debe existir aunque el portal ya muestre los datos.

- Auth por **API key** (`Authorization: Bearer`), key hasheada en base, con scopes y revocación.
- `GET /v1/alumni?updated_since=&page=&per_page=` — paginado por cursor, `id_interno` como llave maestra.
- `GET /v1/alumni/{id_interno}` — ficha completa con historial.
- `GET /v1/job-changes?since=` — eventos de cambio.
- **Webhooks** salientes: `job_change.detected` y `alumnus.updated`, firmados con HMAC, con reintento exponencial y registro de entregas.
- **OpenAPI 3.1** generado desde los esquemas Zod, servido en `/v1/openapi.json` + Swagger UI en `/docs`. La documentación es parte del entregable comercial, no un extra.

---

## 15. Performance, accesibilidad, responsive

- El piloto son 8k filas, pero la arquitectura apunta a **50k+ por tenant**: paginación y facetas en el servidor desde el inicio, nada de traer la tabla completa al cliente.
- Objetivo: Dashboard y Egresados en **<1,5s** con datos reales.
- Accesibilidad: navegación completa por teclado, foco visible (anillo `#534AB7`), contraste AA, `aria-label` en botones de solo icono, las filas de tabla clickeables son elementos accesibles (no `div` con `onClick` a secas).
- Responsive: desktop-first (≥1280px). Bajo ~1100px: KPIs a 2 columnas, gráficos apilados, panel de filtros en drawer, sidebar colapsada a iconos. Móvil no está diseñado — **no lo inventes**, deja el layout utilizable y avísame.
- Fotos de LinkedIn: **no hotlinkear** (las URLs del CDN expiran y hay implicancias de privacidad). Para v1 usa **iniciales sobre la paleta de 5 tonos** (`#26215C`, `#534AB7`, `#7C74C9`, `#0D1B2A`, `#8079D0`, rotados por índice), con el campo `photo_url` listo y un componente `<AlumniAvatar>` que soporte foto cuando definamos proxy y caché.

---

## 16. Plan de trabajo por fases

**Detente en cada checkpoint, muéstrame el resultado y espera confirmación antes de seguir.** No avances tres fases de corrido.

**Fase 0 — Fundaciones.** Next.js + TS + Tailwind con tokens de Argos, fuente self-hosted, `<ArgosMark>`, shell completo (sidebar + header + rutas vacías con `argosFade`), primitivos de UI. `CLAUDE.md` escrito. `.env.example`.
→ **CHECKPOINT 1:** el shell navega y se ve exactamente como el prototipo, con datos en cero.

**Fase 1 — Datos.** Schema Drizzle + migraciones + RLS + seed de tenant UDD y usuario de prueba. Enums canónicos y helpers de formato con tests.
→ **CHECKPOINT 2:** muéstrame el schema y las políticas RLS antes de cargar nada.

**Fase 2 — Ingesta.** CLI con `--inspect`, mapeo YAML, normalizadores, upserts idempotentes, `import_runs` / `import_errors`. Carga real de las tres tablas de Clay.
→ **CHECKPOINT 3:** resumen de importación con los conteos reales. Deben cuadrar: ~8.120 egresados, ~6.426 con match alto, N posiciones de historial, 0 eventos de cambio. Si no cuadra, **para y avísame** — no ajustes la data para que calce.

**Fase 3 — Dashboard + Egresados + Perfil.** Todo con datos reales, filtros con facetas del backend, paginación y orden server-side, estado en la URL, loading/empty/error.

**Fase 4 — Alertas.** Ingesta de eventos + pantalla completa + estado vacío honesto mientras el monitoreo esté apagado + mutaciones optimistas.

**Fase 5 — Export, auditoría y configuración.** Export con filtros y auditoría, `audit_log` operativo, acceso/supresión/opt-out, `/configuracion` mínimo.

**Fase 6 — API pública + webhooks + OpenAPI.**

**Fase 7 (opcional) — Landing** desde `Argos Landing.dc.html`.

---

## 17. Criterios de aceptación

- [ ] Cero números hardcodeados del prototipo en el código de producción.
- [ ] Los conteos de la UI cuadran con `select count(*)` sobre la base cargada.
- [ ] Un usuario del tenant A no puede leer un solo registro del tenant B, ni por API, ni por URL directa, ni desactivando JS. Hay un test que lo prueba.
- [ ] Filtros + búsqueda + orden + página sobreviven un refresh y se comparten por URL.
- [ ] `pnpm ingest` es idempotente: correrlo dos veces con el mismo CSV no duplica ni una fila.
- [ ] Ninguna fila se descarta en silencio: todo rechazo queda en `import_errors`.
- [ ] Ningún RUT en base, logs ni exports.
- [ ] Todo acceso a datos de contacto queda auditado.
- [ ] Toda cifra formateada en es-CL; todos los números tabulares.
- [ ] `prefers-reduced-motion` desactiva `argosFade` y `argosDot`.
- [ ] Skeletons con la geometría real; ningún spinner.
- [ ] Lighthouse accesibilidad ≥ 95 en Dashboard y Egresados.
- [ ] `pnpm build` limpio, sin `any` en el código de dominio, sin warnings de TS.
- [ ] E2E: login → dashboard → filtrar → abrir perfil → exportar.

---

## 18. Qué NO hacer

- No copiar el HTML de los `.dc.html` ni portar `support.js`.
- No dejar estilos inline; todo va a tokens y clases.
- No inventar datos, ni de relleno ni de demo, dentro de las rutas de la app.
- No agregar dependencias fuera de §2 sin avisar.
- No cambiar el stack ni el modelo de datos por tu cuenta.
- No usar `service_role` en código de cliente.
- No poner el RUT en ninguna parte.
- No hotlinkear imágenes de LinkedIn.
- No avanzar de fase sin confirmación en los checkpoints.

---

## 19. Antes de empezar, pregúntame esto

No asumas ninguna de estas. Levántalas todas juntas al inicio, en una sola tanda:

1. Los **headers exactos** de los tres CSV de Clay (o los archivos mismos). El mapeo se escribe con eso a la vista.
2. ¿La tabla `Historial laboral UDD` trae la LinkedIn URL o el id de la fila padre? ¿Cuál es el vínculo real?
3. ¿La base UDD trae **año de egreso**, **facultad** y **sede**, o solo código alumni + nombre? De eso depende el subtexto de cohortes y los filtros.
4. ¿Los datos de contacto (correo personal, corporativo, teléfono) ya están enriquecidos en la tabla, o llegan después de cerrar ContactOut?
5. **Región de alojamiento** de Supabase (implicancias de transferencia internacional bajo la Ley 21.719).
6. ¿Quiénes son los usuarios de UDD en el piloto, qué roles y con qué dominio de correo se autentican?
7. ¿Dominio definitivo del portal? (afecta el envío de magic links y la config de auth)
8. ¿Qué se hace con los 1.694 registros sin match: se muestran como propongo en §10, o UDD prefiere no verlos?
