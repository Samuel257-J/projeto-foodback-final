import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeEmpresa.css";
import "./HistoricoEmpresa.css";

function HistoricoEmpresa() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "empresa") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarHistorico(usuarioLogado.id_usuario);
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [historico, busca, tipoFiltro, periodoFiltro]);

  const carregarHistorico = async (id_usuario) => {
    try {
      console.log("🔍 Buscando histórico completo da empresa...");
      
      const todosEventos = [];

      // 1. Buscar todas as doações cadastradas pela empresa
      try {
        const resDoacoes = await fetch(`http://127.0.0.1:3001/doacoes/empresa/${id_usuario}`);
        if (resDoacoes.ok) {
          const doacoes = await resDoacoes.json();
          doacoes.forEach(doacao => {
            todosEventos.push({
              id: `doacao-${doacao.id_doacao}`,
              tipo: 'doacao_cadastrada',
              titulo: `Doação cadastrada: ${doacao.titulo}`,
              descricao: doacao.descricao || "Sem descrição",
              categoria: doacao.categoria,
              quantidade: doacao.quantidade,
              data: doacao.createdAt,
              icone: '📦',
              cor: '#4caf50',
              detalhes: {
                id_doacao: doacao.id_doacao,
                status: doacao.status,
                validade: doacao.validade
              }
            });
          });
        }
      } catch (error) {
        console.error("Erro ao buscar doações:", error);
      }

      // 2. Buscar todas as solicitações recebidas
      try {
        const resSolicitacoes = await fetch(`http://127.0.0.1:3001/solicitacoes/empresa/${id_usuario}`);
        if (resSolicitacoes.ok) {
          const solicitacoes = await resSolicitacoes.json();
          solicitacoes.forEach(solicitacao => {
            // Extrair informações da doação e ONG
            const tituloDoacao = solicitacao.Doacao?.titulo || 
                                 solicitacao.titulo_doacao || 
                                 'Doação não identificada';
            
            const nomeOng = solicitacao.Ong?.Usuario?.nome || 
                           solicitacao.Ong?.razao_social || 
                           solicitacao.nome_ong || 
                           'ONG não identificada';

            // Evento: Solicitação recebida
            todosEventos.push({
              id: `solicitacao-${solicitacao.id_solicitacao}`,
              tipo: 'solicitacao_recebida',
              titulo: `Solicitação recebida para: ${tituloDoacao}`,
              descricao: `ONG ${nomeOng} solicitou esta doação`,
              data: solicitacao.data_solicitacao || solicitacao.createdAt,
              icone: '📥',
              cor: '#ff9800',
              detalhes: {
                id_solicitacao: solicitacao.id_solicitacao,
                nome_ong: nomeOng,
                status: solicitacao.status
              }
            });

            // Evento: Resposta da solicitação (se houver)
            if (solicitacao.status === 'aprovada') {
              todosEventos.push({
                id: `resposta-${solicitacao.id_solicitacao}`,
                tipo: 'solicitacao_aprovada',
                titulo: `Solicitação aprovada: ${tituloDoacao}`,
                descricao: `Você aprovou a solicitação da ONG ${nomeOng}`,
                data: solicitacao.data_resposta || solicitacao.updatedAt,
                icone: '✅',
                cor: '#4caf50',
                detalhes: {
                  id_solicitacao: solicitacao.id_solicitacao,
                  nome_ong: nomeOng
                }
              });
            } else if (solicitacao.status === 'rejeitada') {
              todosEventos.push({
                id: `resposta-${solicitacao.id_solicitacao}`,
                tipo: 'solicitacao_rejeitada',
                titulo: `Solicitação rejeitada: ${tituloDoacao}`,
                descricao: `Você rejeitou a solicitação da ONG ${nomeOng}`,
                data: solicitacao.data_resposta || solicitacao.updatedAt,
                icone: '❌',
                cor: '#f44336',
                detalhes: {
                  id_solicitacao: solicitacao.id_solicitacao,
                  nome_ong: nomeOng
                }
              });
            } else if (solicitacao.status === 'concluida' || solicitacao.status === 'retirada') {
              todosEventos.push({
                id: `concluida-${solicitacao.id_solicitacao}`,
                tipo: 'solicitacao_concluida',
                titulo: `Doação concluída: ${tituloDoacao}`,
                descricao: `A doação foi retirada pela ONG ${nomeOng}`,
                data: solicitacao.data_retirada || solicitacao.updatedAt,
                icone: '✔️',
                cor: '#9c27b0',
                detalhes: {
                  id_solicitacao: solicitacao.id_solicitacao,
                  nome_ong: nomeOng
                }
              });
            }
          });
        }
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
      }

      // 3. Buscar agendamentos (se houver endpoint específico)
      try {
        const resAgendamentos = await fetch(`http://127.0.0.1:3001/agendamentos/empresa/${id_usuario}`);
        if (resAgendamentos.ok) {
          const agendamentos = await resAgendamentos.json();
          agendamentos.forEach(agendamento => {
            todosEventos.push({
              id: `agendamento-${agendamento.id_agendamento}`,
              tipo: 'agendamento_retirada',
              titulo: `Retirada agendada: ${agendamento.titulo_doacao}`,
              descricao: `ONG ${agendamento.nome_ong} agendou retirada para ${new Date(agendamento.data_agendada).toLocaleDateString('pt-BR')}`,
              data: agendamento.createdAt,
              icone: '📅',
              cor: '#2196f3',
              detalhes: {
                id_agendamento: agendamento.id_agendamento,
                nome_ong: agendamento.nome_ong,
                data_agendada: agendamento.data_agendada,
                horario: agendamento.horario
              }
            });
          });
        }
      } catch (error) {
        console.warn("Endpoint de agendamentos não disponível:", error);
      }

      // Ordenar por data (mais recente primeiro)
      todosEventos.sort((a, b) => new Date(b.data) - new Date(a.data));

      console.log("✅ Histórico carregado:", todosEventos.length, "eventos");
      setHistorico(todosEventos);
    } catch (error) {
      console.error("❌ Erro ao carregar histórico:", error);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...historico];

    // Filtro de busca
    if (busca.trim()) {
      resultado = resultado.filter(h => 
        h.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
        h.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        h.detalhes?.nome_ong?.toLowerCase().includes(busca.toLowerCase())
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

    setHistoricoFiltrado(resultado);
  };

  const formatarDataHora = (data) => {
    const d = new Date(data);
    return {
      data: d.toLocaleDateString("pt-BR"),
      hora: d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      'doacao_cadastrada': 'Doação Cadastrada',
      'solicitacao_recebida': 'Solicitação Recebida',
      'solicitacao_aprovada': 'Solicitação Aprovada',
      'solicitacao_rejeitada': 'Solicitação Rejeitada',
      'solicitacao_concluida': 'Doação Concluída',
      'agendamento_retirada': 'Agendamento de Retirada'
    };
    return labels[tipo] || tipo;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando histórico...</div>;
  }

  // Estatísticas
  const stats = {
    total: historico.length,
    doacoes: historico.filter(h => h.tipo === 'doacao_cadastrada').length,
    solicitacoes: historico.filter(h => h.tipo === 'solicitacao_recebida').length,
    aprovadas: historico.filter(h => h.tipo === 'solicitacao_aprovada').length,
    concluidas: historico.filter(h => h.tipo === 'solicitacao_concluida').length
  };

  return (
    <div className="home-empresa">
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

      <div className="content-empresa">
        {/* Sidebar */}
        <aside className="sidebar-empresa">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => navigate("/home-empresa")}>
              📊 Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/minhas-doacoes")}>
              🎁 Minhas Doações
            </button>
            <button className="nav-item" onClick={() => navigate("/cadastrar-doacao")}>
              ➕ Nova Doação
            </button>
            <button className="nav-item" onClick={() => navigate("/solicitacoes")}>
              📋 Solicitações
            </button>
            <button className="nav-item active" onClick={() => navigate("/historico-empresa")}>
              📚 Histórico
            </button>
            <button className="nav-item" onClick={() => navigate("/perfil-empresa")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-dashboard">
          <div className="page-header-historico">
            <h2 className="page-title">📚 Histórico de Atividades</h2>
            <p className="page-subtitle">
              {historicoFiltrado.length} {historicoFiltrado.length === 1 ? 'evento registrado' : 'eventos registrados'}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total de Eventos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.doacoes}</h3>
                <p>Doações Cadastradas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📥</div>
              <div className="stat-info">
                <h3>{stats.solicitacoes}</h3>
                <p>Solicitações Recebidas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.aprovadas}</h3>
                <p>Aprovadas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✔️</div>
              <div className="stat-info">
                <h3>{stats.concluidas}</h3>
                <p>Concluídas</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filtros-historico">
            <div className="filtro-busca-historico">
              <input
                type="text"
                placeholder="🔍 Buscar por título, descrição ou ONG..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca-historico"
              />
            </div>

            <div className="filtros-selects">
              <select 
                value={tipoFiltro} 
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="select-filtro-historico"
              >
                <option value="todos">Todos os tipos</option>
                <option value="doacao_cadastrada">Doações Cadastradas</option>
                <option value="solicitacao_recebida">Solicitações Recebidas</option>
                <option value="solicitacao_aprovada">Solicitações Aprovadas</option>
                <option value="solicitacao_rejeitada">Solicitações Rejeitadas</option>
                <option value="solicitacao_concluida">Doações Concluídas</option>
                <option value="agendamento_retirada">Agendamentos</option>
              </select>

              <select 
                value={periodoFiltro} 
                onChange={(e) => setPeriodoFiltro(e.target.value)}
                className="select-filtro-historico"
              >
                <option value="todos">Todo período</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
                <option value="trimestre">Último trimestre</option>
              </select>
            </div>
          </div>

          {/* Timeline de Histórico */}
          {historicoFiltrado.length > 0 ? (
            <div className="timeline-historico">
              {historicoFiltrado.map((evento, index) => {
                const { data, hora } = formatarDataHora(evento.data);
                return (
                  <div key={evento.id} className="timeline-item">
                    <div className="timeline-line" style={{ 
                      display: index === historicoFiltrado.length - 1 ? 'none' : 'block' 
                    }}></div>
                    
                    <div className="timeline-marker" style={{ backgroundColor: evento.cor }}>
                      <span className="marker-icon">{evento.icone}</span>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="timeline-info-left">
                          <h3 className="timeline-titulo">{evento.titulo}</h3>
                          <span className="timeline-tipo-badge" style={{ 
                            backgroundColor: `${evento.cor}20`,
                            color: evento.cor
                          }}>
                            {getTipoLabel(evento.tipo)}
                          </span>
                        </div>
                        <div className="timeline-datetime">
                          <span className="timeline-data">📅 {data}</span>
                          <span className="timeline-hora">🕐 {hora}</span>
                        </div>
                      </div>
                      
                      <p className="timeline-descricao">{evento.descricao}</p>
                      
                      {/* Detalhes extras baseados no tipo */}
                      {evento.tipo === 'doacao_cadastrada' && (
                        <div className="timeline-detalhes">
                          <span className="detalhe-item">📦 {evento.categoria}</span>
                          <span className="detalhe-item">📊 Qtd: {evento.quantidade}</span>
                          <span className="detalhe-item">Status: {evento.detalhes.status}</span>
                        </div>
                      )}
                      
                      {evento.detalhes?.nome_ong && (
                        <div className="timeline-detalhes">
                          <span className="detalhe-item">🏢 {evento.detalhes.nome_ong}</span>
                        </div>
                      )}
                      
                      {evento.tipo === 'agendamento_retirada' && evento.detalhes?.data_agendada && (
                        <div className="timeline-detalhes">
                          <span className="detalhe-item">
                            📅 Data agendada: {new Date(evento.detalhes.data_agendada).toLocaleDateString('pt-BR')}
                          </span>
                          {evento.detalhes.horario && (
                            <span className="detalhe-item">
                              🕐 Horário: {evento.detalhes.horario}
                            </span>
                          )}
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
              <h3>Nenhum evento encontrado</h3>
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
                  className="btn-primary"
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