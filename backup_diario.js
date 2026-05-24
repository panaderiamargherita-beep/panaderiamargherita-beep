/**
 * BACKUP DIARIO - Panadería Margherita
 * =====================================
 * Este script descarga todos los datos de Supabase y los guarda
 * en un archivo JSON. Se programa para correr todos los días a las 12.
 * Los backups se conservan 48 horas — siempre tenés el de hoy y el de ayer.
 *
 * REQUISITOS:
 *   - Node.js instalado (https://nodejs.org)
 *   - Ejecutar una vez: npm install en esta carpeta
 *
 * CONFIGURACIÓN:
 *   1. Abrí este archivo y completá SUPABASE_URL y SUPABASE_ANON
 *   2. Seguí las instrucciones al final para programarlo
 */

const https = require("https");
const fs    = require("fs");
const path  = require("path");

// ─── COMPLETAR CON TUS CREDENCIALES ──────────────────────────────────────────
const SUPABASE_URL  = "https://XXXXXXXXXXXXXXXX.supabase.co";   // ← tu URL
const SUPABASE_ANON = "eyXXXXXXXXXXXXXXXXXXXXXXXX";            // ← tu anon key
// ─────────────────────────────────────────────────────────────────────────────

const TABLAS = [
  "users","sales","orders","clients","deliveries",
  "expenses","staff","cash_sessions","reparto_orders",
  "custom_cats","payroll_payments"
];

const BACKUP_DIR = path.join(__dirname, "backups");

function fetch_table(tabla) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${tabla}?select=*`);
    const options = {
      hostname: url.hostname,
      path:     url.pathname + url.search,
      method:   "GET",
      headers:  {
        "apikey":        SUPABASE_ANON,
        "Authorization": `Bearer ${SUPABASE_ANON}`,
        "Content-Type":  "application/json",
      }
    };
    let data = "";
    const req = https.request(options, res => {
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(`Error parsing ${tabla}: ${data}`)); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  // Verificar que las credenciales estén configuradas
  if (SUPABASE_URL.includes("XXXXX")) {
    console.error("❌ ERROR: Completá SUPABASE_URL y SUPABASE_ANON en el archivo backup_diario.js");
    process.exit(1);
  }

  // Crear carpeta backups si no existe
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log("📁 Carpeta 'backups' creada");
  }

  console.log("🔄 Iniciando backup...", new Date().toLocaleString("es-AR"));

  // Descargar todas las tablas
  const backup = { fecha: new Date().toISOString(), tablas: {} };
  let errores = 0;

  for (const tabla of TABLAS) {
    try {
      const rows = await fetch_table(tabla);
      backup.tablas[tabla] = rows;
      console.log(`  ✓ ${tabla}: ${Array.isArray(rows) ? rows.length : "?"} registros`);
    } catch(e) {
      console.error(`  ✗ ${tabla}: ${e.message}`);
      backup.tablas[tabla] = [];
      errores++;
    }
  }

  // Nombre del archivo: backup_2024-05-22.json
  const fecha = new Date().toISOString().split("T")[0];
  const archivo = path.join(BACKUP_DIR, `backup_${fecha}.json`);

  // Guardar backup nuevo
  fs.writeFileSync(archivo, JSON.stringify(backup, null, 2), "utf8");
  const kb = Math.round(fs.statSync(archivo).size / 1024);
  console.log(`\n✅ Backup guardado: ${archivo} (${kb} KB)`);

  // ── Borrar backups con más de 48 horas de antigüedad ─────────────────────
  const HORAS_LIMITE = 48;
  const ahora = Date.now();
  const archivos = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith("backup_") && f.endsWith(".json") && f !== `backup_${fecha}.json`);

  if (archivos.length > 0) {
    archivos.forEach(f => {
      const fullPath = path.join(BACKUP_DIR, f);
      const stats = fs.statSync(fullPath);
      const edadHoras = (ahora - stats.mtimeMs) / (1000 * 60 * 60);
      if (edadHoras >= HORAS_LIMITE) {
        fs.unlinkSync(fullPath);
        console.log(`🗑  Backup eliminado (${Math.round(edadHoras)}hs): ${f}`);
      } else {
        console.log(`📁  Backup conservado (${Math.round(edadHoras)}hs, < ${HORAS_LIMITE}hs): ${f}`);
      }
    });
  }

  if (errores > 0) {
    console.log(`\n⚠️  ${errores} tabla(s) tuvieron errores. Verificá las credenciales.`);
    process.exit(1);
  }

  console.log("\n🎉 Backup completado sin errores");
}

run().catch(e => {
  console.error("❌ Error fatal:", e.message);
  process.exit(1);
});

/**
 * ─── CÓMO PROGRAMAR EL BACKUP AUTOMÁTICO ────────────────────────────────────
 *
 * WINDOWS — Programador de tareas:
 * 1. Buscá "Programador de tareas" en el menú inicio
 * 2. Click en "Crear tarea básica"
 * 3. Nombre: "Backup Margherita"
 * 4. Desencadenador: "Diariamente" → Hora: 12:00
 * 5. Acción: "Iniciar un programa"
 *    - Programa: node
 *    - Argumentos: "C:\ruta\a\panaderia-app\backup\backup_diario.js"
 *    - Iniciar en: C:\ruta\a\panaderia-app\backup\
 * 6. Tildar "Abrir propiedades al finalizar" → en Condiciones: destildar
 *    "Iniciar solo si el equipo usa corriente alterna"
 *
 * MAC — crontab:
 * 1. Abrí Terminal
 * 2. Escribí: crontab -e
 * 3. Agregá esta línea (reemplazá la ruta):
 *    0 12 * * * /usr/local/bin/node /ruta/a/panaderia-app/backup/backup_diario.js >> /ruta/a/panaderia-app/backup/backup.log 2>&1
 * 4. Guardá y cerrá (Ctrl+X, Y, Enter en nano)
 *
 * VERIFICAR QUE FUNCIONA:
 * - Abrí terminal en la carpeta backup/
 * - Escribí: node backup_diario.js
 * - Deberías ver los ✓ y el archivo backup_FECHA.json en la carpeta backups/
 */
