# Panadería Margherita — Instrucciones de instalación con base de datos

## PASO 1 — Crear base de datos en Supabase (gratis)

1. Entrá a https://supabase.com y hacé click en "Start your project"
2. Registrate con GitHub o email
3. Click en "New project"
4. Completá:
   - Nombre: `panaderia-margherita`
   - Contraseña de base de datos: anotala en algún lado
   - Región: South America (São Paulo)
5. Click en "Create new project" y esperá 2 minutos

## PASO 2 — Crear las tablas

1. En el panel de Supabase, click en "SQL Editor" (ícono de terminal en el menú izquierdo)
2. Click en "New query"
3. Abrí el archivo `supabase_schema.sql` que está en esta carpeta
4. Copiá TODO el contenido y pegalo en el editor
5. Click en "Run" (o Ctrl+Enter)
6. Deberías ver "Success" — las tablas están creadas

## PASO 3 — Conseguir las credenciales

1. En Supabase, click en el ícono de engranaje ⚙️ (Settings) en el menú izquierdo
2. Click en "API"
3. Copiá estos dos valores:
   - **Project URL** → empieza con `https://`
   - **anon public key** → cadena larga que empieza con `eyJ`

## PASO 4 — Subir a Vercel con las variables de entorno

1. Entrá a https://vercel.com y creá cuenta con Google
2. Click en "Add New → Project"
3. Subí esta carpeta `panaderia-app`
4. ANTES de hacer click en Deploy, expandí "Environment Variables" y agregá:
   - Nombre: `REACT_APP_SUPABASE_URL`   → Valor: tu Project URL de Supabase
   - Nombre: `REACT_APP_SUPABASE_ANON`  → Valor: tu anon public key de Supabase
5. Ahora sí click en "Deploy"
6. En 2-3 minutos tenés tu URL lista

## PASO 5 — Listo

- Abrís la URL en el navegador
- Ves el indicador "☁️ Conectado" en la barra superior — eso confirma que está conectado a Supabase
- Todo lo que cargues (ventas, clientes, pedidos, etc.) queda guardado para siempre
- Funciona en todos los celulares y computadoras al mismo tiempo

## Usuarios de prueba

- **maria / 1234** → Administrador (acceso total)
- **carlos / 1234** → Cajero
- **ana / 1234** → Vendedora

Podés editar o crear usuarios reales desde el módulo Usuarios (solo admin).
