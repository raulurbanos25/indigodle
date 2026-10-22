export const LONGITUD = 5

// Pasa a mayúsculas y quita las tildes. La Ñ se conserva como letra propia.
export function normalizar(texto) {
  return texto
    .toUpperCase()
    .replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
}

export function esLetra(caracter) {
  return /^[A-ZÑ]$/.test(caracter)
}

// Compara un intento con la palabra secreta. Devuelve una lista con un estado por letra:
// 'correcta' (bien colocada), 'presente' (está, pero en otro sitio) o 'ausente'.
// Las letras repetidas se cuentan bien: no se marca "presente" más veces
// de las que la letra aparece en la palabra secreta.
export function evaluarIntento(intento, objetivo) {
  const resultado = Array(intento.length).fill('ausente')
  const restantes = {}

  // Primero, las letras bien colocadas
  for (let i = 0; i < intento.length; i++) {
    if (intento[i] === objetivo[i]) {
      resultado[i] = 'correcta'
    } else {
      restantes[objetivo[i]] = (restantes[objetivo[i]] || 0) + 1
    }
  }

  // Después, las que están en otro sitio (mientras queden de esa letra)
  for (let i = 0; i < intento.length; i++) {
    if (resultado[i] !== 'correcta' && restantes[intento[i]] > 0) {
      resultado[i] = 'presente'
      restantes[intento[i]] -= 1
    }
  }

  return resultado
}

const PRIORIDAD = { ausente: 1, presente: 2, correcta: 3 }

// Mejor estado conocido de cada letra, para colorear el teclado.
export function mejorEstadoPorLetra(intentos, objetivo) {
  const mapa = {}
  for (const intento of intentos) {
    const evaluacion = evaluarIntento(intento, objetivo)
    intento.split('').forEach((letra, i) => {
      const actual = mapa[letra]
      if (!actual || PRIORIDAD[evaluacion[i]] > PRIORIDAD[actual]) {
        mapa[letra] = evaluacion[i]
      }
    })
  }
  return mapa
}