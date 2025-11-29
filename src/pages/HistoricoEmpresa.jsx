import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoricoEmpresa.css";

function HistoricoEmpresa() {
  const navigate = useNavigate();
  const [usuarioEmpresa, setUsuarioEmpresa] = useState(null);
  const [historicoEmpresa, setHistoricoEmpresa] = useState([]);
  const [historicoEmpresaFiltrado, setHistoricoEmpresaFiltrado] = useState([]);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  
  // Filtros
  const [buscaEmpresa, setBuscaEmpresa] = useState("");
  const [tipoFiltroEmpresa, setTipoFiltroEmpresa] = useState("todos");
  const [periodoFiltroEmpresa, setPeriodoFiltroEmpresa] = useState("todos");
  const [ordenacaoEmpresa, setOrdenacaoEmpresa] = useState("recente");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "empresa") {
      navigate("/login");
      return;
    }
    setUsuarioEmpresa(usuarioLogado);
    carregarHistoricoEmpresa(usuarioLogado.id_usuario);
  }, [navigate]);

  useEffect(() => {
    aplicarFiltrosEmpresa();
  }, [historicoEmpresa, buscaEmpresa, tipoFiltroEmpresa, periodoFiltroEmpresa, ordenacaoEmpresa]);

  const carregarHistoricoEmpresa = async (id_usuario) => {
    try {
      console.log("🔍 Buscando histórico da empresa...");
      
      // Buscar logs de acesso
      const responseAcesso = await fetch(`http://127.0.0.1:3001/logs/acesso/${id_usuario}`);
      const logsAcesso = responseAcesso.ok ? await responseAcesso.json() : [];

      // Buscar logs de ações
      const responseAcoes = await fetch(`http://127.0.0.1:3001/logs/acoes/${id_usuario}`);
      const logsAcoes = responseAcoes.ok ? await responseAcoes.json() : [];

      // Combinar e formatar os logs
      const todosLogsEmpresa = [
        ...logsAcesso.map(log => ({
          id: `acesso-empresa-${log.id_log}`,
          tipo: 'acesso',
          descricao: log.acao || 'Acesso ao sistema',
          ip: log.ip,
          data: log.createdAt || new Date(),
          icone: '🔐'
        })),
        ...logsAcoes.map(log => ({
          id: `acao-empresa-${log.id_acao}`,
          tipo: 'acao',
          descricao: log.descricao_acao,
          data: log.createdAt || new Date(),
          icone: getIconeAcaoEmpresa(log.descricao_acao)
        }))
      ];

      console.log("✅ Histórico da empresa carregado:", todosLogsEmpresa.length);
      setHistoricoEmpresa(todosLogsEmpresa);
    } catch (error) {
      console.error("❌ Erro ao carregar histórico da empresa:", error);
      setHistoricoEmpresa([]);
    } finally {
      setLoadingEmpresa(false);
    }
  };

  const getIconeAcaoEmpresa = (descricao) => {
    const texto = descricao?.toLowerCase() || '';
    if (texto.includes('doa')) return '🎁';
    if (texto.includes('cadastr') && texto.includes('doa')) return '📦';
    if (texto.includes('edit') || texto.includes('atualiz')) return '✏️';
    if (texto.includes('exclu') || texto.includes('remov')) return '🗑️';
    if (texto.includes('perfil')) return '⚙️';
    if (texto.includes('login') || texto.includes('entrou')) return '🔓';
    if (texto.includes('logout') || texto.includes('saiu')) return '🔒';
    if (texto.includes('cadastr')) return '📝';
    if (texto.includes('aprov')) return '✅';
    if (texto.includes('rejeit')) return '❌';
    if (texto.includes('cancel')) return '🚫';
    if (texto.includes('relat')) return '📊';
    if (texto.includes('export')) return '📤';
    return '📌';
  };

  const aplicarFiltrosEmpresa = () => {
    let resultadoEmpresa = [...historicoEmpresa];

    // Filtro de busca
    if (buscaEmpresa.trim()) {
      resultadoEmpresa = resultadoEmpresa.filter(h => 
        h.descricao?.toLowerCase().includes(buscaEmpresa.toLowerCase()) ||
        h.ip?.toLowerCase().includes(buscaEmpresa.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipoFiltroEmpresa !== "todos") {
      resultadoEmpresa = resultadoEmpresa.filter(h => h.tipo === tipoFiltroEmpresa);
    }

    // Filtro por período
    if (periodoFiltroEmpresa !== "todos") {
      const agora = new Date();
      const dataLimite = new Date();
      
      switch(periodoFiltroEmpresa) {
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

      resultadoEmpresa = resultadoEmpresa.filter(h => new Date(h.data) >= dataLimite);
    }

    // Ordenação
    if (ordenacaoEmpresa === "recente") {
      resultadoEmpresa.sort((a, b) => new Date(b.data) - new Date(a.data));
    } else if (ordenacaoEmpresa === "antigo") {
      resultadoEmpresa.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenacaoEmpresa === "tipo") {
      resultadoEmpresa.sort((a, b) => a.tipo.localeCompare(b.tipo));
    }

    setHistoricoEmpresaFiltrado(resultadoEmpresa);
  };

  const formatarDataHoraEmpresa = (data) => {
    const d = new Date(data);
    return {
      data: d.toLocaleDateString("pt-BR"),
      hora: d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTipoBadgeEmpresa = (tipo) => {
    if (tipo === 'acesso') return 'badge-acesso-empresa';
    if (tipo === 'acao') return 'badge-acao-empresa';
    return 'badge-outros-empresa';
  };

  const handleLogoutEmpresa = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loadingEmpresa) {
    return <div className="loading-empresa">Carregando histórico...</div>;
  }

  return (
    <div className="historico-empresa-page">
      {/* Header */}
      <header className="header-empresa">
        <div className="header-empresa-left">
          <h1 className="logo-header-empresa">
            <span className="logo-food-empresa">Food</span>
            <span className="logo-back-empresa">Back</span>
          </h1>
        </div>
        <div className="header-empresa-right">
          <span className="usuario-nome-empresa">Olá, {usuarioEmpresa?.nome}</span>
          <button onClick={handleLogoutEmpresa} className="btn-logout-empresa">Sair</button>
        </div>
      </header>

      <div className="content-historico-empresa">
        {/* Sidebar */}
        <aside className="sidebar-empresa">
          <nav className="nav-menu-empresa">
            <button className="nav-item-empresa" onClick={() => navigate("/home-empresa")}>
              📊 Dashboard
            </button>
            <button className="nav-item-empresa" onClick={() => navigate("/cadastrar-doacao")}>
              📦 Cadastrar Doação
            </button>
            <button className="nav-item-empresa" onClick={() => navigate("/minhas-doacoes")}>
              🎁 Minhas Doações
            </button>
            <button className="nav-item-empresa" onClick={() => navigate("/solicitacoes-recebidas")}>
              📋 Solicitações Recebidas
            </button>
            <button className="nav-item-empresa active-empresa">
              📚 Histórico
            </button>
            <button className="nav-item-empresa" onClick={() => navigate("/perfil-empresa")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-historico-empresa">
          <div className="page-header-empresa">
            <h2 className="page-title-empresa">📚 Histórico de Atividades</h2>
            <p className="page-subtitle-empresa">
              {historicoEmpresaFiltrado.length} {historicoEmpresaFiltrado.length === 1 ? 'registro encontrado' : 'registros encontrados'}
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="stats-historico-empresa">
            <div className="stat-card-empresa">
              <div className="stat-icon-empresa">🔐</div>
              <div className="stat-info-empresa">
                <span className="stat-value-empresa">{historicoEmpresa.filter(h => h.tipo === 'acesso').length}</span>
                <span className="stat-label-empresa">Acessos</span>
              </div>
            </div>
            <div className="stat-card-empresa">
              <div className="stat-icon-empresa">📌</div>
              <div className="stat-info-empresa">
                <span className="stat-value-empresa">{historicoEmpresa.filter(h => h.tipo === 'acao').length}</span>
                <span className="stat-label-empresa">Ações</span>
              </div>
            </div>
            <div className="stat-card-empresa">
              <div className="stat-icon-empresa">📅</div>
              <div className="stat-info-empresa">
                <span className="stat-value-empresa">{historicoEmpresa.length}</span>
                <span className="stat-label-empresa">Total</span>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="filtros-container-empresa">
            <div className="filtro-busca-empresa">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="🔍 Buscar por descrição ou IP..."
                value={buscaEmpresa}
                onChange={(e) => setBuscaEmpresa(e.target.value)}
                className="input-busca-empresa"
              />
            </div>

            <div className="filtros-opcoes-empresa">
              <div className="filtro-grupo-empresa">
                <label>Tipo:</label>
                <select 
                  value={tipoFiltroEmpresa} 
                  onChange={(e) => setTipoFiltroEmpresa(e.target.value)}
                  className="select-filtro-empresa"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="acesso">Acessos</option>
                  <option value="acao">Ações</option>
                </select>
              </div>

              <div className="filtro-grupo-empresa">
                <label>Período:</label>
                <select 
                  value={periodoFiltroEmpresa} 
                  onChange={(e) => setPeriodoFiltroEmpresa(e.target.value)}
                  className="select-filtro-empresa"
                >
                  <option value="todos">Todo período</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mês</option>
                  <option value="trimestre">Último trimestre</option>
                </select>
              </div>

              <div className="filtro-grupo-empresa">
                <label>Ordenar por:</label>
                <select 
                  value={ordenacaoEmpresa} 
                  onChange={(e) => setOrdenacaoEmpresa(e.target.value)}
                  className="select-filtro-empresa"
                >
                  <option value="recente">Mais recentes</option>
                  <option value="antigo">Mais antigos</option>
                  <option value="tipo">Por tipo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline de Histórico */}
          {historicoEmpresaFiltrado.length > 0 ? (
            <div className="historico-timeline-empresa">
              {historicoEmpresaFiltrado.map((item) => {
                const { data, hora } = formatarDataHoraEmpresa(item.data);
                return (
                  <div key={item.id} className="timeline-item-empresa">
                    <div className="timeline-marker-empresa">
                      <span className="marker-icon-empresa">{item.icone}</span>
                    </div>
                    <div className="timeline-content-empresa">
                      <div className="timeline-header-empresa">
                        <div className="timeline-title-empresa">
                          <h4>{item.descricao}</h4>
                          <span className={`badge-tipo-empresa ${getTipoBadgeEmpresa(item.tipo)}`}>
                            {item.tipo === 'acesso' ? '🔐 Acesso' : '📌 Ação'}
                          </span>
                        </div>
                        <div className="timeline-datetime-empresa">
                          <span className="timeline-data-empresa">📅 {data}</span>
                          <span className="timeline-hora-empresa">🕐 {hora}</span>
                        </div>
                      </div>
                      {item.ip && (
                        <div className="timeline-info-empresa">
                          <span className="info-ip-empresa">🌐 IP: {item.ip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-empresa">
              <div className="empty-icon-empresa">📋</div>
              <h3>Nenhum registro encontrado</h3>
              <p>
                {buscaEmpresa || tipoFiltroEmpresa !== "todos" || periodoFiltroEmpresa !== "todos"
                  ? "Tente ajustar os filtros de busca" 
                  : "Ainda não há atividades registradas"}
              </p>
              {(buscaEmpresa || tipoFiltroEmpresa !== "todos" || periodoFiltroEmpresa !== "todos") && (
                <button 
                  onClick={() => {
                    setBuscaEmpresa("");
                    setTipoFiltroEmpresa("todos");
                    setPeriodoFiltroEmpresa("todos");
                  }}
                  className="btn-limpar-filtros-empresa"
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

export default HistoricoEmpresa;