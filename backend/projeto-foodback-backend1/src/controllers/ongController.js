import { cnpj } from "cpf-cnpj-validator";
import db from "../models/index.js";

const Usuario = db.Usuario;
const Ong = db.Ong;

class OngController {
  async cadastrar(req, res) {
    const {
      nome,
      email,
      senha, // senha em texto, será salva como senha_hash
      telefone,
      endereco_rua,
      endereco_numero,
      endereco_bairro,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      cnpj: cnpjRecebido,
      natureza_juridica,
      area_atuacao
    } = req.body;

    // Valida CNPJ
    if (!cnpj.isValid(cnpjRecebido)) {
      return res.status(400).json({ error: "CNPJ inválido." });
    }

    try {
      // 1️⃣ Cria o usuário
      const usuario = await Usuario.create({
        nome,
        email,
        senha_hash: senha,
        telefone,
        endereco_rua,
        endereco_numero,
        endereco_bairro,
        endereco_cidade,
        endereco_estado,
        endereco_cep,
        cnpj: cnpjRecebido,
        tipo_usuario: "ong",
        status_conta: "ativo"
      });

      // 2️⃣ Cria a ONG vinculada ao usuário
      const ongCriada = await Ong.create({
        id_usuario: usuario.id_usuario,
        natureza_juridica,
        area_atuacao,
        perfil_completo: false // ✅ Inicia como false
      });

      return res.status(201).json({ usuario, ong: ongCriada });
    } catch (error) {
      console.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "E-mail ou CNPJ já cadastrado." });
      }
      return res.status(500).json({ error: "Erro ao cadastrar ONG." });
    }
  }

  // ✅ Atualizar/Completar perfil da ONG
  async atualizarDados(req, res) {
    const { id_usuario } = req.params;
    const {
      natureza_juridica,
      area_atuacao,
      descricao,
      ano_fundacao,
      numero_pessoas_atendidas,
      tipo_publico,
      necessidades,
      capacidade_armazenamento,
      possui_transporte,
      responsavel_recebimento,
      telefone_responsavel,
      horarios_disponiveis
    } = req.body;

    try {
      // Verifica se o usuário existe e é do tipo ong
      const usuario = await Usuario.findOne({ 
        where: { id_usuario, tipo_usuario: "ong" } 
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Verifica se já existe registro de ong
      let ong = await Ong.findOne({ where: { id_usuario } });

      if (ong) {
        // Atualiza os dados existentes e marca perfil como completo
        await ong.update({
          natureza_juridica,
          area_atuacao,
          descricao,
          ano_fundacao,
          numero_pessoas_atendidas,
          tipo_publico,
          necessidades,
          capacidade_armazenamento,
          possui_transporte,
          responsavel_recebimento,
          telefone_responsavel,
          horarios_disponiveis,
          perfil_completo: true // ✅ Marca como completo
        });
      } else {
        // Cria novo registro já marcando como completo
        ong = await Ong.create({
          id_usuario,
          natureza_juridica,
          area_atuacao,
          descricao,
          ano_fundacao,
          numero_pessoas_atendidas,
          tipo_publico,
          necessidades,
          capacidade_armazenamento,
          possui_transporte,
          responsavel_recebimento,
          telefone_responsavel,
          horarios_disponiveis,
          perfil_completo: true // ✅ Marca como completo
        });
      }

      return res.status(200).json({ 
        success: true,
        message: "Perfil completado com sucesso!",
        ong 
      });

    } catch (error) {
      console.error("Erro ao atualizar ONG:", error);
      return res.status(500).json({ error: "Erro ao atualizar dados da ONG." });
    }
  }

  // ✅ Buscar dados da ONG
  async buscarDados(req, res) {
    const { id_usuario } = req.params;

    try {
      const ong = await Ong.findOne({ where: { id_usuario } });

      if (!ong) {
        return res.status(404).json({ error: "Dados da ONG não encontrados." });
      }

      return res.status(200).json(ong);
    } catch (error) {
      console.error("Erro ao buscar ONG:", error);
      return res.status(500).json({ error: "Erro ao buscar dados da ONG." });
    }
  }

  // ✅ NOVO - Verificar se perfil está completo
  async verificarPerfilCompleto(req, res) {
    const { id_usuario } = req.params;

    try {
      const ong = await Ong.findOne({ 
        where: { id_usuario },
        attributes: ['perfil_completo'] // Retorna apenas o campo necessário
      });

      if (!ong) {
        return res.status(404).json({ 
          error: "ONG não encontrada",
          perfil_completo: false 
        });
      }

      return res.status(200).json({ 
        perfil_completo: ong.perfil_completo || false 
      });

    } catch (error) {
      console.error("Erro ao verificar perfil da ONG:", error);
      return res.status(500).json({ 
        error: "Erro ao verificar perfil",
        perfil_completo: false 
      });
    }
  }
}

export default new OngController();