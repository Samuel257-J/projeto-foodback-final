import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeEmpresa.css";
import NovaDoacaoModal from "../NovaDoacaoModal/NovaDoacaoModal";
import NotificacoesEmpresa from './NotificacoesEmpresa';

function HomeEmpresa() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [doacoesDisponiveis, setDoacoesDisponiveis] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLogado || usuarioLogado.tipo_usuario !== "empresa") {
      navigate("/login");
      return;
    }
    setUsuario(usuarioLogado);
    carregarDados(usuarioLogado.id_usuario);
  }, [navigate]);

  const carregarDados = async (id_usuario) => {
    try {
      const resEmpresa = await fetch(`http://127.0.0.1:3001/empresa/dados/${id_usuario}`);
      const dadosEmpresa = await resEmpresa.json();
      setEmpresa(dadosEmpresa);
    } catch (error) {
      console.error("Erro ao carregar empresa:", error);
    }

    try {
      const resDoacoes = await fetch(`http://127.0.0.1:3001/doacoes/empresa/${id_usuario}`);
      if (resDoacoes.ok) {
        const dadosDoacoes = await resDoacoes.json();
        setDoacoes(Array.isArray(dadosDoacoes) ? dadosDoacoes : []);
      } else {
        setDoacoes([]);
      }
    } catch (error) {
      setDoacoes([]);
      console.error("Erro ao carregar doações:", error);
    }

    try {
      const resDisponiveis = await fetch(`http://127.0.0.1:3001/doacoes/disponiveis`);
      if (resDisponiveis.ok) {
        const dadosDisponiveis = await resDisponiveis.json();
        setDoacoesDisponiveis(Array.isArray(dadosDisponiveis) ? dadosDisponiveis : []);
      } else {
        setDoacoesDisponiveis([]);
      }
    } catch (error) {
      setDoacoesDisponiveis([]);
      console.error("Erro ao carregar doações disponíveis:", error);
    }

    try {
      const resSolicitacoes = await fetch(`http://127.0.0.1:3001/solicitacoes/empresa/${id_usuario}`);
      if (resSolicitacoes.ok) {
        const dadosSolicitacoes = await resSolicitacoes.json();
        setSolicitacoes(Array.isArray(dadosSolicitacoes) ? dadosSolicitacoes : []);
      } else {
        setSolicitacoes([]);
      }
    } catch (error) {
      setSolicitacoes([]);
      console.warn("Erro ao carregar solicitações:", error);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleDoacaoCadastrada = () => {
    if (usuario) {
      carregarDados(usuario.id_usuario);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  const minhasDoacoesDisponiveis = doacoes.filter(d => d.status === "disponivel").length;
  const minhasDoacoesReservadas = doacoes.filter(d => d.status === "reservada").length;
  const totalDoacoesDisponiveis = doacoesDisponiveis.length;
  const solicitacoesPendentes = solicitacoes.filter(s => s.status === "pendente").length;

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
          <NotificacoesEmpresa idUsuario={usuario?.id_usuario} />
          <span className="usuario-nome">Olá, {usuario?.nome}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <div className="content-empresa">
        {/* Sidebar */}
        <aside className="sidebar-empresa">
          <nav className="nav-menu">
            <button className="nav-item active">📊 Dashboard</button>
            <button className="nav-item" onClick={() => navigate("/minhas-doacoes")}>🎁 Minhas Doações</button>
            <button className="nav-item" onClick={() => setMostrarModal(true)}>➕ Nova Doação</button>
            <button className="nav-item" onClick={() => navigate("/solicitacoes")}>
              📋 Solicitações {solicitacoesPendentes > 0 && <span className="badge">{solicitacoesPendentes}</span>}
            </button>
            <button className="nav-item" onClick={() => navigate("/historico-empresa")}>📚 Histórico</button>
            <button className="nav-item" onClick={() => navigate("/perfil-empresa")}>⚙️ Configurações</button>
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="main-dashboard">
          <h2 className="page-title">Dashboard - {empresa?.razao_social}</h2>

          {/* Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card stat-disponivel">
              <div className="stat-icon">🎁</div>
              <div className="stat-info">
                <h3>{totalDoacoesDisponiveis}</h3>
                <p>Doações Disponíveis</p>
              </div>
            </div>
            <div className="stat-card stat-total">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{doacoes.length}</h3>
                <p>Minhas Doações</p>
              </div>
            </div>
            <div className="stat-card stat-reservada">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{minhasDoacoesReservadas}</h3>
                <p>Reservadas</p>
              </div>
            </div>
            <div className="stat-card stat-solicitacoes">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{solicitacoesPendentes}</h3>
                <p>Solicitações Pendentes</p>
              </div>
            </div>
          </div>

          {/* Doações Recentes Globais */}
          <section className="section-recentes">
            <h3>Doações Recentes no Sistema</h3>
            {doacoesDisponiveis.length > 0 ? (
              <div className="doacoes-list">
                {doacoesDisponiveis.slice(0, 5).map((doacao) => (
                  <div key={doacao.id_doacao} className="doacao-card">
                    <div className="doacao-header">
                      <h4>{doacao.titulo}</h4>
                      <span className={`status-badge status-${doacao.status}`}>{doacao.status}</span>
                    </div>
                    <p className="doacao-descricao">{doacao.descricao || "Sem descrição"}</p>
                    <div className="doacao-footer">
                      <span className="doacao-categoria">📦 {doacao.categoria}</span>
                      <span className="doacao-quantidade">📊 {doacao.quantidade || "N/A"}</span>
                      <span className="doacao-validade">📅 {new Date(doacao.validade).toLocaleDateString("pt-BR")}</span>
                      {doacao.Empresa && (
                        <span className="doacao-empresa">🏢 {doacao.Empresa.Usuario?.nome || doacao.Empresa.razao_social}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nenhuma doação disponível no sistema no momento.</p>
              </div>
            )}
          </section>

          {/* Minhas Doações */}
          {doacoes.length > 0 && (
            <section className="section-recentes">
              <h3>Minhas Doações Cadastradas</h3>
              <div className="doacoes-list">
                {doacoes.slice(0, 5).map((doacao) => (
                  <div key={doacao.id_doacao} className="doacao-card">
                    <div className="doacao-header">
                      <h4>{doacao.titulo}</h4>
                      <span className={`status-badge status-${doacao.status}`}>{doacao.status}</span>
                    </div>
                    <p className="doacao-descricao">{doacao.descricao || "Sem descrição"}</p>
                    <div className="doacao-footer">
                      <span className="doacao-categoria">📦 {doacao.categoria}</span>
                      <span className="doacao-quantidade">📊 {doacao.quantidade || "N/A"}</span>
                      <span className="doacao-validade">📅 {new Date(doacao.validade).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Solicitações Pendentes */}
          {solicitacoesPendentes > 0 && (
            <section className="section-solicitacoes">
              <h3>Solicitações Aguardando Resposta</h3>
              <div className="solicitacoes-list">
                {solicitacoes
                  .filter(s => s.status === "pendente")
                  .slice(0, 3)
                  .map((solicitacao) => (
                    <div key={solicitacao.id_solicitacao} className="solicitacao-card">
                      <div className="solicitacao-info">
                        <h4>Solicitação #{solicitacao.id_solicitacao}</h4>
                        <p>ONG: {solicitacao.nome_ong}</p>
                        <p>Doação: {solicitacao.titulo_doacao}</p>
                        <p className="data-solicitacao">
                          {new Date(solicitacao.data_solicitacao).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="solicitacao-actions">
                        <button className="btn-aprovar">✓ Aprovar</button>
                        <button className="btn-rejeitar">✗ Rejeitar</button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
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

export default HomeEmpresa;
