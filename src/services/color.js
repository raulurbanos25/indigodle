// Convierte un texto (por ejemplo, el id de un álbum) en un tono de color (0 a 359),
// siempre el mismo para el mismo texto. Se usa para dar un color propio a cada álbum.
export function tonoDe(texto) {
  let h = 0
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0
  }
  return h % 360
}