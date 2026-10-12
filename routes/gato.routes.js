import express from "express";
import multer from "multer";
import {
  registrarGato,
  obtenerGatos,
  actualizarGato,
  eliminarGato,
  buscarGatos
} from "../controllers/gato.controller.js";
import { capturarInfoSolicitud } from "../middlewares/auditoria.js";


const router = express.Router();


router.use(capturarInfoSolicitud);  


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


// Crear un nuevo gato (POST /gato)
router.post("/gato", upload.single("imagen"), registrarGato);


// Obtener todos los gatos (GET /gatos)
router.get("/gatos", obtenerGatos);


// Actualizar un gato por ID (PUT /gato/:id)
router.put("/gato/:id", upload.single("imagen"), actualizarGato);


// Ruta para eliminar gato por ID
router.delete("/gato/:id", eliminarGato);


router.get("/gatos/buscar", buscarGatos);  




export default router;


