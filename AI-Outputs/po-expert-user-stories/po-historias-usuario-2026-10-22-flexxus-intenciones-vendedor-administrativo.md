# Historias de Usuario — Flexxus: de pantallas a intenciones (roles Vendedor y Administrativo)

> **Versión:** v1.0.0 · **Fecha:** 2026-10-22
> **Fuente única de requerimientos:** [PRD v3.0.0](../prd/PRD-flexxus-venta-stock-2026-10-22.md) (§5, §8.1 a §8.5, §12.1) · [Definición de roles](../flexxus-discovery/2026-10-22-roles-vendedor-administrativo.md) · [User flows](../flexxus-discovery/2026-10-22-user-flows-vendedor-administrativo.md) · grabación de la demo del 21/10/2026 · código de `flexxus-order` (frontend) y `spec/carrito/`
> **Autor:** PO (elaboración de historias) · **Producto:** Flexxus ERP — frentes web (Flexxus Order / ERP Web / POS) sobre Flexxus Web API
> **POC / referencia de diseño:** wireframe de baja fidelidad del inicio del vendedor ([Definición de roles §3.3](../flexxus-discovery/2026-10-22-roles-vendedor-administrativo.md)); capturas de la demo en `AI-Outputs/flexxus-discovery/img/2026-10-21-demo/`
> **Generado con:** skill `po-expert-user-stories`

---

## Tabla de contenidos

0. [Qué cambia respecto de versión anterior](#0-qué-cambia-respecto-de-versión-anterior)
1. [Criterio de elaboración y alcance](#1-criterio-de-elaboración-y-alcance)
2. [Matriz de inclusión / desestimación](#2-matriz-de-inclusión--desestimación)
3. [Contexto de solución, actores y supuestos](#3-contexto-de-solución-actores-y-supuestos)
4. [Reglas de negocio transversales (RN)](#4-reglas-de-negocio-transversales-rn)
5. [Catálogo de mensajes de UI](#5-catálogo-de-mensajes-de-ui)
6. [Historias de usuario funcionales (tarjetas de backlog)](#6-historias-de-usuario-funcionales-tarjetas-de-backlog)
7. [Historias técnicas — Endpoints BFF / BE (enablers)](#7-historias-técnicas--endpoints-bff--be-enablers)
8. [Tareas técnicas / habilitadores](#8-tareas-técnicas--habilitadores)
9. [Spikes y decisiones pendientes (columna DUDAS)](#9-spikes-y-decisiones-pendientes-columna-dudas)
10. [Recomendaciones del PO — historias faltantes](#10-recomendaciones-del-po--historias-faltantes)
11. [Observaciones sobre la consistencia del input](#11-observaciones-sobre-la-consistencia-del-input)
12. [Matriz de trazabilidad HU ↔ endpoint ↔ pantalla](#12-matriz-de-trazabilidad-hu--endpoint--pantalla)
13. [Definition of Ready / Definition of Done](#13-definition-of-ready--definition-of-done)

---

## 0. Qué cambia respecto de versión anterior

Primera versión: no hay un documento de historias anterior para Flexxus.

Criterios de forma adoptados:

- Tarjetas con metadatos, historia Connextra, AC numerados con tags y Gherkin en español.
- Mensajes de UI centralizados en §5 y citados con su texto inline.
- Trazabilidad de cada tarjeta a su RF del PRD v3.0.0 y a su vista (V-nn) de la definición de roles.
- Pausas HITL ejecutadas el 2026-10-22: 12 supuestos confirmados sin cambios; 10 spikes respondidos (§9), 2 quedan pendientes (S-05, S-10).
- El alcance es **el cambio de navegación por pantallas a navegación por intención**. Las reglas de negocio de la venta (RF-01 a RF-27) ya están implementadas en el carrito y **no se re-especifican**: se preservan por regresión (RN-01).

---

## 1. Criterio de elaboración y alcance

| Criterio | Decisión aplicada |
|----------|-------------------|
| **Origen del input** | PRD, definición de roles y user flows (texto y diagramas Mermaid); no hay Excel. Se aplica el flujo general de la skill |
| **Unidad de descomposición** | Capacidad por capacidad: cada RF-28 a RF-53 del PRD se evalúa como HU, HT, TAREA o desestimada (§2) |
| **Qué se elabora** | Lo que **cambia** para pasar de pantallas a intenciones: entrada por rol, navegación, inicio del vendedor, reubicación y mejoras de la venta, flujos alternativos nuevos, inicio y menú del Administrativo |
| **Qué no se elabora** | Reglas de comprobante, stock, precio, cobro y fiscales ya implementadas en el carrito (RF-01 a RF-27); intenciones de la Épica 3 (viajante, consulta, depósito, administración del sistema) |
| **Historias faltantes** | Solo en §10, no mezcladas con las derivadas del PRD |
| **Identificadores** | No hay tablero Jira accesible; keys propuestas por épica: `ROL-NN` (experiencia por rol), `VEN-NN` (Vender en mostrador), `ADM-NN` (Gestionar y cerrar la venta), `HT-{épica}-NN` para enablers, `T-NN` para tareas |
| **Idioma y formato** | Español; Gherkin con palabras clave en español |

**Convención de tipos:**

| Tipo | Significado |
|------|-------------|
| `HU-FE` | Historia de usuario con impacto principal en el front web |
| `HU-BE` | Historia cuyo valor se entrega vía backend (por ejemplo, una solicitud que recibe otro rol) |
| `HT` | Historia técnica (endpoint BFF / API) |
| `TAREA` | Habilitador de configuración, datos o infraestructura del front |

**Épicas:**

| Código | Épica | Relación con el PRD |
|---|---|---|
| **ROL** | Experiencia por rol: entrada y navegación | Épica 1, §8.1 (RF-28 a RF-31) |
| **VEN** | Intención «Vender en mostrador» (rol Vendedor) | Épica 1, §8.2 a §8.4 (RF-32 a RF-47) |
| **ADM** | Intención «Gestionar y cerrar la venta» (rol Administrativo) | Épica 2, §8.5 (RF-48 a RF-53) |

---

## 2. Matriz de inclusión / desestimación

| Fila | Key | Summary | Tipo | Estado | Motivo |
|-----:|-----|---------|------|--------|--------|
| 1 | ROL-01 | Entrar a la pantalla de inicio de mi rol | HU-FE | ✅ Incluida | RF-29; núcleo del cambio |
| 2 | ROL-02 | Navegar como Vendedor sin el menú del ERP | HU-FE | ✅ Incluida | RF-30 (Vendedor) |
| 3 | ROL-03 | Operar como Administrativo sin la pantalla de venta | HU-FE | ✅ Incluida | RF-30 (Administrativo); actor distinto de ROL-02 |
| 4 | ROL-04 | Ver solo los tipos de comprobante que mi perfil permite | HU-FE | ✅ Incluida | RF-31 |
| 5 | HT-ROL-01 | GET · Contexto de sesión: experiencia de inicio, permisos de los menús de venta y puesto | HT | ✅ Incluida | RF-28, RF-29; hoy solo se cargan los permisos del menú 78 (PRD H-8) |
| 6 | VEN-01 | Ver el contexto de mi puesto al iniciar | HU-FE | ✅ Incluida | RF-32 |
| 7 | VEN-02 | Buscar artículo o cliente desde el inicio | HU-FE | ✅ Incluida | RF-33 |
| 8 | VEN-03 | Iniciar una venta nueva con el tipo de comprobante elegido | HU-FE | ✅ Incluida | RF-33 y RF-31 |
| 9 | VEN-04 | Ver mis últimos comprobantes y reenviarlos | HU-FE | ✅ Incluida | RF-34 |
| 10 | VEN-05 | Ver mis pendientes accionables | HU-FE | ✅ Incluida | RF-35 |
| 11 | VEN-06 | Agregar un artículo a la venta en un paso | HU-FE | ✅ Incluida | RF-36; fricción H-27 |
| 12 | VEN-07 | Ver precio, stock y promoción antes de agregar | HU-FE | ✅ Incluida | RF-37; fricción H-27 |
| 13 | VEN-08 | Empezar con la venta precargada por defecto | HU-FE | ✅ Incluida | RF-38; fricción H-27 |
| 14 | VEN-09 | Ver el total por medio de pago antes de cobrar | HU-FE | ✅ Incluida | RF-39; fricción H-27 |
| 15 | VEN-10 | Volver al inicio con una venta nueva al emitir | HU-FE | ✅ Incluida | RF-40 |
| 16 | VEN-11 | Resolver una venta bloqueada por cuenta corriente | HU-FE | ✅ Incluida | RF-41; alternativo A1 |
| 17 | — | Emitir pedidos y presupuestos desde la misma Venta | — | ❌ Desestimada | RF-42 ya implementado en el carrito («Enviar como»); el inicio por tipo se cubre en VEN-03 |
| 18 | VEN-12 | Resolver una venta con stock insuficiente | HU-FE | ✅ Incluida | RF-43; alternativo A4 |
| 19 | VEN-13 | Retomar una venta en curso | HU-FE | ✅ Incluida | RF-44; alternativo A7 |
| 20 | VEN-14 | Convertir un presupuesto propio en pedido o factura | HU-FE | ✅ Incluida | RF-45; alternativo A8 |
| 21 | VEN-15 | Consultar un artículo sin iniciar una venta | HU-FE | ✅ Incluida | RF-46; alternativo A9 |
| 22 | VEN-16 | Registrar una devolución: NC o solicitud de NC | HU-FE | ✅ Incluida | RF-47; alternativo A10; condicionada a SUP-07 |
| 23 | HT-VEN-01 | GET · Comprobantes del usuario | HT | ✅ Incluida | Habilita VEN-04 |
| 24 | HT-VEN-02 | GET · Pendientes del usuario | HT | ✅ Incluida | Habilita VEN-05, ADM-01 |
| 25 | HT-VEN-03 | GET · Búsqueda unificada de artículos y clientes | HT | ✅ Incluida | Habilita VEN-02 |
| 26 | HT-VEN-04 | POST · Simulación del total por medio de pago | HT | ✅ Incluida | Habilita VEN-09 |
| 27 | HT-VEN-05 | POST · Solicitud de nota de crédito | HT | ✅ Incluida | Habilita VEN-16 y ADM-04 |
| 28 | ADM-01 | Ver mis pendientes de gestión al iniciar | HU-FE | ✅ Incluida | RF-49 |
| 29 | ADM-02 | Usar un menú lateral acotado a Venta y Stock | HU-FE | ✅ Incluida | RF-52 |
| 30 | ADM-03 | Facturar pedidos pendientes filtrando por vendedor | HU-FE | ✅ Incluida | RF-48; la pantalla existe, cambia el acceso desde la bandeja y el filtro por vendedor |
| 31 | — | Cobrar e imputar una cuenta corriente | — | ❌ Desestimada | RF-50 ya implementado en Flexxus Order [23:16–25:08]; solo se reubica en el menú (ADM-02) |
| 32 | ADM-04 | Resolver solicitudes de nota de crédito | HU-FE | ✅ Incluida | RF-51 |
| 33 | — | Buscar cualquier comprobante con trazabilidad | — | ❌ Desestimada | RF-53 ya implementado («Buscar comprobante») [06:19–06:27]; solo se reubica (ADM-02) |
| 34 | HT-ADM-01 | GET · Contadores de pendientes de gestión | HT | ✅ Incluida | Habilita ADM-01 |
| 35 | T-01 | Atributo «Experiencia de inicio» en el perfil | TAREA | ✅ Incluida | S-15 del PRD |
| 36 | T-02 | Permisos por menú en el store del front | TAREA | ✅ Incluida | PRD H-8: el store descarta `CODIGOMENU` |
| 37 | T-03 | Layouts por rol y guard de rutas | TAREA | ✅ Incluida | Habilita ROL-01 a ROL-03 |
| 38 | T-04 | Retirar la home de ejemplo | TAREA | ✅ Incluida | PRD H-26 |
| 39 | T-05 | Instrumentar la venta típica | TAREA | ✅ Incluida | RNF-10: medir pasos y tiempo |
| 40 | T-06 | Feature flag de la experiencia por rol por cliente | TAREA | ✅ Incluida | PRD R-11: versión de API por cliente |
| 41 | — | Reglas de comprobante, stock, precio y cobro (RF-01 a RF-27) | — | ❌ Desestimada | Implementadas en el carrito; se preservan por regresión (RN-01) |
| 42 | HT-VEN-06 | GET · Disponibilidad del artículo: stock y promoción | HT | ✅ Incluida | Habilita VEN-07, VEN-12, VEN-15; S-03: el stock y la promoción se consultan por artículo |
| 43 | — | Indicadores «Mi día», clientes recientes, varias ventas en curso, avisos | — | ❌ Desestimada | Posteriores al MVP sin fuente de datos (PRD H-26, S-18); propuestas en §10 |

**Resumen:** 43 ítems evaluados · 37 incluidos · 6 desestimados · **24 HU** (4 ROL, 16 VEN, 4 ADM) · **8 HT** · **6 tareas**.

---

## 3. Contexto de solución, actores y supuestos

### 3.1 Perfiles de usuario (actores / dominios)

| Actor | Variante | Permisos de comprobante | Experiencia de inicio | Épica |
|---|---|---|---|---|
| **Vendedor** | Vendedor-cajero | 002 (FC, por defecto), 003, 004; 005 opcional | Inicio del vendedor (V-01) | ROL, VEN |
| **Vendedor** | Vendedor de salón | 003, 004; sin 002 | Inicio del vendedor (V-01) | ROL, VEN |
| **Administrativo** | — | 002, 003, 005; permisos de planillas y gestión de cuentas | Inicio administrativo (V-11) | ROL, ADM |
| **Administrador del sistema** | — | Configura perfiles | Fuera de alcance; asigna la experiencia (T-01) | — |

### 3.2 Componentes involucrados

| Componente | Rol en estas historias |
|---|---|
| **Front web** (Flexxus Order, React 19: `MainMenu`, `SidebarContent`, `routes/index.jsx`, `features/cart`) | Layouts por rol, inicio del vendedor, venta reubicada, inicio administrativo |
| **BFF / backend de Flexxus Order** | Endpoints de §7 que componen datos de la API |
| **Flexxus Web API** | Perfiles, permisos por usuario y menú, artículos, comprobantes, cobros |
| **Base Firebird del ERP** | Perfil (`USUARIOSMENU`, permisos especiales por perfil), comprobantes, stock |
| **ERP Delphi** | ABM de perfiles donde se agregaría la experiencia de inicio (T-01); «Solicitud Nota de Crédito» existente |
| **Gateway de pagos de Flexxus** | Cuotas y planes por tarjeta (HT-VEN-04) |

### 3.3 Supuestos (a confirmar con el equipo técnico)

| # | Supuesto | Confirmación *(post HITL)* |
|---|----------|---------------------------|
| SUP-01 | La base de implementación es el front de **Flexxus Order** y su backend; las HT se expresan como endpoints de su BFF sobre la Web API. Si se decide ERP Web / POS (PRD S-02), las HU no cambian y las HT se re-mapean | confirmado (22-10); S-08: Flexxus Order sobre la misma base de datos que el ERP |
| SUP-02 | La experiencia de inicio se asigna con un **atributo nuevo en el perfil del ERP** («Vendedor» o «Administrativo»). Mientras no exista, se infiere: con algún permiso 002 a 005 y sin ítems de menú administrativos → Vendedor; el resto → Administrativo | confirmado — sin cambios (22-10) |
| SUP-03 | Las reglas de venta del carrito (RF-01 a RF-27) **ya funcionan** y no se re-especifican; estas historias cambian ubicación, navegación y presentación, y se validan con la regresión del carrito | confirmado — sin cambios (22-10) |
| SUP-04 | «Vendedor» abarca vendedor-cajero y vendedor de salón, diferenciados solo por los permisos 002 a 005; viajante y usuario de consulta quedan fuera | confirmado — sin cambios (22-10) |
| SUP-05 | El inicio del vendedor en el MVP tiene: contexto del puesto, buscador único, «Nueva venta», una venta en curso, últimos 5 comprobantes y pendientes (pedidos propios sin facturar y comprobantes sin CAE). Sin indicadores «Mi día» | confirmado — sin cambios (22-10) |
| SUP-06 | La venta en curso sigue persistida en el navegador (`localStorage`), una por navegador, como hoy | confirmado — sin cambios (22-10) |
| SUP-07 | El vendedor emite la NC solo con el permiso 005; sin él, registra una **solicitud de NC** que resuelve el Administrativo, reutilizando la «Solicitud Nota de Crédito» del ERP | confirmado — sin cambios (22-10) |
| SUP-08 | El Administrativo **no** tiene «Crear factura» de mostrador en su menú; la factura administrativa sin pedido queda para decidir (PRD S-19) y fuera de estas historias | confirmado — sin cambios (22-10) |
| SUP-09 | Los textos de UI de §5 son una propuesta del PO y se validan con UX antes del Ready | confirmado — sin cambios (22-10) |
| SUP-10 | El usuario con las dos experiencias (encargado) queda fuera del MVP; el selector de modo va a §10 | confirmado — sin cambios (22-10) |
| SUP-11 | «Comprobante propio» = comprobante cuyo vendedor o usuario que lo emitió es el usuario de la sesión | confirmado — sin cambios (22-10) |
| SUP-12 | El volumen de referencia para los criterios de rendimiento es el de un punto de venta típico: hasta 300 comprobantes por usuario por día | confirmado — sin cambios (22-10) |

> Pausa 1 ejecutada el 2026-10-22: el usuario confirmó los 12 supuestos sin cambios.

---

## 4. Reglas de negocio transversales (RN)

| ID | Regla | Fuente |
|----|-------|--------|
| **RN-01** | Las reglas de venta del carrito (precio, stock, promociones, cuenta corriente, cobro, fiscal: RF-01 a RF-27) se comportan igual después de la reubicación; toda historia que toca la venta incluye la regresión del carrito en su DoD | PRD §8.6; SUP-03 |
| **RN-02** | La experiencia de inicio sale del atributo del perfil, que gana sobre la inferencia. Sin atributo: con algún permiso 002 a 005, acceso al carrito y ningún ítem administrativo → **Vendedor**; el resto → **Administrativo**. Es «administrativo» todo ítem del menú lateral izquierdo, de la barra superior (pestañas de módulo) y del encabezado, salvo el carrito | PRD S-15; SUP-02; S-01 y S-02 de §9 |
| **RN-03** | Los permisos se leen de los menús 78, 80, 87 y 90 y se evalúan por par (menú, permiso). Sin permiso, la acción no se muestra (fail-closed) | PRD H-8; `erp-permissions.md` |
| **RN-04** | El Vendedor no accede a rutas de módulo ni al menú lateral; el Administrativo no accede a la pantalla Venta. Una ruta no permitida redirige al inicio del rol con MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio." | PRD RF-30 |
| **RN-05** | Comprobante propio = su vendedor o su usuario emisor es el usuario de la sesión | SUP-11 |
| **RN-06** | Los tipos de comprobante visibles son los permisos 002 (FC), 003 (NP), 004 (PR) y 005 (NC) del perfil; el marcado «por defecto» se preselecciona. Sin ninguno, la venta no se puede iniciar (MSG-03) | `permissionDefaults.ts`; PRD RF-31 |
| **RN-07** | El stock disponible se calcula contra real o remanente y avisa o bloquea según el parámetro 109; el presupuesto no valida stock y el pedido valida solo con valores 5 a 9 | PRD H-14 |
| **RN-08** | La cuenta corriente se valida con los permisos 404 (FC), 402 (NP) y 405 (NC); destildar la validación requiere el permiso 963 cuando el parámetro 287 está activo | PRD RF-20; `CC_PERMISSION_BY_VOUCHER` |
| **RN-09** | Hay una sola venta en curso por navegador; se descarta al emitir o al vaciarla | SUP-06; `spec/carrito` §8 |
| **RN-10** | Una venta nueva se precarga con el cliente del parámetro 87, el tipo de comprobante por defecto del perfil y el depósito, la lista, la condición y el vendedor del usuario | `spec/carrito` §8 (reset B3) |
| **RN-11** | Con el permiso 005 el Vendedor emite la NC vinculada a la factura; sin él, registra una solicitud de NC que resuelve el Administrativo | SUP-07; PRD RF-47 |
| **RN-12** | Facturar un pedido de otra empresa depende del parámetro 116 | PRD RF-27, H-17 |

---

## 5. Catálogo de mensajes de UI

Textos propuestos por el PO, a validar con UX (SUP-09).

| Código | Contexto | Mensaje |
|--------|----------|---------|
| MSG-01 | Inicio de sesión sin perfil ni permisos | "Tu usuario no tiene un perfil de acceso configurado. Pedile al administrador que te asigne uno." |
| MSG-02 | Ruta no permitida para el rol | "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio." |
| MSG-03 | Perfil sin tipos de comprobante | "Tu perfil no tiene habilitado ningún tipo de comprobante. Pedile al administrador que lo configure." |
| MSG-04 | Buscador sin resultados | "No encontramos artículos ni clientes para «{texto}»." |
| MSG-05 | «Nueva venta» con una venta en curso | "Tenés una venta en curso con {n} artículos. ¿Querés retomarla o empezar una nueva?" |
| MSG-06 | Inicio sin comprobantes propios | "Todavía no emitiste comprobantes hoy." |
| MSG-07 | Inicio sin pendientes | "No tenés pendientes." |
| MSG-08 | Stock insuficiente, parámetro 109 en modo aviso | "Stock disponible: {disponible}. Estás vendiendo más de lo disponible." |
| MSG-09 | Stock insuficiente, parámetro 109 en modo bloqueo | "No hay stock suficiente de {articulo} para facturar. Disponible: {disponible}." |
| MSG-10 | Venta bloqueada por cuenta corriente | "La cuenta corriente de {cliente} no permite esta venta: {motivo}. Podés cobrarla de contado o generar un pedido para que la revise administración." |
| MSG-11 | Falla del cálculo de totales por medio de pago | "No pudimos calcular los totales por medio de pago. Los vas a ver al cobrar." |
| MSG-12 | Comprobante emitido | "Comprobante {tipo} {numero} emitido." |
| MSG-13 | Convertir un presupuesto vencido | "El presupuesto {numero} venció el {fecha}. Los precios se recalculan con la lista vigente." |
| MSG-14 | Solicitud de NC registrada | "Registramos la solicitud de nota de crédito {numero}. Administración la va a revisar." |
| MSG-15 | Solicitud de NC rechazada (pendientes del vendedor) | "Solicitud {numero} rechazada: {motivo}." |
| MSG-16 | Devolución sin facturas vinculables | "No encontramos facturas de {cliente} con artículos para devolver." |
| MSG-17 | Bandeja administrativa vacía | "No hay pendientes de gestión." |
| MSG-18 | Pedido de otra empresa no facturable | "El pedido {numero} es de {empresa} y tu configuración no permite facturarlo desde esta empresa." |
| MSG-19 | Rechazo de solicitud sin motivo | "Ingresá el motivo del rechazo." |
| MSG-20 | Error al cargar una zona del inicio | "No pudimos cargar esta sección. Reintentá en unos segundos." |
| MSG-21 | Consulta sin stock en otras sucursales | "Sin stock en otras sucursales." |

---

## 6. Historias de usuario funcionales (tarjetas de backlog)

### 6.1 Épica ROL — Experiencia por rol: entrada y navegación

### ROL-01 — Entrar a la pantalla de inicio de mi rol

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ROL — Experiencia por rol |
| **Actor** | Vendedor, Administrativo |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-ROL-01, T-01 (o la inferencia de RN-02), T-03 |
| **Habilita** | Todas las historias VEN y ADM |
| **Pantalla POC** | V-01 Inicio del vendedor · V-11 Inicio administrativo |

#### Historia
```
Como usuario de la web de Flexxus
quiero entrar directamente a la pantalla de inicio de mi rol
para empezar mi tarea sin recorrer el menú del ERP
```

#### Valor de negocio
Es el cambio central de pantallas a intenciones: cada perfil arranca en su propio ambiente, como pidió Flexxus el 21-10 [29:19].

#### Escenarios fuente
```text
RF-29 | El sistema dirige al usuario a la pantalla de inicio de su experiencia: Vendedor → Inicio del vendedor; Administrativo → Inicio administrativo. Sin atributo de experiencia, la infiere según la regla de S-15
```

#### Criterios de aceptación
1. **[Feliz]** Un usuario con experiencia «Vendedor» entra, al iniciar sesión, al Inicio del vendedor (V-01).
2. **[Feliz]** Un usuario con experiencia «Administrativo» entra al Inicio administrativo (V-11).
3. **[Alternativo]** Un perfil sin el atributo recibe la experiencia inferida según RN-02.
4. **[Error]** Un usuario sin perfil ni permisos no entra a ninguna experiencia y ve MSG-01: "Tu usuario no tiene un perfil de acceso configurado. Pedile al administrador que te asigne uno."
5. **[Validación]** Recargar la página o volver a abrir la web mantiene la experiencia hasta cerrar sesión.

#### Escenarios BDD
```gherkin
Característica: Inicio según el rol
  Como usuario quiero entrar a mi inicio para empezar mi tarea sin recorrer el menú.

  Escenario: Vendedor entra a su inicio
    Dado que mi perfil tiene la experiencia "Vendedor"
    Cuando inicio sesión
    Entonces veo el Inicio del vendedor
    Y no veo el menú lateral

  Escenario: Experiencia inferida
    Dado que mi perfil no tiene experiencia configurada
    Y tiene el permiso 003 y ningún menú administrativo
    Cuando inicio sesión
    Entonces veo el Inicio del vendedor

  Escenario: Usuario sin perfil
    Dado que mi usuario no tiene perfil ni permisos
    Cuando inicio sesión
    Entonces veo el mensaje MSG-01: "Tu usuario no tiene un perfil de acceso configurado. Pedile al administrador que te asigne uno."
```

#### Fuera de alcance
- Selector de modo para usuarios con las dos experiencias (§10, SUP-10).
- Configurar la experiencia desde la web (se hace en el ERP, T-01).

#### Notas / preguntas abiertas
- Menús administrativos (S-02): todos los ítems del menú lateral, de la barra superior y del encabezado, salvo el carrito.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-ROL-01 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ROL-02 — Navegar como Vendedor sin el menú del ERP

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ROL — Experiencia por rol |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-01, T-03 |
| **Habilita** | VEN-01 a VEN-16 |
| **Pantalla POC** | V-01, V-02 |

#### Historia
```
Como vendedor
quiero ver solo las pantallas de mi tarea de venta
para no perder tiempo ni confundirme con módulos que no uso
```

#### Valor de negocio
Hoy el vendedor ve 7 pestañas de módulo y el menú lateral, y la venta es una pestaña más [15:32] (PRD H-27). Quitarlos reduce la carga visual y los errores de navegación.

#### Escenarios fuente
```text
RF-30 | El Vendedor no ve pestañas de módulo ni el menú lateral; el Administrativo no ve la pantalla Venta ni el ícono de carrito
```

#### Criterios de aceptación
1. **[Feliz]** El Vendedor no ve las pestañas Archivos, Ventas, Compras, Fondos, Stock, Configuración y Usuarios, ni el menú lateral.
2. **[Feliz]** Desde cualquier vista del Vendedor (V-02 a V-07) hay un acceso visible a su inicio.
3. **[Error]** Si el Vendedor abre una URL de módulo (por ejemplo `/comprobantes` de todos los usuarios o `/cuentacorriente`), el sistema lo lleva a su inicio y muestra MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio." (RN-04).
4. **[Validación]** La pantalla Venta se abre como pantalla principal, no como pestaña dentro de otra pantalla.

#### Escenarios BDD
```gherkin
Característica: Navegación del Vendedor
  Escenario: Sin menú del ERP
    Dado que inicié sesión como Vendedor
    Cuando estoy en cualquier pantalla
    Entonces no veo las pestañas de módulo ni el menú lateral

  Escenario: URL de módulo no permitida
    Dado que inicié sesión como Vendedor
    Cuando abro la dirección de la gestión de cuentas corrientes
    Entonces veo mi inicio
    Y veo el mensaje MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio."
```

#### Fuera de alcance
- Las vistas del viajante y del usuario de consulta.

#### Notas / preguntas abiertas
- Cerrar sesión y datos del usuario siguen en la barra superior.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ROL-03 — Operar como Administrativo sin la pantalla de venta

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ROL — Experiencia por rol |
| **Actor** | Administrativo |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-01, T-03 |
| **Habilita** | ADM-01 a ADM-04 |
| **Pantalla POC** | V-11 |

#### Historia
```
Como administrativo
quiero trabajar desde el menú lateral sin la pantalla de venta de mostrador
para enfocarme en gestionar lo que generó el equipo de venta
```

#### Valor de negocio
Evita la doble funcionalidad (carrito y «Crear factura» para lo mismo) que confunde al back office [30:39–31:26].

#### Escenarios fuente
```text
RF-30 | El Vendedor no ve pestañas de módulo ni el menú lateral; el Administrativo no ve la pantalla Venta ni el ícono de carrito
```

#### Criterios de aceptación
1. **[Feliz]** El Administrativo no ve el ícono de carrito de la barra superior ni accesos a la pantalla Venta.
2. **[Error]** Si abre la URL de la venta (`/carrito`), el sistema lo lleva a su inicio y muestra MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio."
3. **[Validación]** El menú lateral sigue mostrando solo los ítems disponibles de su perfil.

#### Escenarios BDD
```gherkin
Característica: Administrativo sin venta de mostrador
  Escenario: Sin ícono de carrito
    Dado que inicié sesión como Administrativo
    Cuando veo la barra superior
    Entonces no veo el ícono de carrito

  Escenario: URL de venta no permitida
    Dado que inicié sesión como Administrativo
    Cuando abro la dirección de la venta
    Entonces veo mi inicio
    Y veo el mensaje MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio."
```

#### Fuera de alcance
- El contenido del menú acotado (ADM-02).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ROL-04 — Ver solo los tipos de comprobante que mi perfil permite

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ROL — Experiencia por rol |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-ROL-01, T-02 |
| **Habilita** | VEN-03, VEN-16 |
| **Pantalla POC** | V-01 (Z2), V-02 («Enviar como») |

#### Historia
```
Como vendedor
quiero ver solo los tipos de comprobante que tengo habilitados
para no intentar emitir algo que mi perfil no permite
```

#### Valor de negocio
Diferencia al vendedor-cajero (factura) del vendedor de salón (presupuestos y pedidos) con la misma experiencia [35:16–35:34].

#### Escenarios fuente
```text
RF-31 | El Vendedor solo ve los tipos de comprobante habilitados en su perfil (002 a 005), con el marcado «por defecto» preseleccionado
```

#### Criterios de aceptación
1. **[Feliz]** «Iniciar como» del inicio y «Enviar como» de la venta muestran solo los tipos con permiso 002 a 005 (RN-06).
2. **[Feliz]** El tipo marcado «por defecto» en el perfil aparece preseleccionado.
3. **[Alternativo]** Con un solo tipo habilitado, no se muestra el selector y la venta usa ese tipo.
4. **[Error]** Sin ningún tipo habilitado, «Nueva venta» queda deshabilitada y se muestra MSG-03: "Tu perfil no tiene habilitado ningún tipo de comprobante. Pedile al administrador que lo configure."

#### Escenarios BDD
```gherkin
Característica: Tipos de comprobante por perfil
  Escenario: Vendedor de salón
    Dado que mi perfil tiene los permisos 003 y 004 y no el 002
    Cuando veo "Iniciar como"
    Entonces veo "Pedido" y "Presupuesto"
    Y no veo "Factura"

  Escenario: Perfil sin tipos de comprobante
    Dado que mi perfil no tiene permisos 002 a 005
    Cuando veo mi inicio
    Entonces "Nueva venta" está deshabilitada
    Y veo el mensaje MSG-03: "Tu perfil no tiene habilitado ningún tipo de comprobante. Pedile al administrador que lo configure."
```

#### Fuera de alcance
- Cambiar los permisos (se hace en el ERP).

#### Notas / preguntas abiertas
- Hoy, sin permisos cargados en la base, Factura queda habilitada por defecto (`permissionDefaults.ts`). Se mantiene ese comportamiento para no romper instalaciones sin configurar.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 6.2 Épica VEN — Intención «Vender en mostrador»

### VEN-01 — Ver el contexto de mi puesto al iniciar

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-01, HT-ROL-01 |
| **Habilita** | — |
| **Pantalla POC** | V-01 · zona Z1 |

#### Historia
```
Como vendedor
quiero ver en mi inicio la sucursal, el punto de venta, el depósito y la caja con los que estoy operando
para confirmar dónde estoy vendiendo antes de emitir
```

#### Valor de negocio
Evita emitir en un punto de venta o depósito equivocado, un error fiscal y de stock difícil de revertir.

#### Escenarios fuente
```text
RF-32 | El inicio muestra el contexto del puesto: usuario, sucursal, punto de venta (electrónico o controlador fiscal), depósito y caja
```

#### Criterios de aceptación
1. **[Feliz]** El inicio muestra nombre del usuario, sucursal, punto de venta con su tipo (electrónico o controlador fiscal), depósito y caja.
2. **[Alternativo]** Si el usuario no tiene caja asignada, la zona lo indica sin bloquear presupuestos ni pedidos.
3. **[Error]** Si el contexto no carga, se muestra MSG-20: "No pudimos cargar esta sección. Reintentá en unos segundos." y el resto del inicio sigue disponible.

#### Escenarios BDD
```gherkin
Característica: Contexto del puesto
  Escenario: Contexto completo
    Dado que inicié sesión como Vendedor en la sucursal "Centro", punto de venta 0001 electrónico, depósito "01" y caja "2"
    Cuando veo mi inicio
    Entonces veo "Sucursal Centro · PV 0001 (electrónico) · Depósito 01 · Caja 2"
```

#### Fuera de alcance
- Cambiar de sucursal, depósito o caja desde el inicio.

#### Notas / preguntas abiertas
- Los datos ya existen en la sesión (`checkout_name`, `warehouse_name`, `pos_name`); falta el tipo de punto de venta (HT-ROL-01).

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-02 — Buscar artículo o cliente desde el inicio

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-VEN-03 |
| **Habilita** | VEN-06, VEN-15 |
| **Pantalla POC** | V-01 · zona Z2 |

#### Historia
```
Como vendedor
quiero un único buscador que encuentre artículos y clientes
para empezar la venta por el producto o por el cliente sin elegir antes una pantalla
```

#### Valor de negocio
Una venta en mostrador arranca de dos maneras: «busco el producto» o «atiendo a este cliente». Un solo buscador cubre las dos.

#### Escenarios fuente
```text
RF-33 | El inicio ofrece un buscador único que encuentra artículos (código, descripción, código de barras) y clientes (nombre, código, DNI, CUIT), y un acceso «Nueva venta»
```

#### Criterios de aceptación
1. **[Feliz]** Al escribir al menos 3 caracteres, se muestran resultados agrupados en «Artículos» y «Clientes».
2. **[Feliz]** Leer un código de barras con el escáner muestra el artículo exacto como primer resultado.
3. **[Alternativo]** Elegir un cliente abre una venta nueva con ese cliente cargado; elegir un artículo abre una venta nueva con el artículo agregado (VEN-06).
4. **[Error]** Sin resultados se muestra MSG-04: "No encontramos artículos ni clientes para «{texto}»."
5. **[Validación]** Los resultados aparecen en p95 ≤ 1 s para hasta 70.000 artículos (la demo de ERP Web / POS tiene 69.849).

#### Escenarios BDD
```gherkin
Característica: Buscador único del inicio
  Escenario: Buscar por código de barras
    Dado que estoy en mi inicio
    Cuando leo con el escáner el código de barras de "ARTICULO 01 - BASE"
    Entonces veo "ARTICULO 01 - BASE" como primer resultado en "Artículos"

  Escenario: Empezar por el cliente
    Dado que estoy en mi inicio
    Cuando busco "CLIENTE 03" y elijo el cliente
    Entonces se abre una venta nueva con "CLIENTE 03 CUENTA CORRIENTE" cargado

  Escenario: Sin resultados
    Cuando busco "zzzz"
    Entonces veo el mensaje MSG-04: "No encontramos artículos ni clientes para «zzzz»."
```

#### Fuera de alcance
- Búsqueda avanzada con filtros de familia o marca (sigue en la venta).

#### Notas / preguntas abiertas
- Parámetros 32 y 150 definen la búsqueda por código y barras (PRD RF-01).

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-VEN-03 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-03 — Iniciar una venta nueva con el tipo de comprobante elegido

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-04, VEN-08 |
| **Habilita** | VEN-13 |
| **Pantalla POC** | V-01 · zona Z2 → V-02 |

#### Historia
```
Como vendedor
quiero iniciar desde mi inicio una venta nueva como factura, pedido o presupuesto
para llegar a la pantalla de venta con el tipo correcto en un clic
```

#### Valor de negocio
Reemplaza la elección entre pantallas «Crear factura», «Crear pedido» y «Crear presupuesto» por una sola entrada.

#### Escenarios fuente
```text
RF-33 | … y un acceso «Nueva venta»
RF-31 | … con el marcado «por defecto» preseleccionado
```

#### Criterios de aceptación
1. **[Feliz]** «Nueva venta» abre la pantalla Venta con el tipo preseleccionado y los valores de RN-10.
2. **[Alternativo]** Elegir otro tipo en «Iniciar como» abre la venta con ese tipo y sus campos propios (fecha de entrega y operación en NP; vencimiento en PR).
3. **[Alternativo]** Si hay una venta en curso, se muestra MSG-05: "Tenés una venta en curso con {n} artículos. ¿Querés retomarla o empezar una nueva?" con las opciones «Retomar» y «Empezar nueva».
4. **[Validación]** «Empezar nueva» descarta la venta en curso (RN-09).

#### Escenarios BDD
```gherkin
Característica: Nueva venta desde el inicio
  Escenario: Nueva venta como pedido
    Dado que mi perfil permite Factura y Pedido
    Cuando elijo "Pedido" en "Iniciar como" y toco "Nueva venta"
    Entonces veo la pantalla Venta como Pedido con fecha de entrega y operación

  Escenario: Venta en curso
    Dado que tengo una venta en curso con 3 artículos
    Cuando toco "Nueva venta"
    Entonces veo el mensaje MSG-05: "Tenés una venta en curso con 3 artículos. ¿Querés retomarla o empezar una nueva?"
```

#### Fuera de alcance
- Varias ventas en curso a la vez (§10).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-04 — Ver mis últimos comprobantes y reenviarlos

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-VEN-01 |
| **Habilita** | VEN-16 |
| **Pantalla POC** | V-01 · zona Z6 → V-06 |

#### Historia
```
Como vendedor
quiero ver mis últimos comprobantes en el inicio con acciones de reimprimir y compartir
para atender un «¿me lo reenviás?» sin buscar en planillas
```

#### Valor de negocio
Reimprimir o reenviar es la acción más frecuente después de vender; hoy exige ir a planillas con los comprobantes de todos.

#### Escenarios fuente
```text
RF-34 | El inicio lista los últimos 5 comprobantes del usuario con reimprimir, compartir y ticket de cambio, y un acceso a todos los propios
```

#### Criterios de aceptación
1. **[Feliz]** El inicio lista los últimos 5 comprobantes propios (RN-05) con tipo, número, cliente, importe y hora.
2. **[Feliz]** Cada comprobante ofrece reimprimir, compartir (WhatsApp o mail) y, en facturas, ticket de cambio.
3. **[Alternativo]** «Ver todos» abre V-06 con los propios de los últimos 7 días, filtrables por tipo y cliente.
4. **[Alternativo]** Sin comprobantes en el día se muestra MSG-06: "Todavía no emitiste comprobantes hoy."
5. **[Validación]** Un comprobante recién emitido aparece en la lista al volver al inicio.

#### Escenarios BDD
```gherkin
Característica: Últimos comprobantes
  Escenario: Reenviar una factura
    Dado que emití la factura "FB 0001-00244422"
    Cuando vuelvo a mi inicio
    Entonces veo "FB 0001-00244422" primero en "Últimos comprobantes"
    Y puedo compartirla por WhatsApp

  Escenario: Sin comprobantes
    Dado que no emití comprobantes hoy
    Cuando veo mi inicio
    Entonces veo el mensaje MSG-06: "Todavía no emitiste comprobantes hoy."
```

#### Fuera de alcance
- Comprobantes de otros usuarios (ADM).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-05 — Ver mis pendientes accionables

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Should |
| **Depende de** | HT-VEN-02 |
| **Habilita** | VEN-14 |
| **Pantalla POC** | V-01 · zona Z5 |

#### Historia
```
Como vendedor
quiero ver en mi inicio mis pedidos sin facturar y mis comprobantes sin CAE
para resolverlos antes de que el cliente vuelva o el problema crezca
```

#### Valor de negocio
Convierte lo pendiente en acciones de un clic en lugar de buscarlo en planillas.

#### Escenarios fuente
```text
RF-35 | El inicio muestra los pendientes accionables del usuario: pedidos propios sin facturar o sin entregar, comprobantes sin CAE o rechazados y, posterior al MVP, presupuestos por vencer
```

#### Criterios de aceptación
1. **[Feliz]** El inicio muestra contadores de pedidos propios sin facturar y de comprobantes propios sin CAE o con CAE rechazado.
2. **[Feliz]** Tocar un contador abre la lista filtrada; cada ítem abre el comprobante.
3. **[Alternativo]** Las solicitudes de NC propias rechazadas aparecen con MSG-15: "Solicitud {numero} rechazada: {motivo}."
4. **[Alternativo]** Sin pendientes se muestra MSG-07: "No tenés pendientes."
5. **[Error]** Si la zona no carga, se muestra MSG-20: "No pudimos cargar esta sección. Reintentá en unos segundos."

#### Escenarios BDD
```gherkin
Característica: Pendientes del vendedor
  Escenario: Factura sin CAE
    Dado que emití una factura que quedó sin CAE
    Cuando veo mi inicio
    Entonces veo "1 factura sin CAE" en "Para accionar"

  Escenario: Sin pendientes
    Dado que no tengo pendientes
    Cuando veo mi inicio
    Entonces veo el mensaje MSG-07: "No tenés pendientes."
```

#### Fuera de alcance
- Presupuestos por vencer (posterior, §10).
- Reintentar el CAE desde el inicio (sigue en la vista de factura electrónica).

#### Notas / preguntas abiertas
- S-06: se agrega el filtro por usuario emisor a la vista de factura electrónica si no existe.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-VEN-02 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-06 — Agregar un artículo a la venta en un paso

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | VEN-02 |
| **Habilita** | — |
| **Pantalla POC** | V-02 Venta |

#### Historia
```
Como vendedor
quiero agregar el artículo a la venta con un solo clic desde el resultado de búsqueda
para cargar la venta más rápido mientras atiendo al cliente
```

#### Valor de negocio
Hoy la búsqueda abre el modal «Resultados de tu búsqueda» y pide «Seleccionar» [17:26] (PRD H-27): un paso de más por artículo.

#### Escenarios fuente
```text
RF-36 | Elegir un artículo del resultado de búsqueda lo agrega a la venta en un paso, sin un modal intermedio de selección
```

#### Criterios de aceptación
1. **[Feliz]** Elegir un artículo del resultado lo agrega con cantidad 1 y la lista desplegable se cierra.
2. **[Feliz]** Leer un código de barras con coincidencia exacta agrega el artículo sin mostrar la lista.
3. **[Alternativo]** Si el artículo tiene talle o lote, se pide el talle o lote en la misma línea antes de confirmar la cantidad.
4. **[Alternativo]** Agregar un artículo que ya está en la venta suma 1 a su cantidad.
5. **[Validación]** Del escaneo al artículo agregado pasa ≤ 1 s en p95 (PRD RNF-09). Se cumple RN-01.

#### Escenarios BDD
```gherkin
Característica: Agregar en un paso
  Escenario: Desde el resultado
    Dado que estoy en una venta
    Cuando busco "ART01" y elijo "ARTICULO 01 - BASE"
    Entonces la venta tiene 1 unidad de "ARTICULO 01 - BASE"
    Y no veo el modal "Resultados de tu búsqueda"

  Escenario: Artículo con talle
    Cuando elijo un artículo con talles
    Entonces veo los talles en la línea del artículo para elegir uno
```

#### Fuera de alcance
- Búsqueda avanzada con filtros (se conserva como opción secundaria).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-07 — Ver precio, stock y promoción antes de agregar

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-VEN-06 |
| **Habilita** | VEN-12 |
| **Pantalla POC** | V-01 buscador · V-02 Venta |

#### Historia
```
Como vendedor
quiero ver el precio, el stock disponible y la promoción vigente en el resultado de búsqueda
para decidir con el cliente antes de agregar el artículo
```

#### Valor de negocio
Hoy el aviso de stock llega como confirmación después de agregar [17:35] y el vendedor se entera tarde.

#### Escenarios fuente
```text
RF-37 | El resultado de búsqueda muestra, antes de agregar, el precio de la lista del usuario, el stock disponible según el parámetro 109 y la promoción vigente
```

#### Criterios de aceptación
1. **[Feliz]** Al resaltar un artículo del resultado (o con la coincidencia exacta del escáner), se consultan para ese artículo y se muestran el precio de la lista del usuario, el stock disponible y la promoción vigente si la hay (S-03).
2. **[Feliz]** El stock se calcula según RN-07 (real o remanente) y se indica cuál de los dos se muestra.
3. **[Alternativo]** Un artículo con stock 0 o menor que 1 se marca «Sin stock» en el resultado.
4. **[Validación]** El precio mostrado es el mismo que toma la venta al agregar (sin diferencias como la de $1.200 → $1.210 vista en la demo).

#### Escenarios BDD
```gherkin
Característica: Precio, stock y promoción en el resultado
  Escenario: Artículo con promoción
    Dado que "ARTICULO 01 - BASE" tiene una promoción vigente de 10 %
    Cuando lo busco y lo resalto en el resultado
    Entonces veo su precio de lista, su stock disponible y "10 % off"

  Escenario: Precio coherente
    Dado que el resultado muestra "ARTICULO 01 - BASE" a $1.210,00
    Cuando lo agrego
    Entonces la línea de la venta muestra $1.210,00
```

#### Fuera de alcance
- Stock en otras sucursales en el resultado (está en VEN-12 y VEN-15).

#### Notas / preguntas abiertas
- En la demo, el resultado mostró $1.210 y la línea $1.200: verificar si la diferencia es por IVA incluido (parámetros 4, 21, 49) — se registra en §11.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-VEN-06 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-08 — Empezar con la venta precargada por defecto

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-02 |
| **Habilita** | VEN-03, VEN-10 |
| **Pantalla POC** | V-02 Venta |

#### Historia
```
Como vendedor
quiero que la venta nueva venga con los valores habituales cargados y las condiciones plegadas
para completar solo lo que cambia en esta venta
```

#### Valor de negocio
Hoy el panel de condiciones (Enviar como, lista, condición de venta y de pago, depósito, vendedor, descuento, más detalles) está siempre desplegado aunque casi nunca cambie.

#### Escenarios fuente
```text
RF-38 | La venta nueva se precarga con el cliente del parámetro 87, el tipo de comprobante por defecto, la condición, la lista, el depósito y el vendedor del usuario; las condiciones que no cambian quedan plegadas
```

#### Criterios de aceptación
1. **[Feliz]** La venta nueva se precarga según RN-10.
2. **[Feliz]** Las condiciones se muestran plegadas como un resumen de una línea (por ejemplo «Factura · Contado · L1 · Depósito 01»); tocarlo las despliega.
3. **[Alternativo]** Cambiar una condición la deja visible en el resumen hasta emitir.
4. **[Validación]** Los campos obligatorios sin valor por defecto se muestran desplegados y bloquean «Cobrar» hasta completarse. Se cumple RN-01.

#### Escenarios BDD
```gherkin
Característica: Venta precargada
  Escenario: Venta típica
    Dado que el parámetro 87 define "CLI01 - CLIENTE 01 CONSUMIDOR FINAL"
    Cuando inicio una venta nueva
    Entonces veo el cliente "CLIENTE 01 CONSUMIDOR FINAL"
    Y veo las condiciones plegadas como "Factura · Contado · L1 · DEPOSITO 01 CENTRAL"
```

#### Fuera de alcance
- Cambiar los valores por defecto del usuario (ERP).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-09 — Ver el total por medio de pago antes de cobrar

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor (vendedor-cajero) |
| **Prioridad sugerida** | Should |
| **Depende de** | HT-VEN-04 |
| **Habilita** | — |
| **Pantalla POC** | V-02 Venta · V-03 Cobro |

#### Historia
```
Como vendedor-cajero
quiero ver cuánto paga el cliente con cada medio de pago y en cuotas antes de cobrar
para ofrecerle la mejor opción sin volver atrás
```

#### Valor de negocio
Hoy el 5 % de descuento en efectivo aparece recién en el cobro [17:38]; el cliente pregunta «¿y en efectivo cuánto es?» antes.

#### Escenarios fuente
```text
RF-39 | Antes de confirmar el cobro, el vendedor ve el total con el descuento o recargo de cada medio de pago y las cuotas disponibles con tarjeta
```

#### Criterios de aceptación
1. **[Feliz]** La venta muestra, debajo del total, el total por medio de pago habilitado (por ejemplo «Efectivo $1.140 · Tarjeta 1 pago $1.200»).
2. **[Feliz]** «Ver cuotas» muestra los planes con tarjeta, con el importe de cada cuota y el total.
3. **[Alternativo]** Al cambiar artículos o condiciones, los totales se recalculan.
4. **[Error]** Si el cálculo falla, se muestra MSG-11: "No pudimos calcular los totales por medio de pago. Los vas a ver al cobrar." y la venta sigue.

#### Escenarios BDD
```gherkin
Característica: Total por medio de pago
  Escenario: Descuento en efectivo
    Dado que el multiplazo da 5 % de descuento en efectivo
    Y la venta suma $1.200,00
    Cuando veo el total
    Entonces veo "Efectivo $1.140,00"

  Escenario: Falla del cálculo
    Dado que el cálculo de totales no responde
    Cuando veo el total
    Entonces veo el mensaje MSG-11: "No pudimos calcular los totales por medio de pago. Los vas a ver al cobrar."
```

#### Fuera de alcance
- Cuotas de pasarelas QR (Épica 3).

#### Notas / preguntas abiertas
- S-07: el cálculo se hace en el backend con la misma función que usa el cobro.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-VEN-04 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-10 — Volver al inicio con una venta nueva al emitir

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | VEN-08 |
| **Habilita** | VEN-04 |
| **Pantalla POC** | V-04 Comprobante emitido → V-01 |

#### Historia
```
Como vendedor
quiero, después de emitir, empezar otra venta o volver a mi inicio en un clic
para atender al próximo cliente sin pasos intermedios
```

#### Valor de negocio
Cierra el ciclo de la intención: el puesto queda listo para el próximo cliente.

#### Escenarios fuente
```text
RF-40 | Al emitir, el sistema muestra el comprobante emitido y ofrece «Nueva venta», que vuelve al inicio con una venta vacía
```

#### Criterios de aceptación
1. **[Feliz]** Al emitir se muestra MSG-12: "Comprobante {tipo} {numero} emitido." con imprimir, compartir, ticket de cambio, ver pago, «Nueva venta» y «Ir al inicio».
2. **[Feliz]** «Nueva venta» deja una venta vacía precargada según RN-10.
3. **[Validación]** La venta emitida deja de ser venta en curso (RN-09) y aparece en «Últimos comprobantes».

#### Escenarios BDD
```gherkin
Característica: Después de emitir
  Escenario: Nueva venta
    Dado que emití la factura "FB 0001-00244422"
    Entonces veo el mensaje MSG-12: "Comprobante Factura FB 0001-00244422 emitido."
    Cuando toco "Nueva venta"
    Entonces veo una venta vacía con "CLIENTE 01 CONSUMIDOR FINAL"
```

#### Fuera de alcance
- Impresión automática sin confirmación.

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-11 — Resolver una venta bloqueada por cuenta corriente

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | — |
| **Habilita** | ADM-03 |
| **Pantalla POC** | V-02 Venta · flujo A1 |

#### Historia
```
Como vendedor
quiero que, si la cuenta corriente del cliente bloquea la venta, el sistema me ofrezca cómo seguir
para no perder la venta ni tener que llamar a administración
```

#### Valor de negocio
Hoy el bloqueo termina la operación; ofrecer contado o pedido recupera la venta dentro de las reglas.

#### Escenarios fuente
```text
RF-41 | Si la validación de cuenta corriente bloquea la venta y el vendedor no tiene el permiso 963, el sistema ofrece cobrar de contado, generar un pedido o derivar al Administrativo
```

#### Criterios de aceptación
1. **[Feliz]** Ante el bloqueo (RN-08), se muestra MSG-10: "La cuenta corriente de {cliente} no permite esta venta: {motivo}. Podés cobrarla de contado o generar un pedido para que la revise administración."
2. **[Alternativo]** «Cobrar de contado» cambia la condición a contado y lleva al cobro.
3. **[Alternativo]** «Generar pedido» convierte la venta en pedido; la opción solo aparece con el permiso 003.
4. **[Alternativo]** Con el permiso 963, el vendedor puede destildar la validación y emitir.
5. **[Validación]** El motivo distingue «límite superado» de «comprobantes vencidos».

#### Escenarios BDD
```gherkin
Característica: Bloqueo por cuenta corriente
  Escenario: Cliente sobre el límite
    Dado que "CLIENTE 03" superó su límite de crédito
    Y no tengo el permiso 963
    Cuando intento emitir una factura en cuenta corriente
    Entonces veo el mensaje MSG-10: "La cuenta corriente de CLIENTE 03 no permite esta venta: límite superado. Podés cobrarla de contado o generar un pedido para que la revise administración."

  Escenario: Generar pedido
    Dado que veo el bloqueo por cuenta corriente y tengo el permiso 003
    Cuando elijo "Generar pedido"
    Entonces la venta pasa a Pedido con los mismos artículos
```

#### Fuera de alcance
- Autorización remota del supervisor.

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-12 — Resolver una venta con stock insuficiente

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Must |
| **Depende de** | VEN-07, HT-VEN-06 |
| **Habilita** | — |
| **Pantalla POC** | V-02 Venta · flujo A4 |

#### Historia
```
Como vendedor
quiero que, si no alcanza el stock, el sistema me avise en la línea y me ofrezca alternativas
para resolver la venta con el cliente en el momento
```

#### Valor de negocio
Reemplaza el modal «¿Confirma el movimiento?» [17:35] por un aviso en contexto con caminos de salida.

#### Escenarios fuente
```text
RF-43 | Ante stock insuficiente, el sistema avisa o bloquea según el parámetro 109 y ofrece ver stock en otras sucursales o generar un pedido
```

#### Criterios de aceptación
1. **[Feliz]** Con el parámetro 109 en modo aviso, la línea muestra MSG-08: "Stock disponible: {disponible}. Estás vendiendo más de lo disponible." y la venta sigue.
2. **[Alternativo]** En modo bloqueo y con Factura, se muestra MSG-09: "No hay stock suficiente de {articulo} para facturar. Disponible: {disponible}." y no se puede emitir con esa cantidad.
3. **[Alternativo]** El aviso ofrece «Ver otras sucursales» y, con el permiso 003, «Generar pedido».
4. **[Validación]** En presupuestos no se valida stock; en pedidos solo con valores 5 a 9 (RN-07).

#### Escenarios BDD
```gherkin
Característica: Stock insuficiente
  Escenario: Modo aviso
    Dado que el parámetro 109 vale 5
    Y "ARTICULO 01 - BASE" tiene 0 unidades disponibles
    Cuando lo agrego a una factura
    Entonces veo en la línea el mensaje MSG-08: "Stock disponible: 0. Estás vendiendo más de lo disponible."

  Escenario: Modo bloqueo
    Dado que el parámetro 109 vale 2
    Y "ARTICULO 01 - BASE" tiene 0 unidades disponibles
    Cuando intento emitir la factura
    Entonces veo el mensaje MSG-09: "No hay stock suficiente de ARTICULO 01 - BASE para facturar. Disponible: 0."
```

#### Fuera de alcance
- Registro de venta no realizada (§10).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-13 — Retomar una venta en curso

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Should |
| **Depende de** | VEN-03 |
| **Habilita** | — |
| **Pantalla POC** | V-01 · zona Z3 |

#### Historia
```
Como vendedor
quiero ver en mi inicio la venta que dejé armada y retomarla
para continuar la atención si me interrumpieron
```

#### Valor de negocio
En mostrador se interrumpe la atención; hoy la venta persiste pero solo se ve al abrir el carrito.

#### Escenarios fuente
```text
RF-44 | Una venta armada y no emitida queda disponible en el inicio para retomarla
```

#### Criterios de aceptación
1. **[Feliz]** Si hay una venta en curso (RN-09), el inicio la muestra con cliente, cantidad de artículos y total.
2. **[Feliz]** «Retomar» abre la venta tal como quedó.
3. **[Alternativo]** «Descartar» la elimina tras confirmar.

#### Escenarios BDD
```gherkin
Característica: Venta en curso
  Escenario: Retomar
    Dado que dejé armada una venta para "CLIENTE 01" con 3 artículos
    Cuando vuelvo a mi inicio
    Entonces veo "CLIENTE 01 · 3 ítems" en "Ventas en curso"
    Cuando toco "Retomar"
    Entonces veo la venta con los 3 artículos
```

#### Fuera de alcance
- Varias ventas en curso y persistencia entre dispositivos (§10).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-14 — Convertir un presupuesto propio en pedido o factura

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Should |
| **Depende de** | VEN-04, VEN-05 |
| **Habilita** | — |
| **Pantalla POC** | V-06 Mis comprobantes · flujo A8 |

#### Historia
```
Como vendedor
quiero convertir un presupuesto que hice en pedido o factura cuando el cliente vuelve
para no cargar de nuevo los artículos
```

#### Valor de negocio
Soporta los circuitos PR → NP → FC y PR → FC de los clientes [04:46–04:57].

#### Escenarios fuente
```text
RF-45 | El vendedor convierte un presupuesto propio en pedido o factura desde el inicio, copiando su contenido según la parametrización
```

#### Criterios de aceptación
1. **[Feliz]** Desde un presupuesto propio, «Convertir» ofrece los tipos permitidos (RN-06) y abre una venta con sus artículos y su cliente.
2. **[Alternativo]** Si el presupuesto venció, se muestra MSG-13: "El presupuesto {numero} venció el {fecha}. Los precios se recalculan con la lista vigente."
3. **[Validación]** El comprobante emitido queda vinculado al presupuesto de origen. Se cumple RN-01.

#### Escenarios BDD
```gherkin
Característica: Convertir presupuesto
  Escenario: Presupuesto vencido
    Dado que el presupuesto "PR 0001-00000123" venció el 15/10/2026
    Cuando lo convierto en factura
    Entonces veo el mensaje MSG-13: "El presupuesto PR 0001-00000123 venció el 15/10/2026. Los precios se recalculan con la lista vigente."
```

#### Fuera de alcance
- Convertir presupuestos de otros vendedores (ADM).

#### Notas / preguntas abiertas
- Qué copia la conversión depende de la parametrización (PRD RF-07).

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-15 — Consultar un artículo sin iniciar una venta

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Should |
| **Depende de** | VEN-02, HT-VEN-06 |
| **Habilita** | — |
| **Pantalla POC** | V-05 Consulta de artículo · flujo A9 |

#### Historia
```
Como vendedor
quiero consultar precio, stock en mi depósito y en otras sucursales, promociones y cuotas de un artículo sin abrir una venta
para responder la consulta del cliente sin ensuciar la venta en curso
```

#### Valor de negocio
Una consulta de precio y disponibilidad es parte de la atención [21:14–21:21]; hoy obliga a usar el carrito o la app.

#### Escenarios fuente
```text
RF-46 | El vendedor consulta precio, stock por depósito y sucursal, promociones y cuotas de un artículo sin iniciar una venta
```

#### Criterios de aceptación
1. **[Feliz]** Desde el buscador, «Ver detalle» abre la consulta con precio, stock por depósito y sucursal, promociones y cuotas.
2. **[Alternativo]** «Agregar a una venta» desde la consulta abre una venta nueva o suma a la venta en curso.
3. **[Alternativo]** Sin stock en otras sucursales se muestra MSG-21: "Sin stock en otras sucursales."
4. **[Validación]** Consultar no crea ni modifica la venta en curso.

#### Escenarios BDD
```gherkin
Característica: Consulta de artículo
  Escenario: Stock en otras sucursales
    Dado que "ARTICULO 01 - BASE" no tiene stock en mi depósito y tiene 4 en "Sucursal Norte"
    Cuando consulto su detalle
    Entonces veo "Sucursal Norte: 4"
```

#### Fuera de alcance
- La intención completa del usuario de consulta (Épica 3).

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### VEN-16 — Registrar una devolución: NC o solicitud de NC

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | VEN — Vender en mostrador |
| **Actor** | Vendedor |
| **Prioridad sugerida** | Could |
| **Depende de** | ROL-04, HT-VEN-05 |
| **Habilita** | ADM-04 |
| **Pantalla POC** | V-06 Mis comprobantes · flujo A10 |

#### Historia
```
Como vendedor
quiero iniciar la devolución de una factura de mi cliente
para resolverla en el mostrador o dejarla pedida a administración
```

#### Valor de negocio
Las devoluciones ocurren en el mostrador; sin este camino el vendedor deriva al cliente a otra persona.

#### Escenarios fuente
```text
RF-47 | Ante una devolución, el vendedor emite la NC vinculada a la factura si tiene el permiso 005, o registra una solicitud de NC para el Administrativo
```

#### Criterios de aceptación
1. **[Feliz]** Con el permiso 005, «Devolución» desde una factura abre una NC vinculada con los artículos de esa factura (RN-11).
2. **[Alternativo]** Sin el permiso 005, «Devolución» registra una solicitud con artículos, cantidades y motivo, y muestra MSG-14: "Registramos la solicitud de nota de crédito {numero}. Administración la va a revisar."
3. **[Error]** Si el cliente no tiene facturas con artículos para devolver, se muestra MSG-16: "No encontramos facturas de {cliente} con artículos para devolver."
4. **[Validación]** Las cantidades a devolver no superan las facturadas menos las ya devueltas.

#### Escenarios BDD
```gherkin
Característica: Devolución
  Escenario: Solicitud sin permiso
    Dado que no tengo el permiso 005
    Cuando inicio una devolución de 1 unidad de la factura "FB 0001-00244422"
    Entonces veo el mensaje MSG-14: "Registramos la solicitud de nota de crédito SNC-0001. Administración la va a revisar."
```

#### Fuera de alcance
- Devoluciones sin factura de origen.

#### Notas / preguntas abiertas
- S-04: relevar la «Solicitud Nota de Crédito» del Delphi; si no se puede exponer por la API, se posponen la solicitud (sin permiso 005) y ADM-04.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-VEN-05 | ✅ | ✅ | ⚠️ S-04 | ✅ | ✅ |

---

### 6.3 Épica ADM — Intención «Gestionar y cerrar la venta»

### ADM-01 — Ver mis pendientes de gestión al iniciar

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ADM — Gestionar y cerrar la venta |
| **Actor** | Administrativo |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-03, HT-ADM-01 |
| **Habilita** | ADM-03, ADM-04 |
| **Pantalla POC** | V-11 Inicio administrativo |

#### Historia
```
Como administrativo
quiero ver al iniciar los pendientes de gestión con su cantidad
para empezar por lo que el equipo de venta me dejó
```

#### Valor de negocio
Reemplaza la búsqueda en planillas por una bandeja accionable.

#### Escenarios fuente
```text
RF-49 | El inicio administrativo muestra la bandeja «Pendientes de gestión» con contadores accionables: pedidos sin facturar, solicitudes de NC, comprobantes sin CAE, remitos sin facturar y deudas vencidas
```

#### Criterios de aceptación
1. **[Feliz]** El inicio muestra contadores de pedidos sin facturar, solicitudes de NC, comprobantes sin CAE, remitos sin facturar y clientes con deuda vencida, junto al menú lateral.
2. **[Feliz]** Tocar un contador abre la pantalla correspondiente filtrada.
3. **[Alternativo]** Un contador en 0 se muestra deshabilitado; sin ningún pendiente se muestra MSG-17: "No hay pendientes de gestión."
4. **[Validación]** Los contadores reflejan los datos de la empresa de la sesión.

#### Escenarios BDD
```gherkin
Característica: Pendientes de gestión
  Escenario: Pedidos sin facturar
    Dado que hay 2 pedidos sin facturar
    Cuando inicio sesión como Administrativo
    Entonces veo "Pedidos sin facturar: 2"
    Cuando lo toco
    Entonces veo la facturación de pedidos con esos 2 pedidos
```

#### Fuera de alcance
- Alertas por mail o notificaciones push.

#### Notas / preguntas abiertas
- —

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de HT-ADM-01 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ADM-02 — Usar un menú lateral acotado a Venta y Stock

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ADM — Gestionar y cerrar la venta |
| **Actor** | Administrativo |
| **Prioridad sugerida** | Must |
| **Depende de** | ROL-03, T-02 |
| **Habilita** | — |
| **Pantalla POC** | V-11 menú lateral |

#### Historia
```
Como administrativo
quiero un menú con las opciones de gestión de la venta agrupadas por tarea
para encontrar cada pantalla sin recorrer módulos que no uso
```

#### Valor de negocio
Ordena por tarea lo que hoy está repartido entre pestañas de módulo y submenús copiados del ERP.

#### Escenarios fuente
```text
RF-52 | El menú lateral del Administrativo se limita a Buscar comprobante, Factura, NC, ND, Presupuestos, Pedidos, Remitos, Gestión de cuentas y Consultas, según sus permisos
```

#### Criterios de aceptación
1. **[Feliz]** El menú muestra, en este orden: Buscar comprobante; Factura (Facturación de pedidos, Libro IVA ventas); Nota de crédito; Nota de débito; Presupuestos; Pedidos; Remitos de venta; Gestión de cuentas (Cuenta corriente, Movimientos, Deudas totales); Consultas (Artículos, Clientes, Stock).
2. **[Alternativo]** Un ítem sin permiso no aparece (RN-03).
3. **[Validación]** El Administrativo no ve «Crear factura» de mostrador (SUP-08) ni las pestañas Compras, Fondos, Configuración y Usuarios.

#### Escenarios BDD
```gherkin
Característica: Menú del Administrativo
  Escenario: Menú acotado
    Dado que inicié sesión como Administrativo con todos los permisos de venta
    Cuando abro el menú lateral
    Entonces veo "Buscar comprobante", "Factura", "Nota de crédito", "Nota de débito", "Presupuestos", "Pedidos", "Remitos de venta", "Gestión de cuentas" y "Consultas"
    Y no veo "Crear factura"
```

#### Fuera de alcance
- Menús de Compras, Fondos, Contabilidad y Configuración (otros roles).

#### Notas / preguntas abiertas
- El menú se arma hoy desde el backend (`menuFetch` con `disponible`); la agrupación nueva requiere ajustar el árbol que devuelve (T-02).

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ADM-03 — Facturar pedidos pendientes filtrando por vendedor

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ADM — Gestionar y cerrar la venta |
| **Actor** | Administrativo |
| **Prioridad sugerida** | Must |
| **Depende de** | ADM-01 |
| **Habilita** | — |
| **Pantalla POC** | V-13 Facturación de pedidos |

#### Historia
```
Como administrativo
quiero facturar uno o varios pedidos pendientes filtrándolos por cliente, fecha o vendedor
para cerrar en lote lo que vendió el salón
```

#### Valor de negocio
Es el traspaso principal entre el vendedor de salón y la administración [20:59–21:06].

#### Escenarios fuente
```text
RF-48 | El Administrativo factura uno o varios pedidos pendientes, filtrados por cliente, fecha o vendedor, respetando el parámetro 116 para pedidos de otra empresa
```

#### Criterios de aceptación
1. **[Feliz]** La facturación de pedidos filtra por cliente, rango de fechas y vendedor.
2. **[Feliz]** Seleccionar varios pedidos del mismo cliente genera la factura con sus ítems; el stock reservado se libera y se descuenta (RN-01).
3. **[Error]** Un pedido de otra empresa que el parámetro 116 no permite facturar muestra MSG-18: "El pedido {numero} es de {empresa} y tu configuración no permite facturarlo desde esta empresa."
4. **[Validación]** Facturados, los pedidos salen de «Pedidos sin facturar» del Administrativo y del vendedor.

#### Escenarios BDD
```gherkin
Característica: Facturación de pedidos
  Escenario: Filtrar por vendedor
    Dado que hay pedidos sin facturar de los vendedores "Juan" y "Ana"
    Cuando filtro por vendedor "Juan"
    Entonces veo solo los pedidos de "Juan"

  Escenario: Pedido de otra empresa
    Dado que el parámetro 116 vale 0
    Cuando intento facturar el pedido "NP 0000-00321163" de "Empresa 2"
    Entonces veo el mensaje MSG-18: "El pedido NP 0000-00321163 es de Empresa 2 y tu configuración no permite facturarlo desde esta empresa."
```

#### Fuera de alcance
- Facturación masiva de verticales (PRD S-10).

#### Notas / preguntas abiertas
- Confirmar que el endpoint actual de pedidos pendientes admite el filtro por vendedor.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### ADM-04 — Resolver solicitudes de nota de crédito

| | |
|---|---|
| **Tipo** | HU-FE |
| **Épica** | ADM — Gestionar y cerrar la venta |
| **Actor** | Administrativo |
| **Prioridad sugerida** | Could |
| **Depende de** | VEN-16, HT-VEN-05 |
| **Habilita** | — |
| **Pantalla POC** | V-14 Notas de crédito |

#### Historia
```
Como administrativo
quiero ver las solicitudes de nota de crédito de los vendedores y emitirlas o rechazarlas
para controlar las devoluciones sin frenar la atención en el mostrador
```

#### Valor de negocio
Completa el circuito de devolución cuando el vendedor no tiene permiso para emitir la NC.

#### Escenarios fuente
```text
RF-51 | El Administrativo resuelve las solicitudes de NC del vendedor: emitir la NC vinculada o rechazarla con motivo
```

#### Criterios de aceptación
1. **[Feliz]** La lista de solicitudes muestra vendedor, cliente, factura, artículos, cantidades y motivo.
2. **[Feliz]** «Emitir NC» abre la NC vinculada precargada; al emitirla, la solicitud queda resuelta.
3. **[Alternativo]** «Rechazar» pide un motivo; el vendedor lo ve en sus pendientes (MSG-15: "Solicitud {numero} rechazada: {motivo}.").
4. **[Error]** Rechazar sin motivo muestra MSG-19: "Ingresá el motivo del rechazo."

#### Escenarios BDD
```gherkin
Característica: Solicitudes de NC
  Escenario: Rechazo sin motivo
    Dado que veo la solicitud "SNC-0001"
    Cuando toco "Rechazar" sin escribir un motivo
    Entonces veo el mensaje MSG-19: "Ingresá el motivo del rechazo."
```

#### Fuera de alcance
- Aprobaciones en varios niveles.

#### Notas / preguntas abiertas
- Depende del spike S-04.

#### Chequeo INVEST
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ⚠️ depende de VEN-16 | ✅ | ✅ | ⚠️ S-04 | ✅ | ✅ |

---

## 7. Historias técnicas — Endpoints BFF / BE (enablers)

Rutas propuestas para el BFF de Flexxus Order (SUP-01), que según S-08 opera sobre la misma base de datos que el ERP a través de la Web API; el contrato final se acuerda con el equipo técnico.

### HT-ROL-01 — GET · Contexto de sesión: experiencia, permisos y puesto

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | ROL — Experiencia por rol |
| **Habilita** | ROL-01, ROL-02, ROL-03, ROL-04, VEN-01, ADM-02 |
| **Contrato** | `GET /bff/sesion/contexto` → API: perfil del usuario, permisos por usuario y menú (`FMA_PERMISOSUSUARIOSMENUES_V6`, `FMA_USUARIOSPERMISOESP_V6`), puesto |
| **Prioridad sugerida** | Must |
| **Depende de** | T-01 (atributo) o la inferencia de RN-02 |

#### Objetivo técnico
Devolver en una sola llamada la experiencia de inicio, los permisos de los menús 78, 80, 87 y 90 como pares (menú, permiso), los tipos de comprobante habilitados y el contexto del puesto.

#### Criterios de aceptación
1. `200` con `{ experiencia: "VENDEDOR" | "ADMINISTRATIVO", experienciaOrigen: "PERFIL" | "INFERIDA", permisos: [{ menu, codigo }], tiposComprobante: [{ codigo, tipo, porDefecto }], puesto: { sucursal, puntoVenta, tipoPuntoVenta: "ELECTRONICO" | "CONTROLADOR_FISCAL", deposito, caja }, empresa }`.
2. Sin atributo en el perfil, `experiencia` se calcula con RN-02 y `experienciaOrigen = "INFERIDA"`.
3. Usuario sin perfil: `403` con `PERFIL_INEXISTENTE`.
4. p95 ≤ 500 ms.

#### Escenarios BDD
```gherkin
Característica: Contexto de sesión
  Escenario: Experiencia inferida
    Dado un usuario cuyo perfil no tiene experiencia y tiene el permiso 003 del menú 87
    Cuando se consulta GET /bff/sesion/contexto
    Entonces la respuesta es 200 con experiencia "VENDEDOR" y experienciaOrigen "INFERIDA"
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Contexto resuelto |
| 401 | `SESION_INVALIDA` | Token vencido o inválido |
| 403 | `PERFIL_INEXISTENTE` | El usuario no tiene perfil |
| 502 | `API_NO_DISPONIBLE` | La Web API no responde |

---

### HT-VEN-01 — GET · Comprobantes del usuario

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-04, VEN-14, VEN-16 |
| **Contrato** | `GET /bff/vendedor/comprobantes?desde&hasta&tipo&cliente&limite` → API de búsqueda de comprobantes con filtro por vendedor o usuario emisor |
| **Prioridad sugerida** | Must |
| **Depende de** | — |

#### Objetivo técnico
Listar los comprobantes propios (RN-05), ordenados del más reciente al más antiguo, con lo necesario para reimprimir, compartir, convertir o devolver.

#### Criterios de aceptación
1. `200` con `[{ tipo, numero, fecha, cliente, importe, estadoCae, convertible, devolvible }]`.
2. Sin parámetros, devuelve los últimos 5 del día.
3. Solo devuelve comprobantes propios, aunque el usuario tenga permisos de planilla.
4. p95 ≤ 800 ms para hasta 300 comprobantes por día (SUP-12).

#### Escenarios BDD
```gherkin
Característica: Comprobantes propios
  Escenario: Últimos 5
    Dado un vendedor que emitió 8 comprobantes hoy
    Cuando se consulta GET /bff/vendedor/comprobantes
    Entonces la respuesta tiene los 5 más recientes del vendedor
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Lista, vacía o no |
| 400 | `RANGO_INVALIDO` | `desde` posterior a `hasta` o rango mayor a 31 días |
| 401 | `SESION_INVALIDA` | Token inválido |

---

### HT-VEN-02 — GET · Pendientes del usuario

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-05, HT-ADM-01 |
| **Contrato** | `GET /bff/pendientes?ambito=PROPIOS` → API: pedidos pendientes, estado de CAE (vista de factura electrónica), solicitudes de NC |
| **Prioridad sugerida** | Should |
| **Depende de** | HT-VEN-05 (para solicitudes) |

#### Objetivo técnico
Devolver contadores y listas de pendientes propios: pedidos sin facturar y sin entregar, comprobantes sin CAE o rechazados, solicitudes de NC rechazadas.

#### Criterios de aceptación
1. `200` con `{ pedidosSinFacturar: { cantidad, items }, pedidosSinEntregar, comprobantesSinCae, solicitudesNcRechazadas }`.
2. Cada ítem trae `tipo`, `numero`, `cliente`, `fecha` y `motivo` cuando aplica.
3. Una falla parcial (por ejemplo, la consulta de CAE) devuelve `200` con esa clave en `null` y `errores: ["CAE"]`, sin perder el resto.

#### Escenarios BDD
```gherkin
Característica: Pendientes propios
  Escenario: Falla parcial
    Dado que la consulta de CAE no responde
    Cuando se consulta GET /bff/pendientes?ambito=PROPIOS
    Entonces la respuesta es 200 con comprobantesSinCae nulo y errores ["CAE"]
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Resultado completo o parcial |
| 401 | `SESION_INVALIDA` | Token inválido |

---

### HT-VEN-03 — GET · Búsqueda unificada de artículos y clientes

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-02, VEN-06, VEN-15 |
| **Contrato** | `GET /bff/busqueda?q&limite` → API de artículos (código, descripción, código de barras) y de clientes (nombre, código, DNI, CUIT) |
| **Prioridad sugerida** | Must |
| **Depende de** | — |

#### Objetivo técnico
Devolver artículos y clientes para un texto, con el precio de la lista del usuario. El stock y la promoción no viajan en el listado: se consultan por artículo con HT-VEN-06 (S-03).

#### Criterios de aceptación
1. `200` con `{ articulos: [{ codigo, descripcion, marca, precio, tieneTalle, tieneLote }], clientes: [{ codigo, razonSocial, cuit, telefono }] }`.
2. Una coincidencia exacta de código de barras devuelve ese artículo primero con `coincidenciaExacta: true`.
3. `q` con menos de 3 caracteres responde `400 TEXTO_CORTO`, salvo que sea un código exacto.
4. p95 ≤ 1 s para un catálogo de hasta 70.000 artículos y `limite` ≤ 20.

#### Escenarios BDD
```gherkin
Característica: Búsqueda unificada
  Escenario: Código de barras exacto
    Dado el artículo "ART01" con código de barras "7790000000011"
    Cuando se consulta GET /bff/busqueda?q=7790000000011
    Entonces el primer artículo es "ART01" con coincidenciaExacta verdadero
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Resultado, vacío o no |
| 400 | `TEXTO_CORTO` | Menos de 3 caracteres y no es un código exacto |
| 502 | `API_NO_DISPONIBLE` | La Web API no responde |

---

### HT-VEN-06 — GET · Disponibilidad del artículo: stock y promoción

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-07, VEN-12, VEN-15 |
| **Contrato** | `GET /bff/articulos/{codigo}/disponibilidad?deposito&talle&lote` → API de stock por depósito y sucursal (función de stock remanente del core) y motor de promociones |
| **Prioridad sugerida** | Must |
| **Depende de** | — |

#### Objetivo técnico
Devolver, para un artículo, el stock disponible según el parámetro 109, el stock en otras sucursales y la promoción vigente para el cliente y la lista de la venta (S-03: consulta por artículo).

#### Criterios de aceptación
1. `200` con `{ stockDisponible, criterioStock: "REAL" | "REMANENTE" | "REMANENTE_MAS_OC", modoValidacion: "AVISO" | "BLOQUEO" | "NINGUNO", otrasSucursales: [{ sucursal, deposito, stock }], promocion: { descripcion, porcentaje } | null }`.
2. `criterioStock` y `modoValidacion` salen del parámetro 109 (RN-07); con `VerificaStock = 0` en el artículo, `modoValidacion = "NINGUNO"`.
3. Artículo inexistente: `404 ARTICULO_INEXISTENTE`.
4. p95 ≤ 500 ms por artículo.

#### Escenarios BDD
```gherkin
Característica: Disponibilidad del artículo
  Escenario: Modo aviso contra remanente
    Dado que el parámetro 109 vale 5
    Cuando se consulta GET /bff/articulos/ART01/disponibilidad
    Entonces la respuesta trae criterioStock "REMANENTE" y modoValidacion "AVISO"
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Disponibilidad calculada |
| 404 | `ARTICULO_INEXISTENTE` | El código no existe |
| 502 | `API_NO_DISPONIBLE` | La Web API no responde |

---

### HT-VEN-04 — POST · Simulación del total por medio de pago

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-09 |
| **Contrato** | `POST /bff/ventas/simulacion-medios-pago` → API: multiplazos y condición de venta; gateway de pagos para planes de cuotas |
| **Prioridad sugerida** | Should |
| **Depende de** | — |

#### Objetivo técnico
Calcular en el backend (S-07), con la misma función que usa el cobro, el total por cada medio de pago habilitado y los planes de cuotas con tarjeta de la venta en armado, sin registrar nada.

#### Criterios de aceptación
1. Body: `{ cliente, items, condicionVenta, multiplazo, lista }`.
2. `200` con `[{ medio, total, ajuste: { tipo: "DESCUENTO" | "RECARGO", porcentaje }, planes: [{ cuotas, importeCuota, total }] }]`.
3. El total por medio coincide con el que calcula el cobro al emitir (RN-01).
4. Es idempotente y no reserva stock ni numeración.

#### Escenarios BDD
```gherkin
Característica: Simulación por medio de pago
  Escenario: Efectivo con descuento
    Dado una venta de $1.200,00 con un multiplazo que da 5 % en efectivo
    Cuando se envía POST /bff/ventas/simulacion-medios-pago
    Entonces la respuesta incluye medio "EFECTIVO" con total 1140.00
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Simulación calculada |
| 422 | `VENTA_INCOMPLETA` | Faltan cliente o ítems |
| 502 | `GATEWAY_NO_DISPONIBLE` | El gateway de pagos no responde (se devuelven los medios sin planes) |

---

### HT-VEN-05 — POST / PATCH · Solicitudes de nota de crédito

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | VEN — Vender en mostrador |
| **Habilita** | VEN-16, ADM-04, HT-VEN-02, HT-ADM-01 |
| **Contrato** | `POST /bff/solicitudes-nc` · `GET /bff/solicitudes-nc?estado` · `PATCH /bff/solicitudes-nc/{id}` → API sobre la «Solicitud Nota de Crédito» del ERP |
| **Prioridad sugerida** | Could |
| **Depende de** | Spike S-04 |

#### Objetivo técnico
Registrar la solicitud del vendedor, listarla para el Administrativo y resolverla (emitida o rechazada con motivo).

#### Criterios de aceptación
1. `POST` con `{ facturaOrigen, items: [{ articulo, cantidad }], motivo }` → `201` con `{ id, numero, estado: "PENDIENTE" }`.
2. Una cantidad mayor a la facturada menos la devuelta → `422 CANTIDAD_EXCEDIDA`.
3. `PATCH` con `{ estado: "RECHAZADA", motivo }` sin motivo → `422 MOTIVO_REQUERIDO`; con `{ estado: "EMITIDA", notaCredito }` vincula la NC.
4. Solo un perfil con el permiso 005 puede resolverla (`403` en otro caso).

#### Escenarios BDD
```gherkin
Característica: Solicitud de NC
  Escenario: Cantidad excedida
    Dado la factura "FB 0001-00244422" con 1 unidad de "ART01"
    Cuando se envía POST /bff/solicitudes-nc con 2 unidades de "ART01"
    Entonces la respuesta es 422 con CANTIDAD_EXCEDIDA
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 201 | — | Solicitud registrada |
| 403 | `SIN_PERMISO` | Resolver sin el permiso 005 |
| 404 | `FACTURA_INEXISTENTE` | La factura de origen no existe |
| 422 | `CANTIDAD_EXCEDIDA` / `MOTIVO_REQUERIDO` | Validaciones |

---

### HT-ADM-01 — GET · Contadores de pendientes de gestión

| | |
|---|---|
| **Tipo** | HT (enabler) |
| **Épica** | ADM — Gestionar y cerrar la venta |
| **Habilita** | ADM-01 |
| **Contrato** | `GET /bff/pendientes?ambito=EMPRESA` → mismas fuentes que HT-VEN-02, más remitos sin facturar y deudas vencidas |
| **Prioridad sugerida** | Must |
| **Depende de** | HT-VEN-02 |

#### Objetivo técnico
Devolver los contadores de la empresa de la sesión para la bandeja del Administrativo.

#### Criterios de aceptación
1. `200` con `{ pedidosSinFacturar, solicitudesNc, comprobantesSinCae, remitosSinFacturar, clientesConDeudaVencida }`, cada uno con `cantidad`.
2. Requiere experiencia Administrativo; con experiencia Vendedor responde `403`.
3. p95 ≤ 1 s.

#### Escenarios BDD
```gherkin
Característica: Contadores de gestión
  Escenario: Vendedor sin acceso
    Dado un usuario con experiencia "VENDEDOR"
    Cuando se consulta GET /bff/pendientes?ambito=EMPRESA
    Entonces la respuesta es 403 con SIN_PERMISO
```

#### Errores esperados
| Código HTTP | Código negocio | Cuándo |
|-------------|----------------|--------|
| 200 | — | Contadores |
| 403 | `SIN_PERMISO` | Experiencia distinta de Administrativo |

---

## 8. Tareas técnicas / habilitadores

| ID | Key Excel | Tarea | Objetivo | Definition of Done |
|----|-----------|-------|----------|--------------------|
| **T-01** | — | Atributo «Experiencia de inicio» en el perfil | Que el administrador asigne Vendedor o Administrativo a cada perfil (PRD S-15) | Campo en la tabla de perfiles con valores `VENDEDOR`, `ADMINISTRATIVO` o vacío; editable en el ABM de perfiles del ERP; script de versión incluido en el Updater; leído por HT-ROL-01 |
| **T-02** | — | Permisos por menú en el store del front | Conservar el par (menú, permiso) de los menús 78, 80, 87 y 90 (PRD H-8) | El store guarda `CODIGOMENU`; los chequeos de permiso reciben el menú; las combinaciones que hoy se niegan en silencio (por ejemplo, bonificación de NC, 260 del menú 80) quedan cubiertas por test |
| **T-03** | — | Layouts por rol y guard de rutas | Separar la navegación del Vendedor (sin pestañas ni menú lateral) de la del Administrativo (sin Venta) | Dos layouts; tabla de rutas permitidas por experiencia; redirección al inicio con MSG-02: "Esta sección no está disponible para tu perfil. Te llevamos a tu inicio."; tests de ruteo para las dos experiencias |
| **T-04** | — | Retirar la home de ejemplo | Eliminar `routes/HomePage` con datos fijos (PRD H-26) | Ruta `/` resuelta por experiencia; ningún dato de ejemplo en producción |
| **T-05** | — | Instrumentar la venta típica | Medir pasos y tiempo desde el inicio hasta el comprobante emitido (PRD RNF-10) | Eventos «venta_iniciada», «articulo_agregado», «cobro_iniciado», «comprobante_emitido» con usuario, puesto y duración; tablero con la mediana por día |
| **T-06** | — | Feature flag de la experiencia por rol | Activar la experiencia nueva por cliente según la versión de su API (PRD R-11) | Flag por instalación; con el flag apagado la navegación actual sigue igual; registro del estado por cliente en la consola de versiones |

---

## 9. Spikes y decisiones pendientes (columna DUDAS)

Los IDs de esta sección son propios del documento; entre paréntesis, la decisión relacionada del PRD.

| ID | Origen | Pregunta abierta | Impacto si no se resuelve | Propuesta del PO | Respuesta *(post HITL)* |
|----|--------|------------------|---------------------------|------------------|-------------------------|
| **S-01** | T-01 (PRD S-15) | ¿Se puede agregar el atributo de experiencia al perfil del ERP y a su ABM dentro del primer tramo, o se arranca solo con la inferencia? | ROL-01 sale con una regla que el administrador no puede corregir | Arrancar con la inferencia (RN-02) y sumar el atributo en el mismo tramo; el atributo gana sobre la inferencia | ok — se arranca con la inferencia y el atributo se suma en el mismo tramo; el atributo gana sobre la inferencia |
| **S-02** | ROL-01, RN-02 | ¿Qué códigos de menú cuentan como «administrativos» para la inferencia? | Perfiles mal clasificados | Tomar como administrativos los menús de planillas, facturación de pedidos, libro IVA, gestión de cuentas, maestros y configuración; validar la lista con el referente técnico | Son administrativos todos los ítems del menú lateral izquierdo, de la barra superior y del encabezado, salvo el carrito de compras (RN-02) |
| **S-03** | HT-VEN-03, VEN-07 | ¿La API devuelve stock disponible y promoción en el listado de búsqueda, o hay que consultarlos artículo por artículo? | La búsqueda no cumple 1 s o no muestra stock antes de agregar | Si no los devuelve, agregar un endpoint de listado enriquecido en la API; medirlo con 70.000 artículos | El stock y la promoción se consultan por artículo: HT-VEN-03 devuelve solo la búsqueda y HT-VEN-06 la disponibilidad de cada artículo |
| **S-04** | VEN-16, ADM-04, HT-VEN-05 (PRD S-17) | ¿La «Solicitud Nota de Crédito» del ERP existe en la base y se puede exponer por la API? | El circuito de devolución sin permiso no se puede construir | Relevar el formulario del Delphi y su tabla; si no es exponible, posponer VEN-16 (sin permiso) y ADM-04 | ok — relevar el formulario y su tabla; si no se puede exponer, se posponen VEN-16 (sin permiso) y ADM-04 |
| **S-05** | HT-ROL-01 | ¿Qué contiene hoy el campo `rol` de la sesión web? | Se duplica un concepto que ya existe | Revisarlo con el equipo de Order; si es el nombre del perfil, mantenerlo como dato de pantalla | pendiente de definir |
| **S-06** | VEN-05, HT-VEN-02 | ¿La vista de factura electrónica permite filtrar los comprobantes sin CAE por usuario? | Pendientes del vendedor incompletos | Agregar el filtro por usuario emisor si no existe | ok — agregar el filtro por usuario emisor si no existe |
| **S-07** | VEN-09, HT-VEN-04 | ¿El total por medio de pago y los planes de cuotas se calculan hoy en el backend o en el front? | Totales distintos entre la simulación y el cobro | Calcularlos en el backend con la misma función del cobro; el front solo los muestra | Backend, con la misma función que usa el cobro |
| **S-08** | SUP-01 (PRD S-02) | ¿Se construye sobre Flexxus Order o sobre ERP Web / POS? | Las HT se re-mapean y el layout cambia de base | Mantener las HU; decidir en la Semana 4 con el track de Tecnología | Sobre Flexxus Order, con la misma base de datos que el ERP |
| **S-09** | VEN-11, VEN-12 | Si el vendedor no tiene el permiso 003, ¿se le ofrece «derivar a administración» como pedido igualmente? | El vendedor-cajero sin pedidos se queda sin salida ante un bloqueo | No: sin el 003 solo se ofrece cobrar de contado; derivar requiere el permiso | ok — sin el permiso 003 solo se ofrece cobrar de contado |
| **S-10** | VEN-02, VEN-06 (PRD RNF-11) | ¿Los escáneres en uso funcionan como teclado (con Enter al final) en el navegador? | El agregado en un paso no funciona con el escáner | Probar con los modelos de 2 clientes representativos | pendiente de validar con el cliente |

> Pausa 2 ejecutada el 2026-10-22: 8 spikes respondidos; S-05 y S-10 quedan pendientes y no bloquean el Ready de las historias salvo HT-ROL-01 (S-05) y VEN-06 con escáner (S-10).

---

## 10. Recomendaciones del PO — historias faltantes

> Historias **no** derivadas de los RF-28 a RF-53 del PRD. No se mezclan con §6 y §7.

### 10.1 Imprescindibles antes de salir a producción

| ID | Historia propuesta | Por qué falta / riesgo | Prioridad |
|----|--------------------|------------------------|-----------|
| REC-01 | Como equipo, queremos una regresión automatizada del carrito (FC, NP, PR, NC; stock, CC, promociones, cobro) para garantizar RN-01 después de la reubicación | Las historias mueven la venta de lugar; sin regresión, un cambio de layout puede romper una regla fiscal o de stock | Must |
| REC-02 | Como equipo, queremos que Flexxus Order opere sobre la base del ERP a través de la Web API (S-08) | El repositorio de Order trabaja hoy sobre MariaDB `order-v6` (§11.3); sin este cambio, la experiencia nueva no ve los datos del ERP | Must |
| REC-03 | Como administrador del sistema, quiero ver qué experiencia quedó asignada o inferida para cada perfil antes de activar la nueva navegación | La inferencia (RN-02) puede clasificar mal perfiles mixtos; activarla sin revisión deja usuarios en la experiencia equivocada | Must |

### 10.2 Recomendadas para completar la experiencia

| ID | Historia propuesta | Por qué falta / riesgo | Prioridad |
|----|--------------------|------------------------|-----------|
| REC-04 | Como vendedor, quiero ver «Mi día» (vendido, comprobantes, ticket promedio, cobrado por medio) | Sin servicio de indicadores (PRD H-26, S-18) | Should |
| REC-05 | Como vendedor, quiero ver mis presupuestos por vencer para convertirlos a tiempo | Falta exponer el vencimiento (PRD RF-35) | Should |
| REC-06 | Como vendedor, quiero tener varias ventas en curso, también entre dispositivos | Hoy hay una sola venta por navegador (RN-09) | Could |
| REC-07 | Como encargado, quiero cambiar entre «Modo venta» y «Modo gestión» | Fuera del MVP (SUP-10; PRD S-16) | Could |
| REC-08 | Como vendedor, quiero registrar una venta no realizada por falta de stock | Capacidad del Delphi sin equivalente web (flujo A4) | Could |
| REC-09 | Como vendedor, quiero accesos a mis clientes recientes y avisos del puesto (caja, conexión con ARCA) | Zonas Z7 y Z8 del inicio sin fuente definida | Could |

---

## 11. Observaciones sobre la consistencia del input

1. **RF-41 del PRD ofrece «derivar al Administrativo» como tercera opción.** Por S-09, derivar es generar un pedido y requiere el permiso 003; el PRD v3.0.0 debería unificar la redacción.
2. **RF-37 del PRD pide stock y promoción «en el resultado de búsqueda».** Por S-03 se consultan por artículo (HT-VEN-06) al resaltar el resultado; el PRD debería reflejarlo.
3. **Flexxus Order y la base del ERP.** El repositorio `flexxus-order` trabaja sobre MariaDB (`order-v6`) y la demo dijo que Order es independiente del ERP [11:34–11:52]. La respuesta a S-08 (misma base que el ERP) cambia ese supuesto: se agrega REC-02.
4. **Precio distinto entre resultado y línea en la demo.** El resultado mostró $1.210,00 y la línea $1.200,00 para el mismo artículo; VEN-07 AC4 exige coherencia; hay que verificar el IVA incluido (parámetros 4, 21 y 49).
5. **Permiso por defecto y fail-closed.** `permissionDefaults.ts` habilita Factura cuando la base no tiene permisos cargados, en contra de RN-03; se mantiene como excepción documentada en ROL-04.
6. **RF-42, RF-50 y RF-53 ya están implementados** en el carrito y en Flexxus Order; se desestimaron (§2) y solo se reubican.
7. **S-05 (campo `rol` de la sesión) y S-10 (escáneres) siguen pendientes**: el primero condiciona HT-ROL-01; el segundo, los criterios de escáner de VEN-02 y VEN-06.

---

## 12. Matriz de trazabilidad HU ↔ endpoint ↔ pantalla

| HU | Historias técnicas | Endpoints BFF | Pantalla / paso | RF del PRD |
|----|--------------------|---------------|-----------------|-----------|
| ROL-01 | HT-ROL-01 · T-01 · T-03 | `GET /bff/sesion/contexto` | Inicio de sesión → V-01 / V-11 | RF-28, RF-29 |
| ROL-02 | HT-ROL-01 · T-03 | `GET /bff/sesion/contexto` | Layout del Vendedor | RF-30 |
| ROL-03 | HT-ROL-01 · T-03 | `GET /bff/sesion/contexto` | Layout del Administrativo | RF-30 |
| ROL-04 | HT-ROL-01 · T-02 | `GET /bff/sesion/contexto` | V-01 Z2 · V-02 «Enviar como» | RF-31 |
| VEN-01 | HT-ROL-01 | `GET /bff/sesion/contexto` | V-01 Z1 | RF-32 |
| VEN-02 | HT-VEN-03 | `GET /bff/busqueda` | V-01 Z2 | RF-33 |
| VEN-03 | — | — | V-01 Z2 → V-02 | RF-31, RF-33 |
| VEN-04 | HT-VEN-01 | `GET /bff/vendedor/comprobantes` | V-01 Z6 · V-06 | RF-34 |
| VEN-05 | HT-VEN-02 | `GET /bff/pendientes?ambito=PROPIOS` | V-01 Z5 | RF-35 |
| VEN-06 | HT-VEN-03 | `GET /bff/busqueda` | V-02 | RF-36 |
| VEN-07 | HT-VEN-06 | `GET /bff/articulos/{codigo}/disponibilidad` | V-01 Z2 · V-02 | RF-37 |
| VEN-08 | — | — | V-02 | RF-38 |
| VEN-09 | HT-VEN-04 | `POST /bff/ventas/simulacion-medios-pago` | V-02 · V-03 | RF-39 |
| VEN-10 | — | — | V-04 → V-01 | RF-40 |
| VEN-11 | — | APIs existentes de CC | V-02 · flujo A1 | RF-41 |
| VEN-12 | HT-VEN-06 | `GET /bff/articulos/{codigo}/disponibilidad` | V-02 · flujo A4 | RF-43 |
| VEN-13 | — | — (`localStorage`) | V-01 Z3 | RF-44 |
| VEN-14 | HT-VEN-01 | `GET /bff/vendedor/comprobantes` | V-06 · flujo A8 | RF-45 |
| VEN-15 | HT-VEN-03 · HT-VEN-06 | `GET /bff/busqueda` · `GET /bff/articulos/{codigo}/disponibilidad` | V-05 · flujo A9 | RF-46 |
| VEN-16 | HT-VEN-01 · HT-VEN-05 | `GET /bff/vendedor/comprobantes` · `POST /bff/solicitudes-nc` | V-06 · flujo A10 | RF-47 |
| ADM-01 | HT-ADM-01 | `GET /bff/pendientes?ambito=EMPRESA` | V-11 | RF-49 |
| ADM-02 | HT-ROL-01 · T-02 | `GET /bff/sesion/contexto` (árbol de menú) | V-11 menú lateral | RF-52 |
| ADM-03 | — | API existente de facturación de pedidos (con filtro por vendedor) | V-13 | RF-48 |
| ADM-04 | HT-VEN-05 | `GET` / `PATCH /bff/solicitudes-nc` | V-14 | RF-51 |

Tareas transversales: T-04 (retirar la home de ejemplo) y T-06 (feature flag) aplican a todas las historias ROL; T-05 (instrumentación) a VEN-02 a VEN-10.

---

## 13. Definition of Ready / Definition of Done

**Definition of Ready (por historia)**

- [ ] Objetivo y valor en formato Como / quiero / para
- [ ] Criterios de aceptación numerados (binarios) con tags de camino, referenciando MSG/RN
- [ ] Escenarios BDD en Gherkin (español), alineados a los AC
- [ ] Mensajes de UI identificados (§5) y validados con UX (SUP-09)
- [ ] Contrato de endpoints identificado (§7) y acordado con el equipo técnico
- [ ] Dependencias y spikes bloqueantes resueltos o acotados (S-05 para HT-ROL-01; S-10 para los criterios de escáner; S-04 para VEN-16 y ADM-04)
- [ ] Diseño o pantalla de referencia disponible (wireframe de baja fidelidad validado)
- [ ] Chequeo INVEST completo (o spike marcado si falla)

**Definition of Done (por historia)**

- [ ] Criterios de aceptación cumplidos y demostrables
- [ ] Escenarios BDD automatizados o ejecutados manualmente según acuerdo del equipo
- [ ] Mensajes UI implementados según §5
- [ ] Documentación de API actualizada (si HT)
- [ ] Regresión del carrito ejecutada sin fallas cuando la historia toca la venta (RN-01, REC-01)
- [ ] Comportamiento detrás del feature flag de la experiencia por rol (T-06), con el flag apagado sin cambios para el usuario
- [ ] Sin deuda técnica bloqueante conocida sin ticket
