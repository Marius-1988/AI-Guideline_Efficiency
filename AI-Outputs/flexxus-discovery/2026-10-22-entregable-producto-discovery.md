# Flexxus — Discovery de modernización · Entregable de Producto (4 semanas)

> **Fecha:** 2026-10-22 · **Versión:** v0.3 preliminar, para revisión con Flexxus. Reemplaza al [Entregable parcial S1 v0.2](2026-10-08-entregable-parcial-s1-venta-stock.md), que queda como anexo del relevamiento de la Semana 1
> **Autor:** Líder de Producto (intive)
> **Alcance:** track de Producto del Discovery, Semanas 1 a 4, con la **intención del usuario** como unidad de visión de producto. Intenciones analizadas: **Vender en mostrador** (rol Vendedor, prioritaria) y **Gestionar y cerrar la venta** (rol Administrativo)
> **Documentos de esta versión:** [PRD v3.0.0](../prd/PRD-flexxus-venta-stock-2026-10-22.md) · [Definición de roles](2026-10-22-roles-vendedor-administrativo.md) · [User flows](2026-10-22-user-flows-vendedor-administrativo.md)

Las decisiones, hallazgos y riesgos viven en el PRD y se citan por su ID (S-nn, H-n, R-n). Los minutos entre corchetes remiten a la grabación de la demo del 21/10.

---

## Resumen

| Semana | Entregable de Producto (Propuesta técnica) | Estado | Lo principal |
|---|---|---|---|
| **1 · Relevamiento** (05 al 09-10) | Situación actual, inventario de módulos y capabilities, documentación, estado de accesos; acuerdo del módulo de referencia | ✅ Entregado | Tres implementaciones de la venta, 94 opciones de Venta y 34 de Stock en el Delphi, 3.028 notas de release ([anexo S1 v0.2](2026-10-08-entregable-parcial-s1-venta-stock.md)) |
| **2 · Análisis** (12 al 16-10) | Experiencia objetivo preliminar, capacidades del core que requiere, candidatos a punto de entrada | ✅ Entregado | Reglas de venta y stock extraídas del código (PRD H-14 a H-20); en esta versión se expresan por intención (§3) |
| **3 · Definición** (19 al 23-10) | Funcionalidad objetivo contra la arquitectura, mejoras funcionales, alcance del primer módulo, priorización de la secuencia | 🟡 En curso | Demo del 21-10: primera intención = Vendedor, segunda = Administrativo. Roles, user flows, dashboard y datos requeridos (§4) |
| **4 · Planificación y cierre** (26 al 30-10) | Dirección de producto cerrada, requerimientos del primer módulo con criterio de aceptación, secuencia de los siguientes | ⏳ Pendiente | Depende del roundup de intenciones con Flexxus (PRD S-21) y de la validación de roles y flujos (§5) |

**Cambio de enfoque de esta versión:** las versiones anteriores analizaron Venta y Stock como módulos. La demo del 21-10 mostró que el problema es justamente ese: Flexxus Order trasladó el ERP «pantalla por pantalla» [11:56–12:18], y el vendedor entra a un sistema organizado por módulos. Desde esta versión, la visión de producto se organiza por **intenciones**: lo que un usuario viene a lograr de punta a punta, con su rol, sus pasos y sus caminos alternativos. Flexxus propuso lo mismo: «cada perfil en su ambiente, con todo lo que necesita» [29:19].

---

## 1. Visión de producto: de módulos a intenciones

### 1.1 Qué es una intención

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Intención** | Lo que un usuario viene a lograr de punta a punta, con sus pasos y la información que necesita en cada uno | «Vender en mostrador» |
| **Rol** | La experiencia de inicio y la navegación de una intención; se asigna desde el perfil del ERP | Vendedor, Administrativo |
| **Flujo principal** | El camino más frecuente de la intención (happy path) | Consumidor final, un artículo, factura de contado |
| **Flujo alternativo** | Una variante del mismo puesto que cambia pasos o reglas | Venta a cuenta corriente, pedido con reserva, artículo sin stock |
| **Capacidad del core** | Lo que el core tiene que exponer para que la intención funcione | Consultar precio y stock; emitir comprobante; registrar cobro |

**Por qué la intención es la unidad correcta:**

- **Coincide con cómo Flexxus quiere coexistir.** Un mismo usuario no usa la web y el ERP a la vez [26:57]; migrar el proceso completo de un perfil evita el híbrido de navegador embebido que Flexxus ya descartó [28:16–29:07] (PRD H-24).
- **Hace visible la ganancia de productividad.** El objetivo declarado es que el sistema reúna contexto en lugar de exigir que el usuario arme su recorrido por el menú; eso se mide por intención (pasos, clics, tiempo), no por pantalla.
- **Ordena el roadmap.** Cada intención reutiliza las capacidades del core que expusieron las anteriores.

### 1.2 Catálogo de intenciones (Venta y Stock)

| ID | Intención | Rol | Estado del análisis | Base actual | Épica del PRD |
|---|---|---|---|---|---|
| **I-01** | **Vender en mostrador** | Vendedor (vendedor-cajero y vendedor de salón) | ✅ Analizada: roles, dashboard, flujo principal y 11 alternativos | Carrito de ERP Web / POS y de Flexxus Order | **1 (MVP)** |
| **I-02** | **Gestionar y cerrar la venta** | Administrativo | ✅ Analizada: rol, menú, bandeja y 2 flujos principales | Menú lateral de Flexxus Order; ERP Delphi | **2** |
| I-03 | Vender en ruta | Viajante | Catálogo | App ERP Web / POS con hoja de ruta y GPS | 3 |
| I-04 | Consultar precio y stock | Consulta | Catálogo | App ERP Web / POS, solo Artículos | 3 |
| I-05 | Operar el depósito | Depósito | Catálogo | ERP Delphi (Stock) | 3 |
| I-06 | Administrar maestros y sistema | Administrador | Catálogo | ERP Delphi; Configuración de la web | 3 |

> ⚠️ Fer y Ale, de Flexxus, relevaron intenciones propias que todavía no se compartieron [31:55–32:30]. El catálogo se contrasta en el roundup de la semana del 26-10 (PRD S-21).

---

## 2. Semana 1 — Relevamiento ✅

Entregado el 2026-10-08 en el [Entregable parcial S1 v0.2](2026-10-08-entregable-parcial-s1-venta-stock.md), que se conserva como anexo:

- **Situación actual preliminar:** tres implementaciones de la venta (ERP Delphi, ERP Web / POS, Flexxus Order) y la Web API; modelo de datos; parametrización (399 constantes de parámetros, 163 leídas por las pantallas de Venta).
- **Inventario de módulos y capabilities:** 94 opciones de Venta y 34 de Stock del Delphi, con su descripción funcional; 39 capabilities por implementación.
- **Inventario de documentación:** 24 fuentes, entre ellas 3.028 notas de release del Delphi.
- **Estado de accesos:** fuentes completas desde el 08-10.

**Lo que la demo del 21-10 agrega al relevamiento:**

| Tema | Lo que se confirmó | Evidencia |
|---|---|---|
| Uso real por perfil | Vendedor de salón en la app, cajero en la web o el ERP, administración en el ERP, viajante en mobile, usuario de consulta | [20:08–21:21], [33:14–37:20] |
| Circuitos de venta | PR → NP → FC, NP → FC o FC directa, según el cliente | [04:41–05:03] |
| Reserva de stock | El pedido reserva según la operación; el presupuesto no | [08:35–09:21] |
| Fuente de verdad | La web y el ERP leen y escriben la misma base Firebird por la API | [20:26–22:21] (PRD S-03 resuelta) |
| Flexxus Order | Copia uno a uno del ERP, sin clientes en producción | [11:27–12:22], [19:53] |
| Despliegue | API en el servidor del cliente o en el data center; versión de API acoplada a la del ERP; Portainer y Updater | [22:23–22:47], [38:58–42:59] |

---

## 3. Semana 2 — Análisis ✅

### 3.1 Experiencia objetivo preliminar

La experiencia objetivo se definió por intención en la Semana 3 (§4) sobre las reglas extraídas en esta semana. Las reglas que el flujo del Vendedor ejecuta son las 27 del PRD (RF-01 a RF-27), entre ellas:

- stock real o remanente y aviso o bloqueo según el parámetro 109;
- descuento de stock en la factura o en el remito, según el parámetro 82;
- remito automático, según los parámetros 52 y 154;
- promociones, cupones y puntos aplicados en el comprobante;
- validación de cuenta corriente por comprobante;
- empresa de la sesión.

### 3.2 Capacidades del core que requieren las intenciones analizadas

| Capacidad del core | I-01 Vender en mostrador | I-02 Gestionar y cerrar | Dónde vive hoy |
|---|---|---|---|
| Consultar artículo: precio por lista y pactado, stock por depósito y sucursal, promociones, cuotas | ✅ | Lectura | API (usada por ERP Web / POS); reglas en `Funciones` y `GestorPromociones` del Delphi |
| Identificar cliente: consumidor final, ocasional, con cuenta corriente | ✅ | ✅ | API; parámetros 87 y 94 |
| Validar cuenta corriente y límite | ✅ | ✅ | API; permisos 402, 404 y 405 |
| Emitir comprobante: FC, NP, PR (Vendedor); FC de pedidos, NC, ND, remito (Administrativo) | ✅ | ✅ | API; CAE ante ARCA o controlador fiscal según el punto de venta |
| Mover stock: descontar, reservar, reingresar | ✅ | ✅ | Core (`ModificarStock`); la API lo dispara al emitir |
| Registrar cobro: efectivo, tarjeta (gateway, Payway o manual), transferencia, cheque | ✅ | ✅ (cobranza de CC) | API y gateway de pagos de Flexxus |
| Consultar comprobantes: propios (Vendedor) o todos (Administrativo), con pagos y trazabilidad | ✅ propios | ✅ todos | API (`/comprobantes`, libro IVA) |
| Leer perfil, permisos y contexto del puesto | ✅ | ✅ | API; hoy solo se cargan los permisos del menú 78 (PRD H-8) |

### 3.3 Candidatos a punto de entrada de la modernización

| Candidato | Valor | Riesgo | Por qué | Recomendación |
|---|---|---|---|---|
| **Experiencia por rol + inicio del vendedor + venta unificada (I-01)** | Alto | Medio | Es la intención de mayor volumen y la única con trabajo de UX previo (carrito); usa la API existente y reglas ya extraídas | **Primer módulo** |
| Gestionar y cerrar la venta (I-02) | Medio | Medio | Libera al Administrativo del ERP en lo que toca la venta; replica pantallas que Flexxus Order ya tiene | Segundo tramo |
| Vender en ruta (I-03) | Medio | Bajo | Ya existe en la app; reutiliza la venta de I-01 | Tramo posterior; puede adelantarse si se construye sobre ERP Web / POS |
| Consultar precio y stock (I-04) | Bajo | Bajo | Ya existe en la app | Absorbida por la consulta de I-01 (alternativo A9) |
| Operar el depósito (I-05) | Medio | Alto | Reglas de stock dispersas en formularios (PRD H-16) y modelo de depósitos abierto (S-06) | Después de I-02 |

---

## 4. Semana 3 — Definición 🟡

### 4.1 Roles: Vendedor y Administrativo

Detalle completo en la [definición de roles](2026-10-22-roles-vendedor-administrativo.md). En síntesis:

| | Vendedor | Administrativo |
|---|---|---|
| **Intención** | Vender en mostrador | Gestionar y cerrar la venta |
| **Entra a** | Inicio del vendedor (dashboard), sin menú lateral ni pestañas de módulo | Inicio administrativo: menú lateral y bandeja «Pendientes de gestión» |
| **Emite** | FC, NP y PR según su perfil (002 a 005); NC solo con permiso | FC de pedidos, NC, ND, remitos, recibos de cuenta corriente |
| **No ve** | Menú del ERP, planillas de todos, libro IVA, maestros, gestión de cuentas | La pantalla Venta (ex carrito) ni su ícono |
| **Variantes** | Vendedor-cajero (factura y cobra) y vendedor de salón (presupuestos y pedidos) | — |
| **Asignación** | Atributo «Experiencia de inicio» en el perfil del ERP o inferencia por permisos (PRD S-15) | Ídem |

### 4.2 Experiencia objetivo del Vendedor

- **Inicio del vendedor (dashboard):** contexto del puesto, buscador único de artículo o cliente, «Nueva venta» con los tipos permitidos, venta en curso, pendientes accionables y últimos comprobantes. Los indicadores «Mi día» quedan después del MVP porque la home actual de Flexxus Order tiene datos de ejemplo escritos en el código (PRD H-26).
- **Flujo principal:** buscar → ver precio, stock y promoción → agregar → venta precargada por defecto → revisar total → cobrar viendo el total por medio de pago → confirmar → comprobante emitido → nueva venta ([user flows §2](2026-10-22-user-flows-vendedor-administrativo.md)).
- **Flujos alternativos:** cuenta corriente, pedido con reserva, presupuesto, sin stock, tarjeta, cliente, retomar, convertir presupuesto, consulta, devolución y reenvío ([user flows §3](2026-10-22-user-flows-vendedor-administrativo.md)).

### 4.3 Mejoras funcionales que la modernización habilita sobre la venta

| Hoy (demo del 21-10) | Propuesta | Requerimiento |
|---|---|---|
| El vendedor ve 7 pestañas de módulo y el menú lateral; la venta es una pestaña más [15:32] | Entra directo a su inicio; solo ve su intención | RF-29, RF-30 |
| La búsqueda abre un modal de resultados y pide «Seleccionar» [17:26] | Elegir un resultado agrega el artículo en un paso | RF-36 |
| El aviso de stock llega como confirmación después de agregar [17:35] | Stock disponible visible en el resultado, antes de agregar | RF-37 |
| El panel de condiciones está siempre desplegado (Enviar como, lista, condición, pago, depósito, vendedor, descuento, más detalles) | Venta precargada por defecto; condiciones plegadas | RF-38 |
| El descuento del 5 % en efectivo aparece recién en el cobro [17:38] | Total por medio de pago y cuotas visibles antes de confirmar | RF-39 |
| Lo pendiente se busca en planillas de todos los usuarios | Pendientes propios accionables en el inicio | RF-35 |
| El Administrativo y el Vendedor ven las mismas opciones | Cada rol con su navegación; nada duplicado | RF-30, RF-52 |

### 4.4 Datos requeridos por la experiencia objetivo

Disponibilidad preliminar, a confirmar con el track de Tecnología: ✅ existe · 🟡 parcial · ❌ falta.

| Dato | Vista | Fuente hoy | Disponibilidad | Brecha |
|---|---|---|---|---|
| Contexto del puesto (sucursal, punto de venta, depósito, caja) | Inicio del vendedor | Sesión web (`checkout_name`, `warehouse_name`, `pos_name`) | ✅ | — |
| Experiencia de inicio del perfil | Ruteo al iniciar sesión | No existe; la sesión trae `rol` sin semántica confirmada | ❌ | Atributo nuevo o inferencia (S-15) |
| Permisos de los menús 78, 80, 87 y 90 | Toda la venta | API de permisos por usuario y menú | 🟡 | El front carga solo el menú 78 (H-8) |
| Precio, stock y promoción en el resultado de búsqueda | Venta | API de artículos y motor de promociones | 🟡 | Confirmar que el listado trae stock y promoción sin una consulta por artículo |
| Stock en otras sucursales | Venta, consulta | App ERP Web / POS (grilla por depósito) | ✅ | — |
| Total por medio de pago y cuotas | Venta, cobro | Multiplazos y «Cuotas disponibles» de la app | 🟡 | Calcularlo antes del cobro |
| Últimos comprobantes del usuario | Inicio del vendedor | Búsqueda de comprobantes | 🟡 | Filtro por usuario a confirmar |
| Pedidos propios sin facturar o sin entregar | Inicio del vendedor, bandeja administrativa | Planilla de pedidos | 🟡 | Filtro por vendedor y estado |
| Comprobantes sin CAE o rechazados | Ambos inicios | Vista de factura electrónica | 🟡 | Consulta por usuario y estado |
| Presupuestos por vencer | Inicio del vendedor | Planilla de presupuestos; vencimiento calculado por el backend | 🟡 | Exponer el vencimiento |
| Ventas en curso | Inicio del vendedor | `localStorage` del navegador (una sola) | 🟡 | Varias ventas y persistencia por usuario (posterior) |
| Indicadores «Mi día» | Inicio del vendedor | Sin servicio; la home actual es de ejemplo | ❌ | Servicio de indicadores (S-18) |
| Solicitudes de NC | Bandeja administrativa | Delphi «Solicitud Nota de Crédito» | ⏳ | Confirmar si la web la expone (S-17) |

### 4.5 Alcance del primer módulo y secuencia

- **Primer módulo:** intención I-01 «Vender en mostrador», con la experiencia por rol (entrada y navegación) que también habilita al Administrativo a no ver la venta. Requerimientos RF-28 a RF-47 más las reglas RF-01 a RF-27 (PRD §8).
- **Secuencia propuesta:** I-01 → I-02 → I-03 → I-05 → I-06, con I-04 absorbida por I-01. Criterios: valor para el usuario, volumen de operación, reutilización de capacidades del core y riesgo técnico (PRD H-16, S-06). A contrastar con Flexxus en el roundup (S-21).

---

## 5. Semana 4 — Planificación y cierre ⏳

| Entregable de Producto | Contenido previsto | Insumo que falta |
|---|---|---|
| Cierre de la dirección de producto | Catálogo de intenciones priorizado y validado; roles y flujos de I-01 e I-02 aprobados | Roundup con Fer y Ale (S-21); validación del referente de negocio |
| Requerimientos del primer módulo | RF y RNF de I-01 con criterio de aceptación, cargados como historias con `po-expert-user-stories` | S-15, S-17, S-18 resueltas; medición del flujo actual en la demo de ERP Web / POS |
| Secuencia de los módulos siguientes | Orden de I-02 a I-06 con su criterio de priorización explícito | Roundup; dimensionamiento del track de Tecnología |
| Presentación de cierre | As-is, experiencia objetivo por intención, plan y decisiones recomendadas | Arquitectura destino (track de Tecnología) |

**Relación con los 13 entregables de la propuesta:** el track de Producto produce el 9 (dirección de producto y experiencia objetivo) y el 10 (datos requeridos por la experiencia). También aporta al 1 (inventario de capabilities), al 11 (roadmap), al 12 (plan del primer módulo, en su parte funcional) y al 13 (riesgos y dependencias).

---

## Estado de accesos y dependencias

| Acceso o dependencia | Estado | Acción |
|---|---|---|
| Fuentes del ERP y notas de release | ✅ Disponible | Confirmar la etiqueta 04.12 (S-14) |
| Repositorios `flexxus-order`, `flexxuserpweb`, `flxwebapi-v6` | 🟡 Snapshot del 06/10 | — |
| Acceso a la demo de ERP Web / POS ofrecido en la reunión [37:10–37:14] | 🔴 Pendiente | Pedirlo para medir el flujo actual (RNF-10) |
| Roundup de intenciones con Fer y Ale | 🔴 Sin fecha | Pedirlo para el 27 o el 28-10 |
| Demo del ERP de punta a punta con Leo | 🔴 Sin fecha | Pedirla para el 27-10 |
| Muestra de 5 instalaciones con sus parámetros | 🔴 Pendiente | Pedirla (S-05, S-12, S-13) |
| Jira FO y FLEXV2 | 🔴 Pendiente | Pedir acceso de lectura |

---

*Siguiente paso: enviar a Flexxus la definición de roles y los user flows como insumo del roundup de intenciones, y resolver S-15, S-17 y S-21 del PRD antes del 2026-10-28.*
