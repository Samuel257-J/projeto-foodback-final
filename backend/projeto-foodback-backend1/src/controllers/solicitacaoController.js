import db from "../models/index.js";

const { Solicitacao, Doacao, Ong, Empresa, Usuario, Retirada } = db;

class SolicitacaoController {
  // Criar nova solicitação
  static async criar(req, res) {
    try {
      const { id_doacao, id_ong } = req.body;

      console.log("📝 Criando solicitação:", { id_doacao, id_ong });

      // Validação
      if (!id_doacao || !id_ong) {
        return res.status(400).json({
          error: "Campos obrigatórios: id_doacao, id_ong"
        });
      }

      // Verifica se a doação existe e está disponível
      const doacao = await Doacao.findByPk(id_doacao);
      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }

      if (doacao.status !== "disponivel") {
        return res.status(400).json({ 
          error: "Esta doação não está mais disponível" 
        });
      }

      // Busca a ONG pelo id_usuario
      const ong = await Ong.findOne({ where: { id_usuario: id_ong } });
      if (!ong) {
        return res.status(404).json({ error: "ONG não encontrada" });
      }

      // Verifica se já existe uma solicitação pendente desta ONG para esta doação
      const solicitacaoExistente = await Solicitacao.findOne({
        where: {
          id_doacao,
          id_ong: ong.id_ong,
          status: "pendente"
        }
      });

      if (solicitacaoExistente) {
        return res.status(400).json({
          error: "Você já possui uma solicitação pendente para esta doação"
        });
      }

      // Cria a solicitação
      const novaSolicitacao = await Solicitacao.create({
        id_doacao,
        id_ong: ong.id_ong,
        status: "pendente"
      });

      console.log("✅ Solicitação criada:", novaSolicitacao.id_solicitacao);

      return res.status(201).json({
        success: true,
        message: "Solicitação enviada com sucesso!",
        solicitacao: novaSolicitacao
      });

    } catch (error) {
      console.error("❌ Erro ao criar solicitação:", error);
      return res.status(500).json({
        error: "Erro ao criar solicitação",
        details: error.message
      });
    }
  }

  // Buscar solicitações de uma empresa
  static async buscarPorEmpresa(req, res) {
    try {
      const { id_usuario } = req.params;

      console.log("🔍 Buscando solicitações da empresa (id_usuario):", id_usuario);

      const empresa = await Empresa.findOne({ where: { id_usuario } });
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      const solicitacoes = await Solicitacao.findAll({
        include: [
          {
            model: Doacao,
            where: { id_empresa: empresa.id_empresa },
            attributes: ['id_doacao', 'titulo', 'categoria', 'quantidade', 'validade']
          },

          // ⭐ INCLUIR A RETIRADA AQUI
          {
            model: Retirada,
            required: false // permite vir null quando não houver retirada
          },

          {
            model: Ong,
            include: [
              {
                model: Usuario,
                attributes: ['nome', 'email', 'telefone']
              }
            ]
          }
        ],
        order: [["data_solicitacao", "DESC"]]
      });

      return res.status(200).json(solicitacoes);

    } catch (error) {
      console.error("❌ Erro ao buscar solicitações:", error);
      return res.status(500).json({
        error: "Erro ao buscar solicitações",
        details: error.message
      });
    }
  }


  // Buscar solicitações de uma ONG
  static async buscarPorOng(req, res) {
    try {
      const { id_usuario } = req.params;

      console.log("🔍 Buscando solicitações da ONG (id_usuario):", id_usuario);

      const ong = await Ong.findOne({ where: { id_usuario } });
      if (!ong) {
        return res.status(404).json({ error: "ONG não encontrada" });
      }

      const solicitacoes = await Solicitacao.findAll({
        where: { id_ong: ong.id_ong },
        include: [
          {
            model: Doacao,
            attributes: ['id_doacao', 'titulo', 'descricao', 'categoria', 'quantidade', 'validade', 'status'],
            include: [
              {
                model: Empresa,
                include: [
                  {
                    model: Usuario,
                    attributes: ['nome', 'email', 'telefone']
                  }
                ]
              }
            ]
          },

          // ⭐ INCLUIR A RETIRADA AQUI TAMBÉM
          {
            model: Retirada,
            required: false
          }
        ],
        order: [["data_solicitacao", "DESC"]]
      });

      return res.status(200).json(solicitacoes);

    } catch (error) {
      console.error("❌ Erro ao buscar solicitações:", error);
      return res.status(500).json({
        error: "Erro ao buscar solicitações",
        details: error.message
      });
    }
  }


  // Aprovar solicitação
  static async aprovar(req, res) {
    try {
      const { id_solicitacao } = req.params;
      const { observacoes } = req.body;

      const solicitacao = await Solicitacao.findByPk(id_solicitacao, {
        include: [Doacao]
      });

      if (!solicitacao) {
        return res.status(404).json({ error: "Solicitação não encontrada" });
      }

      if (solicitacao.status !== "pendente") {
        return res.status(400).json({ 
          error: "Esta solicitação já foi respondida" 
        });
      }

      // Atualiza a solicitação
      await solicitacao.update({
        status: "aprovada",
        data_resposta: new Date(),
        observacoes
      });

      // Atualiza o status da doação para "reservada"
      await solicitacao.Doacao.update({ status: "reservada" });

      console.log("✅ Solicitação aprovada:", id_solicitacao);

      return res.status(200).json({
        success: true,
        message: "Solicitação aprovada com sucesso!",
        solicitacao
      });

    } catch (error) {
      console.error("❌ Erro ao aprovar solicitação:", error);
      return res.status(500).json({
        error: "Erro ao aprovar solicitação",
        details: error.message
      });
    }
  }

  // Rejeitar solicitação
  static async rejeitar(req, res) {
    try {
      const { id_solicitacao } = req.params;
      const { observacoes } = req.body;

      const solicitacao = await Solicitacao.findByPk(id_solicitacao);

      if (!solicitacao) {
        return res.status(404).json({ error: "Solicitação não encontrada" });
      }

      if (solicitacao.status !== "pendente") {
        return res.status(400).json({ 
          error: "Esta solicitação já foi respondida" 
        });
      }

      await solicitacao.update({
        status: "rejeitada",
        data_resposta: new Date(),
        observacoes
      });

      console.log("❌ Solicitação rejeitada:", id_solicitacao);

      return res.status(200).json({
        success: true,
        message: "Solicitação rejeitada",
        solicitacao
      });

    } catch (error) {
      console.error("❌ Erro ao rejeitar solicitação:", error);
      return res.status(500).json({
        error: "Erro ao rejeitar solicitação",
        details: error.message
      });
    }
  }

  // Marcar como concluída
  static async concluir(req, res) {
    try {
      const { id_solicitacao } = req.params;

      const solicitacao = await Solicitacao.findByPk(id_solicitacao, {
        include: [Doacao]
      });

      if (!solicitacao) {
        return res.status(404).json({ error: "Solicitação não encontrada" });
      }

      if (solicitacao.status !== "aprovada") {
        return res.status(400).json({ 
          error: "Apenas solicitações aprovadas podem ser concluídas" 
        });
      }

      await solicitacao.update({ status: "concluida" });
      await solicitacao.Doacao.update({ status: "retirada" });

      console.log("✅ Solicitação concluída:", id_solicitacao);

      return res.status(200).json({
        success: true,
        message: "Doação marcada como retirada!",
        solicitacao
      });

    } catch (error) {
      console.error("❌ Erro ao concluir solicitação:", error);
      return res.status(500).json({
        error: "Erro ao concluir solicitação",
        details: error.message
      });
    }
  }
}

export default SolicitacaoController;