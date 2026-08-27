// RC Taxi y Limo — backend real (v1 piloto)
// Registro de choferes, login, ubicacion en vivo, panel de despacho.
// Guardado simple en un archivo JSON (data.json) para que no se pierda todo
// si el servicio se reinicia (los planes gratis de Render "duermen" y reinician).

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
// Clave de acceso al panel de despacho. En Render, configurala en
// Environment > Add Environment Variable > DISPATCH_KEY = lo-que-quieras
const DISPATCH_KEY = process.env.DISPATCH_KEY || "rctaxi2026";

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    return { drivers: {}, tokens: {} };
  }
}
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

let db = loadData();
// db.drivers: { driverId: { id, name, phone, carNumber, passwordHash, lat, lng, online, lastUpdate } }
// db.tokens:  { token: driverId }

function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}
function newId() {
  return crypto.randomBytes(4).toString("hex");
}
function newToken() {
  return crypto.randomBytes(16).toString("hex");
}

function authDriver(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const driverId = db.tokens[token];
  if (!driverId || !db.drivers[driverId]) {
    return res.status(401).json({ error: "No autorizado. Volve a iniciar sesion." });
  }
  req.driverId = driverId;
  next();
}

// ---------- Rutas del chofer ----------

app.post("/api/register", (req, res) => {
  const { name, phone, carNumber, password } = req.body || {};
  if (!name || !phone || !carNumber || !password) {
    return res.status(400).json({ error: "Faltan datos (nombre, telefono, numero de carro, contrasena)." });
  }
  const already = Object.values(db.drivers).find((d) => d.phone === phone);
  if (already) {
    return res.status(400).json({ error: "Ese telefono ya esta registrado. Iniciá sesión en vez de registrarte." });
  }
  const id = newId();
  db.drivers[id] = {
    id,
    name,
    phone,
    carNumber,
    passwordHash: hashPassword(password),
    lat: null,
    lng: null,
    online: false,
    lastUpdate: null,
  };
  const token = newToken();
  db.tokens[token] = id;
  saveData();
  res.json({ token, driver: { id, name, phone, carNumber } });
});

app.post("/api/login", (req, res) => {
  const { phone, password } = req.body || {};
  const driver = Object.values(db.drivers).find((d) => d.phone === phone);
  if (!driver || driver.passwordHash !== hashPassword(password || "")) {
    return res.status(401).json({ error: "Telefono o contrasena incorrectos." });
  }
  const token = newToken();
  db.tokens[token] = driver.id;
  saveData();
  res.json({ token, driver: { id: driver.id, name: driver.name, phone: driver.phone, carNumber: driver.carNumber } });
});

app.post("/api/location", authDriver, (req, res) => {
  const { lat, lng } = req.body || {};
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "Falta lat/lng." });
  }
  const d = db.drivers[req.driverId];
  d.lat = lat;
  d.lng = lng;
  d.online = true;
  d.lastUpdate = Date.now();
  saveData();
  res.json({ ok: true });
});

app.post("/api/offline", authDriver, (req, res) => {
  const d = db.drivers[req.driverId];
  d.online = false;
  saveData();
  res.json({ ok: true });
});

// ---------- Rutas de despacho ----------

app.get("/api/drivers", (req, res) => {
  if (req.query.key !== DISPATCH_KEY) {
    return res.status(401).json({ error: "Clave de despacho incorrecta." });
  }
  const now = Date.now();
  const OFFLINE_AFTER_MS = 90 * 1000; // si no manda ubicacion hace 90s, se considera desconectado
  const drivers = Object.values(db.drivers).map((d) => {
    const stale = !d.lastUpdate || now - d.lastUpdate > OFFLINE_AFTER_MS;
    return {
      id: d.id,
      name: d.name,
      carNumber: d.carNumber,
      lat: d.lat,
      lng: d.lng,
      online: d.online && !stale,
      lastUpdateSecondsAgo: d.lastUpdate ? Math.round((now - d.lastUpdate) / 1000) : null,
    };
  });
  res.json({ drivers });
});

// ---------- Archivos estaticos ----------
app.use("/driver-app", express.static(path.join(__dirname, "driver-app")));
app.use("/dispatch", express.static(path.join(__dirname, "dispatch")));

app.get("/", (req, res) => {
  res.send(
    '<h1>RC Taxi y Limo — backend</h1><p><a href="/driver-app/chofer.html">App del chofer</a></p><p><a href="/dispatch/dispatch.html">Panel de despacho</a></p>'
  );
});

app.listen(PORT, () => {
  console.log(`RC Taxi backend corriendo en el puerto ${PORT}`);
});
