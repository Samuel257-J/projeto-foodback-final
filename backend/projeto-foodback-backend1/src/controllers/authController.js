import db from "../models/index.js";
import jwt from "jsonwebtoken";

const Usuario = db.Usuario;

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    try {
      // Busca o usuário pelo e-mail
      const usuario = await Usuario.findOne({ where: { email } });

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

      // Gera o token JWT
      const token = jwt.sign(
        { 
          id_usuario: usuario.id_usuario, 
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario 
        },
        "sua_chave_secreta_super_segura_123", // ⚠️ Mude isso em produção!
        { expiresIn: "7d" }
      );

      // Retorna os dados do usuário (sem a senha)
      return res.status(200).json({
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
          telefone: usuario.telefone,
          endereco_cidade: usuario.endereco_cidade,
          endereco_estado: usuario.endereco_estado
        }
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