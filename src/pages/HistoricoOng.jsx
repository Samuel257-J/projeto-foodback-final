import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoricoOng.css";

function HistoricoOng() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("recente");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "ong") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarHistorico(usuarioLogado.id_usuario);
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [historico, busca, tipoFiltro, periodoFiltro, ordenacao]);

  const carregarHistorico = async (id_usuario) => {
    try {
      console.log("🔍 Buscando histórico...");
      
      // Buscar logs de acesso
      const responseAcesso = await fetch(`http://127.0.0.1:3001/logs/acesso/${id_usuario}`);
      const logsAcesso = responseAcesso.ok ? await responseAcesso.json() : [];

      // Buscar logs de ações
      const responseAcoes = await fetch(`http://127.0.0.1:3001/logs/acoes/${id_usuario}`);
      const logsAcoes = responseAcoes.ok ? await responseAcoes.json() : [];

      // Combinar e formatar os logs
      const todosLogs = [
        ...logsAcesso.map(log => ({
          id: `acesso-${log.id_log}`,
          tipo: 'acesso',
          descricao: log.acao || 'Acesso ao sistema',
          ip: log.ip,
          data: log.createdAt || new Date(),
          icone: '🔐'
        })),
        ...logsAcoes.map(log => ({
          id: `acao-${log.id_acao}`,
          tipo: 'acao',
          descricao: log.descricao_acao,
          data: log.createdAt || new Date(),
          icone: getIconeAcao(log.descricao_acao)
        }))
      ];

      console.log("✅ Histórico carregado:", todosLogs.length);
      setHistorico(todosLogs);
    } catch (error) {
      console.error("❌ Erro ao carregar histórico:", error);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconeAcao = (descricao) => {
    const texto = descricao?.toLowerCase() || '';
    if (texto.includes('solicit')) return '📋';
    if (texto.includes('doa')) return '🎁';
    if (texto.includes('retir')) return '🚚';
    if (texto.includes('perfil') || texto.includes('atualiz')) return '⚙️';
    if (texto.includes('login') || texto.includes('entrou')) return '🔓';
    if (texto.includes('logout') || texto.includes('saiu')) return '🔒';
    if (texto.includes('cadastr')) return '📝';
    if (texto.includes('aprov')) return '✅';
    if (texto.includes('rejeit')) return '❌';
    if (texto.includes('cancel')) return '🚫';
    return '📌';
  };

  const aplicarFiltros = () => {
    let resultado = [...historico];

    // Filtro de busca
    if (busca.trim()) {
      resultado = resultado.filter(h => 
        h.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        h.ip?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipoFiltro !== "todos") {
      resultado = resultado.filter(h => h.tipo === tipoFiltro);
    }

    // Filtro por período
    if (periodoFiltro !== "todos") {
      const agora = new Date();
      const dataLimite = new Date();
      
      switch(periodoFiltro) {
        case "hoje":
          dataLimite.setHours(0, 0, 0, 0);
          break;
        case "semana":
          dataLimite.setDate(agora.getDate() - 7);
          break;
        case "mes":
          dataLimite.setMonth(agora.getMonth() - 1);
          break;
        case "trimestre":
          dataLimite.setMonth(agora.getMonth() - 3);
          break;
      }

      resultado = resultado.filter(h => new Date(h.data) >= dataLimite);
    }

    // Ordenação
    if (ordenacao === "recente") {
      resultado.sort((a, b) => new Date(b.data) - new Date(a.data));
    } else if (ordenacao === "antigo") {
      resultado.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenacao === "tipo") {
      resultado.sort((a, b) => a.tipo.localeCompare(b.tipo));
    }

    setHistoricoFiltrado(resultado);
  };

  const formatarDataHora = (data) => {
    const d = new Date(data);
    return {
      data: d.toLocaleDateString("pt-BR"),
      hora: d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTipoBadge = (tipo) => {
    if (tipo === 'acesso') return 'badge-acesso';
    if (tipo === 'acao') return 'badge-acao';
    return 'badge-outros';
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando histórico...</div>;
  }

  return (
    <div className="historico-ong-page">
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

      <div className="content-historico">
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
            <button className="nav-item" onClick={() => navigate("/retiradas-agendadas")}>
              🚚 Retiradas Agendadas
            </button>
            <button className="nav-item active">
              📚 Histórico
            </button>
            <button className="nav-item" onClick={() => navigate("/perfil-ong")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-historico">
          <div className="page-header">
            <h2 className="page-title">📚 Histórico de Atividades</h2>
            <p className="page-subtitle">
              {historicoFiltrado.length} {historicoFiltrado.length === 1 ? 'registro encontrado' : 'registros encontrados'}
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="stats-historico">
            <div className="stat-card">
              <div className="stat-icon">🔐</div>
              <div className="stat-info">
                <span className="stat-value">{historico.filter(h => h.tipo === 'acesso').length}</span>
                <span className="stat-label">Acessos</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📌</div>
              <div className="stat-info">
                <span className="stat-value">{historico.filter(h => h.tipo === 'acao').length}</span>
                <span className="stat-label">Ações</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-value">{historico.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="filtros-container">
            <div className="filtro-busca">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="🔍 Buscar por descrição ou IP..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca"
              />
            </div>

            <div className="filtros-opcoes">
              <div className="filtro-grupo">
                <label>Tipo:</label>
                <select 
                  value={tipoFiltro} 
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="select-filtro"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="acesso">Acessos</option>
                  <option value="acao">Ações</option>
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Período:</label>
                <select 
                  value={periodoFiltro} 
                  onChange={(e) => setPeriodoFiltro(e.target.value)}
                  className="select-filtro"
                >
                  <option value="todos">Todo período</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mês</option>
                  <option value="trimestre">Último trimestre</option>
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
                  <option value="antigo">Mais antigos</option>
                  <option value="tipo">Por tipo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline de Histórico */}
          {historicoFiltrado.length > 0 ? (
            <div className="historico-timeline">
              {historicoFiltrado.map((item) => {
                const { data, hora } = formatarDataHora(item.data);
                return (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="marker-icon">{item.icone}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="timeline-title">
                          <h4>{item.descricao}</h4>
                          <span className={`badge-tipo ${getTipoBadge(item.tipo)}`}>
                            {item.tipo === 'acesso' ? '🔐 Acesso' : '📌 Ação'}
                          </span>
                        </div>
                        <div className="timeline-datetime">
                          <span className="timeline-data">📅 {data}</span>
                          <span className="timeline-hora">🕐 {hora}</span>
                        </div>
                      </div>
                      {item.ip && (
                        <div className="timeline-info">
                          <span className="info-ip">🌐 IP: {item.ip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Nenhum registro encontrado</h3>
              <p>
                {busca || tipoFiltro !== "todos" || periodoFiltro !== "todos"
                  ? "Tente ajustar os filtros de busca" 
                  : "Ainda não há atividades registradas"}
              </p>
              {(busca || tipoFiltro !== "todos" || periodoFiltro !== "todos") && (
                <button 
                  onClick={() => {
                    setBusca("");
                    setTipoFiltro("todos");
                    setPeriodoFiltro("todos");
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

export default HistoricoOng;