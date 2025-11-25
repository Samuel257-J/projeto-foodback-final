import express from "express";
import OngController from "../controllers/ongController.js";

const router = express.Router();

// ✅ Rota para cadastrar ONG
router.post("/cadastrar", OngController.cadastrar);

// ✅ Rota para verificar se perfil está completo (DEVE vir ANTES da rota genérica /:id_usuario)
router.get("/perfil-completo/:id_usuario", OngController.verificarPerfilCompleto);

// ✅ Rota para atualizar/completar perfil da ONG
router.put("/atualizar/:id_usuario", OngController.atualizarDados);

// ✅ Rota para buscar dados da ONG por id_usuario
// Esta rota atende tanto /ong/dados/:id_usuario quanto /ong/:id_usuario
router.get("/dados/:id_usuario", OngController.buscarDados);
router.get("/:id_usuario", OngController.buscarDados);

export default router;