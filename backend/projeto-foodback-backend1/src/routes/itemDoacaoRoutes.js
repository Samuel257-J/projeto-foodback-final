import express from "express";
import ItemDoacaoController from "../controllers/itemDoacaoController.js";

const router = express.Router();

// Rota para cadastrar item de doação
router.post("/cadastrar", ItemDoacaoController.cadastrar);

// Rota para buscar itens de uma doação específica
router.get("/doacao/:id_doacao", ItemDoacaoController.buscarPorDoacao);

// Rota para atualizar item
router.put("/:id_item_doacao", ItemDoacaoController.atualizar);

// Rota para deletar item
router.delete("/:id_item_doacao", ItemDoacaoController.deletar);

export default router;  // ⚠️ VERIFIQUE SE ESTA LINHA ESTÁ PRESENTE!