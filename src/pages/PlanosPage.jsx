/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanosPage.css";

function PlanosPage() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("empresa"); // 'empresa' ou 'ong'

  const planosEmpresa = [
    {
      nome: "Básico",
      preco: "Gratuito",
      precoNumerico: 0,
      cor: "basico",
      destaque: false,
      recursos: [
        { texto: "Criar até 10 doações por mês", incluido: true },
        { texto: "Relatório mensal simples", incluido: true },
        { texto: "1 usuário por empresa", incluido: true },
        { texto: "Ver perfil de ONGs", incluido: true },
        { texto: "Prioridade de exibição", incluido: false },
        { texto: "Relatórios completos", incluido: false },
        { texto: "Múltiplos usuários", incluido: false }
      ]
    },
    {
      nome: "Premium",
      preco: "R$ 29,90",
      precoNumerico: 29.90,
      cor: "premium",
      destaque: true,
      badge: "Mais Popular",
      recursos: [
        { texto: "Doações ilimitadas", incluido: true },
        { texto: "Prioridade de exibição para ONGs", incluido: true },
        { texto: "Relatório mensal completo", incluido: true },
        { texto: "Até 3 usuários por empresa", incluido: true },
        { texto: "Ver perfil de ONGs e Empresas", incluido: true },
        { texto: "Suporte prioritário", incluido: true },
        { texto: "Distribuição automática", incluido: false }
      ]
    },
    {
      nome: "Avançado",
      preco: "R$ 59,90",
      precoNumerico: 59.90,
      cor: "avancado",
      destaque: false,
      recursos: [
        { texto: "Doações ilimitadas", incluido: true },
        { texto: "Prioridade máxima de exibição", incluido: true },
        { texto: "Relatórios semanais, mensais e anuais", incluido: true },
        { texto: "Ilimitados usuários por empresa", incluido: true },
        { texto: "Ver perfil de ONGs e Empresas", incluido: true },
        { texto: "Distribuição inteligente e automática", incluido: true },
        { texto: "Suporte VIP 24/7", incluido: true }
      ]
    }
  ];

  const planosOng = [
    {
      nome: "Básico",
      preco: "Gratuito",
      precoNumerico: 0,
      cor: "basico",
      destaque: false,
      recursos: [
        { texto: "Solicitar até 10 doações por mês", incluido: true },
        { texto: "Relatório mensal simples", incluido: true },
        { texto: "1 usuário por ONG", incluido: true },
        { texto: "Ver perfil das Empresas", incluido: true },
        { texto: "Prioridade para receber doações", incluido: false },
        { texto: "Relatórios completos", incluido: false },
        { texto: "Múltiplos usuários", incluido: false }
      ]
    },
    {
      nome: "Premium",
      preco: "R$ 9,90",
      precoNumerico: 9.90,
      cor: "premium",
      destaque: true,
      badge: "Mais Popular",
      recursos: [
        { texto: "Solicitações ilimitadas", incluido: true },
        { texto: "Prioridade para receber doações", incluido: true },
        { texto: "Relatórios mensais completos", incluido: true },
        { texto: "Até 3 usuários por ONG", incluido: true },
        { texto: "Ver perfil das Empresas e ONGs", incluido: true },
        { texto: "Suporte prioritário", incluido: true },
        { texto: "Recomendação automática", incluido: false }
      ]
    },
    {
      nome: "Avançado",
      preco: "R$ 19,90",
      precoNumerico: 19.90,
      cor: "avancado",
      destaque: false,
      recursos: [
        { texto: "Solicitações ilimitadas", incluido: true },
        { texto: "Prioridade máxima para receber doações", incluido: true },
        { texto: "Relatórios semanais, mensais e anuais", incluido: true },
        { texto: "Ilimitados usuários por ONG", incluido: true },
        { texto: "Ver perfil de ONGs e Empresas", incluido: true },
        { texto: "Recomendação automática de doação", incluido: true },
        { texto: "Suporte VIP 24/7", incluido: true }
      ]
    }
  ];

  const planosAtivos = tipoUsuario === "empresa" ? planosEmpresa : planosOng;

  const handleAssinar = (plano) => {
    if (plano.precoNumerico === 0) {
      // Redireciona para o cadastro com o tipo correto
      navigate(`/register?tipo=${tipoUsuario}`);
    } else {
      // Redireciona para a página de checkout
      navigate('/checkout', { state: { plano, tipoUsuario } });
    }
  };

  return (
    <div className="planos-page">
      {/* Header */}
      <header className="planos-header">
        <div className="planos-header-content">
          <button onClick={() => navigate(-1)} className="btn-voltar">
            ← Voltar
          </button>
          <h1 className="planos-logo">
            <span className="logo-food">Food</span>
            <span className="logo-back">Back</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="planos-hero">
        <h1 className="planos-hero-title">Escolha o plano ideal para você</h1>
        <p className="planos-hero-subtitle">
          Planos flexíveis que crescem junto com seu impacto social
        </p>

        {/* Toggle de tipo de usuário */}
        <div className="planos-toggle">
          <button
            className={`toggle-btn ${tipoUsuario === "empresa" ? "active" : ""}`}
            onClick={() => setTipoUsuario("empresa")}
          >
            🏢 Para Empresas
          </button>
          <button
            className={`toggle-btn ${tipoUsuario === "ong" ? "active" : ""}`}
            onClick={() => setTipoUsuario("ong")}
          >
            🤝 Para ONGs
          </button>
        </div>
      </section>

      {/* Cards de Planos */}
      <section className="planos-container">
        <div className="planos-grid">
          {planosAtivos.map((plano, index) => (
            <div
              key={index}
              className={`plano-card plano-${plano.cor} ${plano.destaque ? "destaque" : ""}`}
            >
              {plano.badge && (
                <div className="plano-badge">{plano.badge}</div>
              )}

              <div className="plano-header">
                <h3 className="plano-nome">{plano.nome}</h3>
                <div className="plano-preco">
                  <span className="preco-valor">{plano.preco}</span>
                  {plano.precoNumerico > 0 && (
                    <span className="preco-periodo">/mês</span>
                  )}
                </div>
              </div>

              <ul className="plano-recursos">
                {plano.recursos.map((recurso, idx) => (
                  <li key={idx} className={recurso.incluido ? "incluido" : "nao-incluido"}>
                    <span className="recurso-icone">
                      {recurso.incluido ? "✓" : "✗"}
                    </span>
                    <span className="recurso-texto">{recurso.texto}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn-assinar btn-${plano.cor}`}
                onClick={() => handleAssinar(plano)}
              >
                {plano.precoNumerico === 0 ? "Começar Gratuitamente" : "Assinar Agora"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="planos-faq">
        <h2 className="faq-title">Perguntas Frequentes</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>📌 Posso mudar de plano depois?</h3>
            <p>Sim! Você pode fazer upgrade ou downgrade a qualquer momento.</p>
          </div>
          <div className="faq-item">
            <h3>💳 Quais formas de pagamento?</h3>
            <p>Aceitamos cartão de crédito, débito, PIX e boleto bancário.</p>
          </div>
          <div className="faq-item">
            <h3>🔄 Posso cancelar quando quiser?</h3>
            <p>Sim, sem taxas ou multas. Cancele quando precisar.</p>
          </div>
          <div className="faq-item">
            <h3>📊 Os relatórios são personalizáveis?</h3>
            <p>Sim! Nos planos Premium e Avançado você pode customizar seus relatórios.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="planos-footer">
        <p>© 2024 FoodBack. Todos os direitos reservados.</p>
        <div className="footer-links">
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Contato</a>
        </div>
      </footer>
    </div>
  );
}

export default PlanosPage;