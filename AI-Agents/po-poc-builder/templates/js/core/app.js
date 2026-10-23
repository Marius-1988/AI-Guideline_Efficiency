// Arranque de la POC: login, menú lateral por rol, router por hash, vistas en construcción,
// perfil y panel de demo. Las vistas de negocio viven en js/views/ y se registran solas.
import { POC_CONFIG as C } from '../poc-config.js';
import { db } from './data-service.js';
import * as auth from './auth.js';
import * as ui from './ui.js';
import { getView } from './registry.js';
import '../views/index.js';

const $ = sel => document.querySelector(sel);
const menu = C.menu || [];
const home = menu.find(m => m.view)?.id || 'perfil';
let cleanup = null;

function bindTexts() {
    const values = {
        appName: C.app.name, client: C.app.client, tagline: C.app.tagline || '',
        logoText: C.app.logoText || ui.initials(C.app.client), versionLabel: `POC ${C.app.version || 'v1.0.0'}`,
    };
    document.querySelectorAll('[data-bind]').forEach(el => { el.textContent = values[el.dataset.bind] ?? ''; });
}

function show(id) {
    ['#boot', '#login-screen', '#app-shell'].forEach(s => $(s).classList.toggle('hidden', s !== id));
    $('#demo-fab').classList.toggle('hidden', id !== '#app-shell');
}

// ---------- Login ----------

function renderDemoUsers() {
    const list = $('#demo-users-list');
    list.innerHTML = C.users.map((u, i) => {
        const role = C.roles.find(r => r.id === u.role);
        return `<li><button type="button" class="demo-user" data-i="${i}">
            <span class="avatar sm">${ui.esc(ui.initials(u.name))}</span>
            <span><strong>${ui.esc(u.name)}</strong><small>${ui.esc(role?.label || u.role)} · ${ui.esc(u.email)}</small></span>
            <i class="ph ph-arrow-right"></i></button></li>`;
    }).join('');
    list.addEventListener('click', e => {
        const b = e.target.closest('[data-i]');
        if (!b) return;
        const u = C.users[Number(b.dataset.i)];
        $('#login-email').value = u.email;
        $('#login-password').value = u.password;
        clearLoginErrors();
        $('#login-submit').focus();
    });
}

function clearLoginErrors() {
    document.querySelectorAll('#login-form .field-error').forEach(p => { p.textContent = ''; p.classList.add('hidden'); });
    document.querySelectorAll('#login-form .invalid').forEach(i => i.classList.remove('invalid'));
    $('#login-error').classList.add('hidden');
}

function showLoginError(err) {
    if (err.field) {
        const p = document.querySelector(`[data-error-for="${err.field}"]`);
        p.textContent = err.message;
        p.classList.remove('hidden');
        $(`#${err.field}`).classList.add('invalid');
        $(`#${err.field}`).focus();
    } else {
        $('#login-error').textContent = err.message;
        $('#login-error').classList.remove('hidden');
    }
}

async function doLogin(fn) {
    clearLoginErrors();
    const btn = $('#login-submit');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner sm"></span> Validando...';
    try {
        await fn();
        enterApp();
    } catch (err) {
        if (err instanceof auth.AuthError) showLoginError(err);
        else { console.error(err); showLoginError({ message: 'Ocurrió un error inesperado al ingresar. Intentá nuevamente.' }); }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Ingresar';
    }
}

function setupLogin() {
    renderDemoUsers();
    $('#login-form').addEventListener('submit', e => {
        e.preventDefault();
        doLogin(() => auth.login($('#login-email').value, $('#login-password').value));
    });
    $('#demo-login').addEventListener('click', () => doLogin(() => auth.demoLogin()));
    $('#forgot-password').addEventListener('click', () => ui.modal({
        title: 'Recuperar contraseña',
        body: `<p>Ingresá tu email y te enviaremos un enlace para restablecer la contraseña.</p>
            ${ui.formFields([{ name: 'email', label: 'Email', type: 'email', required: true, value: $('#login-email').value }])}
            <p class="muted small">En esta POC el envío de correo es simulado.</p>`,
        actions: [
            { label: 'Cancelar', variant: 'secondary' },
            {
                label: 'Enviar enlace', onClick: (close, root) => {
                    const data = ui.readForm(root);
                    if (!data) return false;
                    ui.toast(`Si ${data.email} está registrado, recibirá un enlace de recuperación (simulado).`, 'success');
                },
            },
        ],
    }));
    document.querySelectorAll('[data-toggle-password]').forEach(b => b.addEventListener('click', () => {
        const input = document.getElementById(b.dataset.togglePassword);
        input.type = input.type === 'password' ? 'text' : 'password';
        b.querySelector('i').className = `ph ${input.type === 'password' ? 'ph-eye' : 'ph-eye-slash'}`;
    }));
}

// ---------- Shell ----------

function renderNav() {
    const visible = menu.filter(m => auth.canSee(m));
    const groups = [];
    visible.forEach(m => {
        const name = m.section || '';
        let g = groups.find(x => x.name === name);
        if (!g) groups.push(g = { name, items: [] });
        g.items.push(m);
    });
    $('#nav').innerHTML = groups.map(g => `${g.name ? `<p class="nav-section">${ui.esc(g.name)}</p>` : ''}
        ${g.items.map(m => `<a href="${m.href ? ui.esc(m.href) : `#/${ui.esc(m.id)}`}" class="nav-item ${m.status === 'construction' ? 'nav-soon' : ''}"
            data-id="${ui.esc(m.id)}" ${m.href ? 'target="_blank" rel="noopener"' : ''}>
            <i class="ph ${ui.esc(m.icon || 'ph-circle')}"></i><span>${ui.esc(m.label)}</span>
            ${m.status === 'construction' ? '<span class="soon">Pronto</span>' : ''}${m.href ? '<i class="ph ph-arrow-square-out ext"></i>' : ''}</a>`).join('')}`).join('');
}

function renderUserChip() {
    const u = auth.currentUser();
    $('#user-name').textContent = u.name;
    $('#user-role').textContent = u.roleLabel;
    $('#user-avatar').textContent = ui.initials(u.name);
    renderModeChip();
}

function renderModeChip() {
    const chip = $('#data-mode-chip');
    const fire = db.mode === 'firebase';
    chip.className = `chip ${fire ? 'chip-success' : 'chip-neutral'}`;
    chip.innerHTML = `<i class="ph ${fire ? 'ph-cloud-check' : 'ph-database'}"></i> ${fire ? 'Datos en la nube' : 'Datos locales'}`;
    chip.title = fire ? 'Los cambios se guardan en Firebase y los ven todos los usuarios.' : 'Los cambios se guardan solo en este navegador.';
}

function enterApp() {
    renderNav();
    renderUserChip();
    show('#app-shell');
    if (!location.hash || location.hash === '#/' || location.hash === '#') location.hash = `#/${home}`;
    else route();
}

function setupShell() {
    $('#logout-btn').addEventListener('click', async () => {
        if (!(await ui.confirmDialog('¿Querés cerrar la sesión?', { title: 'Cerrar sesión', confirmLabel: 'Cerrar sesión' }))) return;
        await auth.logout();
        location.hash = '';
        show('#login-screen');
        ui.toast('Sesión cerrada correctamente.', 'success');
    });
    $('#user-chip').addEventListener('click', () => { location.hash = '#/perfil'; });
    $('#menu-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
    $('#nav').addEventListener('click', e => { if (e.target.closest('.nav-item')) $('#sidebar').classList.remove('open'); });
    $('#global-search').addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.value.trim()) ui.underConstruction('La búsqueda global');
    });
    $('#notif-btn').addEventListener('click', () => {
        const items = C.notifications || [];
        ui.modal({
            title: 'Notificaciones',
            body: items.length
                ? `<ul class="list">${items.map(n => `<li><i class="ph ph-bell-simple"></i><div><strong>${ui.esc(n.title)}</strong><p class="muted">${ui.esc(n.text || '')}</p></div></li>`).join('')}</ul>`
                : ui.emptyState('Sin notificaciones nuevas', 'Te avisaremos cuando haya novedades.', 'ph-bell-slash'),
        });
    });
    window.addEventListener('hashchange', route);
    db.onChange(change => {
        if (change.type === 'mode') {
            renderModeChip();
            ui.toast('No pudimos conectar con la base en la nube. La demo sigue funcionando con datos locales.', 'warning', 6000);
        }
    });
}

// ---------- Router ----------

function parseHash() {
    const [id = home, ...params] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    return { id: id || home, params };
}

function ctx(params) {
    return {
        db, ui, config: C, params, user: auth.currentUser(), can: auth.can,
        navigate: path => { location.hash = `#/${path}`; },
        refresh: () => route(),
    };
}

async function route() {
    if (!auth.currentUser()) return;
    cleanup?.();
    cleanup = null;
    const { id, params } = parseHash();
    // Contenedor nuevo por navegación: un render lento anterior escribe en un nodo desconectado.
    const el = document.createElement('div');
    $('#view').replaceChildren(el);
    const item = menu.find(m => m.id === id);
    document.querySelectorAll('.nav-item').forEach(a => a.classList.toggle('active', a.dataset.id === id));

    if (id === 'perfil') return renderProfile(el);
    if (!item) return renderNotFound(el);
    if (!auth.canSee(item)) return renderForbidden(el, item);
    $('#page-title').textContent = item.label;
    document.title = `${item.label} | ${C.app.name}`;
    if (item.status === 'construction') return renderConstruction(el, item);

    const view = getView(item.view || item.id);
    if (!view) return renderConstruction(el, item);
    ui.loading(el);
    try {
        const result = await view.render(el, ctx(params));
        if (typeof result === 'function') {
            if (el.isConnected) cleanup = result; else result();
        }
        if (el.isConnected) $('#view').focus({ preventScroll: true });
    } catch (err) {
        console.error(err);
        ui.errorState(el, err.message || 'Error inesperado.', () => route());
    }
}

function renderConstruction(el, item) {
    const upcoming = item.upcoming || [];
    el.innerHTML = `<div class="construction card">
        <div class="construction-icon"><i class="ph ${ui.esc(item.icon || 'ph-hammer')}"></i></div>
        <span class="badge badge-warning"><i class="ph ph-hammer"></i> En construcción</span>
        <h2>${ui.esc(item.label)}</h2>
        <p class="muted">${ui.esc(item.description || 'Estamos trabajando en esta sección. Estará disponible en la próxima versión del producto.')}</p>
        ${upcoming.length ? `<div class="upcoming"><p class="eyebrow">Lo que vas a poder hacer</p><ul>
            ${upcoming.map(u => `<li><i class="ph ph-check-circle"></i>${ui.esc(u)}</li>`).join('')}</ul></div>` : ''}
        <div class="row gap center"><a class="btn btn-primary" href="#/${ui.esc(home)}"><i class="ph ph-house"></i> Volver al inicio</a>
        <button class="btn btn-secondary" data-notify><i class="ph ph-bell"></i> Avisarme cuando esté lista</button></div>
    </div>`;
    el.querySelector('[data-notify]').addEventListener('click', () => ui.toast(`Te avisaremos cuando "${item.label}" esté disponible.`, 'success'));
}

function renderNotFound(el) {
    $('#page-title').textContent = 'Página no encontrada';
    el.innerHTML = `<div class="card">${ui.emptyState('No encontramos esta página', 'Revisá el enlace o volvé al inicio.', 'ph-compass')}
        <div class="row center"><a class="btn btn-primary" href="#/${ui.esc(home)}">Ir al inicio</a></div></div>`;
}

function renderForbidden(el, item) {
    $('#page-title').textContent = item.label;
    el.innerHTML = `<div class="card">${ui.emptyState('No tenés permisos para esta sección', `Tu rol (${auth.currentUser().roleLabel}) no tiene acceso. Si lo necesitás, pedilo al administrador.`, 'ph-lock')}</div>`;
}

function renderProfile(el) {
    const u = auth.currentUser();
    $('#page-title').textContent = 'Mi perfil';
    const role = C.roles.find(r => r.id === u.role);
    el.innerHTML = `${ui.pageHeader('Mi perfil', 'Datos de tu cuenta y permisos asignados')}
        <div class="grid cols-2">
          <article class="card profile">
            <div class="avatar lg">${ui.esc(ui.initials(u.name))}</div>
            <h3>${ui.esc(u.name)}</h3><p class="muted">${ui.esc(u.title)}</p>
            <dl class="dl"><dt>Email</dt><dd>${ui.esc(u.email)}</dd><dt>Rol</dt><dd>${ui.badge(u.roleLabel, 'primary')}</dd>
            <dt>Organización</dt><dd>${ui.esc(C.app.client)}</dd><dt>Origen de datos</dt><dd>${db.mode === 'firebase' ? 'Firebase (nube)' : 'Local (navegador)'}</dd></dl>
            <button class="btn btn-secondary" data-pwd><i class="ph ph-key"></i> Cambiar contraseña</button>
          </article>
          <article class="card"><h3>Permisos del rol</h3><p class="muted">${ui.esc(role?.description || '')}</p>
            <div class="chips">${(u.permissions.includes('*') ? ['Acceso total'] : u.permissions).map(p => ui.badge(p, 'info')).join(' ')}</div>
            <h3 class="mt">Secciones habilitadas</h3>
            <ul class="list compact">${menu.filter(m => auth.canSee(m) && !m.href).map(m => `<li><i class="ph ${ui.esc(m.icon)}"></i>${ui.esc(m.label)}
              ${m.status === 'construction' ? ui.badge('En construcción', 'warning') : ''}</li>`).join('')}</ul></article>
        </div>`;
    el.querySelector('[data-pwd]').addEventListener('click', () => ui.underConstruction('El cambio de contraseña'));
}

// ---------- Panel de demo ----------

function setupDemoDrawer() {
    const drawer = $('#demo-drawer');
    const scenarios = C.demo?.scenarios || [];
    $('#demo-fab').addEventListener('click', () => {
        drawer.innerHTML = `<header class="drawer-head"><div><p class="eyebrow">Panel de demo</p><h3>${ui.esc(C.app.name)}</h3></div>
            <button class="btn-icon" data-close aria-label="Cerrar"><i class="ph ph-x"></i></button></header>
            <div class="drawer-body">
              ${scenarios.length ? `<p class="eyebrow">Escenarios guiados</p><div class="stack">
                ${scenarios.map((s, i) => `<button class="scenario" data-s="${i}"><strong>${ui.esc(s.label)}</strong><small>${ui.esc(s.description || '')}</small></button>`).join('')}</div>` : ''}
              <p class="eyebrow mt">Cambiar de usuario</p><div class="stack">
                ${C.users.map((u, i) => `<button class="scenario" data-u="${i}"><strong>${ui.esc(u.name)}</strong>
                  <small>${ui.esc(C.roles.find(r => r.id === u.role)?.label || u.role)} · ${ui.esc(u.email)}</small></button>`).join('')}</div>
              <p class="eyebrow mt">Datos</p>
              <button class="btn btn-secondary w-100" data-reset><i class="ph ph-arrow-counter-clockwise"></i> Restablecer datos de demo</button>
              ${C.app.docsUrl ? `<a class="btn btn-ghost w-100" href="${ui.esc(C.app.docsUrl)}" target="_blank" rel="noopener"><i class="ph ph-book-open"></i> Manual de uso</a>` : ''}
              <p class="muted small mt">POC ${ui.esc(C.app.version || '')} · ${db.mode === 'firebase' ? 'Firebase' : 'datos locales'} · datos ficticios</p>
            </div>`;
        drawer.classList.remove('hidden');
    });
    drawer.addEventListener('click', async e => {
        if (e.target.closest('[data-close]')) return drawer.classList.add('hidden');
        const s = e.target.closest('[data-s]');
        if (s) {
            const sc = scenarios[Number(s.dataset.s)];
            drawer.classList.add('hidden');
            if (sc.user) await switchUser(C.users.find(u => u.email === sc.user), false);
            if (location.hash === `#/${sc.route}`) route();
            else location.hash = `#/${sc.route}`;
            if (sc.hint) ui.toast(sc.hint, 'info', 6000);
            return;
        }
        const u = e.target.closest('[data-u]');
        if (u) {
            drawer.classList.add('hidden');
            return switchUser(C.users[Number(u.dataset.u)]);
        }
        if (e.target.closest('[data-reset]')) {
            if (!(await ui.confirmDialog('Se descartarán los cambios hechos durante la demo y se recargarán los datos iniciales.', { title: 'Restablecer datos', confirmLabel: 'Restablecer', variant: 'danger' }))) return;
            try {
                await db.reset();
                drawer.classList.add('hidden');
                ui.toast('Datos de demo restablecidos.', 'success');
                route();
            } catch (err) {
                ui.toast(`No se pudieron restablecer los datos: ${err.message}`, 'danger');
            }
        }
    });
}

async function switchUser(user, rerender = true) {
    if (!user) return;
    try {
        await auth.logout();
        await auth.login(user.email, user.password);
        renderNav();
        renderUserChip();
        ui.toast(`Ahora estás como ${user.name}.`, 'success');
        if (rerender) route();
    } catch (err) {
        ui.toast(err.message, 'danger');
        show('#login-screen');
    }
}

// ---------- Boot ----------

window.addEventListener('unhandledrejection', e => {
    console.error(e.reason);
    ui.toast('Ocurrió un error inesperado. Si persiste, recargá la página.', 'danger');
});

async function boot() {
    bindTexts();
    setupLogin();
    setupShell();
    setupDemoDrawer();
    try {
        await db.init();
    } catch (err) {
        console.error(err);
        $('#boot').innerHTML = `<div class="empty empty-error"><i class="ph ph-warning-circle"></i><h3>No pudimos iniciar la aplicación</h3>
            <p>${ui.esc(err.message)}</p><button class="btn btn-primary" onclick="location.reload()">Reintentar</button></div>`;
        return;
    }
    const session = await auth.restoreSession();
    if (session) enterApp();
    else show('#login-screen');
}

boot();
