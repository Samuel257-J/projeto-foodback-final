import express from "express";
import sequelize from "../config/database.js";

const router = express.Router();

// POST - Criar nova retirada
router.post("/", async (req, res) => {
  const { id_solicitacao, responsavel_retirada, tipo_transporte, data_retirada, horario_retirada, observacoes } = req.body;

  // Validação
  if (!id_solicitacao || !responsavel_retirada || !tipo_transporte || !data_retirada || !horario_retirada) {
    return res.status(400).json({ 
      error: "Campos obrigatórios: id_solicitacao, responsavel_retirada, tipo_transporte, data_retirada e horario_retirada" 
    });
  }

  try {
    // Verifica se a solicitação existe e está aprovada
    const [solicitacao] = await sequelize.query(
      "SELECT status FROM solicitacoes WHERE id_solicitacao = ?",
      {
        replacements: [id_solicitacao],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    if (solicitacao.status !== "aprovada") {
      return res.status(400).json({ 
        error: "Apenas solicitações aprovadas podem ter retirada agendada" 
      });
    }

    // Verifica se já existe retirada para esta solicitação
    const retiradaExistente = await sequelize.query(
      "SELECT id_retirada FROM retiradas WHERE id_solicitacao = ?",
      {
        replacements: [id_solicitacao],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (retiradaExistente && retiradaExistente.length > 0) {
      return res.status(400).json({ 
        error: "Já existe uma retirada agendada para esta solicitação" 
      });
    }

    // Insere a retirada
    const [resultado] = await sequelize.query(
      `INSERT INTO retiradas 
       (id_solicitacao, responsavel_retirada, tipo_transporte, data_retirada, horario_retirada, observacoes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: [id_solicitacao, responsavel_retirada, tipo_transporte, data_retirada, horario_retirada, observacoes || null]
      }
    );

    res.status(201).json({
      message: "Retirada agendada com sucesso!",
      id_retirada: resultado
    });

  } catch (error) {
    console.error("Erro ao criar retirada:", error);
    res.status(500).json({ error: "Erro ao agendar retirada" });
  }
});

// GET - Buscar retirada por ID da solicitação
router.get("/solicitacao/:id_solicitacao", async (req, res) => {
  const { id_solicitacao } = req.params;

  try {
    const retiradas = await sequelize.query(
      `SELECT r.*, s.titulo_doacao, e.nome as nome_empresa
       FROM retiradas r
       INNER JOIN solicitacoes s ON r.id_solicitacao = s.id_solicitacao
       INNER JOIN doacoes d ON s.id_doacao = d.id_doacao
       INNER JOIN empresas e ON d.id_empresa = e.id_empresa
       WHERE r.id_solicitacao = ?`,
      {
        replacements: [id_solicitacao],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!retiradas || retiradas.length === 0) {
      return res.status(404).json({ error: "Retirada não encontrada" });
    }

    res.json(retiradas[0]);

  } catch (error) {
    console.error("Erro ao buscar retirada:", error);
    res.status(500).json({ error: "Erro ao buscar retirada" });
  }
});

// GET - Buscar todas as retiradas de uma ONG
router.get("/ong/:id_ong", async (req, res) => {
  const { id_ong } = req.params;

  try {
    const retiradas = await sequelize.query(
      `SELECT r.*, s.titulo_doacao, s.status as status_solicitacao,
              e.nome as nome_empresa, s.id_solicitacao
       FROM retiradas r
       INNER JOIN solicitacoes s ON r.id_solicitacao = s.id_solicitacao
       INNER JOIN doacoes d ON s.id_doacao = d.id_doacao
       INNER JOIN empresas e ON d.id_empresa = e.id_empresa
       WHERE s.id_ong = ?
       ORDER BY r.id_retirada DESC`,
      {
        replacements: [id_ong],
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(retiradas);

  } catch (error) {
    console.error("Erro ao buscar retiradas:", error);
    res.status(500).json({ error: "Erro ao buscar retiradas" });
  }
});

// PUT - Atualizar retirada
router.put("/:id_retirada", async (req, res) => {
  const { id_retirada } = req.params;
  const { responsavel_retirada, tipo_transporte, data_retirada, horario_retirada, observacoes } = req.body;

  try {
    const [resultado] = await sequelize.query(
      `UPDATE retiradas 
       SET responsavel_retirada = ?, tipo_transporte = ?, data_retirada = ?, horario_retirada = ?, observacoes = ?
       WHERE id_retirada = ?`,
      {
        replacements: [responsavel_retirada, tipo_transporte, data_retirada, horario_retirada, observacoes || null, id_retirada]
      }
    );

    if (resultado === 0) {
      return res.status(404).json({ error: "Retirada não encontrada" });
    }

    res.json({ message: "Retirada atualizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar retirada:", error);
    res.status(500).json({ error: "Erro ao atualizar retirada" });
  }
});

// DELETE - Cancelar retirada
router.delete("/:id_retirada", async (req, res) => {
  const { id_retirada } = req.params;

  try {
    const [resultado] = await sequelize.query(
      "DELETE FROM retiradas WHERE id_retirada = ?",
      {
        replacements: [id_retirada]
      }
    );

    if (resultado === 0) {
      return res.status(404).json({ error: "Retirada não encontrada" });
    }

    res.json({ message: "Retirada cancelada com sucesso!" });

  } catch (error) {
    console.error("Erro ao cancelar retirada:", error);
    res.status(500).json({ error: "Erro ao cancelar retirada" });
  }
});

export default router;