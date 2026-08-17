import express from "express";
import cors from "cors";
import gatoRoutes from "./routes/gato.routes.js";

const app = express();


// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://fronten-gato.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {

    // Permitir herramientas o peticiones
    // que no envían Origin
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("Origen no permitido por CORS")
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));


// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.json());


// ==========================================
// RUTAS
// ==========================================

app.use(gatoRoutes);


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

  res.status(404).json({
    mensaje: "Ruta no registrada."
  });

});


export default app;