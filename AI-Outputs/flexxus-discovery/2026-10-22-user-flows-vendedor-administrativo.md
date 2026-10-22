# Flexxus — User flows: Vendedor y Administrativo (happy paths y alternativos)

> **Fecha:** 2026-10-22 · **Versión:** v1.0 preliminar
> **Autor:** Líder de Producto (intive)
> **Documentos asociados:** [Definición de roles](2026-10-22-roles-vendedor-administrativo.md) · [PRD v3.0.0](../prd/PRD-flexxus-venta-stock-2026-10-22.md) · [Entregable de Producto v0.3](2026-10-22-entregable-producto-discovery.md)

Los diagramas describen la **experiencia objetivo propuesta**, no la actual. Los IDs de vista (V-nn) son los de la [definición de roles](2026-10-22-roles-vendedor-administrativo.md); los de requerimiento (RF-nn), los del PRD. Los minutos entre corchetes remiten a la grabación del 21/10.

---

## 1. Entrada a la plataforma según el rol

```mermaid
flowchart TD
    A["Usuario inicia sesión"] --> B["La web lee el perfil del ERP<br/>permisos por menú y por comprobante"]
    B --> C{"Experiencia de inicio<br/>del perfil"}
    C -- "Vendedor" --> D["V-01 Inicio del vendedor<br/>sin menú lateral ni pestañas de módulo"]
    C -- "Administrativo" --> E["V-11 Inicio administrativo<br/>menú lateral + pendientes de gestión"]
    C -- "Sin atributo" --> F{"¿Tiene permisos de comprobante<br/>002 a 005 y ningún menú administrativo?"}
    F -- "Sí" --> D
    F -- "No" --> E
    D --> G["Tipos de comprobante visibles:<br/>solo los habilitados, con el de defecto preseleccionado"]
    E --> H["Sin pantalla Venta ni ícono de carrito"]
```

| Paso | Regla | Referencia |
|---|---|---|
| Lectura del perfil | El perfil se define en el ERP y la web lo levanta al iniciar sesión | [34:34–34:46]; RF-28 |
| Experiencia de inicio | Atributo nuevo del perfil; mientras no exista, se infiere | RF-29, S-15 |
| Tipos visibles | Permisos 002 (FC, por defecto), 003 (NP), 004 (PR), 005 (NC) | RF-31 |

---

## 2. Vendedor — happy path: venta de mostrador con factura de contado

Escenario: un cliente consumidor final compra un artículo en el local, paga en efectivo y se lleva la factura.

```mermaid
flowchart TD
    S(["Cliente en el mostrador"]) --> A["V-01 Inicio del vendedor"]
    A --> B["Busca el artículo en el buscador único<br/>código, descripción o código de barras"]
    B --> C["Ve precio de su lista, stock disponible<br/>y promoción vigente en el resultado"]
    C --> D["Agrega el artículo<br/>se abre V-02 Venta con la venta nueva"]
    D --> E["Venta precargada por defecto:<br/>cliente consumidor final, Factura, contado,<br/>lista, depósito y vendedor del usuario"]
    E --> F{"¿Agrega más artículos?"}
    F -- "Sí" --> B2["Busca y agrega desde la misma pantalla"] --> F
    F -- "No" --> G["Revisa el total con promociones y<br/>descuentos ya aplicados"]
    G --> H["Cobrar → V-03 Cobro"]
    H --> I["Elige efectivo: ve el total con su descuento<br/>y el vuelto"]
    I --> J["Confirma"]
    J --> K["El sistema emite la factura:<br/>CAE o controlador fiscal según el punto de venta,<br/>descuenta stock y registra el cobro"]
    K --> L["V-04 Comprobante emitido"]
    L --> M["Imprime o comparte por WhatsApp o mail"]
    M --> N["Nueva venta → V-01<br/>la venta anterior queda en Últimos comprobantes"]
    N --> Z(["Listo para el próximo cliente"])
```

| # | Paso | Qué ve y hace el Vendedor | Qué resuelve el sistema | Cambio respecto de hoy | RF |
|---|---|---|---|---|---|
| 1 | Inicio | Contexto (sucursal, PV, depósito, caja) y buscador | Lee perfil y contexto del usuario | Hoy entra a una home de ejemplo o al menú completo | RF-29, RF-32 |
| 2 | Buscar | Escribe o escanea | Busca por código, descripción y barras (parámetros 32, 150) | Hoy la búsqueda abre un modal «Resultados de tu búsqueda» y pide «Seleccionar» [17:26] | RF-01, RF-36 |
| 3 | Ver precio y stock | Precio, stock disponible y promoción en el mismo resultado | Precio por lista y pactado; stock real o remanente según el parámetro 109; promociones del motor | Hoy el aviso de stock llega como modal después de agregar [17:35] | RF-02, RF-03, RF-25, RF-37 |
| 4 | Agregar | Un clic; cantidad, talle o lote si corresponde | Valida talle o lote (parámetros 20, 83) | — | RF-04 |
| 5 | Venta precargada | No completa nada si es el caso típico | Cliente por defecto (parámetro 87), tipo de comprobante por defecto del perfil, depósito y lista del usuario | Hoy el panel derecho muestra siempre Enviar como, Lista, Condición de venta y de pago, Depósito, Vendedor, Descuento y Más detalles | RF-38 |
| 6 | Revisar total | Total final con promociones, bonificaciones y descuentos | Motor de promociones y percepciones | — | RF-25, RF-26 |
| 7 | Cobrar | Elige el medio de pago y ve el total con descuento o recargo de ese medio | Descuento por medio de pago del multiplazo | Hoy el −5 % en efectivo aparece recién en el cobro [17:38]; se propone mostrarlo antes | RF-18, RF-39 |
| 8 | Confirmar | Un botón | Comprobante, stock y cobro atómicos; bloqueo de la pantalla mientras graba | — | RF-08, RF-13, RF-24, RNF-02 |
| 9 | Comprobante emitido | Imprimir, compartir, ticket de cambio, ver el pago | Reporteador, WhatsApp, mail | Existe [17:56] | RF-12 |
| 10 | Nueva venta | Vuelve al inicio con la venta vacía | Reset a comprobante nuevo con el cliente del parámetro 87 | Hoy vuelve al carrito vacío | RF-40 |

---

## 3. Vendedor — flujos alternativos

```mermaid
flowchart LR
    V["V-02 Venta en armado"] --> A1["A1 · Venta a cuenta corriente"]
    V --> A2["A2 · Pedido con reserva de stock"]
    V --> A3["A3 · Presupuesto"]
    V --> A4["A4 · Artículo sin stock suficiente"]
    V --> A5["A5 · Cobro con tarjeta"]
    V --> A6["A6 · Cliente identificado u ocasional"]
    I["V-01 Inicio"] --> A7["A7 · Retomar una venta en curso"]
    I --> A8["A8 · Convertir un presupuesto propio"]
    I --> A9["A9 · Consulta de precio y stock sin vender"]
    I --> A10["A10 · Devolución: NC o solicitud de NC"]
    I --> A11["A11 · Reenviar o reimprimir un comprobante"]
```

### 3.1 A1 · Venta a cuenta corriente

```mermaid
flowchart TD
    A["Cliente con cuenta corriente seleccionado"] --> B["Condición de venta: cuenta corriente"]
    B --> C["El sistema valida saldo, límite y vencidos<br/>permiso 404 en FC, 402 en NP"]
    C --> D{"¿Supera el límite o tiene vencidos?"}
    D -- "No" --> E["Emitir: factura en cuenta corriente, sin cobro"]
    D -- "Sí" --> F{"¿Tiene permiso 963 para<br/>destildar la validación?"}
    F -- "Sí" --> E
    F -- "No" --> G["Ofrecer: cobrar de contado,<br/>generar pedido o derivar al Administrativo"]
    E --> H["V-04 Comprobante emitido"]
```

### 3.2 A2 · Pedido con reserva de stock y A3 · Presupuesto

```mermaid
flowchart TD
    A["Iniciar como Pedido o Presupuesto<br/>solo si el perfil lo permite: 003 o 004"] --> B{"Tipo"}
    B -- "Pedido" --> C["Fecha de entrega y operación<br/>la operación define si compromete stock"]
    C --> D{"¿Paga anticipo?"}
    D -- "Sí" --> E["V-03 Cobro del anticipo"] --> G
    D -- "No" --> G["Emitir pedido: reserva stock<br/>y queda pendiente de facturar"]
    B -- "Presupuesto" --> H["Sin cobro ni stock;<br/>vencimiento según multiplazo"]
    H --> I["Emitir presupuesto y compartirlo con el cliente"]
    G --> J["Aparece en Para accionar del inicio<br/>y en la bandeja del Administrativo"]
    I --> K["Aparece en Para accionar hasta vencer o convertirse"]
```

### 3.3 A4 · Artículo sin stock suficiente

```mermaid
flowchart TD
    A["El resultado de búsqueda muestra stock insuficiente<br/>antes de agregar"] --> B{"Parámetro 109"}
    B -- "Avisa: 0, 4, 5, 9" --> C["Agrega con advertencia visible en la línea"]
    B -- "Bloquea: 1, 2, 3, 6, 7, 8" --> D["No permite agregar a FC"]
    D --> E{"Alternativas"}
    E --> F["Ver stock en otras sucursales"]
    E --> G["Generar pedido con fecha de entrega"]
    E --> H["Registrar venta no realizada<br/>capacidad existente en el Delphi"]
```

### 3.4 A5 · Cobro con tarjeta

```mermaid
flowchart TD
    A["V-03 Cobro: elige tarjeta"] --> B["Ve las cuotas y el total de cada plan"]
    B --> C{"¿Terminal integrada?"}
    C -- "Sí, Payway" --> D["Cobro automático en la terminal;<br/>el cupón se completa solo"]
    C -- "No" --> E["POS físico: carga número de cupón"]
    D --> F["Pago confirmado externamente:<br/>no se puede borrar"]
    E --> F
    F --> G{"¿Falta cobrar?"}
    G -- "Sí" --> H["Agrega otro medio de pago"] --> G
    G -- "No" --> I["Confirmar y emitir"]
```

| Flujo | Disparador | Regla clave | Prioridad | RF |
|---|---|---|---|---|
| **A1** Cuenta corriente | Cliente con CC y condición CC | Permisos 402/404/405, 963 con parámetro 287 | MVP | RF-20, RF-41 |
| **A2** Pedido | Tipo Pedido permitido | La operación define la reserva de stock [09:14]; NP validada según el parámetro 109 (5 a 9) | MVP | RF-14, RF-42 |
| **A3** Presupuesto | Tipo Presupuesto permitido | Sin stock ni fiscal; siempre valida CC (PR-6) | MVP | RF-06, RF-42 |
| **A4** Sin stock | Stock menor a la cantidad | Parámetro 109; alternativas: otra sucursal, pedido, VNR | MVP (aviso y bloqueo) / posterior (VNR) | RF-14, RF-43 |
| **A5** Tarjeta | Medio tarjeta | Automático (Payway) o manual con cupón [05:18–05:34]; pagos externos no se borran | MVP | RF-18, RF-39 |
| **A6** Cliente | Venta a cliente identificado u ocasional | Parámetro 94; CUIT obligatorio sobre el umbral de la sucursal | MVP | RF-10, RF-11 |
| **A7** Retomar venta | Venta en curso en el inicio | Persistencia de la venta abierta | MVP (una) / posterior (varias) | RF-44 |
| **A8** Convertir presupuesto | Presupuesto propio en Para accionar | Copia el contenido según la parametrización | MVP | RF-07, RF-45 |
| **A9** Consulta | Buscador del inicio, sin vender | Precio, stock por depósito y sucursal, promociones, cuotas | MVP | RF-03, RF-46 |
| **A10** Devolución | Cliente devuelve | NC vinculada a la factura con permiso 005, o solicitud al Administrativo | Posterior al MVP ⏳ S-17 | RF-09, RF-47 |
| **A11** Reenviar | Últimos comprobantes | Reimprimir, compartir, ticket de cambio | MVP | RF-12 |

---

## 4. Traspaso Vendedor de salón → Administrativo (o cajero)

Es el circuito que la demo describe para los clientes que separan venta y facturación [20:59–21:06].

```mermaid
sequenceDiagram
    actor VS as Vendedor de salón
    participant W as Web (Venta)
    participant API as Flexxus Web API
    participant DB as Base Firebird
    actor AD as Administrativo o cajero
    VS->>W: Arma la venta e inicia como Pedido
    W->>API: Emitir NP
    API->>DB: Graba NP y reserva stock según la operación
    API-->>W: NP emitida
    W-->>VS: Comprobante y número de pedido para el cliente
    AD->>API: Abre Pendientes de gestión
    API->>DB: Consulta NP pendientes de facturar
    API-->>AD: Lista de pedidos
    AD->>API: Facturar pedido
    API->>DB: Graba FC, descuenta stock, libera reserva y registra el cobro
    API-->>AD: Factura emitida con CAE o por controlador fiscal
```

---

## 5. Administrativo — happy path: facturar los pedidos del día

```mermaid
flowchart TD
    S(["Inicio de la jornada administrativa"]) --> A["V-11 Inicio administrativo"]
    A --> B["Pendientes de gestión:<br/>pedidos sin facturar, solicitudes de NC,<br/>facturas sin CAE, remitos sin facturar"]
    B --> C["Abre Pedidos sin facturar → V-13 Facturación de pedidos"]
    C --> D["Filtra por cliente, fecha o vendedor"]
    D --> E["Selecciona uno o varios pedidos"]
    E --> F["Revisa precios, cantidades entregadas<br/>y condición de venta"]
    F --> G{"¿Pedido de otra empresa?"}
    G -- "No" --> H["Genera la factura"]
    G -- "Sí" --> I{"Parámetro 116 lo permite"}
    I -- "Sí" --> H
    I -- "No" --> J["Queda pendiente para la empresa que corresponde"]
    H --> K["CAE, descuento de stock<br/>y remito automático según los parámetros 52 y 154"]
    K --> L["La factura sale de Pendientes<br/>y aparece en Libro IVA ventas"]
    L --> Z(["Pendientes al día"])
```

## 6. Administrativo — happy path secundario: cobrar e imputar una cuenta corriente

```mermaid
flowchart TD
    A["Menú Gestión de cuentas → Cuenta corriente"] --> B["Busca al cliente por nombre, código, DNI o CUIT"]
    B --> C["Ve límite de crédito, saldo disponible y deuda"]
    C --> D["Tilda los comprobantes pendientes a cancelar"]
    D --> E["El sistema completa el monto a cobrar"]
    E --> F["Carga medios de pago, observaciones y descuento"]
    F --> G["Confirma: recibo emitido"]
    G --> H["La cuenta corriente se actualiza;<br/>ve el recibo y los comprobantes cancelados"]
```

| Flujo | Paso crítico | Fuente | RF |
|---|---|---|---|
| Facturar pedidos | Selección múltiple y regla del parámetro 116 | Delphi «Facturación de Pedidos»; NR 04.11 | RF-48, RF-27 |
| Pendientes de gestión | Bandeja con contadores accionables | Propuesta nueva | RF-49 |
| Cobrar CC | Selección de comprobantes y cálculo del monto | Demo [23:41–24:46] | RF-50 |
| NC por solicitud | Resolver la solicitud del vendedor | Delphi «Solicitud Nota de Crédito» | RF-51 |
