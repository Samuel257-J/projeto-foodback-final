import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompletarPerfil.css";

function CompletarPerfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Dados do formulário
  const [dados, setDados] = useState({
    // Campos comuns
    descricao: "",
    capacidade_armazenamento: "",
    telefone_responsavel: "",
    horarios_disponiveis: "",

    // Campos específicos de Empresa
    razao_social: "",
    tipo_empresa: "",
    volume_medio_doacao: "",
    frequencia_doacao: "",
    observacoes: "",
    responsavel_logistica: "",
    pode_entregar: false,

    // Campos específicos de ONG
    natureza_juridica: "",
    area_atuacao: "",
    ano_fundacao: "",
    numero_pessoas_atendidas: "",
    tipo_publico: "",
    necessidades: "",
    possui_transporte: false,
    responsavel_recebimento: "",
  });

  useEffect(() => {
    // Pega os dados do usuário do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDados({
      ...dados,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("Salvando informações...");

    try {
      // ✅ CORRIGIDO: Usa as rotas corretas
      const tipoEndpoint = usuario.tipo_usuario === "empresa" ? "empresa" : "ong";
      const url = `http://127.0.0.1:3001/${tipoEndpoint}/atualizar/${usuario.id_usuario}`;

      const resposta = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        setMensagem("Perfil completado com sucesso! Redirecionando...");
        
        setTimeout(() => {
          if (usuario.tipo_usuario === "empresa") {
            navigate("/home-empresa");
          } else if (usuario.tipo_usuario === "ong") {
            navigate("/home-ong");
          } else {
            navigate("/home");
          }
        }, 1500);
      } else {
        setMensagem(resultado.error || "Erro ao salvar informações.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setMensagem("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  if (!usuario) return <div>Carregando...</div>;

  const isEmpresa = usuario.tipo_usuario === "empresa";
  const isOng = usuario.tipo_usuario === "ong";

  return (
    <div className="completar-perfil-wrapper">
      <div className="completar-perfil-container">
        <h1>Complete seu Perfil</h1>
        <p className="subtitulo">
          Olá, <strong>{usuario.nome}</strong>! Para continuar, precisamos de
          algumas informações adicionais.
        </p>

        <form className="completar-perfil-form" onSubmit={handleSubmit}>
          {/* ============ CAMPOS PARA EMPRESA ============ */}
          {isEmpresa && (
            <>
              <h2>Informações da Empresa</h2>

              <label>Razão Social *</label>
              <input
                type="text"
                name="razao_social"
                value={dados.razao_social}
                onChange={handleChange}
                placeholder="Ex: Alimentos Exemplo LTDA"
                required
              />

              <label>Tipo de Empresa *</label>
              <select
                name="tipo_empresa"
                value={dados.tipo_empresa}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Restaurante">Restaurante</option>
                <option value="Supermercado">Supermercado</option>
                <option value="Padaria">Padaria</option>
                <option value="Hotel">Hotel</option>
                <option value="Indústria Alimentícia">Indústria Alimentícia</option>
                <option value="Atacadista">Atacadista</option>
                <option value="Outro">Outro</option>
              </select>

              <label>Volume Médio de Doação</label>
              <input
                type="text"
                name="volume_medio_doacao"
                value={dados.volume_medio_doacao}
                onChange={handleChange}
                placeholder="Ex: 50kg, 100 refeições"
              />

              <label>Frequência de Doação</label>
              <select
                name="frequencia_doacao"
                value={dados.frequencia_doacao}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="Diária">Diária</option>
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
                <option value="Esporádica">Esporádica</option>
              </select>

              <label>Responsável pela Logística</label>
              <input
                type="text"
                name="responsavel_logistica"
                value={dados.responsavel_logistica}
                onChange={handleChange}
                placeholder="Nome do responsável"
              />

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="pode_entregar"
                  checked={dados.pode_entregar}
                  onChange={handleChange}
                />
                A empresa pode realizar a entrega
              </label>
            </>
          )}

          {/* ============ CAMPOS PARA ONG ============ */}
          {isOng && (
            <>
              <h2>Informações da ONG</h2>

              <label>Natureza Jurídica *</label>
              <select
                name="natureza_juridica"
                value={dados.natureza_juridica}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Associação">Associação</option>
                <option value="Fundação">Fundação</option>
                <option value="Instituto">Instituto</option>
                <option value="ONG">ONG</option>
                <option value="OSCIP">OSCIP</option>
                <option value="Outro">Outro</option>
              </select>

              <label>Área de Atuação *</label>
              <input
                type="text"
                name="area_atuacao"
                value={dados.area_atuacao}
                onChange={handleChange}
                placeholder="Ex: Assistência Social, Educação"
                required
              />

              <label>Ano de Fundação</label>
              <input
                type="number"
                name="ano_fundacao"
                value={dados.ano_fundacao}
                onChange={handleChange}
                placeholder="Ex: 2010"
                min="1900"
                max={new Date().getFullYear()}
              />

              <label>Número de Pessoas Atendidas</label>
              <input
                type="number"
                name="numero_pessoas_atendidas"
                value={dados.numero_pessoas_atendidas}
                onChange={handleChange}
                placeholder="Ex: 100"
                min="0"
              />

              <label>Tipo de Público Atendido</label>
              <input
                type="text"
                name="tipo_publico"
                value={dados.tipo_publico}
                onChange={handleChange}
                placeholder="Ex: Crianças, Idosos, Famílias em vulnerabilidade"
              />

              <label>Necessidades Principais</label>
              <textarea
                name="necessidades"
                value={dados.necessidades}
                onChange={handleChange}
                placeholder="Descreva os tipos de alimentos ou recursos que mais precisa"
                rows="3"
              />

              <label>Responsável pelo Recebimento</label>
              <input
                type="text"
                name="responsavel_recebimento"
                value={dados.responsavel_recebimento}
                onChange={handleChange}
                placeholder="Nome do responsável"
              />

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="possui_transporte"
                  checked={dados.possui_transporte}
                  onChange={handleChange}
                />
                A ONG possui transporte próprio
              </label>
            </>
          )}

          {/* ============ CAMPOS COMUNS ============ */}
          <h2>Informações Operacionais</h2>

          <label>Descrição {isEmpresa ? "da Empresa" : "da ONG"}</label>
          <textarea
            name="descricao"
            value={dados.descricao}
            onChange={handleChange}
            placeholder="Conte um pouco sobre sua organização"
            rows="4"
          />

          <label>Capacidade de Armazenamento</label>
          <input
            type="text"
            name="capacidade_armazenamento"
            value={dados.capacidade_armazenamento}
            onChange={handleChange}
            placeholder="Ex: Geladeira 500L, Freezer 300L"
          />

          <label>Telefone do Responsável</label>
          <input
            type="tel"
            name="telefone_responsavel"
            value={dados.telefone_responsavel}
            onChange={handleChange}
            placeholder="(XX) XXXXX-XXXX"
          />

          <label>Horários Disponíveis</label>
          <input
            type="text"
            name="horarios_disponiveis"
            value={dados.horarios_disponiveis}
            onChange={handleChange}
            placeholder="Ex: Segunda a Sexta, 9h às 17h"
          />

          {isEmpresa && (
            <>
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={dados.observacoes}
                onChange={handleChange}
                placeholder="Informações adicionais relevantes"
                rows="3"
              />
            </>
          )}

          <button type="submit" className="btn-completar" disabled={loading}>
            {loading ? "SALVANDO..." : "COMPLETAR PERFIL"}
          </button>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}

export default CompletarPerfil;