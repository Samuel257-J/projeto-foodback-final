import express from "express";
import db from "../models/index.js"; // ← Importa todos os modelos

const router = express.Router();

// Buscar notificações de um usuário
router.get("/:id_usuario", async (req, res) => {
  try {
    console.log("🔍 Buscando notificações para usuário:", req.params.id_usuario);
    
    const notificacoes = await db.Notificacao.findAll({
      where: { id_usuario: req.params.id_usuario },
      order: [["createdAt", "DESC"]],
      limit: 50
    });
    
    console.log("📬 Notificações encontradas:", notificacoes.length);
    
    res.json(notificacoes);
  } catch (error) {
    console.error("❌ Erro ao buscar notificações:", error);
    res.status(500).json({ error: error.message });
  }
});

// Marcar notificação como lida
router.put("/:id_notificacao/ler", async (req, res) => {
  try {
    const notificacao = await db.Notificacao.findByPk(req.params.id_notificacao);
    
    if (!notificacao) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }

    await db.Notificacao.update(
      { lida: true },
      { where: { id_notificacao: req.params.id_notificacao } }
    );
    
    console.log("✅ Notificação marcada como lida:", req.params.id_notificacao);
    
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao marcar notificação como lida:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;