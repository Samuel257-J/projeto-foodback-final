import db from "../models/index.js";

const Usuario = db.Usuario;
const Empresa = db.Empresa;
const Ong = db.Ong;

class PerfilController {
  // Verifica se o perfil está completo
  async verificarPerfil(req, res) {
    const { id_usuario } = req.params;

    try {
      const usuario = await Usuario.findByPk(id_usuario);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      let perfilCompleto = false;

      if (usuario.tipo_usuario === "empresa") {
        const empresa = await Empresa.findOne({ where: { id_usuario } });
        // Verifica se existe E se os campos obrigatórios estão preenchidos
        perfilCompleto = !!(
          empresa && 
          empresa.razao_social && 
          empresa.tipo_empresa
        );
      } else if (usuario.tipo_usuario === "ong") {
        const ong = await Ong.findOne({ where: { id_usuario } });
        // Verifica se existe E se os campos obrigatórios estão preenchidos
        perfilCompleto = !!(
          ong && 
          ong.natureza_juridica && 
          ong.area_atuacao
        );
      }

      return res.status(200).json({ 
        perfilCompleto,
        tipo_usuario: usuario.tipo_usuario // ✅ Retorna o tipo também
      });
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
      return res.status(500).json({ error: "Erro ao verificar perfil." });
    }
  }

  // Atualizar perfil da Empresa
  async atualizarEmpresa(req, res) {
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
      let empresa = await Empresa.findOne({ where: { id_usuario } });

      if (empresa) {
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
          capacidade_armazenamento
        });
      } else {
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
          capacidade_armazenamento
        });
      }

      return res.status(200).json({ 
        message: "Perfil atualizado com sucesso!",
        empresa 
      });
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      return res.status(500).json({ error: "Erro ao atualizar perfil." });
    }
  }

  // Atualizar perfil da ONG
  async atualizarOng(req, res) {
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
      let ong = await Ong.findOne({ where: { id_usuario } });

      if (ong) {
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
          horarios_disponiveis
        });
      } else {
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
          horarios_disponiveis
        });
      }

      return res.status(200).json({ 
        message: "Perfil atualizado com sucesso!",
        ong 
      });
    } catch (error) {
      console.error("Erro ao atualizar ONG:", error);
      return res.status(500).json({ error: "Erro ao atualizar perfil." });
    }
  }
}

export default new PerfilController();