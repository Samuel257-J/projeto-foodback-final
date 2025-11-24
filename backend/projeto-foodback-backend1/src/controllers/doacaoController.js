import db from "../models/index.js";

const { Doacao, Empresa, Usuario, ItemDoacao } = db;

class DoacaoController {
  // Cadastrar nova doação
  static async cadastrar(req, res) {
    try {
      const { id_empresa, titulo, descricao, categoria, quantidade, validade, status } = req.body;

      // Validação básica
      if (!id_empresa || !titulo || !categoria || !validade) {
        return res.status(400).json({
          error: "Campos obrigatórios: id_empresa, titulo, categoria, validade"
        });
      }

      // Buscar empresa pelo id_usuario (que vem do frontend como id_empresa)
      const empresa = await Empresa.findOne({ where: { id_usuario: id_empresa } });
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      // Criar a doação usando o id_empresa correto da tabela empresas
      const novaDoacao = await Doacao.create({
        id_empresa: empresa.id_empresa,
        titulo,
        descricao,
        categoria,
        quantidade,
        validade,
        status: status || "disponivel"
      });

      return res.status(201).json({
        success: true,
        message: "Doação cadastrada com sucesso!",
        id_doacao: novaDoacao.id_doacao,
        doacao: novaDoacao
      });

    } catch (error) {
      console.error("Erro ao cadastrar doação:", error);
      return res.status(500).json({
        error: "Erro ao cadastrar doação",
        details: error.message
      });
    }
  }

  // Buscar doações de uma empresa específica
  static async buscarPorEmpresa(req, res) {
    try {
      const { id_empresa } = req.params;
      
      // ✅ DEBUG: Ver o que está chegando
      console.log("🔍 Buscando doações para id_empresa:", id_empresa);
      console.log("🔍 Tipo do id_empresa:", typeof id_empresa);

      // Primeiro busca a empresa pelo id_usuario
      const empresa = await Empresa.findOne({ 
        where: { id_usuario: id_empresa } 
      });

      console.log("🏢 Empresa encontrada:", empresa?.id_empresa);

      if (!empresa) {
        console.log("❌ Empresa não encontrada para id_usuario:", id_empresa);
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      // Busca as doações usando o id_empresa correto da tabela empresas
      const doacoes = await Doacao.findAll({
        where: { id_empresa: empresa.id_empresa },
        include: [
          {
            model: Empresa,
            include: [{ model: Usuario }]
          },
          {
            model: ItemDoacao,
            as: "ItemDoacaos"
          }
        ],
        order: [["id_doacao", "DESC"]]
      });

      console.log("📦 Total de doações encontradas:", doacoes.length);
      console.log("📊 Doações:", doacoes.map(d => ({ 
        id: d.id_doacao, 
        titulo: d.titulo, 
        status: d.status 
      })));

      return res.status(200).json(doacoes);

    } catch (error) {
      console.error("❌ Erro ao buscar doações:", error);
      return res.status(500).json({
        error: "Erro ao buscar doações",
        details: error.message
      });
    }
  }

  // Buscar todas as doações disponíveis
  static async buscarDisponiveis(req, res) {
    try {
      const doacoes = await Doacao.findAll({
        where: { status: "disponivel" },
        include: [
          {
            model: Empresa,
            include: [{ model: Usuario }]
          },
          {
            model: ItemDoacao,
            as: "ItemDoacaos"
          }
        ],
        order: [["id_doacao", "DESC"]]
      });

      return res.status(200).json(doacoes);

    } catch (error) {
      console.error("Erro ao buscar doações disponíveis:", error);
      return res.status(500).json({
        error: "Erro ao buscar doações disponíveis",
        details: error.message
      });
    }
  }

  // Buscar uma doação específica por ID
  static async buscarPorId(req, res) {
    try {
      const { id_doacao } = req.params;

      const doacao = await Doacao.findOne({
        where: { id_doacao },
        include: [
          {
            model: Empresa,
            include: [{ model: Usuario }]
          },
          {
            model: ItemDoacao,
            as: "ItemDoacaos"
          }
        ]
      });

      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }

      return res.status(200).json(doacao);

    } catch (error) {
      console.error("Erro ao buscar doação:", error);
      return res.status(500).json({
        error: "Erro ao buscar doação",
        details: error.message
      });
    }
  }

  // Atualizar status da doação
  static async atualizarStatus(req, res) {
    try {
      const { id_doacao } = req.params;
      const { status } = req.body;

      const statusValidos = ["disponivel", "reservada", "retirada", "cancelada"];
      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          error: `Status inválido. Use: ${statusValidos.join(", ")}`
        });
      }

      const doacao = await Doacao.findByPk(id_doacao);
      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }

      await doacao.update({ status });

      return res.status(200).json({
        success: true,
        message: "Status atualizado com sucesso",
        doacao
      });

    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({
        error: "Erro ao atualizar status",
        details: error.message
      });
    }
  }

  // Deletar doação
  static async deletar(req, res) {
    try {
      const { id_doacao } = req.params;

      const doacao = await Doacao.findByPk(id_doacao);
      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }

      await doacao.destroy();

      return res.status(200).json({
        success: true,
        message: "Doação deletada com sucesso"
      });

    } catch (error) {
      console.error("Erro ao deletar doação:", error);
      return res.status(500).json({
        error: "Erro ao deletar doação",
        details: error.message
      });
    }
  }
}

export default DoacaoController;