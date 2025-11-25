import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RetiradasAgendadas.css";

function RetiradasAgendadas() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [retiradas, setRetiradas] = useState([]);
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [busca, setBusca] = useState("");
  const [tipoTransporteFiltro, setTipoTransporteFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("recente");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "ong") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarRetiradas();
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [retiradas, busca, tipoTransporteFiltro, ordenacao]);

  const carregarRetiradas = async () => {
    try {
      console.log("🔍 Buscando retiradas agendadas...");
      
      const response = await fetch(`http://127.0.0.1:3001/retiradas/ong/${JSON.parse(localStorage.getItem("usuario")).id_usuario}`);
      
      if (response.ok) {
        const dados = await response.json();
        console.log("✅ Retiradas carregadas:", dados.length);
        setRetiradas(Array.isArray(dados) ? dados : []);
      } else {
        console.error("❌ Erro ao buscar retiradas:", response.status);
        setRetiradas([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar retiradas:", error);
      setRetiradas([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...retiradas];

    // Filtro de busca
    if (busca.trim()) {
      resultado = resultado.filter(r => 
        r.responsavel_retirada?.toLowerCase().includes(busca.toLowerCase()) ||
        r.tipo_transporte?.toLowerCase().includes(busca.toLowerCase()) ||
        r.observacoes?.toLowerCase().includes(busca.toLowerCase()) ||
        r.Solicitacao?.Doacao?.titulo?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro de tipo de transporte
    if (tipoTransporteFiltro !== "todos") {
      resultado = resultado.filter(r => r.tipo_transporte === tipoTransporteFiltro);
    }

    // Ordenação
    if (ordenacao === "recente") {
      resultado.sort((a, b) => b.id_retirada - a.id_retirada);
    } else if (ordenacao === "antigo") {
      resultado.sort((a, b) => a.id_retirada - b.id_retirada);
    } else if (ordenacao === "responsavel") {
      resultado.sort((a, b) => 
        (a.responsavel_retirada || "").localeCompare(b.responsavel_retirada || "")
      );
    }

    setRetiradasFiltradas(resultado);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando retiradas...</div>;
  }

  // Extrai tipos de transporte únicos para o filtro
  const tiposTransporte = [...new Set(retiradas.map(r => r.tipo_transporte))].filter(Boolean);

  return (
    <div className="retiradas-agendadas-page">
      {/* Header */}
      <header className="header-ong">
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

      <div className="content-retiradas">
        {/* Sidebar */}
        <aside className="sidebar-ong">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => navigate("/home-ong")}>
              📊 Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/doacoes-disponiveis")}>
              🎁 Doações Disponíveis
            </button>
            <button className="nav-item" onClick={() => navigate("/minhas-solicitacoes")}>
              📋 Minhas Solicitações
            </button>
            <button className="nav-item active">
              🚚 Retiradas Agendadas
            </button>
            <button className="nav-item" onClick={() => navigate("/historico-ong")}>
              📚 Histórico
            </button>
            <button className="nav-item" onClick={() => navigate("/perfil-ong")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-retiradas">
          <div className="page-header">
            <h2 className="page-title">🚚 Retiradas Agendadas</h2>
            <p className="page-subtitle">
              {retiradasFiltradas.length} {retiradasFiltradas.length === 1 ? 'retirada agendada' : 'retiradas agendadas'}
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="filtros-container">
            <div className="filtro-busca">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="🔍 Buscar por responsável, transporte ou doação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca"
              />
            </div>

            <div className="filtros-opcoes">
              <div className="filtro-grupo">
                <label>Tipo de Transporte:</label>
                <select 
                  value={tipoTransporteFiltro} 
                  onChange={(e) => setTipoTransporteFiltro(e.target.value)}
                  className="select-filtro"
                >
                  <option value="todos">Todos os tipos</option>
                  {tiposTransporte.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Ordenar por:</label>
                <select 
                  value={ordenacao} 
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="select-filtro"
                >
                  <option value="recente">Mais recentes</option>
                  <option value="antigo">Mais antigas</option>
                  <option value="responsavel">Responsável (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Retiradas */}
          {retiradasFiltradas.length > 0 ? (
            <div className="retiradas-grid">
              {retiradasFiltradas.map((retirada) => (
                <div key={retirada.id_retirada} className="retirada-card">
                  <div className="retirada-card-header">
                    <h3>🎁 {retirada.Solicitacao?.Doacao?.titulo || "Doação"}</h3>
                    <span className="badge-transporte">
                      🚚 {retirada.tipo_transporte || "Não informado"}
                    </span>
                  </div>

                  <div className="retirada-info-grid">
                    <div className="info-item">
                      <span className="info-label">👤 Responsável:</span>
                      <span className="info-value">{retirada.responsavel_retirada || "Não informado"}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">🏢 Empresa:</span>
                      <span className="info-value empresa-nome">
                        {retirada.Solicitacao?.Doacao?.Empresa?.Usuario?.nome || 
                         retirada.Solicitacao?.Doacao?.Empresa?.razao_social || 
                         "Não informado"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">📦 Quantidade:</span>
                      <span className="info-value">
                        {retirada.Solicitacao?.Doacao?.quantidade || "N/A"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">📅 Validade:</span>
                      <span className="info-value">
                        {retirada.Solicitacao?.Doacao?.validade 
                          ? new Date(retirada.Solicitacao.Doacao.validade).toLocaleDateString("pt-BR")
                          : "N/A"}
                      </span>
                    </div>

                    {retirada.observacoes && (
                      <div className="info-item full-width">
                        <span className="info-label">📝 Observações:</span>
                        <p className="observacoes-text">{retirada.observacoes}</p>
                      </div>
                    )}
                  </div>

                  <div className="retirada-footer">
                    <span className="retirada-status">
                      <span className="status-indicator-agendado"></span>
                      Agendada
                    </span>
                    <button 
                      className="btn-detalhes"
                      onClick={() => navigate(`/retirada/${retirada.id_retirada}`)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Nenhuma retirada encontrada</h3>
              <p>
                {busca || tipoTransporteFiltro !== "todos" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Você ainda não tem retiradas agendadas"}
              </p>
              {(busca || tipoTransporteFiltro !== "todos") && (
                <button 
                  onClick={() => {
                    setBusca("");
                    setTipoTransporteFiltro("todos");
                  }}
                  className="btn-limpar-filtros"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default RetiradasAgendadas;