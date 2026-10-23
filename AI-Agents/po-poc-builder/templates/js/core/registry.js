// Registro de vistas funcionales. Cada archivo de js/views/ llama a registerView().
const views = new Map();

export function registerView(id, def) {
    if (!def || typeof def.render !== 'function') {
        throw new Error(`La vista "${id}" debe exponer render(el, ctx)`);
    }
    views.set(id, def);
}

export function getView(id) {
    return views.get(id);
}

export function listViews() {
    return [...views.keys()];
}
