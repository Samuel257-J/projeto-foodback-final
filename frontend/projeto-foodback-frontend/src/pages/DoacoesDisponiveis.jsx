import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoacoesDisponiveis.css";

function DoacoesDisponiveis() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [doacoesFiltradas, setDoacoesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("recente");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "ong") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarDoacoes();
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [doacoes, busca, categoriaFiltro, ordenacao]);

  const carregarDoacoes = async () => {
    try {
      console.log("🔍 Buscando doações disponíveis...");
      
      const response = await fetch(`http://127.0.0.1:3001/doacoes/disponiveis`);
      
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

    // Filtro de busca (título ou descrição)
    if (busca.trim()) {
      resultado = resultado.filter(d => 
        d.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
        d.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        d.Empresa?.Usuario?.nome?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro de categoria
    if (categoriaFiltro !== "todas") {
      resultado = resultado.filter(d => d.categoria === categoriaFiltro);
    }

    // Ordenação
    if (ordenacao === "recente") {
      resultado.sort((a, b) => b.id_doacao - a.id_doacao);
    } else if (ordenacao === "validade") {
      resultado.sort((a, b) => new Date(a.validade) - new Date(b.validade));
    } else if (ordenacao === "quantidade") {
      resultado.sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));
    }

    setDoacoesFiltradas(resultado);
  };

  const handleSolicitarDoacao = async (id_doacao) => {
    try {
      const resposta = await fetch(`http://127.0.0.1:3001/solicitacoes/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_doacao,
          id_ong: usuario.id_usuario
        })
      });

      if (resposta.ok) {
        alert("✅ Solicitação enviada com sucesso!");
        carregarDoacoes(); // Recarrega para atualizar status
      } else {
        const erro = await resposta.json();
        alert(erro.error || "❌ Erro ao solicitar doação.");
      }
    } catch (error) {
      console.error("❌ Erro ao solicitar:", error);
      alert("❌ Erro ao conectar com o servidor.");
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

  // Extrai categorias únicas para o filtro
  const categorias = [...new Set(doacoes.map(d => d.categoria))].filter(Boolean);

  return (
    <div className="doacoes-disponiveis-page">
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

      <div className="content-doacoes">
        {/* Sidebar */}
        <aside className="sidebar-ong">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => navigate("/home-ong")}>
              📊 Dashboard
            </button>
            <button className="nav-item active">
              🎁 Doações Disponíveis
            </button>
            <button className="nav-item" onClick={() => navigate("/minhas-solicitacoes")}>
              📋 Minhas Solicitações
            </button>
            <button className="nav-item" onClick={() => navigate("/retiradas")}>
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
        <main className="main-doacoes">
          <div className="page-header">
            <h2 className="page-title">🎁 Doações Disponíveis</h2>
            <p className="page-subtitle">
              {doacoesFiltradas.length} {doacoesFiltradas.length === 1 ? 'doação encontrada' : 'doações encontradas'}
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="filtros-container">
            <div className="filtro-busca">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="🔍 Buscar por título, descrição ou empresa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca"
              />
            </div>

            <div className="filtros-opcoes">
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
                  <option value="validade">Validade mais próxima</option>
                  <option value="quantidade">Maior quantidade</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Doações */}
          {doacoesFiltradas.length > 0 ? (
            <div className="doacoes-grid">
              {doacoesFiltradas.map((doacao) => (
                <div key={doacao.id_doacao} className="doacao-card">
                  <div className="doacao-card-header">
                    <h3>{doacao.titulo}</h3>
                    <span className={`badge-categoria badge-${doacao.categoria?.toLowerCase().replace(/\s/g, '-')}`}>
                      {doacao.categoria}
                    </span>
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

                    <div className="info-item full-width">
                      <span className="info-label">🏢 Empresa:</span>
                      <span className="info-value empresa-nome">
                        {doacao.Empresa?.Usuario?.nome || doacao.Empresa?.razao_social || "Não informado"}
                      </span>
                    </div>
                  </div>

                  <div className="doacao-footer">
                    <span className="doacao-status">
                      <span className="status-indicator"></span>
                      Disponível
                    </span>
                    <button 
                      onClick={() => handleSolicitarDoacao(doacao.id_doacao)}
                      className="btn-solicitar-doacao"
                    >
                      Solicitar Doação
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nenhuma doação encontrada</h3>
              <p>
                {busca || categoriaFiltro !== "todas" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Não há doações disponíveis no momento"}
              </p>
              {(busca || categoriaFiltro !== "todas") && (
                <button 
                  onClick={() => {
                    setBusca("");
                    setCategoriaFiltro("todas");
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

export default DoacoesDisponiveis;