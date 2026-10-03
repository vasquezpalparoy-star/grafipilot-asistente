# Grafipilot · Asistente de impresión

Chat en español con un lobo animado. Al inicio aparece el lobito con «Hacer una pregunta o cotización»; al pulsarlo se abre la conversación.

## Funciones

- Preguntas frecuentes y reconocimiento de frases similares.
- Cotizaciones con las tarifas de PRESIO.xlsx, en soles (PEN).
- Precio 0 significa combinación no disponible.
- Cantidad, tamaño, color y caras se ingresan por el chat.
- Guardar cotizaciones en PDF mediante impresión.
- Animación mientras se escribe o se analiza una pregunta.

## Estado de las conexiones

Las preguntas frecuentes y las cotizaciones funcionan sin una clave de IA. La integración con `gpt-6-luna` está preparada en el servidor para clasificar preguntas no reconocidas y responder con información confirmada. **Luna no está activado:** falta configurar `OPENAI_API_KEY` como secreto del servidor. No colocar claves en el navegador ni en archivos publicados.

El enlace de WhatsApp queda pendiente del número internacional del negocio. Se configura en `lib/business-chat.ts`, sin el signo + ni espacios. Las condiciones para precio por mayor también requieren confirmación; no se aplican automáticamente.

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
