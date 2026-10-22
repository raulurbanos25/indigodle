# Indigodle

Indigodle es una web de minijuegos musicales dedicada a Lola Índigo. Reúne retos diarios, juegos para reconocer canciones y álbumes, discografía, estadísticas personales y páginas para explorar cada era musical.

## Qué incluye

- Varios modos de juego con retos diarios y resultados guardados en el navegador.
- Historial, evolución y estadísticas personales por modo.
- Discografía con álbumes, canciones y páginas individuales.
- Ajustes de zoom y tamaño de letra.
- Contador de visitas y “me gusta” de la comunidad, guardados por la API del servidor.

## Desarrollo local

1. Instala Node.js y las dependencias con `npm install`.
2. (Opcional) Copia `.env.example` a `.env.local` para configurar `VITE_CONTACT_EMAIL`; el correo de contacto ya está configurado por defecto.
3. Ejecuta `npm run dev` y abre la dirección local que muestra Vite.

Vite ejecuta la API local de comunidad durante el desarrollo. Las visitas y los “me gusta” se guardan en el archivo [`data/community-stats.json`](data/community-stats.json). También puedes ver los totales como JSON en `http://localhost:5173/api/community` mientras esté activo el servidor de desarrollo.

## Consultar los datos de comunidad

- **Archivo:** `data/community-stats.json` contiene los contadores y los hashes de sesión usados para impedir duplicados.
- **API local:** abre `http://localhost:5173/api/community` mientras ejecutas `npm run dev`.
- **API publicada:** abre `https://TU-DOMINIO/api/community` en el dominio donde esté ejecutándose el servidor Node.

El archivo del ordenador solo refleja la actividad recibida por el servidor que escribe en ese archivo. Si la web se aloja en otro servidor, los datos se guardan en el disco de ese servidor y no aparecen automáticamente en la copia local del repositorio.

## Publicar con Node.js

Genera la versión de producción y arranca el servidor:

```bash
npm run build
npm start
```

El servidor Node sirve `dist/` y la API `/api/community`. El alojamiento debe permitir ejecutar Node.js y conservar el almacenamiento entre reinicios. Puedes cambiar la ubicación del archivo con la variable `INDIGODLE_DB_PATH`.

GitHub Pages solo aloja archivos estáticos: no ejecuta esta API ni puede actualizar el archivo JSON del repositorio cuando alguien visita la web. Para mantener un contador común en una web pública, usa un alojamiento con backend persistente o conecta un servicio de base de datos como Firebase.

El formulario de ideas del footer abre Gmail con un borrador dirigido a `raul.urbanos.esteban@gmail.com`, con el concepto en el asunto y el mensaje ya escrito. La persona debe pulsar “Enviar” en Gmail para que el mensaje llegue; el sitio no almacena ni envía correos por su cuenta.

## Cómo cuentan las visitas y los “me gusta”

- La visita se cuenta una vez por sesión de pestaña. Navegar o recargar no suma otra; cerrar la pestaña y volver a entrar inicia otra sesión.
- Cada sesión puede dar un único “me gusta”. El servidor conserva hashes de sesión, no el identificador original.
- Las estadísticas de partidas son locales a cada navegador y se pueden exportar o importar desde la página de estadísticas.

## Estructura principal

```text
src/                  Aplicación React, estilos, páginas y juegos
public/               Portadas, imágenes, vídeos y otros recursos
server/               API de comunidad y servidor Node de producción
data/                 Archivo JSON de contadores de comunidad
scripts/              Herramientas para preparar datos y audios
```
