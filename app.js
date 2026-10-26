import express from "express";
import cors from "cors";  // Para que el frontend pueda llamar
import gatoRoutes from "./routes/gato.routes.js";
import climaRoutes from "./routes/clima.routes.js";
import estadisticasRoutes from "./routes/estadisticas.routes.js";
import rateLimit from "express-rate-limit";
import db from "./firebase.js";  // Para el registro de la bitácora

const app = express();

// Middlewares globales
app.use(cors());  // Permite peticiones desde cualquier origen
app.use(express.json());

// Rate limit para endpoints específicos de gatos (Aumentado opcionalmente a 10 para pruebas)
const limiterGatos = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Cambiado temporalmente a 10 para evitar bloqueos rápidos en pruebas
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: "Demasiadas peticiones desde esta IP. Intenta de nuevo más tarde.",
  },
  handler: async (req, res, next, options) => {
    try {
      await db.collection("auditoria_gatos").add({
        accion: "rate_limit_bloqueado",
        fecha: new Date().toISOString(),
        ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip,
        userAgent: req.headers["user-agent"],
        ruta: req.originalUrl,
        metodo: req.method,
      });
    } catch (e) {}
    res.status(options.statusCode).json(options.message);
  },
});

// Aplicar el limitador solo a las rutas que lo requieran (ej. creación o modificación)
// O si lo prefieres aplicar a todo /gato y /gatos:
app.use("/gato", limiterGatos);
app.use("/gatos", limiterGatos);

// ==========================================
// REGISTRO DE RUTAS
// ==========================================
app.use(gatoRoutes);
app.use(climaRoutes);
app.use(estadisticasRoutes);

// ==========================================
// MANEJO DE RUTA NO REGISTRADA (404) -> DEBE IR SIEMPRE AL FINAL
// ==========================================
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no registrada." });
});

export default app;