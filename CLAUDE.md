# Argos Alumni — guía del repositorio

> Este archivo es el resumen que debe sobrevivir a la compactación de contexto.
> La especificación completa está en `PROMPT_ARGOS.md` (contrato de producto) y
> en `design_handoff_argos_alumni/README.md` (fuente de verdad de la UI).
> Ante conflicto entre ambos, **manda `PROMPT_ARGOS.md`**.

## Qué es

Plataforma web multi-tenant B2B para universidades chilenas. La universidad
entrega su base de egresados (ID interno + nombre); Argos la cruza contra
LinkedIn, la enriquece con datos profesionales públicos y monitorea cambios de
trabajo. Este repo es **la capa de producto**: el portal donde el cliente ve,
filtra, explora y exporta su base, más la API pública para su CRM.

**Cliente piloto:** Universidad del Desarrollo (UDD), Ingeniería Comercial.
**Volumen real:** 8.120 registros, 6.426 con match alto (~79,1%).

El pipeline de enriquecimiento vive en Clay y **no** se reimplementa aquí.

## Reglas invariantes

Estas no se negocian y no se re-litigan. Si algo parece exigir romperlas,
**pregunta antes de actuar**.

1. **Ningún número del prototipo puede quedar hardcodeado.** Los mocks (42.317,
   1.164, 312, 33.428, el top 10 de empresas, los 9 egresados, las 7 alertas)
   son *contrato de datos, no contenido*. Cada cifra se calcula desde Postgres,
   scopeada por tenant y por los filtros activos. Si un dato no existe todavía
   → **estado vacío honesto**, nunca un número inventado ni un placeholder que
   parezca real.
2. **No inventes datos** de relleno ni de demo dentro de las rutas de la app.
3. **El RUT no entra al sistema en ninguna forma**: ni columna, ni jsonb, ni
   logs, ni nombre de archivo. Si aparece en un CSV, el importador lo descarta
   explícitamente y lo anota en el resumen de importación. La llave de negocio
   es `id_interno`.
4. **RLS activo en todas las tablas de datos.** El filtro por `tenant_id` vive
   en el servidor; el cliente nunca lo elige. Todo endpoint verifica pertenencia
   antes de tocar la base, aunque RLS ya lo cubra (defensa en profundidad).
5. **`service_role` jamás en código que llegue al navegador.** Solo en el CLI de
   ingesta y en las migraciones.
6. **Nunca se descarta una fila en silencio.** Todo rechazo de ingesta queda en
   `import_errors` con fila, columna y motivo.
7. **En logs de aplicación y de error: nunca correos, teléfonos ni nombres
   completos.** Solo IDs.
8. **Todo acceso a datos de contacto queda auditado** en `audit_log`.
9. **No hotlinkear fotos de LinkedIn** (las URLs del CDN expiran y hay
   implicancias de privacidad).
10. **No agregar dependencias fuera del stack definido** sin avisar primero.
11. **No avanzar de fase sin confirmación en el checkpoint.**

## Stack (decidido, no re-litigar)

| Capa | Decisión |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript estricto |
| Estilos | Tailwind CSS 3, tokens de Argos en `tailwind.config.ts` |
| Base de datos | Postgres en Supabase |
| Acceso a datos | Drizzle ORM + migraciones versionadas en `/drizzle` |
| Auth | Supabase Auth (magic link), `tenant_id` en el JWT |
| Server state | TanStack Query |
| Tabla | TanStack Table (headless) |
| Gráficos | **Sin librería.** Barras = divs con width porcentual |
| Iconos | Lucide React |
| Fuente | Instrument Sans self-hosted (`next/font/local`). Georgia solo wordmark |
| Validación | Zod en todo borde de entrada |
| Tests | Vitest (unit) + Playwright (e2e) |
| Deploy | Vercel + Supabase |
| Package manager | pnpm |

## Comandos

```bash
pnpm dev             # servidor de desarrollo
pnpm build           # build de producción (debe salir limpio, sin warnings TS)
pnpm typecheck       # tsc --noEmit
pnpm lint            # eslint
pnpm test            # vitest run
pnpm test:watch      # vitest en watch
```

Comandos previstos en fases siguientes:

```bash
pnpm ingest --inspect <archivo.csv>                        # Fase 2
pnpm ingest --tenant udd --type alumni|history|events --file <ruta>
```

## Enums canónicos

Definidos en `lib/domain/enums.ts`. **Manda el dato real** que produce
`clasificar_seniority_area.py`, no los enums del handoff de diseño. **El orden
importa**: define el orden de la barra apilada de seniority y de su leyenda.
Un valor fuera del enum es un **error de importación**, no un valor nuevo.

**Seniority** (9, de mayor a menor):
`C-Level` · `Director` · `Gerente` · `Subgerente` · `Jefatura` ·
`Profesional Senior` · `Profesional` · `Trainee` · `No identificado`

Los 8 primeros usan la escala púrpura del handoff
(`#26215C · #3B3392 · #534AB7 · #6A62C4 · #8079D0 · #9992DD · #AFA9EC · #CFCBF4`);
`No identificado` va en gris neutro `rgba(13,27,42,.18)`, siempre al final de la
barra y de la leyenda, y **no se dibuja si su porcentaje es 0**.

**Área** (11):
`Gerencia General` · `Emprendimiento` · `Finanzas` · `Marketing` · `Ventas` ·
`Tecnología` · `RRHH` · `Legal` · `Operaciones` · `Estrategia y Consultoría` ·
`Otro`

En la lista de área se ordena **por conteo descendente**, no por el orden del
enum, y `Otro` va siempre al final aunque su conteo sea alto.

**Match status:** `match_alto` · `revisar` · `no_encontrado`
**Roles:** `owner` (todo + facturación) · `admin` (todo del tenant) ·
`analyst` (ve, exporta, marca alertas) · `viewer` (ve, no exporta contacto)

## Estructura

```
/app
  /(app)            shell (sidebar + header) y las pantallas del portal
  /(marketing)      landing pública (Fase 7)
  /api              API interna del portal
  /v1               API pública para el CRM del cliente (Fase 6)
/components
  /ui               primitivos: Button, Chip, Checkbox, Badge, Avatar, Card,
                    Segmented, ProgressBar, Skeleton, EmptyState
  /argos            ArgosMark, Wordmark, Sidebar, AppHeader, SyncWidget, Screen…
/lib
  /domain           enums, normalizadores, cálculos derivados (con tests)
  /db               drizzle schema, cliente, queries          (Fase 1)
  /clay             adaptadores de ingesta (CSV + webhook)    (Fase 2)
  /auth /audit /export /format
/ingest             CLI de importación + /mappings/udd.yaml   (Fase 2)
/drizzle            migraciones SQL                           (Fase 1)
/design_handoff_argos_alumni   referencia, NO se compila
```

## Convenciones de UI

- **Formato:** todo con `Intl.NumberFormat("es-CL")` y `Intl.DateTimeFormat("es-CL")`
  a través de los helpers de `/lib/format` (`fmt.number`, `fmt.percent`, `fmt.date`,
  `fmt.relativeDays`). **Prohibido `toLocaleString()` suelto.**
- **Números tabulares siempre.** Utilidades en `globals.css`: `.tabular`,
  `.num` (tabular + peso 500, para tablas y listas) y `.num-kpi`
  (tabular + peso 700 + `-.03em`, para cifras KPI grandes).
- **Georgia solo en el wordmark.** Ningún otro serif en la app.
- **La app no usa sombras.** Las tarjetas se separan por borde de 1px. La única
  excepción es el header sticky (`backdrop-blur-[12px]` sobre `surface-header`).
- **Solo dos animaciones:** `argosFade` (entrada de pantalla) y `argosDot`
  (punto de estado). Ambas se desactivan bajo `prefers-reduced-motion`.
- **Colores:** ningún literal hex en JSX. Todo por token de `tailwind.config.ts`.
  Los cinco colores base están en canales RGB, así que los modificadores de
  opacidad funcionan: `text-navy-900/68` = `rgba(13,27,42,.68)`.
- **Loading:** skeletons con la geometría real de cada tarjeta/fila. **Nunca
  spinners.**
- **Estado en la URL:** filtros, búsqueda, orden, período y página viven en la
  query string. La vista debe ser compartible y sobrevivir un refresh.
- **Accesibilidad:** navegación completa por teclado, foco visible (anillo
  `#534AB7`), contraste AA, `aria-label` en botones de solo icono. Las filas de
  tabla clickeables son elementos accesibles, no `div` con `onClick`.
- **Cálculos derivados van en `/lib/domain` con tests**, nunca dentro de un
  componente.

## Privacidad — Ley 21.719

Argos opera como **tercero mandatario (Art. 15 bis)**; la universidad es el
responsable del tratamiento. Plena vigencia: **1 de diciembre de 2026**.

- Pseudonimización por `id_interno`. Sin RUT (ver regla 3).
- Procedencia por campo en `data_provenance` (fuente, proveedor, fecha de
  verificación). Alimenta la tarjeta "Señales de Argos".
- Derecho de acceso y supresión: export JSON por `id_interno`, y supresión =
  borrado lógico + purga del `raw` + `suppression_list` por hash de
  `linkedin_url` e `id_interno` para excluirlo de futuras ingestas.
- `opt_out = true` excluye de la UI, los exports, la API pública y el
  re-enriquecimiento.
- Retención del `audit_log`: 24 meses.
- **Región de datos de Supabase: pendiente de definir con el cliente.** No crear
  el proyecto con la región por defecto.

## Estado actual

**Fase 0 completada** (fundaciones: tokens, fuente, isotipo, shell, primitivos,
rutas vacías). Detenido en el CHECKPOINT 1 a la espera de confirmación.

Fases siguientes: 1 datos y RLS · 2 ingesta · 3 dashboard/egresados/perfil ·
4 alertas · 5 export, auditoría y configuración · 6 API pública · 7 landing.

### Preguntas abiertas que bloquean fases posteriores

Todas planteadas en el CHECKPOINT 1, ninguna respondida aún:
headers exactos de los tres CSV de Clay · llave de vínculo del historial
laboral · si la base UDD trae año de egreso / facultad / sede · si los datos de
contacto ya están enriquecidos · **región de Supabase** · usuarios y roles del
piloto · dominio definitivo del portal · qué hacer con los 1.694 sin match.
