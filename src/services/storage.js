// Lectura y escritura segura en localStorage.
// Si el navegador bloquea el almacenamiento, el juego sigue funcionando sin guardar.
export function leerJSON(clave, valorPorDefecto = null) {
  try {
    const texto = localStorage.getItem(clave)
    return texto === null ? valorPorDefecto : JSON.parse(texto)
  } catch {
    return valorPorDefecto
  }
}

export function guardarJSON(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin almacenamiento disponible: simplemente no se guarda
  }
}

export function borrar(clave) {
  try {
    localStorage.removeItem(clave)
  } catch {
    // Nada que hacer
  }
}