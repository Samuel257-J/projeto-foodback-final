import express from "express";
import SolicitacaoController from "../controllers/solicitacaoController.js";

const router = express.Router();

// ✅ CORRETO: Sem o prefixo /solicitacoes
router.post("/criar", SolicitacaoController.criar);
router.get("/empresa/:id_usuario", SolicitacaoController.buscarPorEmpresa);
router.get("/ong/:id_usuario", SolicitacaoController.buscarPorOng);
router.put("/:id_solicitacao/aprovar", SolicitacaoController.aprovar);
router.put("/:id_solicitacao/rejeitar", SolicitacaoController.rejeitar);
router.put("/:id_solicitacao/concluir", SolicitacaoController.concluir);

export default router;