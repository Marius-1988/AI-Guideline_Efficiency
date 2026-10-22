# PRD - Flexxus ERP — Discovery de modernización: intención «Vender en mostrador» (rol Vendedor) y rol Administrativo (Épicas 1 a 3)

> **Versión:** v3.0.0 · **Fecha:** 2026-10-07 · **Actualizado:** 2026-10-22 — la demo del 21-10 fija la primera intención (flujo del usuario Vendedor) y la separación de experiencias por rol: cambia el corte, de «ciclo del comprobante de venta» a «intención del usuario». Las reglas de venta y stock de la v2.0.0 se conservan como reglas del flujo (RF-01 a RF-27)
> **Producto:** Flexxus ERP (core Delphi cliente-servidor) y sus frentes web: Flexxus ERP Web / POS, Flexxus Order y Flexxus Web API v6
> **Alcance de este documento:** Épica 1 — Intención «Vender en mostrador» del rol Vendedor (MVP): inicio del vendedor, flujo principal de venta y flujos alternativos; Épica 2 — Intención «Gestionar y cerrar la venta» del rol Administrativo; Épica 3 — Otras intenciones y capacidades nuevas (catálogo, sin profundidad)
> **Fecha límite comprometida:** sin fecha comprometida para la construcción. La etapa de Discovery cierra al final de la Semana 4 (estimado 2026-10-30)
> **Autor:** Product Owner
> **Fuentes:**
> - Grabación `intive Flexxus demo-20261021_110154-Meeting Recording.mp4` (demo de Flexxus del 21/10/2026, 47:36; carrito entre 15:30 y 23:15; perfiles e intenciones entre 29:19 y 37:20), transcripta y con capturas
> - [Definición de roles Vendedor y Administrativo](../flexxus-discovery/2026-10-22-roles-vendedor-administrativo.md) y [User flows](../flexxus-discovery/2026-10-22-user-flows-vendedor-administrativo.md) (2026-10-22)
> - Código de `flexxus-order` (frontend: `components/MainMenu`, `containers/Sidebar`, `routes/HomePage`, `routes/index.jsx`, `features/cart/domain/permissions`, `routes/Configuration/UserConfiguration/permissionDefaults.ts`) y especificación `spec/carrito/` (README, `erp-parameters.md`, `erp-permissions.md`, `factura-desktop.md`)
> - `Flexxus - Propuesta Tecnica v1.0.docx` (propuesta de Discovery de intive, v1.0, septiembre 2026; plan de 4 semanas y 13 entregables)
> - Fuentes Delphi `Erp_04-12_Provisorio.zip` (rama `develop`) y notas de release del Delphi (3.028 documentos), analizadas en la v2.0.0
> - Notas de release y documento funcional de ERP Web / POS, Flexxus Order y Web API v6 (06/10/2026)
> - Versión anterior: [PRD v2.0.0](PRD-flexxus-venta-stock-2026-10-08.md) · Entregables: [Entregable de Producto v0.3](../flexxus-discovery/2026-10-22-entregable-producto-discovery.md)

---

## Tabla de contenidos

1. [Resumen ejecutivo — dónde está el corte](#1-resumen-ejecutivo--dónde-está-el-corte)
2. [Contexto y problema](#2-contexto-y-problema)
3. [Objetivos de la etapa de Producto del Discovery y métricas de éxito](#3-objetivos-de-la-etapa-de-producto-del-discovery-y-métricas-de-éxito)
4. [Actores y sistemas](#4-actores-y-sistemas)
5. [**El corte del MVP — regla de decisión y matriz de capacidades**](#5-el-corte-del-mvp--regla-de-decisión-y-matriz-de-capacidades)
6. [Alcance por épica](#6-alcance-por-épica)
7. [Alcance diferido — Épica 3](#7-alcance-diferido--épica-3)
8. [Requerimientos funcionales de la intención Vender en mostrador y del rol Administrativo](#8-requerimientos-funcionales-de-la-intención-vender-en-mostrador-y-del-rol-administrativo)
9. [Requerimientos no funcionales y restricciones](#9-requerimientos-no-funcionales-y-restricciones)
10. [Hallazgos de la documentación técnica, el código y la demo de Flexxus que condicionan el alcance](#10-hallazgos-de-la-documentación-técnica-el-código-y-la-demo-de-flexxus-que-condicionan-el-alcance)
11. [Observaciones sobre el backlog borrador (OpenSpec y especificaciones de flexxus-order)](#11-observaciones-sobre-el-backlog-borrador-openspec-y-especificaciones-de-flexxus-order)
12. [Riesgos, dependencias y decisiones abiertas](#12-riesgos-dependencias-y-decisiones-abiertas)
13. [Plan de entrega contra el cierre del Discovery](#13-plan-de-entrega-contra-el-cierre-del-discovery)
14. [Criterios de aceptación de la etapa de Producto del Discovery (DoD de fase)](#14-criterios-de-aceptación-de-la-etapa-de-producto-del-discovery-dod-de-fase)

---

## 1. Resumen ejecutivo — dónde está el corte

**El MVP es la intención «Vender en mostrador» del rol Vendedor: al iniciar sesión, el vendedor entra a su propia pantalla principal, desde la que busca, arma, cobra y emite la venta (factura, pedido o presupuesto) con todas las reglas de precio, stock y cuenta corriente del core, sin ver el menú del ERP; todavía no gestiona lo que otros generaron ni cubre otras intenciones (viajante, depósito, consulta pura).**

El corte no es por módulo ni por cantidad de pantallas: es por **intención de un rol**. Flexxus Order trasladó el ERP pantalla por pantalla [11:56–12:18]; el carrito, la única pieza con trabajo de UX, quedó como una pestaña más dentro de ese menú. El MVP reordena la experiencia alrededor de lo que el vendedor viene a hacer, y deja el menú para quien lo necesita: el Administrativo.

| | Épica 1 — Vender en mostrador (rol Vendedor, MVP) | Épica 2 — Gestionar y cerrar la venta (rol Administrativo) | Épica 3 — Otras intenciones y capacidades nuevas |
|---|---|---|---|
| **Qué hace el producto** | Inicio del vendedor (dashboard), venta unificada FC / NP / PR, cobro, comprobante emitido, flujos alternativos (cuenta corriente, pedido, presupuesto, sin stock, tarjeta, retomar, convertir, consulta) | Inicio administrativo con menú lateral y bandeja de pendientes; facturación de pedidos, NC y ND, remitos, cuenta corriente, libro IVA, consultas | Viajante con hoja de ruta, consulta de precio y stock, operación de depósito, administración del sistema, modelo Multi-Tenant, cobros QR |
| **Efecto sobre el estado del sistema** | Crea comprobantes de venta al cliente con su efecto fiscal, de stock y de cobro | Crea comprobantes derivados (FC de pedidos, NC, ND, remitos, recibos) y corrige los existentes | Según la intención; Multi-Tenant agrega entidades que el core no tiene |
| **Riesgo de un defecto** | Alto — fiscal y diferencia de stock o importe frente al cliente | Medio — corrección diferida, detectable en el control | Medio — no afecta la operación vigente si no se habilita |
| **Interfaces salientes** | CAE ante ARCA o controlador fiscal; gateway de pagos (Payway); impresión y envío | CAE de los comprobantes derivados; libro IVA digital | Mapas y geolocalización; pasarelas QR |
| **Interfaces entrantes** | Perfil y permisos del ERP; precios, stock, promociones y cliente desde la API | Pedidos y solicitudes que genera el Vendedor | Registro de grupos y compañías (Multi-Tenant) |
| **Habilita** | La primera experiencia por intención y las capacidades del core que expone (artículo, precio, stock, cliente, comprobante, cobro) | Que el perfil administrativo opere en la web sin la venta de mostrador, y la coexistencia por perfil con el ERP | El catálogo completo de intenciones del roadmap |

**Las tres preguntas que resuelven cualquier caso dudoso:**

1. ¿Lo hace alguien distinto del vendedor, sobre comprobantes ya emitidos o de otros usuarios (facturar pedidos ajenos, NC y ND administrativas, libro IVA, cobranza, altas de maestros)? → **Épica 2**, sin excepción.
2. ¿Pertenece a otra intención (vender en ruta, operar el depósito, solo consultar, administrar el sistema) o requiere una capacidad que el core no tiene (Multi-Tenant, QR)? → **Épica 3**.
3. ¿Ocurre entre «llega el cliente» y «el cliente se va con su comprobante», en el puesto del vendedor? → **MVP (Épica 1)**.

**Por qué este corte es el correcto y no uno arbitrario:**

- **Es el pedido explícito de Flexxus.** Propuso «orientarlo más a procesos por perfil: cada perfil en su ambiente» [29:19] y acordó avanzar con el Vendedor como primera intención [30:12–33:11].
- **La coexistencia por perfil ya es real.** Un mismo usuario no usa la web y el ERP a la vez [26:57–27:04]: el cajero factura en la web y la administración trabaja en el ERP. Migrar una intención completa por perfil evita el híbrido de navegador embebido que Flexxus ya probó y descartó [28:16–29:07].
- **Las reglas ya están extraídas.** Las 27 reglas de venta y stock de la v2.0.0 (H-14 a H-18) son exactamente las que el flujo del Vendedor ejecuta; la intención reordena la experiencia sin redefinir el negocio.

> ✅ La primera intención (Vendedor) y la segunda (Administrativo) quedaron acordadas en la demo del 21-10 ([S-01](#121-decisiones-abiertas--a-resolver-en-la-épica-1) resuelta). ⚠️ Fer y Ale, de Flexxus, relevaron intenciones propias que todavía no se compartieron; el roundup posterior puede reordenar el catálogo de la Épica 3 ([S-21](#121-decisiones-abiertas--a-resolver-en-la-épica-1)).

---

## 1.bis Decisiones confirmadas el 2026-10-07, el 2026-10-08 y el 2026-10-21

Definiciones cerradas de alcance interno del track de Producto o resueltas por Flexxus; las abiertas viven en §12.1.

### Ronda del 2026-10-07

| Decisión | Definición confirmada | Qué cambia |
|---|---|---|
| **Alcance funcional del relevamiento** | El Líder de Producto de intive acota el análisis de la etapa a **Venta y Stock**; el resto de los módulos se ignora (07-10) | Los inventarios de la Semana 1 cubren solo esos dominios ([Entregable S1 v0.2](../flexxus-discovery/2026-10-08-entregable-parcial-s1-venta-stock.md)) |

### Ronda del 2026-10-08

| Decisión | Definición confirmada | Qué cambia |
|---|---|---|
| **Fuentes completas del ERP (S-04)** | Flexxus entregó la copia completa de `Erp_04-12_Provisorio` y las notas de release del Delphi | Reglas de stock y comprobantes con evidencia en el código (H-14 a H-20) |
| **Reclasificación del corte sobre el código** | Promociones, cupones y puntos se aplican dentro del comprobante → entran al flujo de venta | RF-25 y RF-26 |
| **Empresa del usuario como contexto** | El Delphi ya opera varias empresas por instalación (H-17) | RF-27; S-07 y S-13 |

### Ronda del 2026-10-21 — demo de Flexxus

| Decisión | Definición confirmada | Qué cambia |
|---|---|---|
| **Primera intención: el usuario Vendedor (S-01)** | Se avanza con el flujo del Vendedor como primera intención; la venta es el módulo de referencia [30:12–33:11] | El MVP pasa de «ciclo del comprobante» a «intención del Vendedor»; v3.0.0 |
| **Separación de experiencias por rol** | El Vendedor entra a una pantalla principal de venta; el Administrativo opera desde el menú lateral y no accede a la venta de mostrador [30:39–31:26] | Épica 2 nueva; RF-28 a RF-31 |
| **Procesos por perfil como estrategia de coexistencia** | Flexxus prefiere migrar procesos completos por perfil; el que no tiene su proceso sigue en el ERP [29:19–29:31] | Camino de coexistencia por intención; insumo del track de Tecnología |
| **Fuente de verdad durante la coexistencia (S-03)** | ERP Web / POS y el ERP leen y escriben la misma base Firebird a través de la API; Flexxus Order no tiene clientes en producción [19:53–20:52], [22:16–22:21] | S-03 resuelta; S-02 se acota a qué base de experiencia se usa |

### Definición revisada o desestimada — 2026-10-21: el MVP como «ciclo del comprobante de venta»

La v2.0.0 cortaba por el hecho de negocio (todo lo que nace de un comprobante de venta al cliente). La demo mostró que esa definición reproduce el problema que Flexxus quiere resolver: el mismo comprobante se puede emitir desde el carrito o desde la pantalla «Crear factura» del menú, y el vendedor ve ambas cosas. **Consecuencia:** el corte pasa a ser la intención del rol; el contenido funcional del ciclo de venta se conserva entero como reglas del flujo del Vendedor (RF-01 a RF-27), y lo que la v2.0.0 dejaba en la Épica 2 (operación de stock, maestros, procesos posteriores) se reparte entre el rol Administrativo (Épica 2) y otras intenciones (Épica 3).

---

## 2. Contexto y problema

Flexxus es un ERP argentino con más de veinte años de producto y más de 2.200 clientes activos, construido en Delphi cliente-servidor sobre Firebird. Flexxus quiere modernizarlo para ganar productividad, con un sistema que reúna contexto y recomiende en lugar de exigir que el usuario arme su recorrido por el menú, e innovación. intive ejecuta un Discovery de cuatro semanas, de análisis y planificación; el track de Producto define la experiencia objetivo sobre un módulo de referencia.

La demo del 21-10 mostró dos frentes web. **Flexxus Order** es la evolución del ERP a la nube, independiente del ERP, construida «copiando pantalla, pantalla» sin reingeniería de procesos [11:27–12:22]; no tiene clientes en producción. **ERP Web / POS** es la app híbrida (mobile y facturador web) que usan muchos clientes; de ella sale el carrito, la única experiencia unificada para emitir factura, pedido o presupuesto desde un mismo lugar [15:30–16:43], que no existe en el ERP [18:56–19:17]. En los dos casos, el vendedor entra a un sistema organizado por módulos: ve Archivos, Compras, Fondos, Stock, Configuración y Usuarios, y abre la venta como una pestaña más.

El problema de la etapa ya no es solo entender el Delphi: es **definir la experiencia por intención** sobre las reglas que ya se extrajeron. La primera intención es la del Vendedor; la segunda, la del Administrativo que gestiona lo que el vendedor generó.

### Qué significa intención, rol y venta en el diccionario de Flexxus

- **Intención** — lo que un usuario viene a lograr de punta a punta (por ejemplo, «vender en mostrador»), con sus pasos, la información que necesita en cada uno y sus caminos alternativos. Es la unidad del corte: se migra una intención completa, no una pantalla.
- **Rol (experiencia de inicio)** — la puerta de entrada y la navegación que corresponden a una intención: Vendedor o Administrativo. Se asigna desde el perfil del ERP, que ya define los permisos; no reemplaza los permisos por comprobante y acción.
- **Perfil y permisos** — se definen en el ERP; la web los levanta al iniciar sesión y arma el menú con los ítems disponibles [34:34–34:46]. Los tipos de comprobante habilitados son los permisos 002 (Factura, por defecto), 003 (Pedido), 004 (Presupuesto) y 005 (Nota de crédito).
- **Venta** — el comprobante al cliente con su efecto fiscal (CAE o controlador fiscal, según el punto de venta), de stock (real o remanente según el parámetro 109; reserva en el pedido según la operación) y de cobro. Los clientes la recorren de tres formas: presupuesto → pedido → factura, pedido → factura, o factura directa [04:41–05:03].

**El corte no es una concesión de alcance: sigue la unidad que el propio Flexxus eligió para coexistir con el ERP, el proceso completo de un perfil.**

---

## 3. Objetivos de la etapa de Producto del Discovery y métricas de éxito

### Objetivo de negocio

Que Flexxus decida, al cierre del Discovery (2026-10-30), el alcance del primer módulo a modernizar como **la intención «Vender en mostrador» del rol Vendedor**, con su experiencia objetivo, las capacidades del core que expone, los datos que necesita y sus requerimientos con criterio de aceptación; y la secuencia de las intenciones siguientes, empezando por el rol Administrativo.

### Objetivos de producto

| # | Objetivo | Cómo se verifica |
|---|---|---|
| OBJ-1 | Roles Vendedor y Administrativo definidos: permisos, vistas, funcionalidades y regla de asignación | Documento de roles validado por el referente de negocio de Flexxus; S-15 y S-16 resueltas |
| OBJ-2 | Experiencia objetivo del Vendedor: inicio (dashboard), flujo principal y alternativos | User flows validados en sesión; cada paso con su regla trazada a RF-01 a RF-27 |
| OBJ-3 | Experiencia objetivo del Administrativo: inicio, menú acotado y flujos principales | User flows validados en sesión; menú lateral aprobado |
| OBJ-4 | Capacidades del core y datos que requiere la experiencia, con su disponibilidad | Matriz dato × vista × fuente con estado (existe / parcial / falta), revisada por el track de Tecnología |
| OBJ-5 | Catálogo de intenciones priorizado para el roadmap | Catálogo con valor, riesgo y dependencia por intención; contrastado con las intenciones de Fer y Ale (S-21) |
| OBJ-6 | Equivalencia funcional del flujo del Vendedor con el comportamiento vigente | Cada RF del flujo trazado a una regla del Delphi, del carrito web o de una nota de release |

### Métricas

| Métrica | Objetivo de la etapa |
|---|---|
| Pasos de la venta típica (consumidor final, un artículo, efectivo) desde el inicio hasta el comprobante emitido | Medir el actual en sesión y proponer una reducción ≥ 30 % (⏳ a validar) |
| Opciones de navegación visibles para el Vendedor | Solo las de su intención: 0 pestañas de módulo y 0 ítems de menú lateral (hoy 7 pestañas más el menú) |
| Flujos alternativos del Vendedor especificados | 11 (A1 a A11), con prioridad MVP o posterior |
| Datos de la experiencia con fuente y disponibilidad | 100 % de los datos del inicio y de la venta |
| Sesiones de validación con Flexxus | ≥ 1 con el referente de negocio y ≥ 1 roundup de intenciones antes del 2026-10-30 (⏳ a validar agenda) |

### No-objetivos explícitos de la etapa de Producto del Discovery

- No se desarrolla, prototipa ni prueba ningún componente (Propuesta técnica, «Fuera de alcance»); los wireframes del dashboard son de baja fidelidad.
- No se redefinen las reglas de venta y stock: el flujo ejecuta las reglas vigentes (RF-01 a RF-27).
- No se analizan en profundidad las intenciones de la Épica 3 ni los módulos de Compras, Fondos, Contabilidad, RMA, Producción, Calidad y RR.HH.
- No se diseña la migración de datos ni el modelo de seguridad: el rol ordena la navegación y los permisos siguen en el perfil del ERP.
- No se define la arquitectura destino: es del track de Tecnología.

---

## 4. Actores y sistemas

### 4.1 Actores

| Actor | Descripción | Rol en la etapa |
|---|---|---|
| **Vendedor** (vendedor-cajero o vendedor de salón) | Atiende al cliente en el local; según su perfil factura y cobra, o arma presupuestos y pedidos [20:59–21:21], [35:20–35:34] | Usuario de la Épica 1; fuente de fricción |
| **Administrativo** | Back office de ventas: factura pedidos, emite NC y ND, gestiona remitos y cuentas corrientes; hoy usa el ERP [26:41] | Usuario de la Épica 2 |
| **Viajante** | Visita clientes con hoja de ruta y geolocalización; genera pedidos y cobra [35:44–36:57] | Intención de la Épica 3 |
| **Usuario de consulta** | Solo ve artículos: stock, precios y descuentos [34:10–34:32] | Intención de la Épica 3 |
| **Administrador del sistema** | Define perfiles, permisos y parámetros | Asigna el rol de experiencia (S-15) |
| **Referente de negocio y producto (Flexxus)** | Martín Fabregues en la demo; Fer y Ale relevan intenciones | Valida roles, flujos y prioridades |
| **Referente técnico (Flexxus)** | Leo mostrará el ERP de punta a punta | Valida capacidades y datos |
| **Decisor del proyecto (Flexxus)** | Aprueba alcance e inversión | Aprueba el primer módulo |
| **Líder de Producto (intive)** | Conduce el track de Producto | Autor de este PRD y de los entregables |
| **Arquitecto de Solución (intive)** | Conduce el track de Tecnología | Define cómo se exponen las capacidades y la coexistencia |

### 4.2 Sistemas y componentes

| Componente | Responsabilidad | Épica |
|---|---|---|
| **Flexxus ERP Delphi** (`Erp_04-12_Provisorio`, rama `develop`) | Core transaccional y fuente de las reglas; define perfiles y permisos; donde opera hoy la administración | 1, 2 (referencia de comportamiento) |
| **Base Firebird del ERP** | Base única que leen y escriben el ERP y la API [22:16–22:21] | 1, 2 |
| **Flexxus Web API** (v4 y v6) | Única capa de acceso para la web; se instala en el servidor del cliente o en el data center de Flexxus [22:23–22:47]; su versión está acoplada a la del ERP [39:16–40:16] | 1, 2 |
| **Flexxus ERP Web / POS** (`flexxuserpweb`, v1.165.0 en la demo) | App híbrida productiva: carrito, artículos, cuenta corriente, hoja de ruta; perfiles por usuario [33:14–37:20] | 1 (base de experiencia del carrito, S-02) |
| **Flexxus Order** (1.0.x beta) | Evolución del ERP a la nube, copia uno a uno de pantallas; menú lateral y carrito; home con datos de ejemplo; sin clientes en producción | 1, 2 (candidato a base técnica, S-02) |
| **Gateway de pagos de Flexxus** | Centraliza la comunicación con terminales POS y entidades (Payway y otros) [44:37–45:13] | 1 |
| **ARCA** | CAE de factura electrónica; el punto de venta define electrónico o controlador fiscal [12:41–13:08] | 1, 2 |
| **Portainer, Updater y plataforma de licencias** | Despliegue de la API y la app por cliente; actualización del ERP; licenciamiento [40:54–42:59], [45:15–45:29] | Insumo de Tecnología (despliegue de la experiencia por rol) |

---

## 5. El corte del MVP — regla de decisión y matriz de capacidades

### 5.1 La regla

> **Entra en el MVP todo lo que el Vendedor necesita para atender a un cliente de punta a punta sin salir de su pantalla:** entrada por rol, inicio del vendedor, búsqueda y consulta de artículo, armado de la venta (FC, NP o PR), cobro, emisión con su efecto fiscal y de stock, comprobante emitido y los flujos alternativos de ese mismo puesto.

> **Queda fuera del MVP** lo que gestiona o corrige lo que otros generaron (Épica 2, rol Administrativo) y lo que pertenece a otra intención o requiere una capacidad que el core no tiene (Épica 3).

Corolario: el Vendedor **emite** sus comprobantes y **consulta** los suyos; no **gestiona** los de otros ni **administra** maestros.

### 5.2 Matriz de capacidades por épica

El detalle de cada vista, permiso y flujo vive en la [definición de roles](../flexxus-discovery/2026-10-22-roles-vendedor-administrativo.md) y en los [user flows](../flexxus-discovery/2026-10-22-user-flows-vendedor-administrativo.md). En la columna Criterio, «Pregunta n» remite a las tres preguntas de §1.

#### Entrada y navegación por rol — **dentro del MVP (Épica 1)**

| Capacidad | Origen | Por qué está en el MVP | Épica | Criterio |
|---|---|---|---|---|
| Ruteo al iniciar sesión según la experiencia del perfil | Perfil del ERP leído por la web [34:34] | Sin él no hay experiencia por intención | 1 | Pregunta 3 |
| Navegación del Vendedor sin pestañas de módulo ni menú lateral | Hoy 7 pestañas y menú lateral en Flexxus Order | Es el pedido central del 21-10 | 1 | Pregunta 3 |
| Tipos de comprobante visibles según permisos 002 a 005 | `permissionDefaults.ts` | Diferencia vendedor-cajero de vendedor de salón | 1 | Pregunta 3 |

#### Inicio del vendedor (dashboard) — **dentro del MVP (Épica 1); el corte pasa por acá**

| Capacidad | Origen | Por qué | Épica | Criterio |
|---|---|---|---|---|
| Contexto del puesto, buscador único y «Nueva venta» | Datos de sesión; búsquedas existentes | Primer paso de toda venta | 1 | Pregunta 3 |
| Últimos comprobantes propios y pendientes accionables (pedidos sin facturar, CAE pendiente) | Búsqueda de comprobantes y planillas existentes | Acciones frecuentes del mismo puesto | 1 | Pregunta 3 |
| Venta en curso para retomar (una) | Persistencia actual del carrito | Atención interrumpida en mostrador | 1 | Pregunta 3 |
| *Indicadores «Mi día», clientes recientes, varias ventas en curso, avisos* | Sin servicio: la home actual es de ejemplo (H-26) | Valor alto pero sin datos hoy | 1 (posterior al MVP) | Pregunta 3 ⏳ S-18 |

#### Armado de la venta, cobro y emisión — **dentro del MVP (Épica 1)**

| Capacidad | Origen | Por qué | Épica | Criterio |
|---|---|---|---|---|
| Búsqueda, precio, stock y promociones en el resultado | RF-01 a RF-05, RF-25; carrito web | Decide si la venta se puede hacer | 1 | Pregunta 3 |
| Venta unificada FC / NP / PR con valores por defecto | Carrito de ERP Web / POS | Es la intención | 1 | Pregunta 3 |
| Cliente consumidor final, identificado u ocasional | Parámetros 87 y 94 | Paso obligatorio de la venta | 1 | Pregunta 3 |
| Cobro: efectivo, tarjeta (Payway o manual), transferencia, cheque, cuenta corriente | Carrito web; gateway de pagos | Sin cobro la factura de contado no se cierra | 1 | Pregunta 3 |
| Emisión con CAE o controlador fiscal, efecto en stock y cobro atómicos | RF-08, RF-13, RF-14; RNF-02 | Núcleo fiscal | 1 | Pregunta 3 |
| Comprobante emitido: imprimir, compartir, ticket de cambio | Carrito web [17:56] | Cierra la atención | 1 | Pregunta 3 |

#### Flujos alternativos del Vendedor — **dentro del MVP (Épica 1), salvo los marcados**

| Capacidad | Origen | Épica | Criterio |
|---|---|---|---|
| A1 cuenta corriente, A2 pedido con reserva, A3 presupuesto, A4 sin stock (aviso o bloqueo), A5 tarjeta, A6 cliente, A7 retomar, A8 convertir presupuesto propio, A9 consulta, A11 reenviar | User flows §3 | 1 | Pregunta 3 |
| *A10 devolución con NC emitida por el vendedor* | NC vinculada (RF-09); permiso 005 | 1 o 2 ⏳ | S-17 |
| *A4 con registro de venta no realizada* | Delphi «Nueva VNR» | 1 (posterior al MVP) | Pregunta 3 |

#### Gestión y cierre de la venta — **Épica 2 (rol Administrativo)**

| Capacidad | Origen | Épica | Criterio |
|---|---|---|---|
| Inicio administrativo con bandeja «Pendientes de gestión» | Propuesta nueva | 2 | Pregunta 1 |
| Facturación de pedidos (uno o varios; parámetro 116) | Menú Factura de Flexxus Order; Delphi | 2 | Pregunta 1 |
| NC y ND administrativas; solicitudes de NC del vendedor | Menú NC y ND; Delphi «Solicitud Nota de Crédito» | 2 | Pregunta 1 |
| Planillas, autorización y anulación de pedidos y presupuestos de todos | Menú Pedido y Presupuesto | 2 | Pregunta 1 |
| Remitos de venta y facturación de remitos | Menú Remito de venta | 2 | Pregunta 1 |
| Cuenta corriente: cobro, imputación, movimientos, deudas | Menú Gestión de cuentas [23:16–25:08] | 2 | Pregunta 1 |
| Libro IVA ventas y búsqueda de todos los comprobantes | Menú Factura y Buscar comprobante | 2 | Pregunta 1 |

#### Otras intenciones y capacidades nuevas — **Épica 3**

| Capacidad | Origen | Épica | Criterio |
|---|---|---|---|
| Vender en ruta (viajante, hoja de ruta, GPS) | ERP Web / POS, permisos 007 a 010 | 3 | Pregunta 2 |
| Consultar precio y stock (perfil de consulta) | ERP Web / POS | 3 | Pregunta 2 |
| Operar el depósito: ajustes, transferencias, inventario, picking, packing, expedición, reparto | Delphi (v2.0.0, Épica 2 anterior) | 3 | Pregunta 2 |
| Administrar maestros y el sistema: artículos, listas, multiplazos, perfiles, parámetros | Delphi; Configuración de la web | 3 | Pregunta 2 |
| Modelo Multi-Tenant y cobros QR | Propuesta Multi-Tenant; ERP Web / POS | 3 | Pregunta 2 |

> **Decisión de alcance explícita y necesaria:** «Vendedor» en el MVP significa **quien atiende al cliente en el local** (vendedor-cajero y vendedor de salón, diferenciados solo por permisos). El viajante y el usuario de consulta comparten piezas (artículo, carrito, cuenta corriente) pero son otras intenciones; sumarlos ahora mezcla geolocalización y hoja de ruta en el MVP (cf. R-5).

### 5.3 El corte en la dirección del flujo del Vendedor

El flujo del Vendedor atraviesa capacidades del core que hoy están en distintas pantallas; cada tramo cae de un lado del corte según quién lo ejecuta.

| Flujo de integración | Épica | Detalle |
|---|---|---|
| **Inicio de sesión → Inicio del vendedor** | **1** | Perfil del ERP → experiencia de inicio (RF-28, RF-29) |
| **Buscador → Venta** | **1** | Artículo con precio, stock y promoción; agregado en un paso (RF-36, RF-37) |
| **Venta → Cobro → Comprobante emitido** | **1** | FC o NP de contado; CAE o controlador fiscal; stock y cobro atómicos |
| **Venta → Pedido → Pendientes del Administrativo** | **1 → 2** | El vendedor de salón emite la NP; el Administrativo la factura [20:59–21:06] |
| **Presupuesto propio → Pedido o Factura** | **1** | Conversión desde «Para accionar» (RF-45) |
| **Solicitud de NC → NC** | **1 → 2** | El vendedor solicita; el Administrativo emite (S-17) |
| **Cliente con CC → Cobranza** | **2** | La cobranza de saldos la gestiona el Administrativo (o el viajante, Épica 3) |
| **Pedido → Picking → Expedición → Reparto** | **3** | Operación de depósito |

### 5.4 Capacidades transversales: dónde corta cada una

La documentación web y la demo no coinciden en varias capacidades; se decide por capacidad.

| Capacidad | En el MVP (Épica 1) | Diferido a Épica 2 o 3 (Administrativo / otras intenciones) |
|---|---|---|
| **Permisos** | Lectura del perfil; tipos de comprobante 002 a 005; permisos de precio, bonificación, descuento, CC y retenciones de los menús 78, 80, 87 y 90 | Permisos de planillas, autorización y gestión de cuentas (2); configuración de perfiles (3) |
| **Parametrización** | Los 28 parámetros del carrito y los de stock y remito (52, 55, 77, 82, 87, 94, 109, 116, 154, 237), con sus variantes reales (S-05, S-12) | El resto de los 163 parámetros de las pantallas de Venta del Delphi (2) |
| **Fiscal** | CAE de FC y NC; controlador fiscal según el punto de venta | Libro IVA digital (2); cierres X/Z ⏳ S-11 |
| **Cobros** | Efectivo, tarjeta con Payway o manual, transferencia, cheque, cuenta corriente | Cobranza de saldos (2); QR de pasarelas (3) ⏳ S-09 |
| **Indicadores** | Ninguno obligatorio en el MVP | «Mi día» y avisos, cuando exista un servicio de indicadores (1, posterior) ⏳ S-18 |
| **Multiempresa** | La empresa del usuario logueado (RF-27) | Facturación de NP de otra empresa (2, parámetro 116); Multi-Tenant (3) |
| **Auditoría** | Usuario, fecha, puesto, comprobante y movimiento de stock (RF-23) | Auditoría de gestión y de maestros (2, 3) |

> La separación por rol se apoya en la demo: «el mismo usuario generalmente no usa los dos sistemas» [26:57] y «cada perfil en su ambiente, y el que no lo tiene sigue dentro del ERP hasta que evolucione» [29:19–29:31].

---

## 6. Alcance por épica

### Épica 1 — Intención «Vender en mostrador» (rol Vendedor, MVP)

**Objetivo:** dejar definida, al cierre del Discovery, la experiencia objetivo del Vendedor, con su inicio, su flujo principal y sus alternativos, las capacidades del core que expone, los datos que necesita y sus requerimientos con criterio de aceptación.
**Duración prevista:** análisis en las Semanas 3 y 4 del Discovery (ver §13); construcción a estimar en el roadmap de la Semana 4.

**Dentro de alcance**

| Bloque | Contenido |
|---|---|
| Roles y entrada (S3) | Definición del rol Vendedor, sus variantes por permiso, su regla de asignación y su navegación ([definición de roles](../flexxus-discovery/2026-10-22-roles-vendedor-administrativo.md)) |
| Inicio del vendedor (S3) | Dashboard por zonas, con prioridad MVP o posterior y disponibilidad de datos |
| Flujo principal (S3) | Venta de mostrador con factura de contado, paso a paso, con sus reglas y fricciones a resolver ([user flows §2](../flexxus-discovery/2026-10-22-user-flows-vendedor-administrativo.md)) |
| Flujos alternativos (S3) | A1 a A11 con disparador, regla y prioridad |
| Datos de la experiencia (S3) | Matriz dato × vista × fuente, contrastada por el track de Tecnología (entregable 10 de la propuesta) |
| Requerimientos (S4) | RF y RNF con criterio de aceptación; insumo de historias con `po-expert-user-stories` |

**Fuera de alcance:** la gestión administrativa (Épica 2) y las demás intenciones (Épica 3).

**Criterio de salida:** roles y flujos validados por el referente de negocio de Flexxus; S-15, S-17 y S-18 resueltas; cada paso del flujo principal trazado a su regla; datos del inicio y de la venta con fuente identificada.

> **Restricción de planificación:** el roundup de intenciones con Fer y Ale depende del regreso de Ale la semana del 26-10 [47:12–47:20]; la demo del ERP de punta a punta con Leo todavía no tiene fecha (S-21).

### Épica 2 — Intención «Gestionar y cerrar la venta» (rol Administrativo)

**Objetivo:** dejar definida la experiencia del Administrativo en la web: inicio con bandeja de pendientes, menú acotado a Venta y Stock y sus flujos principales, sin la venta de mostrador.
**Duración prevista:** análisis en la Semana 3 a nivel de flujos; requerimientos detallados en el plan del segundo tramo del roadmap.

**Dentro de alcance**

| Bloque | Contenido |
|---|---|
| Rol y navegación | Definición del rol, menú lateral propuesto y lo que no ve |
| Inicio administrativo | Bandeja «Pendientes de gestión»: pedidos sin facturar, solicitudes de NC, comprobantes sin CAE, remitos sin facturar, deudas vencidas |
| Flujos principales | Facturar pedidos del día; cobrar e imputar una cuenta corriente ([user flows §5 y §6](../flexxus-discovery/2026-10-22-user-flows-vendedor-administrativo.md)) |
| Traspasos con el Vendedor | Pedido de salón → factura; solicitud de NC → NC |

**Fuera de alcance:** altas y modificaciones de maestros, que siguen en el ERP; administración del sistema.

**Criterio de salida:** menú y bandeja aprobados por el referente de negocio; S-19 resuelta.

---

## 7. Alcance diferido — Épica 3

### Épica 3 — Otras intenciones y capacidades nuevas (a planificar en el roadmap)

La habilita el catálogo de intenciones: cada una se analiza en profundidad cuando entra en el plan, según el modelo de modernización módulo por módulo de la propuesta. Sus requisitos reutilizan las capacidades que expone la Épica 1 (artículo, precio, stock, cliente, comprobante, cobro).

| Bloque | Contenido |
|---|---|
| Vender en ruta | Viajante: hoja de ruta, visitas, pedidos con GPS, cobranza en ruta (permisos 007 a 010) |
| Consultar | Precio, stock en otras sucursales y promociones, sin vender |
| Operar el depósito | Ajustes, transferencias, inventario, picking, packing, expedición, reparto |
| Administrar | Maestros (artículos, listas, multiplazos) y sistema (perfiles, parámetros, integraciones) |
| Capacidades nuevas | Modelo Multi-Tenant; cobros QR de pasarelas |

**Dependencias que no existen en la etapa:** las intenciones relevadas por Fer y Ale (S-21); la demo del ERP de punta a punta; la arquitectura destino (Semana 3, track de Tecnología).

**Consideración de reutilización:** si la Épica 1 se construye sobre el carrito de ERP Web / POS, el viajante hereda la misma venta con hoja de ruta, porque ya la usa en mobile; si se construye sobre Flexxus Order, hay que portar la hoja de ruta (permisos 007 a 010 ya portados en `permissionDefaults.ts`).

---

## 8. Requerimientos funcionales de la intención Vender en mostrador y del rol Administrativo

Los RF-28 a RF-53 son nuevos en la v3.0.0 y describen la experiencia por rol. Los RF-01 a RF-27 se conservan con sus IDs de la v2.0.0: son las reglas del core que el flujo del Vendedor ejecuta (§8.6). Todos trazan a OBJ-2, OBJ-3 u OBJ-6.

### 8.1 Entrada y navegación por rol

| ID | Requerimiento |
|---|---|
| RF-28 | Al iniciar sesión, el sistema lee el perfil del usuario definido en el ERP, con sus permisos de todos los menús que usa la venta (78, 80, 87 y 90), no solo los del 78 |
| RF-29 | El sistema dirige al usuario a la pantalla de inicio de su experiencia: Vendedor → Inicio del vendedor; Administrativo → Inicio administrativo. Sin atributo de experiencia, la infiere según la regla de [S-15](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| RF-30 | El Vendedor no ve pestañas de módulo ni el menú lateral; el Administrativo no ve la pantalla Venta ni el ícono de carrito |
| RF-31 | El Vendedor solo ve los tipos de comprobante habilitados en su perfil (002 a 005), con el marcado «por defecto» preseleccionado |

### 8.2 Inicio del vendedor

| ID | Requerimiento |
|---|---|
| RF-32 | El inicio muestra el contexto del puesto: usuario, sucursal, punto de venta (electrónico o controlador fiscal), depósito y caja |
| RF-33 | El inicio ofrece un buscador único que encuentra artículos (código, descripción, código de barras) y clientes (nombre, código, DNI, CUIT), y un acceso «Nueva venta» |
| RF-34 | El inicio lista los últimos 5 comprobantes del usuario con reimprimir, compartir y ticket de cambio, y un acceso a todos los propios |
| RF-35 | El inicio muestra los pendientes accionables del usuario: pedidos propios sin facturar o sin entregar, comprobantes sin CAE o rechazados y, posterior al MVP, presupuestos por vencer |

### 8.3 Flujo principal de venta

| ID | Requerimiento |
|---|---|
| RF-36 | Elegir un artículo del resultado de búsqueda lo agrega a la venta en un paso, sin un modal intermedio de selección |
| RF-37 | El resultado de búsqueda muestra, antes de agregar, el precio de la lista del usuario, el stock disponible según el parámetro 109 y la promoción vigente |
| RF-38 | La venta nueva se precarga con el cliente del parámetro 87, el tipo de comprobante por defecto, la condición, la lista, el depósito y el vendedor del usuario; las condiciones que no cambian quedan plegadas |
| RF-39 | Antes de confirmar el cobro, el vendedor ve el total con el descuento o recargo de cada medio de pago y las cuotas disponibles con tarjeta |
| RF-40 | Al emitir, el sistema muestra el comprobante emitido y ofrece «Nueva venta», que vuelve al inicio con una venta vacía |

### 8.4 Flujos alternativos del Vendedor

| ID | Requerimiento |
|---|---|
| RF-41 | Si la validación de cuenta corriente bloquea la venta y el vendedor no tiene el permiso 963, el sistema ofrece cobrar de contado, generar un pedido o derivar al Administrativo |
| RF-42 | El vendedor emite pedidos y presupuestos desde la misma pantalla Venta, con los campos propios de cada tipo (fecha de entrega y operación en NP; vencimiento en PR) |
| RF-43 | Ante stock insuficiente, el sistema avisa o bloquea según el parámetro 109 y ofrece ver stock en otras sucursales o generar un pedido |
| RF-44 | Una venta armada y no emitida queda disponible en el inicio para retomarla |
| RF-45 | El vendedor convierte un presupuesto propio en pedido o factura desde el inicio, copiando su contenido según la parametrización |
| RF-46 | El vendedor consulta precio, stock por depósito y sucursal, promociones y cuotas de un artículo sin iniciar una venta |
| RF-47 | Ante una devolución, el vendedor emite la NC vinculada a la factura si tiene el permiso 005, o registra una solicitud de NC para el Administrativo |

### 8.5 Rol Administrativo

| ID | Requerimiento |
|---|---|
| RF-48 | El Administrativo factura uno o varios pedidos pendientes, filtrados por cliente, fecha o vendedor, respetando el parámetro 116 para pedidos de otra empresa |
| RF-49 | El inicio administrativo muestra la bandeja «Pendientes de gestión» con contadores accionables: pedidos sin facturar, solicitudes de NC, comprobantes sin CAE, remitos sin facturar y deudas vencidas |
| RF-50 | El Administrativo cobra e imputa la cuenta corriente de un cliente seleccionando comprobantes pendientes, con el monto a cobrar calculado por el sistema |
| RF-51 | El Administrativo resuelve las solicitudes de NC del vendedor: emitir la NC vinculada o rechazarla con motivo |
| RF-52 | El menú lateral del Administrativo se limita a Buscar comprobante, Factura, NC, ND, Presupuestos, Pedidos, Remitos, Gestión de cuentas y Consultas, según sus permisos |
| RF-53 | El Administrativo busca cualquier comprobante de venta y ve sus pagos, comprobantes vinculados y trazabilidad (remitos generados) |

### 8.6 Reglas del core que ejecuta el flujo del Vendedor (RF-01 a RF-27, sin cambios desde la v2.0.0)

#### 8.6.1 Consulta de artículo, precio y stock

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema permite buscar artículos por código, descripción y código de barras, incluidos los códigos configurables con peso, precio o cantidad (parámetros 32 y 150) |
| RF-02 | El sistema resuelve el precio según lista de precios, multiplazo, precio pactado por cliente y precio de oferta vigente (parámetros 4, 43, 99) |
| RF-03 | El sistema muestra el stock del artículo por depósito, lote y empresa según la política del parámetro 109: real, remanente (real menos NP pendientes, facturado sin remitir y, con su parámetro activo, órdenes de reparación) o remanente más órdenes de compra (`Funciones.CalculaStockRemanente`) |
| RF-04 | El sistema ofrece solo artículos con stock cuando el parámetro 55 está activo, considerando talles y lotes (parámetros 20 y 83) |
| RF-05 | El sistema muestra los precios con o sin IVA y en moneda base según los parámetros 21, 49 y 50, sin alterar el importe facturado |

#### 8.6.2 Comprobantes de venta

| ID | Requerimiento |
|---|---|
| RF-06 | El sistema emite Presupuesto, Nota de Pedido, Factura, Nota de Crédito y Nota de Débito desde un mismo flujo, con el tipo elegido condicionando pasos y validaciones |
| RF-07 | El sistema convierte un presupuesto en pedido o factura, y factura pedidos y remitos pendientes copiando su contenido según la parametrización |
| RF-08 | El sistema solicita el CAE para FC, NC y ND electrónicas y no da por emitido un comprobante sin CAE |
| RF-09 | La nota de crédito se vincula a una o más facturas de origen, buscadas por número o por rango de fechas según el parámetro 119 |
| RF-10 | El sistema bloquea la venta a clientes no facturables en FC y NP, y la permite en PR |
| RF-11 | El sistema valida el CUIT del cliente cuando el importe supera el umbral de la sucursal (`montovalidacioncuit`) |
| RF-12 | El sistema permite consultar, reimprimir, enviar por mail y anular comprobantes de venta |

#### 8.6.3 Efecto en stock y validaciones

| ID | Requerimiento |
|---|---|
| RF-13 | Al confirmar una FC o un remito de venta, el sistema descuenta el stock del casillero (depósito × lote) y recalcula el total del artículo, salvo que el parámetro 82 indique facturar sin descontar stock; si el artículo no admite stock negativo, la operación completa se revierte (`ModificacionesBaseDatos.ModificarStock`) |
| RF-14 | Para artículos que verifican stock, el sistema avisa (parámetro 109 en 0, 4, 5 o 9) o impide (1, 2, 3, 6, 7 u 8) confirmar un comprobante que supera el stock disponible; la NP solo se valida con valores de 5 a 9, la NC nunca se valida y la FC no se valida si viene de un remito o si el 82 traslada el descuento al remito (`Funciones.fxTieneQueVerificarStock`) |
| RF-15 | Una NC o un remito de devolución reingresa el stock al depósito correspondiente (parámetros 184 y 206) |
| RF-16 | El sistema verifica que el artículo esté asociado al depósito elegido, o lo asocia automáticamente si el parámetro 77 lo indica |
| RF-17 | El sistema registra acopios (venta con entrega diferida) y su saldo pendiente de entrega |

#### 8.6.4 Cobro dentro del ciclo de venta

| ID | Requerimiento |
|---|---|
| RF-18 | El checkout admite combinar efectivo, tarjeta, cheque, retenciones y cuenta corriente en una misma operación |
| RF-19 | El sistema propone la factura como contado aunque el cliente tenga cuenta corriente cuando el parámetro 58 está activo, y propone o fuerza el remito automático según los parámetros 52 (cuenta corriente) y 154 (contado) (`frmFacturacion`) |
| RF-20 | El sistema valida la cuenta corriente del cliente (saldo, límite y comprobantes vencidos) según el permiso de cada tipo de comprobante y el parámetro 287 |

#### 8.6.5 Parametrización, permisos y auditoría

| ID | Requerimiento |
|---|---|
| RF-21 | Todo comportamiento de §8.1 a §8.4 que dependa de un parámetro lo lee de la configuración de la instalación; ningún valor queda fijo en el código |
| RF-22 | El sistema aplica los permisos por usuario sobre editar precio, descuento, lista de precios y depósito en el comprobante |
| RF-23 | Cada comprobante y cada movimiento de stock que genera quedan registrados con usuario, fecha, sucursal, depósito y comprobante de origen |
| RF-24 | El sistema bloquea las opciones del comprobante mientras se registra y muestra un resultado único de éxito o error |

#### 8.6.6 Reglas que el core aplica dentro del comprobante

| ID | Requerimiento |
|---|---|
| RF-25 | Al armar PR, NP, FC o remito, el sistema aplica las promociones, reglas de precio y cupones de descuento vigentes con el mismo resultado que el motor del ERP, incluida la regla de descuento general o por línea (parámetro 311) y de descuento sobre oferta (parámetro 99) (`GestorPromociones`) |
| RF-26 | El sistema calcula los puntos de fidelización del cliente por comprobante y su vencimiento, y un cupón se consume entero, vigente, del mismo cliente y sin atraso en sus pagos (`FuncionesComprobantes.prCalcularPuntos` y `prVencerPuntosComprobante`; NR 03.15 «Consumo de cupones de descuento») |
| RF-27 | El sistema opera en la empresa del usuario logueado: stock, depósitos, comprobantes y numeración se filtran por `IDEMPRESA`, y la facturación de NP de otra empresa respeta el parámetro 116 (`Funciones.fxCondicionEmpresas`) |

---

## 9. Requerimientos no funcionales y restricciones

### 9.1 Tecnología (impuesta por Flexxus)

| Aspecto | Definición |
|---|---|
| Principios no negociables | Core protegido, sin DB directa, Business APIs, Events, aislamiento y eficiencia en costos (Propuesta técnica, «Criterios de trabajo») |
| Core vigente | Delphi cliente-servidor sobre Firebird (migración 2.5 → 5); versión única para toda la base instalada |
| Frentes web vigentes | ERP Web / POS: React 18 + Ionic 8 + Capacitor 7 sobre API v4. Flexxus Order: React 19 + Node.js/Express + MariaDB 10.6 con Sequelize |
| API | flxWebAPI v6: REST JSON, JWT, rutas /v1 a /v6 conviviendo; única capa que accede a la base |
| Proceso | Especificación previa con OpenSpec vinculada a Jira; pruebas Vitest, Jest y Playwright |

> ⚠️ La demo del 21-10 resolvió la base de datos durante la coexistencia (S-03: Firebird a través de la API); queda decidir en la Semana 4, con el track de Tecnología, el frente web sobre el que se construye la experiencia (S-02).

### 9.2 Integración y datos (impuesto por AFIP/ARCA y por el core)

| Aspecto | Definición |
|---|---|
| Factura electrónica | Solicitud de CAE por web services de AFIP/ARCA; catálogo oficial de tipos de comprobante; moneda extranjera |
| Padrones | Datos del cliente según ARCA; padrón de percepciones y retenciones |
| Remito electrónico | ARBA (Épica 2) |
| Acceso a datos | Ningún componente externo lee tablas internas del core; todo pasa por API (principio «sin DB directa») |
| Despliegue | API en el servidor de cada cliente (Docker Desktop sobre Windows o PM2 en entornos legacy) y servicios centrales en Docker Swarm del proveedor de Flexxus |

### 9.3 Requerimientos no funcionales del producto

| ID | Requerimiento |
|---|---|
| RNF-01 | Equivalencia funcional: el 100 % de los casos de prueba de equivalencia de los flujos del MVP da el mismo resultado que el ERP vigente (comprobante, importes, stock) |
| RNF-02 | Atomicidad: el comprobante, su efecto en stock y su cobro se graban completos o no se graban; 0 comprobantes parciales en las pruebas de falla |
| RNF-03 | La búsqueda de artículos responde en p95 ≤ 1 s con 100.000 artículos (⏳ a validar volumen real con Flexxus) |
| RNF-04 | Los listados de comprobantes y artículos se paginan y ordenan en el servidor, sin degradación con ≥ 1 millón de comprobantes (⏳ a validar) |
| RNF-05 | El costo incremental por instalación de exponer el MVP se mide y se compara por alternativa de topología (Semana 3, track de Tecnología) |
| RNF-06 | El 100 % de los parámetros de §5.4 se respeta con todos sus valores posibles, verificado por pruebas parametrizadas |
| RNF-07 | Disponibilidad del punto de venta durante el horario comercial del cliente ≥ 99,5 % (⏳ a validar contra el SLA vigente) |
| RNF-08 | La pantalla de inicio de cada rol carga en p95 ≤ 2 s con el contexto del usuario y sus últimos comprobantes (⏳ a validar con el track de Tecnología) |
| RNF-09 | Un artículo buscado por código de barras queda agregado a la venta en ≤ 1 s desde la lectura, en p95 |
| RNF-10 | La venta típica (consumidor final, un artículo, efectivo) se completa en ≤ 6 interacciones desde el inicio del vendedor (⏳ a validar contra la medición actual en sesión) |
| RNF-11 | La experiencia del Vendedor funciona en pantallas desde 1.280 px de ancho y en tablet, con el escáner de códigos de barra como teclado |

---

## 10. Hallazgos de la documentación técnica, el código y la demo de Flexxus que condicionan el alcance

Hallazgos que cambian o acotan lo que asume la propuesta técnica. H-1 a H-20 vienen de la v2.0.0 (documentación y código); H-21 a H-29 son de la demo del 21-10 y del frontend de Flexxus Order. Cada uno tiene su decisión en §12.

| # | Hallazgo | Impacto |
|---|---|---|
| **H-1** | **El brief de Flexxus propone Pagos a Proveedores como módulo de referencia.** La propuesta técnica lo registra como cuestión abierta a acordar en la sesión de inicio | ✅ Resuelto el 21-10: la referencia es la venta, por la intención del Vendedor (§1.bis) → [S-01](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-2** | **Venta y Stock ya tienen dos reconstrucciones web.** ERP Web / POS v1.164.0 (desde 2021, 12.861 commits) y Flexxus Order 1.0 beta (mar 2024 – oct 2026, 180 cambios especificados, «6 áreas funcionales: ventas, cuenta corriente, compras, fondos, stock y maestros») | El as-is tiene tres implementaciones; hay que decidir cuál es la referencia de comportamiento y cuál la base de la experiencia → [S-02](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-3** | **Conviven dos modelos de datos.** Firebird (ERP Delphi y API v6, migrando a Firebird 5) y MariaDB `order-v6` (386 tablas, 658 procedimientos), que «reemplaza progresivamente» a Firebird «módulo por módulo» (nota de release de Flexxus Order) | La coexistencia ya empezó, sin una fuente de verdad única para stock y comprobantes → [S-03](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-4** | ✅ **Resuelto el 08-10.** La copia del 07-10 estaba incompleta (1.728 archivos sin descargar, entre ellos las 115 unidades de `03-ERP/unit`). La entrega del 08-10 trae `03-ERP/unit` completa, `ERP.dpr`, `04-PS`, `05-Datos Externos` y `06-Librerias` | Las reglas de stock y comprobantes ya se leen en el Delphi (H-14 a H-20) → [S-04](#121-decisiones-abiertas--a-resolver-en-la-épica-1) resuelta, R-1 mitigado |
| **H-5** | **La documentación del carrito describe reglas que el código no implementa.** Según `spec/carrito/README.md` §0.4b, el saldo de cuenta corriente no bloquea ninguna venta, y un cliente con facturas vencidas no se bloquea contra la base real porque el procedimiento `FMA_SALDOSCTACTECLIENTES_V6` no existe en `order-v6`; siete endpoints del carrito no devuelven datos | La documentación no alcanza como fuente de reglas; cada regla del MVP se valida contra el código y contra el referente → R-3 |
| **H-6** | **Un tipo de dato divergente invierte una regla de bloqueo.** `CLIENTES.facturable` es `boolean` en `order-v6` y `string` en el origen (`database-gaps.md` §2.1) | Riesgo de que la venta a un cliente no facturable se permita o se bloquee al revés según la implementación → validación en S2 |
| **H-7** | **La parametrización es masiva y no binaria.** 345 parámetros generales y 5.137 filas de parámetros por punto de venta en la base de test; el carrito lee 28 y el backend lee otros dentro de procedimientos; el 109 es una política con rangos y el 82 se compara de tres formas distintas (`erp-parameters.md` §2 y §4.1) | Una «venta» tiene N variantes según la instalación; el MVP debe definir qué variantes soporta → [S-05](#121-decisiones-abiertas--a-resolver-en-la-épica-1), R-7 |
| **H-8** | **El front web solo carga los permisos del menú 78.** El modelo es un par (menú, permiso) y varias combinaciones comprobante × acción quedan denegadas en silencio, incluida la bonificación por ítem en NC (`erp-permissions.md` §1) | Los permisos del MVP se relevan sobre el Delphi, no sobre el front web |
| **H-9** | **Flexxus Order cambió el modelo de depósitos.** Reemplaza subdepósitos por un árbol de dos niveles; el Delphi tiene Depósitos, Sub Depósitos, Casilleros, Depósitos Externos y Centros de distribución | El efecto de la venta en stock depende del modelo elegido → [S-06](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-10** | **La propuesta Multi-Tenant cambia la pertenencia del stock.** El stock pasa a pertenecer a la sucursal física, con visibilidad cruzada configurable entre compañías. Su premisa de «una sola empresa por instalación» no coincide con el código (H-17) | El modelo Multi-Tenant sigue fuera del MVP; las empresas actuales, no → [S-07](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-11** | **Hay dos variantes del producto en las fuentes.** `Corralon_0336` (vertical Corralón, con Print Server y servidor de depósitos, documentación de 2007-2010) y `Erp_04-12_Provisorio` (ERP general, rama `develop`) | Las diferencias entre instalaciones pueden ser de vertical y no solo de parámetros → [S-05](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-12** | **El Delphi no tiene un manual funcional de Venta ni de Stock** (actualizado 08-10). Su documentación funcional son las notas de release por versión (H-19), más el cuestionario de pre-parametrización (v1.02, 2008), descripciones de tablas del Corralón y ayudas `.chm` de errores y migración | El riesgo R4 de la propuesta se atenúa pero no desaparece: las notas describen cambios, no el comportamiento completo → R-3 |
| **H-13** | **El código tiene residuos que confunden el análisis.** La copia completa del 08-10 trae 231 archivos de conflicto de merge o respaldo (`_BACKUP_`, `_BASE_`, `_LOCAL_`, `_REMOTE_`, `.orig`); `frmFacturacion` tiene cuatro copias de conflicto | Los agentes de análisis deben excluirlos para no duplicar reglas → acción del track de Tecnología |
| **H-14** | **El parámetro 109 combina tres dimensiones en un solo valor de 0 a 9:** contra qué compara (real en 1, 4, 6 y 9; remanente en 0, 2, 5 y 7; remanente más órdenes de compra en 3 y 8), si avisa (0, 4, 5, 9) o bloquea (1, 2, 3, 6, 7, 8) y si valida la NP (solo de 5 a 9). Solo aplica a artículos con `VerificaStock = 1`; la NC nunca valida stock (`Funciones.fxValidarStockArticulos`, `fxTieneQueVerificarStock`) | RF-03 y RF-14 quedan definidos; la experiencia objetivo tiene que mostrar al usuario contra qué stock se validó → [S-12](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-15** | **El stock se guarda en dos niveles y el control de negativos vive en la base.** Cada movimiento actualiza `CASILLEROS` (depósito × lote × empresa) y recalcula `STOCK`; el negativo lo rechaza la base con la excepción `ERROR_STOCK_NEGATIVO` según el artículo. La NR 04.12 crea el parámetro 537 (control por stock general o por depósito) para evitar «intervenciones técnicas manuales» en la base, pero **la constante 537 no existe en esta copia del código** (salta de 536 a 539) | La regla de negativos depende de objetos de la base que no se recibieron; la copia de `develop` no coincide con la 04.12 publicada → [S-14](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-16** | **La lógica de Venta vive en los formularios.** `frmFacturacion` tiene 19.153 líneas, `frmPedidos` 16.817 y `frmRemitoInterno` 15.654; las 7 pantallas de comprobante suman 748 sentencias SQL embebidas y 77 permisos especiales distintos; `ModificarStock` se invoca desde 43 archivos y cada formulario maneja su propia transacción (`prAnularTodasTransacciones`) | Exponer «emitir comprobante» como capacidad del core exige extraer reglas de la UI; el dimensionamiento de la Semana 4 tiene que reflejarlo → R-8 |
| **H-17** | **El Delphi ya es multiempresa dentro de una instalación.** 724 de las 1.401 unidades de `03-ERP` filtran por `IDEMPRESA`; la empresa 1 es la principal, el «modo compilador» suma stock de varias empresas (parámetro 540) y el 116 regula ver y facturar NP de otra empresa (NR 04.11, valores 0 a 3). El parámetro 535 «validar stock por empresa» está declarado pero nadie lo usa | Contradice la premisa de la propuesta Multi-Tenant; el MVP no puede asumir empresa única → RF-27, [S-07](#121-decisiones-abiertas--a-resolver-en-la-épica-1), [S-13](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-18** | **Varias «capacidades nuevas» de la v1.0.0 ya existen en el core.** El motor de promociones y cupones (`GestorPromociones`, 144.436 caracteres) lo usan FC, NP, PR y remito; también existen fidelización por puntos, picking, packing, guía de reparto, expedición, optimización de stock y terminales POSNET/VISA (`06-Librerias`) | Se reclasifican: promociones, cupones y puntos a la Épica 1; el resto a la Épica 2 (§1.bis, ronda 08-10) |
| **H-19** | **Las notas de release son la documentación funcional del Delphi.** 3.028 documentos únicos de las versiones 03.01 a 04.12 (Enterprise, Flexxus 4 y Corralón); 1.399 tratan Venta o Stock. Están ordenadas por versión y por ticket, no por capability, con duplicados `.docx`/`.pdf` y archivos temporales | Fuente de evidencia funcional para cada regla del MVP; hay que indexarlas por capability → [O-7](#11-observaciones-sobre-el-backlog-borrador-openspec-y-especificaciones-de-flexxus-order) |
| **H-20** | **La parametrización real es mayor que la del carrito y tiene peso muerto.** El código declara 399 constantes (345 filas en la base de test); las pantallas de Venta del menú leen 163 y las de Stock 79; 12 están declaradas sin uso (entre ellas 200 «depósito de reserva» y 535) y el parámetro 1 «multidepósitos», marcado como descartado, sigue con 132 referencias | El alcance de parametrización del MVP (§5.4) es un subconjunto explícito; el resto se clasifica en la Semana 2 → R-7 |
| **H-21** | **Flexxus Order es una copia uno a uno de las pantallas del ERP y no tiene clientes en producción.** «Agarramos una pantalla del ERP y tratamos de llevarla a web», sin reingeniería de procesos [11:27–12:22]; «hoy no tenemos ningún cliente que tenga Order» [19:53]. Su objetivo es reemplazar al ERP en la nube, independiente de él | La base técnica del MVP no tiene validación productiva; la experiencia por intención es justamente lo que le falta → [S-02](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-22** | **El carrito unificado no existe en el ERP y es la única pieza con trabajo de UX.** Vino de la app ERP Web / POS, productiva en muchos clientes como facturador [15:30–16:43]; en el ERP hay una pantalla por comprobante [18:56–19:17] | El carrito es la base de experiencia del flujo del Vendedor; se reposiciona como pantalla principal (RF-29, RF-38) |
| **H-23** | **Los perfiles ya segmentan la experiencia en ERP Web / POS.** Vendedor de salón, cajero, consulta y viajante; el perfil se define en el ERP y la app lo levanta al iniciar sesión; se restringen los comprobantes por perfil o usuario: el cajero solo factura y el vendedor de salón solo hace presupuestos y pedidos [34:02–35:34] | El rol Vendedor tiene variantes por permiso, no roles separados (§5.2); el modelo de permisos existente alcanza (RF-28, RF-31) |
| **H-24** | **La coexistencia ya es por perfil y el híbrido embebido fracasó.** Un mismo usuario no usa la web y el ERP a la vez; la administración usa el ERP [26:22–27:04]. Flexxus probó abrir pantallas web dentro de un navegador embebido en el Delphi y lo descartó por tamaños de pantalla y eventos [28:16–29:07] | Se migra una intención completa por perfil (§1); insumo del camino de coexistencia del track de Tecnología |
| **H-25** | **Los clientes recorren la venta de tres formas y el pedido reserva stock según su operación.** PR → NP → FC, NP → FC o FC directa [04:41–05:03]; el ABM de Operaciones define si el pedido compromete stock [09:14–09:21]; el presupuesto no reserva [08:40] | El flujo del Vendedor arranca por cualquier tipo y la conversión es un alternativo (A8); RF-42, RF-45 |
| **H-26** | **La home de Flexxus Order es una maqueta con datos fijos.** `routes/HomePage/index.jsx` muestra «Clientes Nuevos 281», «Facturas Emitidas $2300» y «Top Vendedores Markus Zukus» escritos en el código; no hay servicio de indicadores | Los indicadores del inicio del vendedor no tienen fuente → quedan posteriores al MVP ([S-18](#121-decisiones-abiertas--a-resolver-en-la-épica-1)) |
| **H-27** | **El carrito actual expone todo al vendedor y lo interrumpe tarde.** En Flexxus Order, el carrito se abre como pestaña junto a las 7 pestañas de módulo y el menú lateral [15:32]; el panel de condiciones (Enviar como, lista, condición de venta y de pago, depósito, vendedor, descuento, más detalles) está siempre desplegado; la búsqueda abre un modal de resultados que pide «Seleccionar» [17:26]; el aviso de stock remanente llega como confirmación después de agregar [17:35]; el descuento del 5 % en efectivo aparece recién en el cobro [17:38] | Fricciones que el flujo principal resuelve (RF-30, RF-36 a RF-39); a medir en sesión (RNF-10) |
| **H-28** | **El cobro con tarjeta tiene dos modos y pasa por un gateway propio.** Automático con Payway o manual con POS físico y número de cupón [03:12], [05:18–05:34]; Flexxus centraliza terminales y entidades en un gateway que quiere usar desde todos sus productos [44:37–45:13] | El cobro del MVP se integra al gateway, no a cada proveedor → [S-09](#121-decisiones-abiertas--a-resolver-en-la-épica-1) |
| **H-29** | **La versión de la API está acoplada a la del ERP.** Un cambio estructural del ERP (por ejemplo, un campo obligatorio nuevo) rompe la API; cada versión de API es compatible con un rango de versiones del ERP; la API se despliega con Portainer y el ERP con el Updater, en infraestructuras separadas [38:58–42:59] | Una experiencia por rol que depende de la API llega a cada cliente según la versión de su ERP → R-11 |

---

## 11. Observaciones sobre el backlog borrador (OpenSpec y especificaciones de flexxus-order)

No se recibió un backlog Jira para este Discovery. Los repositorios traen especificaciones OpenSpec y las trazas de los tableros Jira FO y FLEXV2; se listan las observaciones para el análisis, no como crítica.

| # | Observación | Acción propuesta |
|---|---|---|
| **O-1** | **No hay backlog del Discovery ni acceso a Jira FO / FLEXV2.** Solo se ven las historias citadas en las especificaciones (FO-225, FO-236, FO-247, FO-300, entre otras) | Pedir acceso de lectura a ambos tableros para cruzar el estado real de Venta y Stock |
| **O-2** | **La especificación del carrito es transitoria.** `spec/carrito/` se vacía a medida que avanzan las 24 subtareas de FO-225; el documento mobile está pendiente | Tomarla como foto al 06/10/2026 y citar la versión del repositorio en cada regla |
| **O-3** | **El carrito documentado es el de `flexxuserpweb`, no el de `flexxus-order`.** El propio README lo aclara (§0.1) | Distinguir en el inventario qué regla vale para cada implementación |
| **O-4** | **Un criterio de aceptación de FO-300 (depósitos) no se cumple.** El selector de artículos responde 500 (spec `deposito-crud`) | Registrarlo como deuda conocida del frente que podría ser base del MVP |
| **O-5** | **La cobertura web vs Delphi no está medida.** El Delphi tiene 94 opciones de Venta y 34 de Stock; las notas de release web describen áreas, no opciones | Construir la matriz de cobertura por opción en la Semana 2 ([entregable parcial S1 v0.2](../flexxus-discovery/2026-10-08-entregable-parcial-s1-venta-stock.md) §2 como base) |
| **O-6** | **El nombre «MVP TCR/ER» no aparece en ninguna fuente.** | Confirmar alcance y significado de la sigla ([S-08](#121-decisiones-abiertas--a-resolver-en-la-épica-1)) |
| **O-7** | **Las notas de release traen número de ticket pero no el tablero de origen.** Por ejemplo, «74606» en la NR 04.12 del parámetro 537 o «441135» en la 04.11 del parámetro 116; los nombres tienen variantes («Enterprice», «Entreprise») y archivos temporales `~$` | Pedir a Flexxus el sistema de tickets de origen para enlazar cada nota con su historia, e indexar las 1.399 notas de Venta y Stock por capability del inventario en la Semana 2 |
| **O-8** | **La sigla «MVP TCR/ER» proviene de otro proyecto.** Aparece en el PRD del conector FIX ↔ A3 Mercados del mismo repositorio (Trade Capture Report / Execution Report) y no tiene significado para Flexxus | S-08 resuelta: el MVP se nombra «intención Vender en mostrador» |
| **O-9** | **Las intenciones relevadas por Flexxus todavía no se compartieron.** Fer y Ale trabajaron intenciones a partir de lo que intive envió; Ale vuelve la semana del 26-10 y se coordinará un roundup; Leo mostrará el ERP de punta a punta [31:55–32:30], [47:12–47:20] | Llevar al roundup este PRD, la definición de roles y los user flows como propuesta; registrar las diferencias en S-21 |
| **O-10** | **La documentación mobile del carrito sigue pendiente.** `spec/carrito/README.md` §2.2 lista `mobile-wizard.md` como pendiente, y es la base de la experiencia del viajante | Pedirlo o relevarlo antes de abrir la intención «Vender en ruta» (Épica 3) |

---

## 12. Riesgos, dependencias y decisiones abiertas

### 12.1 Decisiones abiertas — a resolver en la Épica 1

| ID | Pregunta | Impacto si no se resuelve | Propuesta del PO |
|---|---|---|---|
| **S-01** ✅ **RESUELTO 21-10** | **¿Cuál es el módulo de referencia?** | — | Resuelto en la demo: la venta, empezando por la intención del usuario Vendedor y siguiendo por el Administrativo (§1.bis) |
| **S-02** ⏳ **SIN DEFINIR** | **¿Sobre qué producto se construye la experiencia del Vendedor: ERP Web / POS (productivo, con el carrito y los perfiles) o Flexxus Order (evolución cloud, sin clientes)?** (actualizada 21-10) | Se rediseña una base que no llega a producción, o se construye sobre una que Flexxus planea reemplazar | Tomar el carrito y el modelo de perfiles de ERP Web / POS como referencia de experiencia, y decidir la base técnica en la Semana 4 con el track de Tecnología según el camino de coexistencia |
| **S-03** ✅ **RESUELTO 21-10** | **¿Cuál es la fuente de verdad de stock y comprobantes durante la coexistencia?** | — | Resuelto: la web y el ERP leen y escriben la misma base Firebird a través de la API; Flexxus Order no tiene clientes en producción [19:53–22:21] |
| **S-04** ✅ **RESUELTO 08-10** | **¿Puede Flexxus entregar las fuentes completas del ERP?** | — | Resuelto: fuentes y notas de release entregadas el 08-10 |
| **S-05** ⏳ **SIN DEFINIR** | **¿Qué valores de parámetros usan los clientes representativos?** | El flujo se diseña para una configuración que no es la mayoritaria | Pedir 5 instalaciones representativas con los valores de los parámetros de §5.4 |
| **S-06** ⏳ **SIN DEFINIR** | **¿El modelo de depósitos objetivo es el árbol de Flexxus Order o el del Delphi?** | El stock que ve el vendedor se calcula distinto según el modelo | Para el MVP basta el depósito del usuario y la consulta en otras sucursales; decidir el modelo con la intención «Operar el depósito» (Épica 3) |
| **S-07** ⏳ **SIN DEFINIR** | **¿El modelo Multi-Tenant entra en el primer módulo?** | El MVP crece con una jerarquía que el core no tiene | Mantenerlo en la Épica 3; el Vendedor opera en la empresa de su sesión (RF-27) |
| **S-08** ✅ **RESUELTO 22-10** | **¿Qué abarca la sigla «MVP TCR/ER»?** | — | Resuelto: es nomenclatura de otro proyecto (O-8); el MVP es la intención «Vender en mostrador» |
| **S-09** ⏳ **SIN DEFINIR** | **¿El cobro con tarjeta del MVP se integra al gateway de pagos de Flexxus, y entran los QR?** (actualizada 21-10) | Integraciones duplicadas por proveedor o un cobro que no cierra la venta | Usar el gateway para Payway (automático) y mantener el modo manual con cupón; dejar los QR en la Épica 3 salvo uso mayoritario |
| **S-10** ⏳ **SIN DEFINIR** | **¿La facturación masiva y los comprobantes de verticales quedan fuera?** | Alcance sobredimensionado | Fuera de las Épicas 1 y 2; catálogo de la Épica 3 |
| **S-11** ⏳ **SIN DEFINIR** | **¿Qué porcentaje de clientes usa controlador fiscal en lugar de factura electrónica?** | El flujo omite una variante obligatoria o especifica una en desuso | Consultarlo al referente de negocio; el punto de venta ya define cuál aplica [12:41–13:08] |
| **S-12** ⏳ **SIN DEFINIR** | **¿Qué valores del parámetro 109 y del 82 usa la mayoría de los clientes?** | El aviso o bloqueo de stock del flujo se diseña para todas las variantes | Extraerlo de la muestra de S-05; la demo usa modo aviso contra el remanente |
| **S-13** ⏳ **SIN DEFINIR** | **¿Se soporta facturar NP de otra empresa (parámetro 116 en 1 o 3)?** | Se omite un caso de instalaciones multiempresa | Llevarlo a la Épica 2 (RF-48) y medir el uso en la muestra de S-05 |
| **S-14** ⏳ **SIN DEFINIR** | **¿Qué versión del código es la referencia de comportamiento: `develop` o la 04.12 publicada?** | Reglas que no coinciden con las de los clientes | Pedir la etiqueta 04.12 y los objetos de base de stock al referente técnico |
| **S-15** | **¿Cómo se asigna la experiencia de inicio: un atributo nuevo en el perfil del ERP o inferida de los permisos?** | Usuarios que entran a la experiencia equivocada, o un cambio de modelo que el ERP no admite a tiempo | Atributo nuevo «Experiencia de inicio» en el perfil; mientras no exista, inferir: con permisos 002 a 005 y sin menús administrativos → Vendedor |
| **S-16** | **¿Qué ve un usuario que necesita las dos experiencias (encargado de local)?** | Navegaciones mezcladas que reproducen el problema actual | Selector «Modo venta / Modo gestión» visible solo con permiso; cada modo con su navegación |
| **S-17** | **¿El vendedor emite notas de crédito o solo las solicita?** | Devoluciones bloqueadas en el mostrador o NC sin control | NC emitida por el vendedor solo con el permiso 005; sin permiso, solicitud al Administrativo (RF-47, RF-51) |
| **S-18** | **¿Qué indicadores muestra el inicio del vendedor y de qué fuente salen?** | Un dashboard con datos de ejemplo, como la home actual (H-26) | MVP sin indicadores de negocio; definir con Flexxus 3 indicadores y su fuente para el tramo siguiente |
| **S-19** | **¿El Administrativo crea facturas sin un pedido previo?** | Duplicación de la venta de mostrador en el menú | Permitir solo «factura administrativa» (por ejemplo, a cuenta corriente sin mostrador), con permiso propio |
| **S-20** | **¿El vendedor de salón cobra anticipos de pedidos?** | El vendedor de salón necesita el cobro, que hoy es del cajero | Permitirlo solo si el perfil tiene el medio de pago habilitado; por defecto, no |
| **S-21** | **¿Las intenciones que relevaron Fer y Ale coinciden con «Vender en mostrador» y «Gestionar y cerrar la venta»?** | Retrabajo de roles y flujos después del roundup | Llevar este PRD y los user flows al roundup como propuesta; registrar las diferencias antes del 2026-10-28 |

### 12.2 Riesgos

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| **R-1** | **La copia del código no es la versión publicada** — mitigado 08-10; residual por S-14 | Bajo — reglas extraídas de otra versión | Confirmar la etiqueta 04.12 (S-14) |
| **R-2** | **Tres implementaciones con reglas distintas para la misma venta** | Alto — el flujo del Vendedor especifica una regla que no es la vigente | Matriz regla × implementación; la regla canónica es la del core (RF-01 a RF-27) |
| **R-3** | **La documentación describe comportamiento no implementado** (H-5, H-12) | Medio — requerimientos falsos | Doble evidencia: código y referente |
| **R-4** | **Disponibilidad de los referentes menor a la prevista** | Alto — quedan 6 días hábiles y dos sesiones pendientes (roundup y demo del ERP) | Pedir las dos sesiones esta semana; validar roles y flujos por escrito si no hay sesión |
| **R-5** | **El MVP crece con otras intenciones** (viajante, consulta) por compartir piezas | Alto — análisis superficial del Vendedor | La decisión de §5.2: «Vendedor» es quien atiende en el local; el resto al catálogo |
| **R-6** | **Expectativa de prototipo dentro de la etapa** | Medio — los wireframes se leen como diseño final | Marcar los wireframes como baja fidelidad; el diseño de UI es del primer tramo de construcción |
| **R-7** | **La parametrización multiplica las variantes del flujo** (H-7, H-14, H-20) | Alto — el dimensionamiento subestima la construcción | Fijar en S-05 y S-12 las variantes soportadas |
| **R-8** | **Las reglas de Venta están dispersas en formularios con SQL embebido** (H-16) | Alto — reglas omitidas al exponer la venta como capacidad del core | La experiencia web ya consume la API; validar cada regla del flujo contra el carrito y el Delphi |
| **R-9** | **Las intenciones de Flexxus difieren de la propuesta** (S-21) | Medio — retrabajo de roles y flujos en la Semana 4 | Roundup antes del 2026-10-28; roles y flujos versionados |
| **R-10** | **El inicio del vendedor no tiene datos reales** (H-26) | Medio — un dashboard vacío o con datos de ejemplo no aporta valor | MVP con zonas que usan servicios existentes (contexto, buscador, últimos comprobantes, pendientes); indicadores después (S-18) |
| **R-11** | **La experiencia por rol llega a cada cliente según la versión de su ERP** (H-29) | Medio — despliegue desparejo entre clientes | Llevarlo al camino de coexistencia del track de Tecnología: compatibilidad mínima de API para la experiencia nueva |

### 12.3 Dependencias del cliente Flexxus

| Dependencia | Requerida para | Fecha límite sugerida |
|---|---|---|
| Roundup de intenciones con Fer y Ale | S-21, OBJ-5, Épica 1 | 2026-10-28 |
| Demo del ERP de punta a punta con Leo | OBJ-6, Épica 2 | 2026-10-27 |
| Validación de la definición de roles y de los user flows por el referente de negocio | OBJ-1, OBJ-2, OBJ-3 | 2026-10-28 |
| Decisión sobre el atributo de experiencia en el perfil (S-15) y el alcance de la NC del vendedor (S-17) | RF-29, RF-47 | 2026-10-28 |
| Muestra de 5 instalaciones con sus valores de parámetros | S-05, S-12, S-13 | 2026-10-27 |
| Acceso de lectura a la demo de ERP Web / POS ofrecido en la reunión [37:10–37:14] | Medición del flujo actual (RNF-10) | 2026-10-23 |
| Etiqueta 04.12 y objetos de base de stock | S-14 | 2026-10-27 |

---

## 13. Plan de entrega contra el cierre del Discovery

Supuestos: T0 = lunes 2026-10-05, etapa de plazo fijo de cuatro semanas, sin sprints; cada semana cierra con un entregable parcial (Propuesta técnica, «Plan de trabajo»). Hoy es 2026-10-22, Semana 3.

| Etapa | Duración | Ventana estimada | Entregable de cierre |
|---|---|---|---|
| **Semana 1** — Relevamiento ✅ | 1 semana | 05-10 al 09-10 | Situación actual, inventarios y accesos ([Entregable S1 v0.2](../flexxus-discovery/2026-10-08-entregable-parcial-s1-venta-stock.md), PRD v2.0.0) |
| **Semana 2** — Análisis ✅ | 1 semana | 12-10 al 16-10 | Reglas de venta y stock extraídas del código (H-14 a H-20); preguntas de kick off |
| **Semana 3** — Definición 🟡 | 1 semana | 19-10 al 23-10 | Demo del 21-10; roles, user flows y PRD v3.0.0; experiencia objetivo del Vendedor; datos requeridos |
| **Épica 1** — Requerimientos de la intención Vender en mostrador | Semana 4 | 26-10 al 30-10 | RF y RNF con criterio de aceptación; historias con `po-expert-user-stories`; catálogo de intenciones priorizado; presentación de cierre |
| **Holgura hasta el cierre del Discovery** | 0 días | — | Ninguna: el roundup y la demo del ERP tienen que caer el 27 o el 28-10 |

**Lectura del PO sobre la fecha (actualizada al 2026-10-22):** el camino crítico es validación de roles y flujos → roundup de intenciones (S-21) → requerimientos con criterio de aceptación de la Épica 1. La Épica 2 llega al cierre a nivel de flujos y menú, no de requerimientos detallados. Si el roundup se corre al 29-10, la Semana 4 cierra con roles y flujos validados por escrito y los requerimientos de la Épica 1 sin la revisión de Flexxus.

En consecuencia, las prioridades de lo que resta de la Semana 3 son:

1. **Enviar a Flexxus la definición de roles y los user flows** — son el insumo del roundup y lo que más puede cambiar.
2. **Pedir fecha para el roundup y para la demo del ERP** — sin ellas no hay holgura.
3. **Pedir el acceso a la demo de ERP Web / POS** — para medir el flujo actual (RNF-10, H-27).
4. **Resolver S-15 y S-17 con el referente de negocio** — definen la entrada y la devolución del Vendedor.
5. **Contrastar con el track de Tecnología la matriz de datos de la experiencia** — define qué zonas del inicio entran al MVP (S-18).

---

## 14. Criterios de aceptación de la etapa de Producto del Discovery (DoD de fase)

La etapa de Producto del Discovery se considera completa cuando:

- [ ] La definición de los roles Vendedor y Administrativo (permisos, vistas, funcionalidades y regla de asignación) está validada por el referente de negocio de Flexxus, con S-15 y S-16 resueltas (OBJ-1)
- [ ] El inicio del vendedor, el flujo principal y los 11 alternativos están validados en sesión, con cada paso trazado a su regla (OBJ-2, OBJ-6)
- [ ] El inicio administrativo, su menú y sus dos flujos principales están aprobados por el referente de negocio, con S-19 resuelta (OBJ-3)
- [ ] La matriz de datos de la experiencia tiene fuente y disponibilidad para el 100 % de los datos del inicio y de la venta, revisada por el track de Tecnología (OBJ-4)
- [ ] El catálogo de intenciones está priorizado por valor, riesgo y dependencia y contrastado con las intenciones de Flexxus (S-21) (OBJ-5)
- [ ] Cada RF de la Épica 1 tiene criterio de aceptación y está cargado como historia de usuario (OBJ-2, OBJ-6)
- [ ] Ninguna S-nn de la Épica 1 queda sin definir al cierre de la Semana 4

---

*Documento generado como insumo para el refinamiento de historias de usuario con el agente `po-expert-user-stories`.*
