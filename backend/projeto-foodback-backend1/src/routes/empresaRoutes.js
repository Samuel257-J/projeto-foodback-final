import express from "express";
import EmpresaController from "../controllers/empresaController.js";

const router = express.Router();

// Rota para cadastrar empresa
router.post("/cadastrar", EmpresaController.cadastrar);

// ✅ NOVA: Rota para atualizar/completar perfil da empresa
router.put("/atualizar/:id_usuario", EmpresaController.atualizarDados);

// Rota para buscar dados da empresa por id_usuario
router.get("/dados/:id_usuario", EmpresaController.buscarDados);

// ✅ NOVA: Rota para verificar se perfil está completo
router.get("/perfil-completo/:id_usuario", EmpresaController.verificarPerfilCompleto);

export default router;