import db from "../models/index.js";

const {
  Retirada,
  Solicitacao,
  Doacao,
  Empresa,
  Usuario,
  Ong,
  Notificacao // ✅ ADICIONAR
} = db;

// ================================
// 🚚 CRIAR AGENDAMENTO
// ================================
export const criarRetirada = async (req, res) => {
  try {
    const {
      id_solicitacao,
      responsavel_retirada,
      tipo_transporte,
      data_retirada,
      horario_retirada,
      observacoes
    } = req.body;

    console.log("📦 Criando retirada para solicitação:", id_solicitacao);

    // 1️⃣ BUSCAR INFORMAÇÕES DA SOLICITAÇÃO E DOAÇÃO
    const solicitacao = await Solicitacao.findByPk(id_solicitacao, {
      include: [
        {
          model: Doacao,
          include: [
            {
              model: Empresa,
              as: "Empresa",
              include: [
                {
                  model: Usuario,
                  as: "Usuario"
                }
              ]
            }
          ]
        },
        {
          model: Ong,
          include: [
            {
              model: Usuario
            }
          ]
        }
      ]
    });

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    console.log("✅ Solicitação encontrada:", solicitacao.id_solicitacao);
    console.log("🏢 Empresa:", solicitacao.Doacao?.Empresa?.Usuario?.nome);
    console.log("🏛️ ONG:", solicitacao.Ong?.Usuario?.nome);

    // 2️⃣ CRIAR A RETIRADA
    const retirada = await Retirada.create({
      id_solicitacao,
      responsavel_retirada,
      tipo_transporte,
      data_retirada,
      horario_retirada,
      observacoes
    });

    console.log("✅ Retirada criada:", retirada.id_retirada);

    // 3️⃣ CRIAR NOTIFICAÇÃO PARA A EMPRESA
    const id_usuario_empresa = solicitacao.Doacao?.Empresa?.id_usuario;
    
    if (id_usuario_empresa) {
      const dataFormatada = data_retirada 
        ? new Date(data_retirada + 'T00:00:00').toLocaleDateString('pt-BR') 
        : 'Data não informada';

      await Notificacao.create({
        id_usuario: id_usuario_empresa,
        tipo: 'agendamento_retirada',
        titulo: `Retirada agendada: ${solicitacao.Doacao?.titulo || 'Doação'}`,
        mensagem: `A ONG ${solicitacao.Ong?.Usuario?.nome || 'Uma ONG'} agendou a retirada para ${dataFormatada} às ${horario_retirada || 'horário não informado'}`,
        lida: false,
        dados_extras: JSON.stringify({
          id_retirada: retirada.id_retirada,
          id_solicitacao: solicitacao.id_solicitacao,
          id_doacao: solicitacao.Doacao?.id_doacao,
          nome_ong: solicitacao.Ong?.Usuario?.nome,
          responsavel_retirada,
          tipo_transporte,
          data_retirada,
          horario_retirada,
          observacoes
        })
      });

      console.log("🔔 Notificação criada para empresa (ID usuário:", id_usuario_empresa, ")");
    } else {
      console.warn("⚠️ Não foi possível criar notificação: id_usuario da empresa não encontrado");
    }

    return res.status(201).json(retirada);
  } catch (error) {
    console.error("❌ Erro ao criar retirada:", error);
    console.error("Stack:", error.stack);
    return res.status(500).json({ error: "Erro ao criar retirada." });
  }
};


// ================================
// ✏️ EDITAR AGENDAMENTO
// ================================
export const editarRetirada = async (req, res) => {
  try {
    const { id } = req.params;

    const retirada = await Retirada.findByPk(id);
    if (!retirada) {
      return res.status(404).json({ error: "Retirada não encontrada." });
    }

    await retirada.update(req.body);

    return res.json({ message: "Retirada atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar retirada:", error);
    return res.status(500).json({ error: "Erro ao editar retirada." });
  }
};


// ================================
// ❌ EXCLUIR AGENDAMENTO
// ================================
export const excluirAgendamento = async (req, res) => {
  try {
    const retirada = await Retirada.findByPk(req.params.id);

    if (!retirada) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    await retirada.destroy();

    return res.json({ message: "Agendamento excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir retirada:", error);
    res.status(500).json({ error: "Erro ao excluir retirada." });
  }
};


// ================================
// 📌 LISTAR TODAS AS RETIRADAS POR ONG - VERSÃO CORRIGIDA
// ================================
export const listarRetiradasPorOng = async (req, res) => {
  try {
    const { id_ong } = req.params;
    
    console.log("🔍 Buscando retiradas para ONG ID:", id_ong);

    // Primeiro, tente buscar de forma simples para verificar se existem retiradas
    const retiradasSimples = await Retirada.findAll({
      include: [
        {
          model: Solicitacao,
          required: true,
          where: { id_ong }
        }
      ]
    });

    console.log(`📊 Encontradas ${retiradasSimples.length} retiradas simples`);

    // Agora busca com todos os includes
    const retiradas = await Retirada.findAll({
      include: [
        {
          model: Solicitacao,
          required: true,
          where: { id_ong },
          include: [
            {
              model: Doacao,
              required: false,
              include: [
                {
                  model: Empresa,
                  as: "Empresa",
                  required: false,
                  include: [
                    {
                      model: Usuario,
                      as: "Usuario",
                      required: false,
                      attributes: ["nome", "email", "telefone"]
                    }
                  ]
                }
              ]
            },
            {
              model: Ong,
              required: false,
              include: [
                {
                  model: Usuario,
                  required: false,
                  attributes: ["nome"]
                }
              ]
            }
          ]
        }
      ],
      order: [["id_retirada", "DESC"]]
    });

    console.log(`✅ Retornando ${retiradas.length} retiradas com dados completos`);
    return res.json(retiradas);
    
  } catch (error) {
    console.error("❌ Erro detalhado ao buscar retiradas por ONG:", error);
    console.error("Stack:", error.stack);
    return res.status(500).json({ 
      error: "Erro ao buscar retiradas.",
      detalhes: error.message 
    });
  }
};

// ================================
// 🔍 VERIFICAR SE A SOLICITAÇÃO JÁ TEM RETIRADA
// ================================
export const verificarAgendamento = async (req, res) => {
  try {
    const { id_solicitacao } = req.params;

    const agendamentoExistente = await Retirada.findOne({
      where: { id_solicitacao },
    });

    if (agendamentoExistente) {
      return res.status(200).json({
        agendado: true,
        mensagem: "Essa solicitação já possui agendamento.",
        dados: agendamentoExistente,
      });
    }

    return res.status(200).json({
      agendado: false,
      mensagem: "Nenhum agendamento encontrado para essa solicitação.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao verificar agendamento." });
  }
};