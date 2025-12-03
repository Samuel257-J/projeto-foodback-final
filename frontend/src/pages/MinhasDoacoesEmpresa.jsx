import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MinhasDoacoesEmpresa.css";
import "./HomeEmpresa.css";
import NovaDoacaoModal from "../NovaDoacaoModal/NovaDoacaoModal";

function MinhasDoacoesEmpresa() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [doacoesFiltradas, setDoacoesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Filtros
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("recente");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "empresa") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarDoacoes(usuarioLogado.id_usuario);
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [doacoes, busca, statusFiltro, categoriaFiltro, ordenacao]);

  const carregarDoacoes = async (id_usuario) => {
    try {
      console.log("🔍 Buscando doações da empresa...");
      
      const response = await fetch(`http://127.0.0.1:3001/doacoes/empresa/${id_usuario}`);
      
      if (response.ok) {
        const dados = await response.json();
        console.log("✅ Doações carregadas:", dados.length);
        setDoacoes(Array.isArray(dados) ? dados : []);
      } else {
        console.error("❌ Erro ao buscar doações:", response.status);
        setDoacoes([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar doações:", error);
      setDoacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...doacoes];

    // Filtro de busca
    if (busca.trim()) {
      resultado = resultado.filter(d => 
        d.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
        d.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        d.categoria?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFiltro !== "todos") {
      resultado = resultado.filter(d => d.status === statusFiltro);
    }

    // Filtro de categoria
    if (categoriaFiltro !== "todas") {
      resultado = resultado.filter(d => d.categoria === categoriaFiltro);
    }

    // Ordenação
    if (ordenacao === "recente") {
      resultado.sort((a, b) => b.id_doacao - a.id_doacao);
    } else if (ordenacao === "antigo") {
      resultado.sort((a, b) => a.id_doacao - b.id_doacao);
    } else if (ordenacao === "validade") {
      resultado.sort((a, b) => new Date(a.validade) - new Date(b.validade));
    } else if (ordenacao === "quantidade") {
      resultado.sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));
    }

    setDoacoesFiltradas(resultado);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'disponivel': { label: 'Disponível', color: 'status-disponivel', icon: '✅' },
      'reservada': { label: 'Reservada', color: 'status-reservada', icon: '📋' },
      'retirada': { label: 'Retirada', color: 'status-retirada', icon: '✔️' },
      'cancelada': { label: 'Cancelada', color: 'status-cancelada', icon: '❌' }
    };
    return statusMap[status] || { label: status, color: 'status-outros', icon: '❓' };
  };

  const handleEditarDoacao = (id_doacao) => {
    navigate(`/editar-doacao/${id_doacao}`);
  };

  const handleCancelarDoacao = async (id_doacao) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta doação?")) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3001/doacoes/${id_doacao}/cancelar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        alert("✅ Doação cancelada com sucesso!");
        carregarDoacoes(usuario.id_usuario);
      } else {
        const erro = await response.json();
        alert(erro.error || "❌ Erro ao cancelar doação.");
      }
    } catch (error) {
      console.error("❌ Erro ao cancelar:", error);
      alert("❌ Erro ao conectar com o servidor.");
    }
  };

  const handleDoacaoCadastrada = () => {
    if (usuario) {
      carregarDoacoes(usuario.id_usuario);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando doações...</div>;
  }

  // Estatísticas
  const stats = {
    total: doacoes.length,
    disponiveis: doacoes.filter(d => d.status === 'disponivel').length,
    reservadas: doacoes.filter(d => d.status === 'reservada').length,
    retiradas: doacoes.filter(d => d.status === 'retirada').length,
    canceladas: doacoes.filter(d => d.status === 'cancelada').length
  };

  // Extrai categorias únicas para o filtro
  const categorias = [...new Set(doacoes.map(d => d.categoria))].filter(Boolean);

  return (
    <div className="minhas-doacoes-empresa-page">
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

      <div className="content-doacoes-empresa">
        {/* Sidebar */}
        <aside className="sidebar-empresa">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => navigate("/home-empresa")}>
              📊 Dashboard
            </button>
            <button className="nav-item active">
              🎁 Minhas Doações
            </button>
            <button className="nav-item" onClick={() => setMostrarModal(true)}>
              ➕ Nova Doação
            </button>
            <button className="nav-item" onClick={() => navigate("/solicitacoes")}>
              📋 Solicitações
            </button>
            <button className="nav-item" onClick={() => navigate("/historico-empresa")}>
              📚 Histórico
            </button>
            <button className="nav-item" onClick={() => navigate("/perfil-empresa")}>
              ⚙️ Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-doacoes-empresa">
          <div className="page-header">
            <h2 className="page-title">🎁 Minhas Doações</h2>
            <p className="page-subtitle">
              {doacoesFiltradas.length} {doacoesFiltradas.length === 1 ? 'doação cadastrada' : 'doações cadastradas'}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="stats-doacoes">
            <div className="stat-card">
              <div className="stat-icon stat-total">📦</div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-disponiveis">✅</div>
              <div className="stat-info">
                <span className="stat-value">{stats.disponiveis}</span>
                <span className="stat-label">Disponíveis</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-reservadas">📋</div>
              <div className="stat-info">
                <span className="stat-value">{stats.reservadas}</span>
                <span className="stat-label">Reservadas</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-retiradas">✔️</div>
              <div className="stat-info">
                <span className="stat-value">{stats.retiradas}</span>
                <span className="stat-label">Retiradas</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-canceladas">❌</div>
              <div className="stat-info">
                <span className="stat-value">{stats.canceladas}</span>
                <span className="stat-label">Canceladas</span>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="filtros-container">
            <div className="filtro-busca">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="🔍 Buscar por título, descrição ou categoria..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca"
              />
            </div>

            <div className="filtros-opcoes">
              <div className="filtro-grupo">
                <label>Status:</label>
                <select 
                  value={statusFiltro} 
                  onChange={(e) => setStatusFiltro(e.target.value)}
                  className="select-filtro"
                >
                  <option value="todos">Todos os status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="reservada">Reservada</option>
                  <option value="retirada">Retirada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="filtro-grupo">
                <label>Categoria:</label>
                <select 
                  value={categoriaFiltro} 
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="select-filtro"
                >
                  <option value="todas">Todas as categorias</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  <option value="validade">Validade mais próxima</option>
                  <option value="quantidade">Maior quantidade</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Doações */}
          {doacoesFiltradas.length > 0 ? (
            <div className="doacoes-grid">
              {doacoesFiltradas.map((doacao) => {
                const statusInfo = getStatusInfo(doacao.status);
                return (
                  <div key={doacao.id_doacao} className="doacao-card">
                    <div className="doacao-card-header">
                      <h3>{doacao.titulo}</h3>
                      <div className="badges-container">
                        <span className={`badge-status ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className={`badge-categoria badge-${doacao.categoria?.toLowerCase().replace(/\s/g, '-')}`}>
                          {doacao.categoria}
                        </span>
                      </div>
                    </div>

                    <p className="doacao-descricao">
                      {doacao.descricao || "Sem descrição disponível"}
                    </p>

                    <div className="doacao-info-grid">
                      <div className="info-item">
                        <span className="info-label">📦 Quantidade:</span>
                        <span className="info-value">{doacao.quantidade || "N/A"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">📅 Validade:</span>
                        <span className="info-value">
                          {new Date(doacao.validade).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">📅 Cadastrada em:</span>
                        <span className="info-value">
                          {new Date(doacao.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">📊 Solicitações:</span>
                        <span className="info-value">
                          {doacao.Solicitacoes?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="doacao-footer">
                      <div className="footer-actions">
                        {doacao.status === 'disponivel' && (
                          <>
                            <button 
                              onClick={() => handleEditarDoacao(doacao.id_doacao)}
                              className="btn-editar"
                            >
                              ✏️ Editar
                            </button>
                            <button 
                              onClick={() => handleCancelarDoacao(doacao.id_doacao)}
                              className="btn-cancelar"
                            >
                              ❌ Cancelar
                            </button>
                          </>
                        )}
                        {doacao.status === 'reservada' && (
                          <button 
                            onClick={() => navigate(`/doacao/${doacao.id_doacao}`)}
                            className="btn-detalhes"
                          >
                            👁️ Ver Detalhes
                          </button>
                        )}
                        {(doacao.status === 'retirada' || doacao.status === 'cancelada') && (
                          <button 
                            onClick={() => navigate(`/doacao/${doacao.id_doacao}`)}
                            className="btn-detalhes-secondary"
                          >
                            📄 Ver Histórico
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Nenhuma doação encontrada</h3>
              <p>
                {busca || statusFiltro !== "todos" || categoriaFiltro !== "todas"
                  ? "Tente ajustar os filtros de busca" 
                  : "Você ainda não cadastrou nenhuma doação"}
              </p>
              {(busca || statusFiltro !== "todos" || categoriaFiltro !== "todas") ? (
                <button 
                  onClick={() => {
                    setBusca("");
                    setStatusFiltro("todos");
                    setCategoriaFiltro("todas");
                  }}
                  className="btn-limpar-filtros"
                >
                  Limpar Filtros
                </button>
              ) : (
                <button 
                  onClick={() => setMostrarModal(true)}
                  className="btn-nova-doacao"
                >
                  ➕ Cadastrar Nova Doação
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Nova Doação */}
      <NovaDoacaoModal 
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        onDoacaoCadastrada={handleDoacaoCadastrada}
      />
    </div>
  );
}

export default MinhasDoacoesEmpresa;