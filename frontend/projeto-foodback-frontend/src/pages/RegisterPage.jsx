import React, { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("ong");
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    endereco_cep: "",
    endereco_rua: "",
    endereco_numero: "",
    endereco_bairro: "",
    endereco_cidade: "",
    endereco_estado: "",
    cnpj: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  // Função para buscar CEP
  const buscarCep = async (cep) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMensagem("CEP não encontrado.");
        setBuscandoCep(false);
        return;
      }

      // Preenche os campos automaticamente
      setDados({
        ...dados,
        endereco_cep: cepLimpo,
        endereco_rua: data.logradouro || "",
        endereco_bairro: data.bairro || "",
        endereco_cidade: data.localidade || "",
        endereco_estado: data.uf || "",
      });

      setMensagem("");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setMensagem("Erro ao buscar CEP.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (e) => {
    const cep = e.target.value;
    setDados({ ...dados, endereco_cep: cep });

    // Busca automaticamente quando o CEP tiver 8 dígitos
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarCep(cep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Cadastrando...");

    try {
      const url =
        tipo === "ong"
          ? "http://127.0.0.1:3001/ong/cadastrar"
          : "http://127.0.0.1:3001/empresa/cadastrar";

      const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const dadosResposta = await resposta.json();

      if (resposta.ok) {
        setMensagem("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);

        setDados({
          nome: "",
          email: "",
          senha: "",
          telefone: "",
          endereco_cep: "",
          endereco_rua: "",
          endereco_numero: "",
          endereco_bairro: "",
          endereco_cidade: "",
          endereco_estado: "",
          cnpj: "",
        });
      } else {
        setMensagem(dadosResposta.error || "Erro no cadastro.");
      }
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-left">
          <h1>
            <span className="logo-food">Food</span>
            <span className="logo-back">Back</span>
          </h1>
          <p>Transforme o desperdício em solidariedade!</p>
        </div>

        <div className="register-right">
          <h2>Cadastro</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Tipo de cadastro</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="ong"
                  checked={tipo === "ong"}
                  onChange={() => setTipo("ong")}
                />
                ONG
              </label>

              <label>
                <input
                  type="radio"
                  value="empresa"
                  checked={tipo === "empresa"}
                  onChange={() => setTipo("empresa")}
                />
                Empresa
              </label>
            </div>

            <label>{tipo === "ong" ? "Nome da ONG" : "Nome da Empresa"}</label>
            <input
              type="text"
              name="nome"
              value={dados.nome}
              onChange={handleChange}
              placeholder={
                tipo === "ong"
                  ? "Digite o nome da ONG"
                  : "Digite o nome da empresa"
              }
              required
            />

            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={dados.email}
              onChange={handleChange}
              placeholder={
                tipo === "ong"
                  ? "Digite o e-mail da ONG"
                  : "Digite o e-mail da empresa"
              }
              required
            />

            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={dados.senha}
              onChange={handleChange}
              placeholder="Crie uma senha"
              required
            />

            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={dados.telefone}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              required
            />

            <label>CNPJ {tipo === "ong" ? "da ONG" : "da Empresa"}</label>
            <input
              type="text"
              name="cnpj"
              value={dados.cnpj}
              onChange={handleChange}
              placeholder={
                tipo === "ong"
                  ? "Digite o CNPJ da ONG"
                  : "Digite o CNPJ da empresa"
              }
              required
            />

            {/* === CAMPOS DE ENDEREÇO === */}
            <div className="endereco-section">
              <h3>Endereço</h3>

              <label>CEP</label>
              <input
                type="text"
                name="endereco_cep"
                value={dados.endereco_cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength="9"
                required
              />
              {buscandoCep && (
                <p className="cep-loading">Buscando CEP...</p>
              )}

              <div className="endereco-row">
                <div className="endereco-col">
                  <label>Estado</label>
                  <input
                    type="text"
                    name="endereco_estado"
                    value={dados.endereco_estado}
                    onChange={handleChange}
                    placeholder="UF"
                    maxLength="2"
                    required
                  />
                </div>

                <div className="endereco-col endereco-col-large">
                  <label>Cidade</label>
                  <input
                    type="text"
                    name="endereco_cidade"
                    value={dados.endereco_cidade}
                    onChange={handleChange}
                    placeholder="Nome da cidade"
                    required
                  />
                </div>
              </div>

              <label>Bairro</label>
              <input
                type="text"
                name="endereco_bairro"
                value={dados.endereco_bairro}
                onChange={handleChange}
                placeholder="Nome do bairro"
                required
              />

              <div className="endereco-row">
                <div className="endereco-col endereco-col-large">
                  <label>Rua</label>
                  <input
                    type="text"
                    name="endereco_rua"
                    value={dados.endereco_rua}
                    onChange={handleChange}
                    placeholder="Nome da rua"
                    required
                  />
                </div>

                <div className="endereco-col endereco-col-small">
                  <label>Número</label>
                  <input
                    type="text"
                    name="endereco_numero"
                    value={dados.endereco_numero}
                    onChange={handleChange}
                    placeholder="Nº"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-register">
              CADASTRAR
            </button>

            <p className="mensagem">{mensagem}</p>

            <p className="link-login">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;