import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeOng.css";

function HomeOng() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [ong, setOng] = useState(null);
  const [doacoesDisponiveis, setDoacoesDisponiveis] = useState([]);
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOng, setLoadingOng] = useState(true);
  const [erroOng, setErroOng] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "ong") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarDados(usuarioLogado.id_usuario);
  }, [navigate]);

  const carregarDados = async (id_usuario) => {
    console.log("🚀 ONG: Carregando dados para id_usuario:", id_usuario);

    // Busca dados da ONG
    setLoadingOng(true);
    setErroOng(null);
    
    try {
      const resOng = await fetch(`http://127.0.0.1:3001/ong/${id_usuario}`);
      console.log("📡 ONG: Status da resposta:", resOng.status);
      
      if (resOng.ok) {
        const dadosOng = await resOng.json();
        console.log("🏛️ ONG: Dados completos da ONG recebidos:", dadosOng);
        setOng(dadosOng);
      } else {
        const errorText = await resOng.text();
        console.error("❌ Erro ao buscar dados da ONG:", resOng.status, errorText);
        setErroOng("Não foi possível carregar as informações da ONG");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar ONG:", error);
      setErroOng("Erro ao conectar com o servidor");
    } finally {
      setLoadingOng(false);
    }

    // Busca TODAS as doações disponíveis (global)
    try {
      const urlDisponiveis = `http://127.0.0.1:3001/doacoes/disponiveis`;
      console.log("🌍 ONG: Buscando doações disponíveis:", urlDisponiveis);
      
      const resDoacoes = await fetch(urlDisponiveis);
      
      if (resDoacoes.ok) {
        const dadosDoacoes = await resDoacoes.json();
        console.log("🎁 ONG: Doações disponíveis:", dadosDoacoes);
        setDoacoesDisponiveis(Array.isArray(dadosDoacoes) ? dadosDoacoes : []);
      } else {
        console.error("❌ Erro na resposta de doações:", resDoacoes.status);
        setDoacoesDisponiveis([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar doações:", error);
      setDoacoesDisponiveis([]);
    }

    // Busca solicitações da ONG
    try {
      const resSolicitacoes = await fetch(`http://127.0.0.1:3001/solicitacoes/ong/${id_usuario}`);
      
      if (resSolicitacoes.ok) {
        const dadosSolicitacoes = await resSolicitacoes.json();
        console.log("📋 ONG: Solicitações:", dadosSolicitacoes);
        setMinhasSolicitacoes(Array.isArray(dadosSolicitacoes) ? dadosSolicitacoes : []);
      } else {
        console.warn("⚠️ Nenhuma solicitação encontrada");
        setMinhasSolicitacoes([]);
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar solicitações:", error);
      setMinhasSolicitacoes([]);
    }

    setLoading(false);
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
        alert("Solicitação enviada com sucesso!");
        carregarDados(usuario.id_usuario);
      } else {
        const erro = await resposta.json();
        alert(erro.error || "Erro ao solicitar doação.");
      }
    } catch (error) {
      console.error("Erro ao solicitar:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  // Contadores de estatísticas
  const solicitacoesAprovadas = minhasSolicitacoes.filter(s => s.status === "aprovada").length;
  const solicitacoesPendentes = minhasSolicitacoes.filter(s => s.status === "pendente").length;
  const solicitacoesConcluidas = minhasSolicitacoes.filter(s => s.status === "concluida").length;

  return (
    <div className="home-ong">
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

      {/* Main Content */}
      <div className="content-ong">
        {/* Sidebar */}
        <aside className="sidebar-ong">
          <nav className="nav-menu">
            <button className="nav-item active">
              📊 Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/doacoes-disponiveis")}>
              🎁 Doações Disponíveis
            </button>
            <button className="nav-item" onClick={() => navigate("/minhas-solicitacoes")}>
              📋 Minhas Solicitações
              {solicitacoesPendentes > 0 && (
                <span className="badge">{solicitacoesPendentes}</span>
              )}
            </button>
            <button className="nav-item" onClick={() => navigate("/retiradas-agendadas")}>
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

        {/* Main Dashboard */}
        <main className="main-dashboard">
          <h2 className="page-title">Dashboard - {ong?.area_atuacao || ong?.razao_social || "ONG"}</h2>

          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card stat-disponiveis">
              <div className="stat-icon">🎁</div>
              <div className="stat-info">
                <h3>{doacoesDisponiveis.length}</h3>
                <p>Doações Disponíveis</p>
              </div>
            </div>

            <div className="stat-card stat-aprovadas">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <h3>{solicitacoesAprovadas}</h3>
                <p>Solicitações Aprovadas</p>
              </div>
            </div>

            <div className="stat-card stat-pendentes">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{solicitacoesPendentes}</h3>
                <p>Aguardando Resposta</p>
              </div>
            </div>

            <div className="stat-card stat-concluidas">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{solicitacoesConcluidas}</h3>
                <p>Doações Recebidas</p>
              </div>
            </div>
          </div>

          {/* Informações da ONG */}
          <section className="section-info-ong">
            <h3>Informações da ONG</h3>
            {loadingOng ? (
              <div className="empty-state">
                <p>Carregando informações da ONG...</p>
              </div>
            ) : erroOng ? (
              <div className="empty-state error">
                <p>❌ {erroOng}</p>
                <button 
                  onClick={() => carregarDados(usuario?.id_usuario)}
                  className="btn-retry"
                >
                  Tentar novamente
                </button>
              </div>
            ) : ong ? (
              <div className="info-grid">
                <div className="info-item">
                  <strong>Natureza Jurídica:</strong>
                  <span>{ong.natureza_juridica || "Não informado"}</span>
                </div>
                <div className="info-item">
                  <strong>Área de Atuação:</strong>
                  <span>{ong.area_atuacao || "Não informado"}</span>
                </div>
                <div className="info-item">
                  <strong>Pessoas Atendidas:</strong>
                  <span>{ong.numero_pessoas_atendidas ? `${ong.numero_pessoas_atendidas} pessoas` : "Não informado"}</span>
                </div>
                <div className="info-item">
                  <strong>Possui Transporte:</strong>
                  <span>{ong.possui_transporte === true || ong.possui_transporte === 1 ? "Sim" : ong.possui_transporte === false || ong.possui_transporte === 0 ? "Não" : "Não informado"}</span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>⚠️ Nenhuma informação da ONG encontrada.</p>
                <button 
                  onClick={() => navigate("/perfil-ong")}
                  className="btn-completar-perfil"
                >
                  Completar Perfil
                </button>
              </div>
            )}
          </section>

          {/* Doações Recentes no Sistema */}
          <section className="section-doacoes">
            <h3>Doações Recentes no Sistema</h3>
            {doacoesDisponiveis.length > 0 ? (
              <div className="doacoes-grid">
                {doacoesDisponiveis.slice(0, 6).map((doacao) => (
                  <div key={doacao.id_doacao} className="doacao-card-ong">
                    <div className="doacao-header-ong">
                      <h4>{doacao.titulo}</h4>
                      <span className="doacao-categoria-tag">{doacao.categoria}</span>
                    </div>
                    <p className="doacao-descricao-ong">
                      {doacao.descricao || "Sem descrição"}
                    </p>
                    <div className="doacao-detalhes">
                      <span>📊 Qtd: {doacao.quantidade || "N/A"}</span>
                      <span>📅 {new Date(doacao.validade).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="doacao-empresa">
                      <span>
                        🏢 {doacao.Empresa?.Usuario?.nome || doacao.Empresa?.razao_social || "Empresa"}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleSolicitarDoacao(doacao.id_doacao)}
                      className="btn-solicitar"
                    >
                      Solicitar Doação
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nenhuma doação disponível no momento.</p>
              </div>
            )}
          </section>

          {/* Minhas Solicitações Pendentes */}
          {solicitacoesPendentes > 0 && (
            <section className="section-pendentes">
              <h3>Solicitações Aguardando Resposta</h3>
              <div className="solicitacoes-list">
                {minhasSolicitacoes
                  .filter(s => s.status === "pendente")
                  .map((solicitacao) => (
                    <div key={solicitacao.id_solicitacao} className="solicitacao-card-ong">
                      <div className="solicitacao-info-ong">
                        <h4>Doação: {solicitacao.titulo_doacao}</h4>
                        <p>Empresa: {solicitacao.nome_empresa}</p>
                        <p className="data-solicitacao">
                          Solicitado em: {new Date(solicitacao.data_solicitacao).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <span className="status-pendente">⏳ Pendente</span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomeOng;