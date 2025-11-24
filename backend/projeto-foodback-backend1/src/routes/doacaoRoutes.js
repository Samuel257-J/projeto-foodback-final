import express from "express";
import DoacaoController from "../controllers/doacaoController.js";

const router = express.Router();

// Rota para cadastrar nova doação
router.post("/cadastrar", DoacaoController.cadastrar);

// Rota para buscar doações de uma empresa
router.get("/empresa/:id_empresa", DoacaoController.buscarPorEmpresa);

// Rota para buscar todas as doações disponíveis
router.get("/disponiveis", DoacaoController.buscarDisponiveis);

// Rota para buscar uma doação específica
router.get("/:id_doacao", DoacaoController.buscarPorId);

// Rota para atualizar status da doação
router.put("/:id_doacao/status", DoacaoController.atualizarStatus);

// Rota para deletar doação
router.delete("/:id_doacao", DoacaoController.deletar);

export default router;