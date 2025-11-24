import db from "../models/index.js";

const { ItemDoacao, Doacao } = db;

class ItemDoacaoController {
  // Cadastrar item de doação
  static async cadastrar(req, res) {
    try {
      const { id_doacao, nome_item, quantidade, unidade_medida } = req.body;

      // Validação básica
      if (!id_doacao || !nome_item || !quantidade) {
        return res.status(400).json({
          error: "Campos obrigatórios: id_doacao, nome_item, quantidade"
        });
      }

      // Verificar se a doação existe
      const doacao = await Doacao.findByPk(id_doacao);
      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }

      // Criar o item
      const novoItem = await ItemDoacao.create({
        id_doacao,
        nome_item,
        quantidade,
        unidade_medida: unidade_medida || "unidade(s)"
      });

      return res.status(201).json({
        success: true,
        message: "Item cadastrado com sucesso!",
        id_item_doacao: novoItem.id_item_doacao,
        item: novoItem
      });

    } catch (error) {
      console.error("Erro ao cadastrar item:", error);
      return res.status(500).json({
        error: "Erro ao cadastrar item",
        details: error.message
      });
    }
  }

  // Buscar itens de uma doação específica
  static async buscarPorDoacao(req, res) {
    try {
      const { id_doacao } = req.params;

      const itens = await ItemDoacao.findAll({
        where: { id_doacao },
        include: [{ model: Doacao }]
      });

      return res.status(200).json(itens);

    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      return res.status(500).json({
        error: "Erro ao buscar itens",
        details: error.message
      });
    }
  }

  // Atualizar item
  static async atualizar(req, res) {
    try {
      const { id_item_doacao } = req.params;
      const { nome_item, quantidade, unidade_medida } = req.body;

      const item = await ItemDoacao.findByPk(id_item_doacao);
      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      await item.update({
        nome_item: nome_item || item.nome_item,
        quantidade: quantidade || item.quantidade,
        unidade_medida: unidade_medida || item.unidade_medida
      });

      return res.status(200).json({
        success: true,
        message: "Item atualizado com sucesso",
        item
      });

    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      return res.status(500).json({
        error: "Erro ao atualizar item",
        details: error.message
      });
    }
  }

  // Deletar item
  static async deletar(req, res) {
    try {
      const { id_item_doacao } = req.params;

      const item = await ItemDoacao.findByPk(id_item_doacao);
      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      await item.destroy();

      return res.status(200).json({
        success: true,
        message: "Item deletado com sucesso"
      });

    } catch (error) {
      console.error("Erro ao deletar item:", error);
      return res.status(500).json({
        error: "Erro ao deletar item",
        details: error.message
      });
    }
  }
}

export default ItemDoacaoController;