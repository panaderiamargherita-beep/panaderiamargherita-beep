# Backup automático - Panadería Margherita

## Qué hace
Todos los días a las 12:00 descarga todos los datos de Supabase
y los guarda en un archivo JSON. El backup del día anterior se borra
automáticamente — siempre tenés solo el más reciente.

## Configuración (5 minutos)

### 1. Abrí el archivo `backup_diario.js`
Completá las dos líneas con tus credenciales de Supabase:
```
SUPABASE_URL  = "https://tu-proyecto.supabase.co"
SUPABASE_ANON = "eyJ..."
```

### 2. Probá que funciona
Abrí una terminal en esta carpeta y ejecutá:
```
node backup_diario.js
```
Deberías ver los datos descargarse y aparecer la carpeta `backups/`
con un archivo `backup_2024-XX-XX.json`.

### 3. Programar automático

**Windows:**
- Buscá "Programador de tareas" → "Crear tarea básica"
- Nombre: Backup Margherita
- Frecuencia: Diariamente, 12:00
- Programa: `node`
- Argumentos: `ruta-completa\backup_diario.js`

**Mac:**
- Terminal → `crontab -e`
- Agregar: `0 12 * * * node /ruta/completa/backup_diario.js`

## Dónde quedan los backups
En la carpeta `backups/` dentro de esta misma carpeta.
Archivo: `backup_2024-05-22.json`

## Para restaurar datos
Si alguna vez necesitás recuperar datos, mandame el archivo
backup_FECHA.json y te ayudo a restaurarlo a Supabase.
