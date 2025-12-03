import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import pizzaImg from "../assets/pizza.png";
import leaf from "../assets/decor/leaf.png";
import pimentao from "../assets/decor/pimentao.png";
import pimenta from "../assets/decor/pimenta.png";
import tomate from "../assets/decor/tomate.png";
import doacao from "../assets/decor/doacao.png";
import terra from "../assets/decor/terra.png";
import sobrenos from "../assets/decor/sobrenos.png";
import joaovit from "../assets/decor/JoaoVit.png"
import luizfel from "../assets/decor/LuizFel.png"
import marceloaug from "../assets/decor/MarceloAug.png"
import pauloric from "../assets/decor/PauloRic.png"
import samuelvic from "../assets/decor/SamuelVicente.png" 
import ethancoh from "../assets/decor/EthanCohelet.jpeg"

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">

      {/* HEADER */}
      <header className="navbar">
        <nav>
          <a href="#inicio">Início</a>
          <a href="#sobre-nos">Sobre Nós</a>
          <a href="#equipe">Equipe</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-login-container">
          <button
            className="btn-cadastrar"
            onClick={() => navigate("/planos")}
          >
            CADASTRE-SE
          </button>

          <button 
            className="btn-header-login" 
            onClick={() => navigate('/login')}
          >
            <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </header>

      {/* FUNDO ESCURO DO TOPO */}
      <div className="topo-bg">
        
        {/* DECORAÇÕES */}
        <div className="decorations">
          <img src={leaf} alt="Folha" className="decor decor-leaf" />
          <img src={pimentao} alt="Pimentão" className="decor decor-pimentao" />
          <img src={pimenta} alt="Pimenta" className="decor decor-pimenta" />
          <img src={tomate} alt="Tomate" className="decor decor-tomate" />
        </div>

        {/* SEÇÃO INÍCIO */}
        <section id="inicio" className="section-inicio">
          <div className="content-center">
            
            <h1 className="logo-central">
              <span className="food">FOOD</span>
              <span className="back">BACK</span>
            </h1>

            <div className="pizza-container">
              <img src={pizzaImg} alt="Pizza" className="pizza-img" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="smoke-bottom"></div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="white-overlay">
        {/* Container para imagens de fundo */}
        <img src={terra} alt="Terra" className="bg-image bg-terra" />
        <img src={doacao} alt="Doação" className="bg-image bg-doacao" />

        {/* Container do texto */}
        <div className="slogan-container">
          <h2 className="slogan-top">Transformando desperdício em</h2>
          <h1 className="slogan-bottom">SOLIDARIEDADE</h1>
        </div>
      </div>

      <section id="sobre-nos" className="section-sobre-nos">
        <h2>Sobre Nós</h2>
        <div className="sobre-nos-content">
          <div className="sobre-nos-text">
            <p>
              O FoodBack é uma plataforma criada com o propósito de combater o desperdício de alimentos e contribuir para a solidariedade social. Nosso sistema conecta estabelecimentos que possuem alimentos excedentes a ONGs que, por sua vez, fazem a distribuição para pessoas em situação de vulnerabilidade.
            </p>
            <p>
              Acreditamos que o reaproveitamento consciente dos alimentos pode gerar um impacto positivo no meio ambiente e na vida de muitas pessoas que enfrentam dificuldades. Por meio do FoodBack, buscamos facilitar essa conexão, promovendo uma cadeia colaborativa eficiente e transparente.
            </p>
            <p>
              Junte-se a nós nessa missão de transformar desperdício em esperança, promovendo um futuro mais justo e sustentável para todos.
            </p>
          </div>
          <div className="sobre-nos-right">
            <img src={sobrenos} alt="Sobre Nós" className="bg-image bg-sobrenos" />
            <div className="sobre-nos-button">
              <button className="btn-explorar" onClick={() => navigate('/sobre')}>Explorar mais</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO EQUIPE */}
      <section id="equipe" className="section-equipe">
        <h2>EQUIPE</h2>
        <div className="equipe-grid">
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={joaovit} alt="João Victor" className="foto-membro" />
            </div>
            <h3 className="nome-membro">João Victor</h3>
            <p className="cargo-membro">Técnico em Documentação</p>
          </div>
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={luizfel} alt="Luiz Felipe" className="foto-membro" />
            </div>
            <h3 className="nome-membro">Luiz Felipe</h3>
            <p className="cargo-membro">Desenvolvedor Back-end</p>
          </div>
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={samuelvic} alt="Samuel Vicente" className="foto-membro" />
            </div>
            <h3 className="nome-membro">Samuel Vicente</h3>
            <p className="cargo-membro">Desenvolvedor Front-end</p>
          </div>
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={marceloaug} alt="Marcelo Augusto" className="foto-membro" />
            </div>
            <h3 className="nome-membro">Marcelo Augusto</h3>
            <p className="cargo-membro">Diretor de Vendas</p>
          </div>
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={pauloric} alt="Paulo Ricardo" className="foto-membro" />
            </div>
            <h3 className="nome-membro">Paulo Ricardo</h3>
            <p className="cargo-membro">Gestor de Marketing</p>
          </div>
          <div className="membro-equipe">
            <div className="circulo-membro">
              <img src={ethancoh} alt="Ethan Cohelet" className="foto-membro" />
            </div>
            <h3 className="nome-membro">Ethan Cohelet</h3>
            <p className="cargo-membro">Diretor do Projeto</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO */}
      <section id="contato" className="section-contato">
        <h2>CONTATO</h2>
        <div className="contato-grid">
          <div className="contato-item">
            <div className="contato-icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h3 className="contato-titulo">Telefone</h3>
            <p className="contato-info">+55 84 99999-0000</p>
          </div>
          <div className="contato-item">
            <div className="contato-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h3 className="contato-titulo">E-mail</h3>
            <p className="contato-info">foodbackacademico@gmail.com</p>
          </div>
          <div className="contato-item">
            <div className="contato-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <h3 className="contato-titulo">Localização</h3>
            <p className="contato-info">Av. Parque das Algarobas Nº 69<br />Natal - RN</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;