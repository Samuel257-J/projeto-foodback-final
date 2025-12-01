import React, { useState } from "react";
import "./RegisterForm.css";

function RegisterForm() {
  const [tipoCadastro, setTipoCadastro] = useState("pessoa");
  const [papel, setPapel] = useState("doador");
  const [formData, setFormData] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    senha: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    idade: "",
    motivo_cadastro: "",
    nome_fantasia: "",
    tipo_estabelecimento: "",
    horario_funcionamento: "",
    descricao: "",
    responsavel_contato: "",
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Enviando...");

    try {
      const resposta = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipoCadastro, papel, ...formData }),
      });

      const dados = await resposta.json();
      if (resposta.ok) {
        setMensagem("Cadastro realizado com sucesso!");
      } else {
        setMensagem(dados.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-logo">
        <span className="food">Food</span>
        <span className="back">Back</span>
      </h1>
      <h2>Cadastro no sistema</h2>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Tipo de cadastro */}
        <label>Sou:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="tipoCadastro"
              value="pessoa"
              checked={tipoCadastro === "pessoa"}
              onChange={(e) => setTipoCadastro(e.target.value)}
            />
            Pessoa Física
          </label>
          <label>
            <input
              type="radio"
              name="tipoCadastro"
              value="empresa"
              checked={tipoCadastro === "empresa"}
              onChange={(e) => setTipoCadastro(e.target.value)}
            />
            Empresa / Estabelecimento
          </label>
        </div>

        {/* Papel no sistema */}
        <label>Função no sistema:</label>
        <select
          value={papel}
          onChange={(e) => setPapel(e.target.value)}
          required
        >
          <option value="doador">Doador</option>
          <option value="receptor">Receptor</option>
          <option value="voluntario">Voluntário</option>
        </select>

        {/* Campos comuns */}
        <label>Nome completo / Razão social</label>
        <input
          type="text"
          name="nome"
          placeholder="Digite o nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>CPF / CNPJ</label>
        <input
          type="text"
          name="cpf_cnpj"
          placeholder="Digite o CPF ou CNPJ"
          value={formData.cpf_cnpj}
          onChange={handleChange}
          required
        />

        <label>E-mail</label>
        <input
          type="email"
          name="email"
          placeholder="Digite o e-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          name="senha"
          placeholder="Crie uma senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />

        <label>Telefone / WhatsApp</label>
        <input
          type="text"
          name="telefone"
          placeholder="(00) 00000-0000"
          value={formData.telefone}
          onChange={handleChange}
        />

        <label>Endereço</label>
        <input
          type="text"
          name="endereco"
          placeholder="Rua, número, bairro..."
          value={formData.endereco}
          onChange={handleChange}
        />

        <div className="form-row">
          <div>
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Estado</label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Campos específicos */}
        {tipoCadastro === "empresa" && (
          <>
            <label>Nome Fantasia</label>
            <input
              type="text"
              name="nome_fantasia"
              value={formData.nome_fantasia}
              onChange={handleChange}
            />

            <label>Tipo de Estabelecimento</label>
            <input
              type="text"
              name="tipo_estabelecimento"
              placeholder="Ex: restaurante, mercado..."
              value={formData.tipo_estabelecimento}
              onChange={handleChange}
            />

            <label>Horário de Funcionamento</label>
            <input
              type="text"
              name="horario_funcionamento"
              placeholder="Ex: 08h às 18h"
              value={formData.horario_funcionamento}
              onChange={handleChange}
            />

            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Fale um pouco sobre o local..."
              value={formData.descricao}
              onChange={handleChange}
            />

            <label>Responsável pelo Contato</label>
            <input
              type="text"
              name="responsavel_contato"
              value={formData.responsavel_contato}
              onChange={handleChange}
            />
          </>
        )}

        {tipoCadastro === "pessoa" && (
          <>
            <label>Idade</label>
            <input
              type="number"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
            />

            <label>Motivo do Cadastro</label>
            <textarea
              name="motivo_cadastro"
              placeholder="Ex: Quero doar alimentos, receber, ou ser voluntário..."
              value={formData.motivo_cadastro}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit" className="btn-register">
          CADASTRAR
        </button>

        <p className="mensagem">{mensagem}</p>
      </form>
    </div>
  );
}

export default RegisterForm;
