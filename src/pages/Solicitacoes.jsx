import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Solicitacoes.css";

function Solicitacoes() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todas");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "empresa") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarSolicitacoes(usuarioLogado.id_usuario);
  }, [navigate]);

  const carregarSolicitacoes = async (id_usuario) => {
    try {
      console.log("🔍 Buscando solicitações da empresa...");
      
      const response = await fetch(`http://127.0.0.1:3001/solicitacoes/empresa/${id_usuario}`);
      
      if (response.ok) {
        const dados = await response.json();
        console.log("✅ Solicitações carregadas:", dados);
        setSolicitacoes(Array.isArray(dados) ? dados : []);
      } else {
        console.error("❌ Erro ao buscar solicitações:", response.status);
        setSolicitacoes([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar solicitações:", error);
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id_solicitacao) => {
    if (!window.confirm("Deseja aprovar esta solicitação? A doação será reservada para esta ONG.")) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3001/solicitacoes/${id_solicitacao}/aprovar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacoes: "Solicitação aprovada pela empresa" })
      });

      if (response.ok) {
        alert("✅ Solicitação aprovada! A doação foi reservada para a ONG.");
        carregarSolicitacoes(usuario.id_usuario);
      } else {
        const erro = await response.json();
        alert(erro.error || "❌ Erro ao aprovar solicitação.");
      }
    } catch (error) {
      console.error("❌ Erro ao aprovar:", error);
      alert("❌ Erro ao conectar com o servidor.");
    }
  };

  const handleRejeitar = async (id_solicitacao) => {
    const motivo = window.prompt("Deseja adicionar um motivo para a rejeição? (opcional)");
    
    if (motivo === null) return; // Cancelou

    try {
      const response = await fetch(`http://127.0.0.1:3001/solicitacoes/${id_solicitacao}/rejeitar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacoes: motivo || "Solicitação rejeitada" })
      });

      if (response.ok) {
        alert("✅ Solicitação rejeitada.");
        carregarSolicitacoes(usuario.id_usuario);
      } else {
        const erro = await response.json();
        alert(erro.error || "❌ Erro ao rejeitar solicitação.");
      }
    } catch (error) {
      console.error("❌ Erro ao rejeitar:", error);
      alert("❌ Erro ao conectar com o servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando solicitações...</div>;
  }

  // Filtra solicitações
  const solicitacoesFiltradas = filtroStatus === "todas" 
    ? solicitacoes 
    : solicitacoes.filter(s => s.status === filtroStatus);

  // Contadores
  const pendentes = solicitacoes.filter(s => s.status === "pendente").length;
  const aprovadas = solicitacoes.filter(s => s.status === "aprovada").length;
  const rejeitadas = solicitacoes.filter(s => s.status === "rejeitada").length;

  return (
    <div className="solicitacoes-page">
      {/* Header */}
      <header className="header-empresa">
        <div className="header-left">
          <h1 className="logo-header">
            <span className="logo-food">Food</span>
            <span className="logo-back">Back</span>
          </h1>
        </div>
        <div className="header-right">
          <span className="usuario-nome">Olá, {usuario?.nome}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <div className="content-solicitacoes">
        {/* Sidebar */}
        <aside className="sidebar-empresa">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => navigate("/home-empresa")}>
              📊 Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/minhas-doacoes")}>
              🎁 Minhas Doações
            </button>
            <button className="nav-item active">
              📋 Solicitações
              {pendentes > 0 && <span className="badge">{pendentes}</span>}
            </button>
            <button className="nav-item" onClick={() => navigate("/historico")}>
              📚 Histórico
            </button>
            <button className="nav-item" onClick={() => navigate("/perfil-empresa")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-solicitacoes">
          <div className="page-header">
            <h2 className="page-title">📋 Solicitações de Doações</h2>
            <p className="page-subtitle">
              Gerencie as solicitações recebidas das ONGs
            </p>
          </div>

          {/* Cards de Resumo */}
          <div className="resumo-cards">
            <div className="resumo-card card-pendentes" onClick={() => setFiltroStatus("pendente")}>
              <div className="resumo-icon">⏳</div>
              <div className="resumo-info">
                <h3>{pendentes}</h3>
                <p>Pendentes</p>
              </div>
            </div>

            <div className="resumo-card card-aprovadas" onClick={() => setFiltroStatus("aprovada")}>
              <div className="resumo-icon">✅</div>
              <div className="resumo-info">
                <h3>{aprovadas}</h3>
                <p>Aprovadas</p>
              </div>
            </div>

            <div className="resumo-card card-rejeitadas" onClick={() => setFiltroStatus("rejeitada")}>
              <div className="resumo-icon">❌</div>
              <div className="resumo-info">
                <h3>{rejeitadas}</h3>
                <p>Rejeitadas</p>
              </div>
            </div>

            <div className="resumo-card card-todas" onClick={() => setFiltroStatus("todas")}>
              <div className="resumo-icon">📊</div>
              <div className="resumo-info">
                <h3>{solicitacoes.length}</h3>
                <p>Total</p>
              </div>
            </div>
          </div>

          {/* Filtro de Status */}
          <div className="filtro-container">
            <label>Filtrar por status:</label>
            <select 
              value={filtroStatus} 
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="select-filtro"
            >
              <option value="todas">Todas as solicitações</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovada">Aprovadas</option>
              <option value="rejeitada">Rejeitadas</option>
              <option value="concluida">Concluídas</option>
            </select>
          </div>

          {/* Lista de Solicitações */}
          {solicitacoesFiltradas.length > 0 ? (
            <div className="solicitacoes-lista">
              {solicitacoesFiltradas.map((solicitacao) => (
                <div key={solicitacao.id_solicitacao} className={`solicitacao-item status-${solicitacao.status}`}>
                  <div className="solicitacao-header">
                    <div className="solicitacao-numero">
                      <span className="label">Solicitação #</span>
                      <span className="numero">{solicitacao.id_solicitacao}</span>
                    </div>
                    <span className={`badge-status badge-${solicitacao.status}`}>
                      {solicitacao.status === "pendente" && "⏳ Pendente"}
                      {solicitacao.status === "aprovada" && "✅ Aprovada"}
                      {solicitacao.status === "rejeitada" && "❌ Rejeitada"}
                      {solicitacao.status === "concluida" && "📦 Concluída"}
                    </span>
                  </div>

                  <div className="solicitacao-body">
                    <div className="info-section">
                      <h4>🎁 Doação Solicitada</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Título:</span>
                          <span className="value">{solicitacao.Doacao?.titulo}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Categoria:</span>
                          <span className="value">{solicitacao.Doacao?.categoria}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Quantidade:</span>
                          <span className="value">{solicitacao.Doacao?.quantidade || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Validade:</span>
                          <span className="value">
                            {new Date(solicitacao.Doacao?.validade).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>🏛️ ONG Solicitante</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Nome:</span>
                          <span className="value">{solicitacao.Ong?.Usuario?.nome}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email:</span>
                          <span className="value">{solicitacao.Ong?.Usuario?.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Telefone:</span>
                          <span className="value">{solicitacao.Ong?.Usuario?.telefone || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Data da Solicitação:</span>
                          <span className="value">
                            {new Date(solicitacao.data_solicitacao).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {solicitacao.observacoes && (
                      <div className="info-section">
                        <h4>📝 Observações</h4>
                        <p className="observacoes">{solicitacao.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {solicitacao.status === "pendente" && (
                    <div className="solicitacao-actions">
                      <button 
                        onClick={() => handleAprovar(solicitacao.id_solicitacao)}
                        className="btn-aprovar"
                      >
                        ✓ Aprovar Solicitação
                      </button>
                      <button 
                        onClick={() => handleRejeitar(solicitacao.id_solicitacao)}
                        className="btn-rejeitar"
                      >
                        ✗ Rejeitar
                      </button>
                    </div>
                  )}

                  {solicitacao.status === "aprovada" && solicitacao.data_resposta && (
                    <div className="info-resposta">
                      <span>✅ Aprovada em {new Date(solicitacao.data_resposta).toLocaleString("pt-BR")}</span>
                    </div>
                  )}

                  {solicitacao.status === "rejeitada" && solicitacao.data_resposta && (
                    <div className="info-resposta rejeitada">
                      <span>❌ Rejeitada em {new Date(solicitacao.data_resposta).toLocaleString("pt-BR")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Nenhuma solicitação encontrada</h3>
              <p>
                {filtroStatus === "todas" 
                  ? "Você ainda não recebeu nenhuma solicitação de doação."
                  : `Não há solicitações com status "${filtroStatus}".`}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Solicitacoes;