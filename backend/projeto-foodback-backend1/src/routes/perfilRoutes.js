import express from "express";
import PerfilController from "../controllers/perfilController.js";

const router = express.Router();

router.get("/verificar/:id_usuario", PerfilController.verificarPerfil);
router.put("/empresa/:id_usuario", PerfilController.atualizarEmpresa);
router.put("/ong/:id_usuario", PerfilController.atualizarOng);

export default router;