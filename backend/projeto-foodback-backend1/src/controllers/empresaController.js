import { cnpj } from "cpf-cnpj-validator";
import db from "../models/index.js";

const Usuario = db.Usuario;
const Empresa = db.Empresa;

class EmpresaController {
  async cadastrar(req, res) {
    const {
      nome,
      email,
      senha,
      telefone,
      endereco_rua,
      endereco_numero,
      endereco_bairro,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      cnpj: cnpjRecebido,
      razao_social,
      tipo_empresa,
      descricao,
      volume_medio_doacao,
      frequencia_doacao,
      observacoes,
      responsavel_logistica,
      telefone_responsavel,
      horarios_disponiveis,
      pode_entregar,
      capacidade_armazenamento
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
        tipo_usuario: "empresa",
        status_conta: "ativo"
      });

      // 2️⃣ Cria a Empresa vinculada ao usuário
      const empresaCriada = await Empresa.create({
        id_usuario: usuario.id_usuario,
        razao_social,
        tipo_empresa,
        descricao,
        volume_medio_doacao,
        frequencia_doacao,
        observacoes,
        responsavel_logistica,
        telefone_responsavel,
        horarios_disponiveis,
        pode_entregar,
        capacidade_armazenamento,
        perfil_completo: false // ✅ Inicia como false
      });

      return res.status(201).json({ usuario, empresa: empresaCriada });
    } catch (error) {
      console.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "E-mail ou CNPJ já cadastrado." });
      }
      return res.status(500).json({ error: "Erro ao cadastrar empresa." });
    }
  }

  // ✅ Atualizar/Completar perfil da empresa
  async atualizarDados(req, res) {
    const { id_usuario } = req.params;
    const {
      razao_social,
      tipo_empresa,
      descricao,
      volume_medio_doacao,
      frequencia_doacao,
      observacoes,
      responsavel_logistica,
      telefone_responsavel,
      horarios_disponiveis,
      pode_entregar,
      capacidade_armazenamento
    } = req.body;

    try {
      // Verifica se o usuário existe e é do tipo empresa
      const usuario = await Usuario.findOne({ 
        where: { id_usuario, tipo_usuario: "empresa" } 
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Verifica se já existe registro de empresa
      let empresa = await Empresa.findOne({ where: { id_usuario } });

      if (empresa) {
        // Atualiza os dados existentes e marca perfil como completo
        await empresa.update({
          razao_social,
          tipo_empresa,
          descricao,
          volume_medio_doacao,
          frequencia_doacao,
          observacoes,
          responsavel_logistica,
          telefone_responsavel,
          horarios_disponiveis,
          pode_entregar,
          capacidade_armazenamento,
          perfil_completo: true // ✅ Marca como completo
        });
      } else {
        // Cria novo registro já marcando como completo
        empresa = await Empresa.create({
          id_usuario,
          razao_social,
          tipo_empresa,
          descricao,
          volume_medio_doacao,
          frequencia_doacao,
          observacoes,
          responsavel_logistica,
          telefone_responsavel,
          horarios_disponiveis,
          pode_entregar,
          capacidade_armazenamento,
          perfil_completo: true // ✅ Marca como completo
        });
      }

      return res.status(200).json({ 
        success: true,
        message: "Perfil completado com sucesso!",
        empresa 
      });

    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      return res.status(500).json({ error: "Erro ao atualizar dados da empresa." });
    }
  }

  // ✅ Buscar dados da empresa
  async buscarDados(req, res) {
    const { id_usuario } = req.params;

    try {
      const empresa = await Empresa.findOne({ where: { id_usuario } });

      if (!empresa) {
        return res.status(404).json({ error: "Dados da empresa não encontrados." });
      }

      return res.status(200).json(empresa);
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      return res.status(500).json({ error: "Erro ao buscar dados da empresa." });
    }
  }

  // ✅ NOVO - Verificar se perfil está completo
  async verificarPerfilCompleto(req, res) {
    const { id_usuario } = req.params;

    try {
      const empresa = await Empresa.findOne({ 
        where: { id_usuario },
        attributes: ['perfil_completo'] // Retorna apenas o campo necessário
      });

      if (!empresa) {
        return res.status(404).json({ 
          error: "Empresa não encontrada",
          perfil_completo: false 
        });
      }

      return res.status(200).json({ 
        perfil_completo: empresa.perfil_completo || false 
      });

    } catch (error) {
      console.error("Erro ao verificar perfil da empresa:", error);
      return res.status(500).json({ 
        error: "Erro ao verificar perfil",
        perfil_completo: false 
      });
    }
  }
}

export default new EmpresaController();