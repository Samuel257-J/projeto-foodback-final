import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensagem("Carregando...");

  try {
    const resposta = await fetch("http://127.0.0.1:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();
    console.log("🔐 Dados do login:", dados); // LOG 1

    if (resposta.ok) {
      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));

      const tipoEndpoint = dados.usuario.tipo_usuario === "empresa" ? "empresa" : "ong";
      console.log("🔍 Tipo endpoint:", tipoEndpoint); // LOG 2
      console.log("🆔 ID usuário:", dados.usuario.id_usuario); // LOG 3
      
      const urlVerificacao = `http://127.0.0.1:3001/${tipoEndpoint}/perfil-completo/${dados.usuario.id_usuario}`;
      console.log("🌐 URL verificação:", urlVerificacao); // LOG 4
      
      const verificacao = await fetch(urlVerificacao);
      const resultadoVerificacao = await verificacao.json();
      console.log("✅ Resultado verificação:", resultadoVerificacao); // LOG 5
      console.log("📊 Tipo de perfil_completo:", typeof resultadoVerificacao.perfil_completo); // LOG 6
      console.log("📊 Valor exato:", resultadoVerificacao.perfil_completo); // LOG 7

      setMensagem("Login bem-sucedido! Redirecionando...");

      setTimeout(() => {
        console.log("🎯 Verificando condição..."); // LOG 8
        console.log("🎯 Condição 1:", resultadoVerificacao.perfil_completo === true); // LOG 9
        console.log("🎯 Condição 2:", resultadoVerificacao.perfil_completo === 1); // LOG 10
        
        if (resultadoVerificacao.perfil_completo === true || resultadoVerificacao.perfil_completo === 1) {
          console.log("✅ PERFIL COMPLETO - Redirecionando para home"); // LOG 11
          if (dados.usuario.tipo_usuario === "empresa") {
            navigate("/home-empresa");
          } else if (dados.usuario.tipo_usuario === "ong") {
            navigate("/home-ong");
          } else {
            navigate("/home");
          }
        } else {
          console.log("⚠️ PERFIL INCOMPLETO - Indo para completar perfil"); // LOG 12
          navigate("/completar-perfil");
        }
      }, 800);
    } else {
      setMensagem(dados.error || "Erro no login.");
    }
  } catch (erro) {
    console.error("❌ Erro ao logar:", erro);
    setMensagem("Erro ao conectar com o servidor.");
  }
};

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const emailRecuperacao = prompt("Digite seu e-mail para redefinir a senha:");
    
    if (!emailRecuperacao) return;

    try {
      const resposta = await fetch("http://127.0.0.1:3001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRecuperacao }),
      });

      const dados = await resposta.json();
      alert(dados.message || dados.error);
    } catch (erro) {
      console.error("Erro ao recuperar senha:", erro);
      alert("Erro ao enviar o e-mail.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>E-mail</label>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Senha</label>
      <div className="campo-senha">
        <input
          type={mostrarSenha ? "text" : "password"}
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <span
          className="icone-senha"
          onClick={() => setMostrarSenha(!mostrarSenha)}
        >
          {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <a
        href="#"
        className="forgot-password"
        onClick={handleForgotPassword}
      >
        Esqueceu a sua senha?
      </a>

      <button type="submit" className="btn-login">
        LOGAR
      </button>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </form>
  );
}

export default LoginForm;