// Autenticación de la POC. Con Firebase valida la contraseña contra Firebase Auth; el rol y el
// perfil salen siempre de POC_CONFIG.users (fuente única de usuarios de prueba).
import { POC_CONFIG } from '../poc-config.js';
import { db } from './data-service.js';

const SESSION_KEY = `poc:${POC_CONFIG.slug}:session`;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30000;
const FALLBACK_AUTH_CODES = [
    'auth/configuration-not-found', 'auth/operation-not-allowed', 'auth/api-key-not-valid',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.', 'auth/invalid-api-key', 'auth/unauthorized-domain',
];

let current = null;
let attempts = 0;
let lockedUntil = 0;

export class AuthError extends Error {
    constructor(message, field = null) { super(message); this.field = field; }
}

function roleOf(id) {
    return POC_CONFIG.roles.find(r => r.id === id) || null;
}

function profileFor(email) {
    const u = POC_CONFIG.users.find(x => x.email.toLowerCase() === String(email).toLowerCase());
    if (!u) return null;
    const role = roleOf(u.role);
    return {
        email: u.email, name: u.name, role: u.role, roleLabel: role?.label || u.role,
        title: u.title || role?.label || '', permissions: role?.permissions || [],
    };
}

function remember(profile, via) {
    current = { ...profile, via };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: profile.email, via }));
    return current;
}

function friendlyFirebaseError(code) {
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-login-credentials':
            return 'Usuario o contraseña incorrectos. Revisá los datos e intentá nuevamente.';
        case 'auth/invalid-email':
            return 'El email no tiene un formato válido.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos fallidos. Esperá unos minutos antes de volver a intentar.';
        case 'auth/network-request-failed':
            return 'No hay conexión. Verificá tu red e intentá nuevamente.';
        case 'auth/user-disabled':
            return 'El usuario está deshabilitado. Contactá al administrador.';
        default:
            return 'No pudimos validar tus credenciales en este momento. Intentá nuevamente.';
    }
}

export function currentUser() { return current; }

export function can(permission) {
    if (!current) return false;
    return current.permissions.includes('*') || current.permissions.includes(permission);
}

export function canSee(item) {
    if (!current) return false;
    if (!item.roles || item.roles.includes('*')) return true;
    return item.roles.includes(current.role) || current.permissions.includes('*');
}

export async function login(email, password) {
    email = String(email || '').trim();
    if (Date.now() < lockedUntil) {
        const s = Math.ceil((lockedUntil - Date.now()) / 1000);
        throw new AuthError(`Por seguridad, el ingreso está bloqueado temporalmente. Reintentá en ${s} segundos.`);
    }
    if (!email) throw new AuthError('Ingresá tu usuario (email).', 'login-email');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new AuthError('El email no tiene un formato válido.', 'login-email');
    if (!password) throw new AuthError('Ingresá tu contraseña.', 'login-password');

    const profile = profileFor(email);

    if (db.mode === 'firebase') {
        try {
            const { signInWithEmailAndPassword } = db.firebase.authMod;
            await signInWithEmailAndPassword(db.firebase.auth, email, password);
            if (!profile) throw new AuthError('Tu usuario no tiene un perfil asignado en esta POC. Contactá al administrador.');
            attempts = 0;
            return remember(profile, 'firebase');
        } catch (err) {
            if (err instanceof AuthError) throw err;
            if (!FALLBACK_AUTH_CODES.includes(err.code)) {
                registerFailure();
                throw new AuthError(friendlyFirebaseError(err.code));
            }
            db.useLocal(err.code);
        }
    }

    const user = POC_CONFIG.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password || !profile) {
        registerFailure();
        throw new AuthError('Usuario o contraseña incorrectos. Revisá los datos e intentá nuevamente.');
    }
    attempts = 0;
    return remember(profile, 'local');
}

function registerFailure() {
    attempts += 1;
    if (attempts >= MAX_ATTEMPTS) {
        attempts = 0;
        lockedUntil = Date.now() + LOCK_MS;
    }
}

export function demoUser() {
    return POC_CONFIG.users.find(u => roleOf(u.role)?.permissions.includes('*')) || POC_CONFIG.users[0];
}

export async function demoLogin() {
    const u = demoUser();
    return login(u.email, u.password);
}

export async function restoreSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
        const { email, via } = JSON.parse(raw);
        const profile = profileFor(email);
        if (!profile) return null;
        if (via === 'firebase' && db.mode === 'firebase') {
            await db.firebase.auth.authStateReady();
            if (!db.firebase.auth.currentUser) return null;
        }
        if (via === 'local' && db.mode === 'firebase') db.useLocal('sesión local');
        current = { ...profile, via };
        return current;
    } catch {
        return null;
    }
}

export async function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    current = null;
    if (db.mode === 'firebase' && db.firebase?.auth?.currentUser) {
        try { await db.firebase.authMod.signOut(db.firebase.auth); } catch { /* sesión ya cerrada */ }
    }
}
