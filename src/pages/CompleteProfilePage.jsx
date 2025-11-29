import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompleteProfilePage.css";

function CompleteProfilePage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [dados, setDados] = useState({});
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    // Pega os dados do usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }

    setUsuario(usuarioLogado);

    // Inicializa os campos vazios baseado no tipo de usuário
    if (usuarioLogado.tipo_usuario === "empresa") {
      setDados({
        razao_social: "",
        tipo_empresa: "",
        descricao: "",
        volume_medio_doacao: "",
        frequencia_doacao: "",
        observacoes: "",
        responsavel_logistica: "",
        telefone_responsavel: "",
        horarios_disponiveis: "",
        pode_entregar: false,
        capacidade_armazenamento: ""
      });
    } else {
      setDados({
        natureza_juridica: "",
        area_atuacao: "",
        descricao: "",
        ano_fundacao: "",
        numero_pessoas_atendidas: "",
        tipo_publico: "",
        necessidades: "",
        capacidade_armazenamento: "",
        possui_transporte: false,
        responsavel_recebimento: "",
        telefone_responsavel: "",
        horarios_disponiveis: ""
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDados({
      ...dados,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Salvando...");

    try {
      const tipo = usuario.tipo_usuario;
      const url = `http://127.0.0.1:3001/${tipo}/atualizar/${usuario.id_usuario}`;

      const resposta = await fetch(url, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        setMensagem("Dados salvos com sucesso! Redirecionando...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMensagem(resultado.error || "Erro ao salvar dados.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  if (!usuario) return <div>Carregando...</div>;

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-box">
        <h2>Complete seu cadastro</h2>
        <p className="subtitle">
          Olá, {usuario.nome}! Complete suas informações para continuar.
        </p>

        <form onSubmit={handleSubmit} className="complete-form">
          {usuario.tipo_usuario === "empresa" ? (
            <>
              <label>Razão Social *</label>
              <input
                type="text"
                name="razao_social"
                value={dados.razao_social}
                onChange={handleChange}
                placeholder="Nome completo da empresa"
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
                <option value="Cafeteria">Cafeteria</option>
                <option value="Outro">Outro</option>
              </select>

              <label>Descrição da Empresa</label>
              <textarea
                name="descricao"
                value={dados.descricao}
                onChange={handleChange}
                placeholder="Conte um pouco sobre sua empresa..."
                rows="4"
              />

              <label>Volume Médio de Doação</label>
              <input
                type="text"
                name="volume_medio_doacao"
                value={dados.volume_medio_doacao}
                onChange={handleChange}
                placeholder="Ex: 50kg por semana"
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
                <option value="Eventual">Eventual</option>
              </select>

              <label>Responsável pela Logística *</label>
              <input
                type="text"
                name="responsavel_logistica"
                value={dados.responsavel_logistica}
                onChange={handleChange}
                placeholder="Nome do responsável"
                required
              />

              <label>Telefone do Responsável *</label>
              <input
                type="tel"
                name="telefone_responsavel"
                value={dados.telefone_responsavel}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                required
              />

              <label>Horários Disponíveis para Coleta</label>
              <input
                type="text"
                name="horarios_disponiveis"
                value={dados.horarios_disponiveis}
                onChange={handleChange}
                placeholder="Ex: Seg-Sex 14h-18h"
              />

              <label>Capacidade de Armazenamento</label>
              <input
                type="text"
                name="capacidade_armazenamento"
                value={dados.capacidade_armazenamento}
                onChange={handleChange}
                placeholder="Ex: Refrigerado, 100kg"
              />

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="pode_entregar"
                  checked={dados.pode_entregar}
                  onChange={handleChange}
                />
                Pode realizar entrega das doações
              </label>

              <label>Observações</label>
              <textarea
                name="observacoes"
                value={dados.observacoes}
                onChange={handleChange}
                placeholder="Informações adicionais..."
                rows="3"
              />
            </>
          ) : (
            <>
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
                <option value="OSCIP">OSCIP</option>
                <option value="Outro">Outro</option>
              </select>

              <label>Área de Atuação *</label>
              <input
                type="text"
                name="area_atuacao"
                value={dados.area_atuacao}
                onChange={handleChange}
                placeholder="Ex: Assistência social, educação..."
                required
              />

              <label>Descrição da ONG</label>
              <textarea
                name="descricao"
                value={dados.descricao}
                onChange={handleChange}
                placeholder="Conte sobre o trabalho da ONG..."
                rows="4"
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
                placeholder="Quantidade aproximada"
              />

              <label>Tipo de Público Atendido</label>
              <input
                type="text"
                name="tipo_publico"
                value={dados.tipo_publico}
                onChange={handleChange}
                placeholder="Ex: Crianças, idosos, famílias..."
              />

              <label>Necessidades Específicas</label>
              <textarea
                name="necessidades"
                value={dados.necessidades}
                onChange={handleChange}
                placeholder="Que tipo de alimentos mais precisa?"
                rows="3"
              />

              <label>Capacidade de Armazenamento</label>
              <input
                type="text"
                name="capacidade_armazenamento"
                value={dados.capacidade_armazenamento}
                onChange={handleChange}
                placeholder="Ex: Geladeira industrial, 200kg"
              />

              <label>Responsável pelo Recebimento *</label>
              <input
                type="text"
                name="responsavel_recebimento"
                value={dados.responsavel_recebimento}
                onChange={handleChange}
                placeholder="Nome do responsável"
                required
              />

              <label>Telefone do Responsável *</label>
              <input
                type="tel"
                name="telefone_responsavel"
                value={dados.telefone_responsavel}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                required
              />

              <label>Horários Disponíveis para Recebimento</label>
              <input
                type="text"
                name="horarios_disponiveis"
                value={dados.horarios_disponiveis}
                onChange={handleChange}
                placeholder="Ex: Seg-Sex 8h-17h"
              />

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="possui_transporte"
                  checked={dados.possui_transporte}
                  onChange={handleChange}
                />
                Possui transporte próprio para coleta
              </label>
            </>
          )}

          <button type="submit" className="btn-save">
            SALVAR E CONTINUAR
          </button>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}

export default CompleteProfilePage;