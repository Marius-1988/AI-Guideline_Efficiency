# Plantilla — POC Brief (análisis SR PO + SR BA)

Leer en el Paso 2. El brief es el contrato de alcance de la POC: se escribe en
`AI-Outputs/po-poc-builder/{slug}/poc-brief.md` y se confirma con el usuario antes de construir.

## Criterio de análisis (aplicar antes de escribir)

1. **Propuesta de valor primero:** qué dolor del cliente resuelve y qué tiene que "ver" el
   decisor en 5 minutos de demo para decir que sí. Los flujos principales se eligen por eso.
2. **2 a 4 flujos principales (FP)**, cada uno de punta a punta con datos mockeados: actor →
   disparador → pasos → cambio de estado → resultado visible. Más de 4 diluye la demo; lo
   demás va al menú como "en construcción".
3. **Máquina de estados** por entidad central: estados, transiciones, quién las ejecuta y
   reglas de negocio que las bloquean. Es lo que hace que la POC se sienta real.
4. **Roles:** si el usuario no los da, un único rol administrador (`*`). Si los da, un usuario
   de prueba por rol y al menos un escenario demo donde se note la diferencia de permisos.
5. **Sensación de producto completo:** completar el menú con 4–8 módulos del rubro en
   construcción (ver [rubro-catalog.md](rubro-catalog.md)), cada uno con 3–5 capacidades
   "próximamente" coherentes con el producto.
6. **Componente IA** (si el producto es guiado por IA): qué decide o sugiere la IA, con qué
   datos, cómo se explica, y dónde valida el humano. Se simula según poc-architecture §8.
7. **Supuestos `⏳`:** todo lo no informado se resuelve con un supuesto explícito, nunca con
   una pregunta bloqueante. Solo se pregunta lo que impide construir (ver SKILL, Paso 1).
8. **Datos ficticios verosímiles** del país y rubro del cliente; nada real.

## Estructura del brief (fija)

```markdown
# POC Brief — {Producto} · {Cliente}
Versión POC: v1.0.0 · Fecha: {AAAA-MM-DD} · Estado: Pendiente de confirmación

## 1. Contexto
- Cliente / rubro / país:
- Producto y propuesta de valor (2–3 líneas):
- Objetivo de la demo (qué decisión busca habilitar):
- Audiencia de la demo:

## 2. Identidad visual
| Token | Hex | Origen (dado / derivado ⏳) |
Fuentes, tono de marca, logo (texto del monograma).

## 3. Roles y usuarios de prueba
| Rol | Permisos clave | Usuario | Contraseña |

## 4. Flujos principales
### FP-01 — {Nombre}
- Actor(es): · Disparador: · Resultado esperado:
- Pasos (happy path): 1… 2… 3…
- Variantes/errores a mostrar:
- Estados que recorre:
- Pantalla(s): `#/ruta`
(repetir por FP)

## 5. Máquina de estados
| Entidad | Estado origen | Acción | Estado destino | Rol | Regla |

## 6. Mapa de navegación
| Sección | Ítem de menú | Tipo (funcional / en construcción / externo) | Roles | FP |

## 7. Datos a mockear
| Colección | Campos clave | Volumen | Cobertura de estados |

## 8. Dashboard
KPIs (4), gráficos (2) y lista de pendientes, con la pregunta de negocio que responde cada uno.

## 9. Componente IA (si aplica)
| Capacidad | Entrada | Salida simulada | Explicación | Validación humana |

## 10. Escenarios de demo
| Escenario | Usuario | Ruta | Qué debe mostrar |

## 11. Supuestos ⏳ y fuera de alcance
- S-01 ⏳ …
- Fuera de alcance: integraciones reales, envío de emails, seguridad productiva, …
```

## Protocolo de confirmación (única pausa de negocio)

Presentar en el chat **un solo bloque** de máximo ~15 líneas: flujos principales (nombre +
resultado), roles/usuarios, cantidad de módulos en construcción, componente IA y los 3–5
supuestos `⏳` más relevantes, con la ruta del brief. Cerrar con: *"¿Confirmás para
construir, o ajustamos algo?"*. Con "ok/dale/confirmo" → Paso 3. Con cambios → editar solo
las secciones afectadas del brief y volver a preguntar en un bloque. Si el usuario pidió
expresamente "sin pausas", construir directo y dejar el brief como referencia.
