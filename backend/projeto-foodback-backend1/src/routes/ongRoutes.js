import express from "express";
import OngController from "../controllers/ongController.js";

const router = express.Router();

// Rota para cadastrar ONG
router.post("/cadastrar", OngController.cadastrar);

// ✅ NOVA: Rota para atualizar/completar perfil da ONG
router.put("/atualizar/:id_usuario", OngController.atualizarDados);

// Rota para buscar dados da ONG por id_usuario
router.get("/dados/:id_usuario", OngController.buscarDados);

// ✅ NOVA: Rota para verificar se perfil está completo
router.get("/perfil-completo/:id_usuario", OngController.verificarPerfilCompleto);

export default router;