# Arquitectura y contratos de la POC

Leer en el Paso 4 (construcción), una sola vez. El núcleo (login, menú, router, UI, datos)
ya viene en `templates/` y lo copia `scaffold_poc.py`: **no se reescribe ni se lee**; solo
se generan las piezas propias del cliente listadas en §2.

## 1. Stack (fijo)

| Capa | Elección | Motivo |
|------|----------|--------|
| Front | HTML + CSS + JavaScript vanilla con módulos ES, sin build | Zero setup: GitHub Pages lo sirve tal cual |
| Iconos | Phosphor Icons (CDN) — clases `ph ph-<nombre>` | Catálogo amplio para menús de cualquier rubro |
| Gráficos | Chart.js 4 (CDN) vía `ui.chart()` | Toma la paleta del cliente automáticamente |
| Datos | Firestore (Firebase JS SDK 10, CDN) con respaldo `localStorage` + `data/seed.json` | La demo nunca se cae: si Firebase falla, sigue local |
| Auth | Firebase Auth Email/Password; rol y perfil desde `poc-config.json` | Usuarios de prueba reales sin backend propio |
| Hosting | GitHub Pages, rama `main`, carpeta raíz | Link público para compartir |

Prohibido: frameworks con build (React/Vite/Angular), npm, backends propios, rutas absolutas
(`/css/...` rompe Pages en subcarpeta), datos reales de personas o clientes.

## 2. Estructura del repo de la POC

```
index.html, css/styles.css, js/core/*        ← núcleo (scaffold, se sobrescribe)
css/theme.css, js/poc-config.js, README.md   ← generados por scaffold desde poc-config.json
js/views/index.js                            ← generado por scaffold (imports)
poc-config.json   ← lo escribe el agente (§3)
data/seed.json    ← lo escribe el agente (§5)
js/views/<id>.js  ← lo escribe el agente: dashboard + un archivo por flujo principal (§4)
docs/manual-usuario.md, docs/flujos-funcionales.md ← copia de los entregables
firestore.rules, .nojekyll
```

Personalización visual fuera de la paleta: agregar reglas al final de una vista con un
`<style>` acotado, o pedir un cambio en `templates/css/styles.css` del agente (beneficia a
todas las POCs). Nunca editar `js/core/` en el repo de la POC: el próximo scaffold lo pisa.

## 3. `poc-config.json`

Ejemplo completo en [poc-config.example.json](poc-config.example.json).
Reglas:

- `slug`: minúsculas con guiones; prefija las claves de `localStorage`.
- `palette`: hex. Mínimo `primary`; el resto tiene defaults. `sidebar` oscuro por defecto.
  Si el cliente da una sola marca, derivar `secondary`/`accent` armónicos y anotarlo en el brief.
- `roles[].permissions`: `["*"]` = acceso total (obligatorio al menos un rol así). Permisos
  finos con verbos de negocio (`solicitudes.aprobar`) que las vistas consultan con `ctx.can()`.
- `users`: emails en dominio ficticio del cliente (`@demo.<cliente>.com`), contraseña ≥ 6
  caracteres, misma convención para todos (ej. `Demo2026!`). Sin roles informados: un único
  usuario administrador con `["*"]`.
- `menu[]`: exactamente uno de `view` (funcional), `status: "construction"` o `href` (externo).
  `section` agrupa ítems; `roles` limita visibilidad; en construcción completar `description`
  y `upcoming` (3–5 capacidades). El primer ítem con `view` es la pantalla de inicio.
- `demo.scenarios[]`: `{label, description, route, user?, hint?}` — un escenario por flujo
  principal y por variante relevante (ej. rechazo, mora, aprobación de supervisor).
- `notifications[]`: 3–5 avisos verosímiles del rubro.
- `firebase`: el objeto `firebaseConfig` que entregó el usuario (es público por diseño; la
  protección son las reglas). `null` = modo local.
- `deploy`: `repoUrl`, `branch`, `pagesUrl` (opcional; se deriva del repo).
- `app.version`: semver, ver §7.

## 4. Contrato de vistas

Cada `js/views/<id>.js` se registra solo. `render` puede devolver una función de limpieza.

```js
import { registerView } from '../core/registry.js';

registerView('solicitudes', {
    async render(el, { db, ui, user, can, params, navigate, refresh }) {
        const rows = await db.list('solicitudes');
        el.innerHTML = `${ui.pageHeader('Solicitudes', 'Bandeja de trabajo',
            can('solicitudes.crear') ? '<button class="btn btn-primary" data-new><i class="ph ph-plus"></i> Nueva</button>' : '')}
            <div class="card" data-table></div>`;
        ui.dataTable(el.querySelector('[data-table]'), {
            rows, filters: [{ key: 'estado', label: 'Estado', options: ['Pendiente', 'Aprobada', 'Rechazada'] }],
            columns: [
                { key: 'id', label: 'N°' },
                { key: 'monto', label: 'Monto', align: 'right', render: r => ui.formatMoney(r.monto) },
                { key: 'estado', label: 'Estado', render: r => ui.badge(r.estado, r.estado === 'Aprobada' ? 'success' : 'warning') },
            ],
            onRowClick: r => navigate(`solicitudes/${r.id}`),   // detalle: params[0] === r.id
        });
        el.querySelector('[data-new]')?.addEventListener('click', () => ui.modal({
            title: 'Nueva solicitud',
            body: `<div class="form-grid">${ui.formFields([{ name: 'monto', label: 'Monto', type: 'number', required: true, min: 1 }])}</div>`,
            actions: [{ label: 'Cancelar', variant: 'secondary' }, { label: 'Crear', onClick: async (close, root) => {
                const data = ui.readForm(root);
                if (!data) return false;                       // mantiene el modal abierto con errores
                await db.add('solicitudes', { ...data, estado: 'Pendiente', fecha: ui.nowIso() });
                await db.log('Alta de solicitud', { monto: data.monto }, user);
                ui.toast('Solicitud creada.', 'success');
                refresh();
            } }],
        }));
    },
});
```

API disponible (no reimplementar):

- `db`: `list(col)`, `get(col,id)`, `add(col,data)`, `update(col,id,patch)`, `remove(col,id)`,
  `log(accion, detalle, user)` (colección `auditoria`), `reset()`, `mode`.
- `ui`: `pageHeader`, `kpiCard`, `chart(canvas, chartJsConfig)`, `dataTable`, `badge`, `modal`,
  `confirmDialog`, `formFields`, `readForm`, `toast`, `underConstruction(nombre)`, `emptyState`,
  `loading`, `errorState`, `formatMoney`, `formatNumber`, `formatDate`, `nowIso`, `esc`,
  `fakeLatency`, `streamText`, `confidence`, `initials`.
- Clases CSS: `grid cols-2|3|4`, `span-2`, `card`, `card-head`, `chart-box`, `steps/step done|current`,
  `timeline`, `alert alert-*`, `ai-panel`, `ai-tag`, `dl`, `list`, `chips`, `row gap`, `stack`.
- Todo texto que venga de datos va por `ui.esc()` (o por `render` de columnas con `esc`).

## 5. `data/seed.json`

`{"collections": {"<col>": [{"id": "...", ...}]}}`. Reglas:

- `id` legible y del dominio (`SOL-0001`, `001-001-0001001`), sin `/`.
- 8–30 registros por colección; cubrir **todos los estados** de cada máquina de estados
  (mín. 2 por estado) para que cada escenario demo tenga casos.
- Nombres, montos, fechas y documentos verosímiles para el rubro y país del cliente; fechas
  relativas a la fecha actual (últimos 90 días y próximos 60).
- Relaciones por id (`clienteId`), no objetos anidados profundos.

## 6. Patrones UX obligatorios

- Login con validación por campo, error claro de credenciales, bloqueo tras 5 intentos,
  "Olvidé mi contraseña" simulado y "Ingresar en modo demo" (los da el núcleo).
- Dashboard temático: 4 KPIs + 2 gráficos + una lista de "pendientes/alertas" con acceso
  directo a los flujos principales.
- Cada flujo principal: listado → detalle → acción con confirmación → cambio de estado
  visible (badge, `steps`, `timeline`) → toast de éxito → registro en `auditoria`.
- Errores de negocio con mensaje accionable (qué pasó + qué hacer), nunca técnico.
- Estados vacíos y de carga en toda lista; acciones sin implementar → `ui.underConstruction()`.
- Botones de acciones secundarias del rubro (exportar, imprimir, compartir) presentes pero en
  construcción: suman sensación de producto.

## 7. Versionado e iteraciones

`app.version` en semver: **patch** = ajustes visuales o de textos; **minor** = flujo, vista o
escenario nuevo; **major** = rediseño o cambio de alcance. Cada iteración edita solo las vistas
afectadas, sube la versión, vuelve a correr scaffold + validador y agrega una línea al
historial de cambios del manual. Nunca regenerar la POC completa por un ajuste.

## 8. IA simulada (productos guiados por IA)

Las capacidades de IA se simulan de forma determinista sobre los datos semilla, con:
latencia (`ui.fakeLatency`), respuesta en streaming (`ui.streamText`), indicador de
confianza (`ui.confidence`), explicación breve del porqué ("factores considerados"),
acción humana de aceptar/editar/rechazar (human-in-the-loop) y registro en `auditoria`.
Usar el contenedor `card ai-panel` con `ai-tag` "Sugerido por IA". Respuestas preparadas
por escenario en el seed (colección `ia_respuestas` o campos `ia*` en cada registro).
