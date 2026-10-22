# Cómo asegurar que el tablero está en el equipo del MCP de Miro

El MCP de Miro queda autorizado para **un solo equipo** de Miro: el que elegiste al
conectarlo. Solo ve los tableros de ese equipo; invitarlo con un link no alcanza.
El síntoma de un equipo distinto es la respuesta **«Board access denied»**.

## Verificar

1. Abrí el tablero en el navegador y copiá la URL: `https://miro.com/app/board/<id>/`.
2. En Miro, arriba a la izquierda, mirá a qué **equipo** pertenece el tablero.
3. Pedile al agente que pruebe el acceso: si responde sin «Board access denied», está OK.

## Si el equipo no coincide (elegí una opción)

**A. Reconectar el MCP al equipo correcto (recomendado)**

1. En Cursor: *Settings → MCP / Integrations → Miro* → desconectar (o «Logout»).
2. Volver a conectar: se abre la autorización de Miro.
3. En la pantalla de Miro, **elegir el equipo** donde está (o va a estar) el tablero
   y aceptar.
4. Pedile al agente que reintente.

**B. Mover el tablero al equipo del MCP**

1. En el tablero: menú del nombre → *Move to* / *Mover a* → elegir el equipo que tiene
   autorizado el MCP.
2. Pasale al agente la URL nueva si cambió.

**C. Tablero nuevo**

Si el agente lo crea, queda directamente en el equipo del MCP. Compartilo después con
quien lo necesite desde *Share*.

## Errores frecuentes

| Mensaje | Causa | Acción |
|---|---|---|
| «Board access denied» | Tablero en otro equipo | Opción A o B |
| Link `miro.com/welcomeonboard/…` | Es una invitación, no trae el id | Pasar la URL `miro.com/app/board/<id>/` |
| «The server is temporarily unavailable» | Caída transitoria de Miro | Reintentar en unos minutos o crear el tablero a mano y pasar la URL |
