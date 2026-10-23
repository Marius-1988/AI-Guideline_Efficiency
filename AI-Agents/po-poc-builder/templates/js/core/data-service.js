// Capa de datos: Firestore si hay configuración de Firebase válida; si no (o si falla), datos
// locales en localStorage sembrados desde data/seed.json. Las vistas solo usan esta API.
import { POC_CONFIG } from '../poc-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const PREFIX = `poc:${POC_CONFIG.slug}:`;
const FALLBACK_CODES = ['permission-denied', 'unavailable', 'failed-precondition', 'not-found', 'unauthenticated'];
const REMOTE_TIMEOUT_MS = 8000;

let mode = 'local';
let fb = null;
let seed = null;
let fallbackNotified = false;
const listeners = new Set();

async function loadSeed() {
    if (seed) return seed;
    const res = await fetch('data/seed.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar data/seed.json');
    seed = await res.json();
    seed.collections ??= {};
    return seed;
}

function localKey(col) { return PREFIX + col; }

function localRead(col) {
    const raw = localStorage.getItem(localKey(col));
    if (raw) {
        try { return JSON.parse(raw); } catch { /* semilla corrupta: se regenera abajo */ }
    }
    const rows = structuredClone(seed?.collections?.[col] || []);
    localStorage.setItem(localKey(col), JSON.stringify(rows));
    return rows;
}

function localWrite(col, rows) {
    localStorage.setItem(localKey(col), JSON.stringify(rows));
}

function genId(col) {
    const tag = col.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase() || 'DOC';
    return `${tag}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
}

function emit(change) {
    listeners.forEach(fn => { try { fn(change); } catch (e) { console.error(e); } });
}

function switchToLocal(reason) {
    if (mode === 'local') return;
    console.warn('[POC] Firebase no disponible, se usan datos locales:', reason);
    mode = 'local';
    if (!fallbackNotified) {
        fallbackNotified = true;
        emit({ type: 'mode', mode, reason: String(reason) });
    }
}

function timeout(ms) {
    return new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('Tiempo de espera agotado'), { code: 'unavailable' })), ms));
}

async function withFallback(remoteOp, localOp) {
    if (mode !== 'firebase') return localOp();
    try {
        return await Promise.race([remoteOp(), timeout(REMOTE_TIMEOUT_MS)]);
    } catch (err) {
        const code = String(err?.code || '').replace('firestore/', '');
        if (!FALLBACK_CODES.includes(code)) throw err;
        switchToLocal(code);
        return localOp();
    }
}

const local = {
    list: col => localRead(col),
    get: (col, id) => localRead(col).find(r => String(r.id) === String(id)) || null,
    set(col, id, data) {
        const rows = localRead(col);
        const i = rows.findIndex(r => String(r.id) === String(id));
        const doc = { ...data, id };
        if (i >= 0) rows[i] = doc; else rows.unshift(doc);
        localWrite(col, rows);
        return doc;
    },
    update(col, id, patch) {
        const rows = localRead(col);
        const i = rows.findIndex(r => String(r.id) === String(id));
        if (i < 0) throw new Error(`No existe el registro ${id}`);
        rows[i] = { ...rows[i], ...patch, id: rows[i].id };
        localWrite(col, rows);
        return rows[i];
    },
    remove(col, id) {
        localWrite(col, localRead(col).filter(r => String(r.id) !== String(id)));
    },
};

function stripId(data) {
    const { id, ...rest } = data;
    return rest;
}

export const db = {
    get mode() { return mode; },
    get firebase() { return fb; },

    async init() {
        await loadSeed();
        const cfg = POC_CONFIG.firebase;
        if (cfg?.apiKey && cfg?.projectId) {
            try {
                const [appMod, authMod, fsMod] = await Promise.all([
                    import(`${SDK}firebase-app.js`),
                    import(`${SDK}firebase-auth.js`),
                    import(`${SDK}firebase-firestore.js`),
                ]);
                const app = appMod.initializeApp(cfg);
                fb = { auth: authMod.getAuth(app), authMod, fs: fsMod.getFirestore(app), fsMod };
                mode = 'firebase';
            } catch (err) {
                console.warn('[POC] No se pudo inicializar Firebase, se usan datos locales:', err);
                mode = 'local';
            }
        }
        return mode;
    },

    /** Fuerza modo local (ej. Firebase Auth no configurado: sin sesión, Firestore rechazaría todo). */
    useLocal(reason) { switchToLocal(reason); },

    /** Suscribirse a cambios (type: 'change' | 'mode'). Devuelve función para desuscribir. */
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    seedCollections() { return Object.keys(seed?.collections || {}); },

    async list(col) {
        return withFallback(async () => {
            const { collection, getDocs } = fb.fsMod;
            const snap = await getDocs(collection(fb.fs, col));
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }, () => local.list(col));
    },

    async get(col, id) {
        return withFallback(async () => {
            const { doc, getDoc } = fb.fsMod;
            const snap = await getDoc(doc(fb.fs, col, String(id)));
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        }, () => local.get(col, id));
    },

    async add(col, data) {
        const id = String(data.id || genId(col));
        const result = await withFallback(async () => {
            const { doc, setDoc } = fb.fsMod;
            await setDoc(doc(fb.fs, col, id), stripId(data));
            return { ...data, id };
        }, () => local.set(col, id, data));
        emit({ type: 'change', col, id, action: 'add' });
        return result;
    },

    async update(col, id, patch) {
        const result = await withFallback(async () => {
            const { doc, setDoc, getDoc } = fb.fsMod;
            const ref = doc(fb.fs, col, String(id));
            await setDoc(ref, stripId(patch), { merge: true });
            const snap = await getDoc(ref);
            return { id: snap.id, ...snap.data() };
        }, () => local.update(col, id, patch));
        emit({ type: 'change', col, id, action: 'update' });
        return result;
    },

    async remove(col, id) {
        await withFallback(async () => {
            const { doc, deleteDoc } = fb.fsMod;
            await deleteDoc(doc(fb.fs, col, String(id)));
        }, () => local.remove(col, id));
        emit({ type: 'change', col, id, action: 'remove' });
    },

    /** Registro de auditoría simple: útil para mostrar trazabilidad en flujos con aprobaciones o IA. */
    async log(action, detail = {}, user = null) {
        return this.add('auditoria', {
            fecha: new Date().toISOString(), accion: action,
            usuario: user?.email || 'sistema', ...detail,
        });
    },

    /** Restablece los datos de la demo a la semilla original. */
    async reset() {
        const cols = Object.keys(seed.collections);
        Object.keys(localStorage).filter(k => k.startsWith(PREFIX) && !k.endsWith(':session'))
            .forEach(k => localStorage.removeItem(k));
        if (mode === 'firebase') {
            await withFallback(async () => {
                const { collection, getDocs, writeBatch, doc } = fb.fsMod;
                for (const col of [...cols, 'auditoria']) {
                    const existing = await getDocs(collection(fb.fs, col));
                    const seedRows = seed.collections[col] || [];
                    const keep = new Set(seedRows.map(r => String(r.id)));
                    const ops = [
                        ...existing.docs.filter(d => !keep.has(d.id)).map(d => b => b.delete(d.ref)),
                        ...seedRows.map(r => b => b.set(doc(fb.fs, col, String(r.id)), stripId(r))),
                    ];
                    for (let i = 0; i < ops.length; i += 400) {
                        const batch = writeBatch(fb.fs);
                        ops.slice(i, i + 400).forEach(op => op(batch));
                        await batch.commit();
                    }
                }
            }, () => null);
        }
        emit({ type: 'change', col: '*', action: 'reset' });
    },
};
