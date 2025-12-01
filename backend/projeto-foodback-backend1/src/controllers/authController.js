import db from "../models/index.js";
import jwt from "jsonwebtoken";

const { Usuario, Ong, Empresa } = db;

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    try {
      // Busca o usuário pelo e-mail, incluindo dados de ONG e Empresa
      const usuario = await Usuario.findOne({ 
        where: { email },
        include: [
          {
            model: Ong,
            attributes: ['id_ong'],
            required: false
          },
          {
            model: Empresa,
            attributes: ['id_empresa'],
            required: false
          }
        ]
      });

      if (!usuario) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // Verifica a senha (comparação direta porque está em texto plano)
      // ⚠️ ATENÇÃO: Em produção, use bcrypt!
      if (usuario.senha_hash !== senha) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // Verifica se a conta está ativa
      if (usuario.status_conta !== "ativo") {
        return res.status(403).json({ error: "Conta inativa. Entre em contato com o suporte." });
      }

      // Extrai o id_ong ou id_empresa dependendo do tipo de usuário
      let id_ong = null;
      let id_empresa = null;

      if (usuario.tipo_usuario === "ong" && usuario.Ong) {
        id_ong = usuario.Ong.id_ong;
      } else if (usuario.tipo_usuario === "empresa" && usuario.Empresa) {
        id_empresa = usuario.Empresa.id_empresa;
      }

      console.log("✅ Login realizado:", {
        tipo: usuario.tipo_usuario,
        id_ong,
        id_empresa
      });

      // Gera o token JWT
      const token = jwt.sign(
        { 
          id_usuario: usuario.id_usuario, 
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
          id_ong,
          id_empresa
        },
        "sua_chave_secreta_super_segura_123", // ⚠️ Mude isso em produção!
        { expiresIn: "7d" }
      );

      // Retorna os dados do usuário (sem a senha)
      const usuarioRetorno = {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        telefone: usuario.telefone,
        endereco_cidade: usuario.endereco_cidade,
        endereco_estado: usuario.endereco_estado
      };

      // Adiciona id_ong ou id_empresa conforme o tipo
      if (id_ong) {
        usuarioRetorno.id_ong = id_ong;
      }
      if (id_empresa) {
        usuarioRetorno.id_empresa = id_empresa;
      }

      return res.status(200).json({
        token,
        usuario: usuarioRetorno
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ error: "Erro ao realizar login." });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório." });
    }

    try {
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        // Por segurança, não revela se o e-mail existe ou não
        return res.status(200).json({ 
          message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha." 
        });
      }

      // TODO: Implementar envio de e-mail real
      console.log(`📧 Recuperação de senha solicitada para: ${email}`);

      return res.status(200).json({ 
        message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha." 
      });

    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      return res.status(500).json({ error: "Erro ao processar solicitação." });
    }
  }
}

export default new AuthController();