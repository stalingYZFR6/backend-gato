import express from "express";
import { Router } from "express";
import multer from "multer";

import {
  registrarGato,
  obtenerGatos,
  actualizarGato,
  eliminarGato,
  buscarGatos,
  enviarGatosPorEmail
} from "../controllers/gato.controller.js";

import { 
  exportarGatosLista, 
  exportarGatosJSON, 
  exportarGatosSQL 
} from "../controllers/exportacion.controller.js";

import { capturarInfoSolicitud } from "../middlewares/auditoria.js";

const router = Router();

// Middleware global de auditoría para este router
router.use(capturarInfoSolicitud);  

// Configuración de Multer para manejo de imágenes en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5MB
  },
});

// ==========================================
// 1. RUTAS ESPECÍFICAS Y DE BÚSQUEDA / EXPORTACIÓN
// ==========================================
router.get("/gatos/buscar", buscarGatos);  
router.get("/gatos/enviar-email", enviarGatosPorEmail);

// Rutas de exportación (Texto, JSON, SQL)
router.get("/exportar/lista", exportarGatosLista);
router.get("/exportar/json", exportarGatosJSON);
router.get("/exportar/sql", exportarGatosSQL);

// ==========================================
// 2. RUTAS CRUD GENERALES
// ==========================================
router.get("/gatos", obtenerGatos);
router.post("/gato", upload.single("imagen"), registrarGato);

// ==========================================
// 3. RUTAS CON PARÁMETROS DINÁMICOS (:id)
// ==========================================
router.put("/gato/:id", upload.single("imagen"), actualizarGato);
router.delete("/gato/:id", eliminarGato);

export default router;