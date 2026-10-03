# Grafipilot · Asistente de impresión

Chat en español con un lobo animado. Al entrar aparece únicamente un botón pequeño del lobito en la esquina inferior derecha. Al pulsarlo se abre un chat oscuro de hasta 390 px de ancho; se puede cerrar. El lobito dentro del chat también es pequeño. La página del negocio conserva su diseño y sus funciones.

## Funciones

- Preguntas frecuentes y reconocimiento de frases similares.
- Cotizaciones con las tarifas de PRESIO.xlsx, en soles (PEN).
- Precio 0 significa combinación no disponible.
- Cantidad, tamaño, color y caras se ingresan por el chat.
- Guardar cotizaciones en PDF mediante impresión.
- Animación mientras se escribe o se analiza una pregunta.

## Estado de las conexiones

Las preguntas frecuentes y las cotizaciones funcionan sin una clave de IA. La integración con `gpt-6-luna` está preparada en el servidor para clasificar preguntas no reconocidas y responder con información confirmada. **La activación de Luna requiere `OPENAI_API_KEY` como secreto del servidor.** «IA configurada» indica que existe ese secreto; no garantiza que la cuenta tenga acceso o saldo. Si falla la API, se conservan las respuestas básicas. No colocar claves en el navegador ni en archivos publicados.

WhatsApp usa el contacto de la página Grafiplot: 51 952 628 844. Se configura en `lib/business-chat.ts`, sin el signo + ni espacios. Las cotizaciones incluyen un enlace con el detalle y el total estimado para consultar con el negocio. Las condiciones para precio por mayor también requieren confirmación; no se aplican automáticamente.

## Desarrollo

Requiere Node.js 22.13 o posterior y pnpm (versión indicada en package.json).

```sh
pnpm install
pnpm dev
```

## Verificaciones

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types tests/business-chat.mjs
node tests/luna.mjs
pnpm build
```

## Publicación e integración

Aplicación React con Vinext y un endpoint de servidor `/api/chat`, compatible con Cloudflare Workers. El repositorio publica el código fuente. GitHub Pages por sí solo no ejecuta el endpoint de IA; para usar el chat completo se necesita alojar el servidor.

La configuración `.openai/hosting.json` pertenece al Site original y conserva su identificador. Crear una configuración propia si se despliega como un proyecto distinto. Publicar este repositorio no modifica el acceso del Site original ni activa una clave de API.

Las respuestas y tarifas se encuentran en `lib/business-chat.ts`; el historial y las cotizaciones duran la sesión del navegador.

## Borrador de revisión

Este cambio se prepara en una rama de revisión: no publica el Site ni agrega un iframe a pagina-web. Conserva el acceso existente del alojamiento. El estado de conexión distingue comprobación, conexión sin IA, IA configurada y error. Las llamadas al chat tienen un límite de espera y muestran una alternativa por WhatsApp si fallan.

## Widget en la página del negocio

`integration/widget.html`, `widget.css` y `widget.js` forman el widget de integración. El iframe se carga solo al abrir el chat y conserva su sesión al cerrarlo. Copiar el lobito a `assets/v1/lobito.png`. El destino lleva `?embed=1`, para abrir la conversación dentro del panel sin otro botón inicial. Antes de integrarlo, desplegar esta versión del asistente. La autenticación existente del alojamiento y la activación de la API se gestionan por separado.
