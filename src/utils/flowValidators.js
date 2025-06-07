// src/utils/flowValidators.js

/**
 * Verifica si la conexión es válida:
 * - Un nodo de tipo 'cond' puede tener hasta 2 salidas.
 * - Los demás nodos solo pueden tener 1 salida.
 */
export function isValidConnection(nodes, edges, connection) {
    const src = nodes.find((n) => n.id === connection.source);
    if (!src) return false;
    const outgoing = edges.filter((e) => e.source === src.id).length;
    return src.type === 'cond' ? outgoing < 2 : outgoing < 1;
}

/**
 * Busca nodos sin vínculos (ni como source ni como target).
 * Devuelve un arreglo de los nodos “sueltos”.
 */
export function findUnlinked(nodes, edges) {
    return nodes.filter(
        (n) => !edges.some((e) => e.source === n.id || e.target === n.id)
    );
}