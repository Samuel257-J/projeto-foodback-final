import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MinhasSolicitacoes.css";
import AgendarRetiradaModal from "./AgendarRetiradaModal";

function MinhasSolicitacoes() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [menuAtivo, setMenuAtivo] = useState("solicitacoes");
  const [modalAberto, setModalAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "ong") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarSolicitacoes(usuarioLogado.id_usuario);
  }, [navigate]);

  const carregarSolicitacoes = async (id_usuario) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:3001/solicitacoes/ong/${id_usuario}`);
      
      if (response.ok) {
        const dados = await response.json();
        console.log("📋 Solicitações carregadas:", dados);
        setSolicitacoes(Array.isArray(dados) ? dados : []);
      } else {
        console.error("Erro ao carregar solicitações:", response.status);
        setSolicitacoes([]);
      }
    } catch (error) {
      console.error("Erro ao conectar com servidor:", error);
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarSolicitacao = async (id_solicitacao) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta solicitação?")) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3001/solicitacoes/cancelar/${id_solicitacao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        alert("Solicitação cancelada com sucesso!");
        carregarSolicitacoes(usuario.id_usuario);
      } else {
        const erro = await response.json();
        alert(erro.error || "Erro ao cancelar solicitação.");
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleAbrirModalRetirada = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setSolicitacaoSelecionada(null);
  };

  const handleSuccessRetirada = () => {
    carregarSolicitacoes(usuario.id_usuario);
  };

  // Filtra solicitações por status
  const solicitacoesFiltradas = solicitacoes.filter(s => {
    if (filtroStatus === "todas") return true;
    return s.status === filtroStatus;
  });

  // Contadores
  const totalPendentes = solicitacoes.filter(s => s.status === "pendente").length;
  const totalAprovadas = solicitacoes.filter(s => s.status === "aprovada").length;
  const totalRecusadas = solicitacoes.filter(s => s.status === "recusada").length;
  const totalConcluidas = solicitacoes.filter(s => s.status === "concluida").length;

  // Função para renderizar badge de status
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pendente: { icon: "⏳", label: "Pendente", class: "minhas-solicitacoes-status-pendente" },
      aprovada: { icon: "✓", label: "Aprovada", class: "minhas-solicitacoes-status-aprovada" },
      recusada: { icon: "✗", label: "Recusada", class: "minhas-solicitacoes-status-recusada" },
      concluida: { icon: "📦", label: "Concluída", class: "minhas-solicitacoes-status-concluida" },
      cancelada: { icon: "🚫", label: "Cancelada", class: "minhas-solicitacoes-status-cancelada" }
    };

    const config = statusConfig[status] || statusConfig.pendente;
    return (
      <span className={`minhas-solicitacoes-status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  if (loading) {
    return <div className="minhas-solicitacoes-loading">Carregando solicitações...</div>;
  }

  return (
    <div className="minhas-solicitacoes-page">
      {/* Header */}
      <header className="minhas-solicitacoes-header-ong">
        <div className="minhas-solicitacoes-header-left">
          <h1 className="minhas-solicitacoes-logo-header">
            <span className="minhas-solicitacoes-logo-food">Food</span>
            <span className="minhas-solicitacoes-logo-back">Back</span>
          </h1>
        </div>
        <div className="minhas-solicitacoes-header-right">
          <span className="minhas-solicitacoes-usuario-nome">Olá, {usuario?.nome}</span>
          <button onClick={handleLogout} className="minhas-solicitacoes-btn-logout">Sair</button>
        </div>
      </header>

      {/* Layout Principal com Sidebar */}
      <div className="minhas-solicitacoes-layout">
        {/* Sidebar */}
        <aside className="minhas-solicitacoes-sidebar">
          <nav className="minhas-solicitacoes-nav-menu">
            <button 
              className={`minhas-solicitacoes-nav-item ${menuAtivo === "dashboard" ? "active" : ""}`}
              onClick={() => { setMenuAtivo("dashboard"); navigate("/home-ong"); }}
            >
              📊 Dashboard
            </button>
            <button 
              className={`minhas-solicitacoes-nav-item ${menuAtivo === "solicitacoes" ? "active" : ""}`}
              onClick={() => setMenuAtivo("solicitacoes")}
            >
              📋 Minhas Solicitações
            </button>
            <button 
              className={`minhas-solicitacoes-nav-item ${menuAtivo === "doacoes" ? "active" : ""}`}
              onClick={() => { setMenuAtivo("doacoes"); navigate("/doacoes-disponiveis"); }}
            >
              🎁 Doações Disponíveis
            </button>
            <button 
              className={`minhas-solicitacoes-nav-item ${menuAtivo === "historico" ? "active" : ""}`}
              onClick={() => { setMenuAtivo("historico"); navigate("/historico-ong"); }}
            >
              📜 Histórico
            </button>
            <button 
              className={`minhas-solicitacoes-nav-item ${menuAtivo === "configuracoes" ? "active" : ""}`}
              onClick={() => { setMenuAtivo("configuracoes"); navigate("/configuracoes-ong"); }}
            >
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="minhas-solicitacoes-content">
          <div className="minhas-solicitacoes-title-header">
            <h2>📋 Minhas Solicitações</h2>
            <p className="subtitle">Acompanhe o status das suas solicitações de doações</p>
          </div>

          {/* Cards de Resumo */}
          <div className="minhas-solicitacoes-resumo-grid">
            <div className="minhas-solicitacoes-resumo-card minhas-solicitacoes-card-pendente">
              <div className="minhas-solicitacoes-resumo-icon">⏳</div>
              <div className="minhas-solicitacoes-resumo-info">
                <h3>{totalPendentes}</h3>
                <p>Pendentes</p>
              </div>
            </div>

            <div className="minhas-solicitacoes-resumo-card minhas-solicitacoes-card-aprovada">
              <div className="minhas-solicitacoes-resumo-icon">✓</div>
              <div className="minhas-solicitacoes-resumo-info">
                <h3>{totalAprovadas}</h3>
                <p>Aprovadas</p>
              </div>
            </div>

            <div className="minhas-solicitacoes-resumo-card minhas-solicitacoes-card-recusada">
              <div className="minhas-solicitacoes-resumo-icon">✗</div>
              <div className="minhas-solicitacoes-resumo-info">
                <h3>{totalRecusadas}</h3>
                <p>Recusadas</p>
              </div>
            </div>

            <div className="minhas-solicitacoes-resumo-card minhas-solicitacoes-card-concluida">
              <div className="minhas-solicitacoes-resumo-icon">📦</div>
              <div className="minhas-solicitacoes-resumo-info">
                <h3>{totalConcluidas}</h3>
                <p>Concluídas</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="minhas-solicitacoes-filtros-container">
            <button 
              className={`minhas-solicitacoes-filtro-btn ${filtroStatus === "todas" ? "active" : ""}`}
              onClick={() => setFiltroStatus("todas")}
            >
              Todas ({solicitacoes.length})
            </button>
            <button 
              className={`minhas-solicitacoes-filtro-btn ${filtroStatus === "pendente" ? "active" : ""}`}
              onClick={() => setFiltroStatus("pendente")}
            >
              Pendentes ({totalPendentes})
            </button>
            <button 
              className={`minhas-solicitacoes-filtro-btn ${filtroStatus === "aprovada" ? "active" : ""}`}
              onClick={() => setFiltroStatus("aprovada")}
            >
              Aprovadas ({totalAprovadas})
            </button>
            <button 
              className={`minhas-solicitacoes-filtro-btn ${filtroStatus === "recusada" ? "active" : ""}`}
              onClick={() => setFiltroStatus("recusada")}
            >
              Recusadas ({totalRecusadas})
            </button>
            <button 
              className={`minhas-solicitacoes-filtro-btn ${filtroStatus === "concluida" ? "active" : ""}`}
              onClick={() => setFiltroStatus("concluida")}
            >
              Concluídas ({totalConcluidas})
            </button>
          </div>

          {/* Lista de Solicitações */}
          {solicitacoesFiltradas.length > 0 ? (
            <div className="minhas-solicitacoes-list">
              {solicitacoesFiltradas.map((solicitacao) => (
                <div key={solicitacao.id_solicitacao} className="minhas-solicitacoes-solicitacao-card">
                  <div className="minhas-solicitacoes-solicitacao-header">
                    <div className="minhas-solicitacoes-solicitacao-titulo">
                      <h3>{solicitacao.Doacao?.titulo || "Doação"}</h3>
                      <span className="minhas-solicitacoes-solicitacao-id">
                        #SOL-{solicitacao.id_solicitacao}
                      </span>
                    </div>
                    {renderStatusBadge(solicitacao.status)}
                  </div>

                  <div className="minhas-solicitacoes-solicitacao-body">
                    <div className="minhas-solicitacoes-info-row">
                      <span className="minhas-solicitacoes-info-label">🏢 Empresa</span>
                      <span className="minhas-solicitacoes-info-value">
                        {solicitacao.Doacao?.Empresa?.Usuario?.nome || "Não informado"}
                      </span>
                    </div>

                    <div className="minhas-solicitacoes-info-row">
                      <span className="minhas-solicitacoes-info-label">📅 Data da Solicitação</span>
                      <span className="minhas-solicitacoes-info-value">
                        {new Date(solicitacao.data_solicitacao).toLocaleString("pt-BR")}
                      </span>
                    </div>

                    {solicitacao.data_resposta && (
                      <div className="minhas-solicitacoes-info-row">
                        <span className="minhas-solicitacoes-info-label">📅 Data da Resposta</span>
                        <span className="minhas-solicitacoes-info-value">
                          {new Date(solicitacao.data_resposta).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    )}

                    {solicitacao.observacoes && (
                      <div className="minhas-solicitacoes-info-row observacoes">
                        <span className="minhas-solicitacoes-info-label">💬 Observações</span>
                        <span className="minhas-solicitacoes-info-value">{solicitacao.observacoes}</span>
                      </div>
                    )}
                  </div>

                  <div className="minhas-solicitacoes-solicitacao-footer">
                    {solicitacao.status === "pendente" && (
                      <button 
                        onClick={() => handleCancelarSolicitacao(solicitacao.id_solicitacao)}
                        className="minhas-solicitacoes-btn-cancelar"
                      >
                        Cancelar Solicitação
                      </button>
                    )}

                    {solicitacao.status === "aprovada" && (
                      <button 
                        onClick={() => handleAbrirModalRetirada(solicitacao)}
                        className="minhas-solicitacoes-btn-agendar"
                      >
                        Agendar Retirada
                      </button>
                    )}

                    <button 
                      onClick={() => navigate(`/solicitacao-detalhes/${solicitacao.id_solicitacao}`)}
                      className="minhas-solicitacoes-btn-detalhes"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="minhas-solicitacoes-empty-state">
              <div className="minhas-solicitacoes-empty-icon">📋</div>
              <h3>Nenhuma solicitação encontrada</h3>
              <p>
                {filtroStatus === "todas" 
                  ? "Você ainda não fez nenhuma solicitação de doação."
                  : `Você não possui solicitações com status "${filtroStatus}".`
                }
              </p>
              <button 
                onClick={() => navigate("/doacoes-disponiveis")}
                className="minhas-solicitacoes-btn-solicitar-doacao"
              >
                Buscar Doações Disponíveis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agendar Retirada */}
      {modalAberto && solicitacaoSelecionada && (
        <AgendarRetiradaModal 
          solicitacao={solicitacaoSelecionada}
          onClose={handleFecharModal}
          onSuccess={handleSuccessRetirada}
        />
      )}
    </div>
  );
}

export default MinhasSolicitacoes;