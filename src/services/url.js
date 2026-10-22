// ¿Es una dirección web normal (http o https)? Así se descartan cosas como "javascript:..."
export function esUrlSegura(url) {
  try {
    const direccion = new URL(url)
    return direccion.protocol === 'https:' || direccion.protocol === 'http:'
  } catch {
    return false
  }
}