# Setup de una sola vez — GitHub Pages + Firebase (todo gratuito)

Leer solo en el Paso 1 cuando falte algún dato de infraestructura. Pasale al usuario la
sección §1 tal cual (o los puntos que falten) y esperá su respuesta.

## 1. Mensaje para el usuario

> Para publicar la POC necesito que prepares esto una sola vez (≈ 10 minutos, sin costo):
>
> **A. Repositorio en GitHub**
> 1. Creá un repositorio **público** vacío (ej. `cliente-producto-poc`) en tu cuenta.
> 2. Verificá que en esta PC podés hacer `git push` a ese repo (Git Credential Manager o
>    `git config` ya autenticado).
> 3. Pasame la URL: `https://github.com/<usuario>/<repo>`.
>
> **B. GitHub Pages** (podés hacerlo después del primer push, cuando el repo tenga archivos)
> 1. En el repo: **Settings → Pages**.
> 2. *Source*: **Deploy from a branch** · *Branch*: **main** · carpeta **/ (root)** · **Save**.
> 3. La URL pública será `https://<usuario>.github.io/<repo>/`.
>
> **C. Firebase** (plan Spark, gratis)
> 1. Entrá a <https://console.firebase.google.com> → **Agregar proyecto** (Google Analytics
>    no es necesario).
> 2. **Authentication → Comenzar → Sign-in method → Correo electrónico/contraseña →
>    Habilitar → Guardar**.
> 3. **Authentication → Settings → Dominios autorizados → Agregar dominio**:
>    `<usuario>.github.io`.
> 4. **Firestore Database → Crear base de datos** → modo **producción** → región cercana
>    (ej. `southamerica-east1`).
> 5. **Firestore → Reglas**: reemplazá el contenido por el siguiente y **Publicar**:
>    ```
>    rules_version = '2';
>    service cloud.firestore {
>      match /databases/{database}/documents {
>        match /{document=**} {
>          allow read, write: if request.auth != null;
>        }
>      }
>    }
>    ```
> 6. **Configuración del proyecto (⚙️) → Tus apps → Web (`</>`)** → registrá la app (sin
>    Hosting) y copiame el objeto `firebaseConfig` completo (`apiKey`, `authDomain`,
>    `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
>
> Si preferís arrancar sin Firebase, la POC funciona igual con datos locales en el navegador
> (cada persona ve sus propios cambios). Se puede conectar después sin rehacer nada.

## 2. Qué hace el agente con cada dato

| Dato | Uso |
|------|-----|
| URL del repo | Clona en `config.json → workspace_root/<repo>`; `deploy.repoUrl` del `poc-config.json` |
| Pages activo | Lo verifica `validate_poc.py --url` tras el push (si da 404, recordar el paso B) |
| `firebaseConfig` | Va a `poc-config.json → firebase`; `seed_firebase.py` crea usuarios y carga datos |

## 3. Notas de seguridad (contarlas solo si el usuario pregunta)

- El `firebaseConfig` web es **público por diseño** (viaja en el navegador de cualquier app
  Firebase); no es un secreto. La protección son las reglas (solo usuarios autenticados) y
  los dominios autorizados.
- GitHub puede enviar un aviso de *secret scanning* por la `apiKey`: es esperable; se puede
  marcar como "usado en tests/falso positivo". Opcional: en Google Cloud Console →
  APIs y servicios → Credenciales, restringir la clave a referrers `https://<usuario>.github.io/*`.
- Las contraseñas de los usuarios de prueba quedan visibles en el repo y en el manual: son
  ficticias y exclusivas de la POC. Nunca reutilizar contraseñas reales ni cargar datos reales.
- Nunca se piden ni guardan cuentas de servicio (`*-firebase-adminsdk.json`) ni tokens de GitHub.

## 4. Diagnóstico rápido

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| `seed_firebase.py`: `CONFIGURATION_NOT_FOUND` / `OPERATION_NOT_ALLOWED` | Email/Password no habilitado | Paso C.2 |
| `seed_firebase.py`: `PERMISSION_DENIED` | Reglas no publicadas | Paso C.5 |
| `seed_firebase.py`: `NOT_FOUND` | Firestore no creado | Paso C.4 |
| Login en Pages: "No pudimos validar..." y luego entra local | Dominio no autorizado | Paso C.3 |
| Chip "Datos locales" en la POC publicada | Firestore inaccesible o `firebase: null` | Revisar C.4–C.5 |
| `validate_poc.py --url` → 404 | Pages no activado o rama equivocada | Paso B |
| `git push` rechazado (auth) | Credenciales de Git en la PC | Paso A.2; nunca usar `--force` |
