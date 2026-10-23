// Ayudantes de UI compartidos por todas las vistas. Sin dependencias salvo Chart.js (CDN).
import { POC_CONFIG } from '../poc-config.js';

const LOCALE = POC_CONFIG.app?.locale || 'es-AR';
const CURRENCY = POC_CONFIG.app?.currency || 'USD';

export function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function formatMoney(n, currency = CURRENCY) {
    const num = Number(n || 0);
    try {
        return new Intl.NumberFormat(LOCALE, { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
    } catch {
        return `${currency} ${num.toLocaleString(LOCALE)}`;
    }
}

export function formatNumber(n, digits = 0) {
    return Number(n || 0).toLocaleString(LOCALE, { maximumFractionDigits: digits });
}

export function formatDate(value, withTime = false) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return esc(value);
    return d.toLocaleDateString(LOCALE, withTime
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function nowIso() {
    return new Date().toISOString();
}

/** Encabezado de página. actions: HTML de botones. */
export function pageHeader(title, subtitle = '', actions = '') {
    return `<div class="page-head"><div><h2>${esc(title)}</h2>${subtitle ? `<p class="muted">${esc(subtitle)}</p>` : ''}</div>
        <div class="page-actions">${actions}</div></div>`;
}

export const TONES = ['neutral', 'info', 'success', 'warning', 'danger', 'primary'];

export function badge(text, tone = 'neutral') {
    return `<span class="badge badge-${TONES.includes(tone) ? tone : 'neutral'}">${esc(text)}</span>`;
}

export function kpiCard({ label, value, delta, icon = 'ph-chart-line-up', tone = 'primary', hint }) {
    const deltaHtml = delta === undefined || delta === null ? '' :
        `<span class="kpi-delta ${String(delta).startsWith('-') ? 'down' : 'up'}">${esc(delta)}</span>`;
    return `<article class="card kpi kpi-${tone}">
        <div class="kpi-icon"><i class="ph ${esc(icon)}"></i></div>
        <div class="kpi-body"><p class="kpi-label">${esc(label)}</p>
        <p class="kpi-value">${esc(value)} ${deltaHtml}</p>${hint ? `<p class="kpi-hint">${esc(hint)}</p>` : ''}</div>
    </article>`;
}

export function emptyState(title, text = '', icon = 'ph-tray') {
    return `<div class="empty"><i class="ph ${esc(icon)}"></i><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
}

export function loading(el, text = 'Cargando...') {
    el.innerHTML = `<div class="loading"><div class="spinner"></div><p>${esc(text)}</p></div>`;
}

export function errorState(el, message, onRetry) {
    el.innerHTML = `<div class="empty empty-error"><i class="ph ph-warning-circle"></i>
        <h3>No pudimos cargar esta sección</h3><p>${esc(message)}</p>
        ${onRetry ? '<button class="btn btn-primary" data-retry>Reintentar</button>' : ''}</div>`;
    el.querySelector('[data-retry]')?.addEventListener('click', onRetry);
}

/**
 * Tabla con búsqueda, filtro opcional y paginación.
 * columns: [{ key, label, render?(row), align? }]
 */
export function dataTable(el, { columns, rows, pageSize = 10, searchKeys, filters = [], empty = 'Sin resultados', onRowClick, toolbar = '' }) {
    let page = 1;
    let query = '';
    const active = {};
    const keys = searchKeys || columns.map(c => c.key);

    el.innerHTML = `<div class="table-toolbar">
        <div class="search inline"><i class="ph ph-magnifying-glass"></i><input type="search" placeholder="Buscar..." data-q></div>
        ${filters.map(f => `<select class="select" data-filter="${esc(f.key)}">
            <option value="">${esc(f.label)}: todos</option>
            ${f.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`).join('')}
        <div class="toolbar-extra">${toolbar}</div></div>
        <div class="table-wrap"><table class="table"><thead><tr>
        ${columns.map(c => `<th class="${c.align === 'right' ? 'right' : ''}">${esc(c.label)}</th>`).join('')}
        </tr></thead><tbody></tbody></table></div><div class="pagination"></div>`;

    const tbody = el.querySelector('tbody');
    const pager = el.querySelector('.pagination');

    function filtered() {
        const q = query.toLowerCase();
        return rows.filter(r => (!q || keys.some(k => String(r[k] ?? '').toLowerCase().includes(q)))
            && Object.entries(active).every(([k, v]) => !v || String(r[k]) === v));
    }

    function draw() {
        const list = filtered();
        const pages = Math.max(1, Math.ceil(list.length / pageSize));
        page = Math.min(page, pages);
        const slice = list.slice((page - 1) * pageSize, page * pageSize);
        tbody.innerHTML = slice.length ? slice.map((r, i) => `<tr data-i="${(page - 1) * pageSize + i}" class="${onRowClick ? 'clickable' : ''}">
            ${columns.map(c => `<td class="${c.align === 'right' ? 'right' : ''}">${c.render ? c.render(r) : esc(r[c.key])}</td>`).join('')}</tr>`).join('')
            : `<tr><td colspan="${columns.length}">${emptyState(empty)}</td></tr>`;
        pager.innerHTML = `<span>${list.length} registro(s)</span>
            <button class="btn-icon" data-p="-1" ${page <= 1 ? 'disabled' : ''} aria-label="Página anterior"><i class="ph ph-caret-left"></i></button>
            <span>${page} / ${pages}</span>
            <button class="btn-icon" data-p="1" ${page >= pages ? 'disabled' : ''} aria-label="Página siguiente"><i class="ph ph-caret-right"></i></button>`;
        if (onRowClick) {
            tbody.querySelectorAll('tr[data-i]').forEach(tr => tr.addEventListener('click', e => {
                if (e.target.closest('button, a, input, select')) return;
                onRowClick(list[Number(tr.dataset.i)]);
            }));
        }
    }

    el.querySelector('[data-q]').addEventListener('input', e => { query = e.target.value; page = 1; draw(); });
    el.querySelectorAll('[data-filter]').forEach(s => s.addEventListener('change', e => { active[s.dataset.filter] = e.target.value; page = 1; draw(); }));
    pager.addEventListener('click', e => {
        const b = e.target.closest('[data-p]');
        if (b) { page += Number(b.dataset.p); draw(); }
    });
    draw();
    return { update(newRows) { rows = newRows; draw(); } };
}

export function toast(message, type = 'info', ms = 3800) {
    const root = document.getElementById('toast-root');
    const icons = { info: 'ph-info', success: 'ph-check-circle', warning: 'ph-warning', danger: 'ph-x-circle' };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    t.innerHTML = `<i class="ph ${icons[type] || icons.info}"></i><span>${esc(message)}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
}

export function underConstruction(feature = 'Esta funcionalidad') {
    toast(`${feature} está en construcción para esta POC.`, 'info');
}

/**
 * Modal genérico. body: string HTML. actions: [{ label, variant, onClick(close, root) -> false para no cerrar }]
 */
export function modal({ title, body, actions = [{ label: 'Cerrar', variant: 'secondary' }], size = 'md', onOpen }) {
    const root = document.getElementById('modal-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `<div class="modal modal-${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <header class="modal-head"><h3>${esc(title)}</h3><button class="btn-icon" data-close aria-label="Cerrar"><i class="ph ph-x"></i></button></header>
        <div class="modal-body">${body}</div>
        <footer class="modal-foot">${actions.map((a, i) => `<button class="btn btn-${a.variant || 'primary'}" data-action="${i}">${esc(a.label)}</button>`).join('')}</footer>
    </div>`;
    const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    wrap.addEventListener('click', async e => {
        if (e.target === wrap || e.target.closest('[data-close]')) return close();
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = actions[Number(btn.dataset.action)];
        if (!action.onClick) return close();
        btn.disabled = true;
        try {
            const result = await action.onClick(close, wrap);
            if (result !== false) close();
        } catch (err) {
            toast(err.message || 'No se pudo completar la acción.', 'danger');
        } finally {
            btn.disabled = false;
        }
    });
    document.addEventListener('keydown', onKey);
    root.appendChild(wrap);
    wrap.querySelector('input, select, textarea, button.btn-primary')?.focus();
    onOpen?.(wrap);
    return close;
}

export function confirmDialog(message, { title = 'Confirmar acción', confirmLabel = 'Confirmar', variant = 'primary' } = {}) {
    return new Promise(resolve => {
        modal({
            title, body: `<p>${esc(message)}</p>`,
            actions: [
                { label: 'Cancelar', variant: 'secondary', onClick: () => resolve(false) },
                { label: confirmLabel, variant, onClick: () => resolve(true) },
            ],
        });
    });
}

/**
 * Formularios: fields [{ name, label, type, options?, required?, placeholder?, value?, min?, max?, pattern?, help? }]
 */
export function formFields(fields) {
    return fields.map(f => {
        const req = f.required ? 'required' : '';
        const val = f.value ?? '';
        let input;
        if (f.type === 'select') {
            input = `<select class="select" name="${esc(f.name)}" id="f-${esc(f.name)}" ${req}>
                <option value="">Seleccioná...</option>
                ${(f.options || []).map(o => {
                    const v = typeof o === 'object' ? o.value : o;
                    const l = typeof o === 'object' ? o.label : o;
                    return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`;
                }).join('')}</select>`;
        } else if (f.type === 'textarea') {
            input = `<textarea class="input" name="${esc(f.name)}" id="f-${esc(f.name)}" rows="3" ${req} placeholder="${esc(f.placeholder || '')}">${esc(val)}</textarea>`;
        } else {
            input = `<input class="input" type="${esc(f.type || 'text')}" name="${esc(f.name)}" id="f-${esc(f.name)}" value="${esc(val)}" ${req}
                ${f.min !== undefined ? `min="${esc(f.min)}"` : ''} ${f.max !== undefined ? `max="${esc(f.max)}"` : ''}
                ${f.pattern ? `pattern="${esc(f.pattern)}"` : ''} placeholder="${esc(f.placeholder || '')}">`;
        }
        return `<div class="field"><label for="f-${esc(f.name)}">${esc(f.label)}${f.required ? ' *' : ''}</label>${input}
            ${f.help ? `<small class="muted">${esc(f.help)}</small>` : ''}<p class="field-error hidden"></p></div>`;
    }).join('');
}

/** Valida con la API nativa del navegador y muestra mensajes en español. Devuelve los datos o null. */
export function readForm(root) {
    let ok = true;
    const data = {};
    root.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
        const err = input.closest('.field')?.querySelector('.field-error');
        let msg = '';
        const v = input.validity;
        if (v.valueMissing) msg = 'Este campo es obligatorio.';
        else if (v.typeMismatch) msg = 'El formato no es válido.';
        else if (v.rangeUnderflow) msg = `El valor mínimo es ${input.min}.`;
        else if (v.rangeOverflow) msg = `El valor máximo es ${input.max}.`;
        else if (v.patternMismatch) msg = 'El formato no es válido.';
        input.classList.toggle('invalid', !!msg);
        if (err) { err.textContent = msg; err.classList.toggle('hidden', !msg); }
        if (msg) ok = false;
        data[input.name] = input.type === 'number' ? (input.value === '' ? null : Number(input.value)) : input.value.trim();
    });
    if (!ok) root.querySelector('.invalid')?.focus();
    return ok ? data : null;
}

export function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function chartColors() {
    return ['--c-primary', '--c-secondary', '--c-accent', '--c-success', '--c-warning', '--c-danger', '--c-info'].map(cssVar);
}

/** Crea un gráfico Chart.js con la paleta del cliente. Devuelve la instancia (o null si Chart.js no cargó). */
export function chart(canvas, config) {
    if (!window.Chart) {
        canvas.replaceWith(Object.assign(document.createElement('p'), { className: 'muted', textContent: 'Gráfico no disponible sin conexión.' }));
        return null;
    }
    const colors = chartColors();
    (config.data?.datasets || []).forEach((ds, i) => {
        const multi = ['pie', 'doughnut', 'polarArea'].includes(config.type);
        ds.backgroundColor ??= multi ? colors : colors[i % colors.length];
        ds.borderColor ??= multi ? '#fff' : colors[i % colors.length];
        ds.borderWidth ??= multi ? 2 : 2;
        if (config.type === 'line') { ds.tension ??= 0.35; ds.fill ??= false; }
    });
    window.Chart.defaults.font.family = cssVar('--font-body') || 'sans-serif';
    return new window.Chart(canvas, {
        ...config,
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, ...(config.options || {}) },
    });
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Latencia simulada para dar realismo a procesos (IA, validaciones, integraciones). */
export function fakeLatency(min = 600, max = 1400) {
    return sleep(min + Math.random() * (max - min));
}

/** Efecto de texto en streaming, útil para simular respuestas de un asistente de IA. */
export async function streamText(el, text, cps = 60) {
    el.textContent = '';
    el.classList.add('streaming');
    for (const word of String(text).split(/(\s+)/)) {
        el.textContent += word;
        await sleep(Math.max(8, (word.length / cps) * 1000));
    }
    el.classList.remove('streaming');
}

/** Barra de confianza para resultados simulados de IA (0-1). */
export function confidence(value, label = 'Confianza') {
    const pct = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100);
    const tone = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger';
    return `<div class="confidence"><span>${esc(label)}: <strong>${pct}%</strong></span>
        <div class="bar"><div class="bar-fill bar-${tone}" style="width:${pct}%"></div></div></div>`;
}

export function initials(name = '') {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('') || '?';
}
