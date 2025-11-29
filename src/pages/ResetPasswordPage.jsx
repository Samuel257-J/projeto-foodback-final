import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ResetPasswordPage() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token"); // Captura o token da URL
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    setMensagem("Atualizando senha...");

    try {
      const resposta = await fetch("http://127.0.0.1:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nova_senha: senha }),
    });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem("Senha redefinida com sucesso!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensagem(dados.error || "Erro ao redefinir senha.");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Redefinir Senha</h2>
        <form onSubmit={handleSubmit}>
          <label>Nova senha</label>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#2e7d32", color: "#fff", border: "none", borderRadius: "5px" }}>
            Redefinir Senha
          </button>

          {mensagem && (
            <p style={{ marginTop: "10px", color: "green", textAlign: "center" }}>
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
