/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { plano, tipoUsuario } = location.state || {};

  const [metodoPagamento, setMetodoPagamento] = useState("cartao");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pixData, setPixData] = useState(null);
  const [email, setEmail] = useState("");
  
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    cpf: ""
  });

  const [dadosPix, setDadosPix] = useState({
    cpf: "",
    email: ""
  });

  const [dadosBoleto, setDadosBoleto] = useState({
    cpf: "",
    nome: "",
    email: ""
  });

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!plano) {
    navigate("/planos");
    return null;
  }

  // Extrair valor numérico do preço
  const getValorNumerico = (preco) => {
    const numeroStr = preco.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numeroStr);
  };

  const valorPlano = getValorNumerico(plano.preco);

  const handleChangeCartao = (e) => {
    let { name, value } = e.target;

    if (name === "numero") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "validade") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    if (name === "cpf") {
      value = value.replace(/\D/g, "").slice(0, 11);
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    setDadosCartao({ ...dadosCartao, [name]: value });
  };

  const handleChangePix = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      let cpf = value.replace(/\D/g, "").slice(0, 11);
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      setDadosPix({ ...dadosPix, cpf });
    } else {
      setDadosPix({ ...dadosPix, [name]: value });
    }
  };

  const handleChangeBoleto = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      let cpf = value.replace(/\D/g, "").slice(0, 11);
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      setDadosBoleto({ ...dadosBoleto, cpf });
    } else {
      setDadosBoleto({ ...dadosBoleto, [name]: value });
    }
  };

  const processarPagamentoPix = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/mercadopago/create-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_amount: valorPlano,
          description: `Plano ${plano.nome} - FoodBack`,
          payer: {
            email: dadosPix.email,
            cpf: dadosPix.cpf.replace(/\D/g, "")
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      setPixData(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Erro ao processar pagamento PIX");
    }
  };

  const processarPagamentoCartao = async () => {
    try {
      // Criar token do cartão usando SDK do Mercado Pago
      const mp = new window.MercadoPago("TEST-5e97bb2f-49d9-47a3-8500-aab43bb2eeb5", {
        locale: "pt-BR"
      });

      const [mes, ano] = dadosCartao.validade.split("/");
      
      const cardData = {
        cardNumber: dadosCartao.numero.replace(/\s/g, ""),
        cardholderName: dadosCartao.nome,
        cardExpirationMonth: mes,
        cardExpirationYear: `20${ano}`,
        securityCode: dadosCartao.cvv,
        identificationType: "CPF",
        identificationNumber: dadosCartao.cpf.replace(/\D/g, "")
      };

      const token = await mp.createCardToken(cardData);

      // Enviar para o backend
      const response = await fetch("http://localhost:3001/api/mercadopago/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_amount: valorPlano,
          description: `Plano ${plano.nome} - FoodBack`,
          payment_method_id: "visa", // Detectar automaticamente
          token: token.id,
          installments: 1,
          payer: {
            email: email,
            identification: {
              type: "CPF",
              number: dadosCartao.cpf.replace(/\D/g, "")
            }
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      return data;
    } catch (err) {
      throw new Error(err.message || "Erro ao processar pagamento com cartão");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let resultado;

      if (metodoPagamento === "pix") {
        resultado = await processarPagamentoPix();
        alert("✅ PIX gerado com sucesso! Use o QR Code abaixo para pagar.");
      } else if (metodoPagamento === "cartao") {
        resultado = await processarPagamentoCartao();
        
        if (resultado.status === "approved") {
          alert(`✅ Pagamento aprovado!\n\nPlano: ${plano.nome}\nValor: ${plano.preco}\nID: ${resultado.id}`);
          
          if (tipoUsuario === "empresa") {
            navigate("/home-empresa");
          } else {
            navigate("/home-ong");
          }
        } else {
          throw new Error("Pagamento não foi aprovado. Status: " + resultado.status);
        }
      } else {
        // Simulação para boleto
        setTimeout(() => {
          alert(`✅ Boleto gerado com sucesso!\n\nPlano: ${plano.nome}\nValor: ${plano.preco}\n\nO boleto foi enviado para seu e-mail.`);
          
          if (tipoUsuario === "empresa") {
            navigate("/home-empresa");
          } else {
            navigate("/home-ong");
          }
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
      alert("❌ Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigoPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      alert("✅ Código PIX copiado!");
    }
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-content">
          <button onClick={() => navigate(-1)} className="btn-voltar-checkout">
            ← Voltar
          </button>
          <h1 className="checkout-logo">
            <span className="logo-food">Food</span>
            <span className="logo-back">Back</span>
          </h1>
        </div>
      </header>

      <div className="checkout-container">
        <div className="checkout-resumo">
          <div className="resumo-card">
            <h2>Resumo do Pedido</h2>
            
            <div className="resumo-plano">
              <div className="resumo-plano-header">
                <h3>Plano {plano.nome}</h3>
                <span className="resumo-badge">
                  {tipoUsuario === "empresa" ? "🏢 Empresa" : "🤝 ONG"}
                </span>
              </div>
              
              <div className="resumo-preco">
                <span className="preco-label">Valor mensal</span>
                <span className="preco-valor">{plano.preco}</span>
              </div>

              <div className="resumo-recursos">
                <h4>Inclui:</h4>
                <ul>
                  {plano.recursos
                    .filter(r => r.incluido)
                    .slice(0, 5)
                    .map((recurso, idx) => (
                      <li key={idx}>✓ {recurso.texto}</li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="resumo-total">
              <span>Total a pagar hoje</span>
              <strong>{plano.preco}</strong>
            </div>

            <div className="resumo-info">
              <p>💳 Renovação automática mensal</p>
              <p>🔒 Pagamento 100% seguro</p>
              <p>✓ Cancele quando quiser</p>
            </div>
          </div>
        </div>

        <div className="checkout-pagamento">
          <div className="pagamento-card">
            <h2>Forma de Pagamento</h2>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <div className="metodos-pagamento">
              <button
                className={`metodo-btn ${metodoPagamento === "cartao" ? "active" : ""}`}
                onClick={() => setMetodoPagamento("cartao")}
              >
                💳 Cartão de Crédito
              </button>
              <button
                className={`metodo-btn ${metodoPagamento === "pix" ? "active" : ""}`}
                onClick={() => setMetodoPagamento("pix")}
              >
                📱 PIX
              </button>
              <button
                className={`metodo-btn ${metodoPagamento === "boleto" ? "active" : ""}`}
                onClick={() => setMetodoPagamento("boleto")}
              >
                📄 Boleto
              </button>
            </div>

            <form className="pagamento-form" onSubmit={handleSubmit}>
              {metodoPagamento === "cartao" && (
                <div className="form-cartao">
                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Número do Cartão</label>
                    <input
                      type="text"
                      name="numero"
                      value={dadosCartao.numero}
                      onChange={handleChangeCartao}
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Nome no Cartão</label>
                    <input
                      type="text"
                      name="nome"
                      value={dadosCartao.nome}
                      onChange={handleChangeCartao}
                      placeholder="Nome como está no cartão"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Validade</label>
                      <input
                        type="text"
                        name="validade"
                        value={dadosCartao.validade}
                        onChange={handleChangeCartao}
                        placeholder="MM/AA"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={dadosCartao.cvv}
                        onChange={handleChangeCartao}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>CPF do Titular</label>
                    <input
                      type="text"
                      name="cpf"
                      value={dadosCartao.cpf}
                      onChange={handleChangeCartao}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
              )}

              {metodoPagamento === "pix" && !pixData && (
                <div className="form-pix">
                  <div className="pix-info">
                    <div className="pix-icon">📱</div>
                    <h3>Pagamento via PIX</h3>
                    <p>Após confirmar, você receberá um QR Code para realizar o pagamento</p>
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={dadosPix.email}
                      onChange={handleChangePix}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={dadosPix.cpf}
                      onChange={handleChangePix}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div className="pix-vantagens">
                    <p>✓ Aprovação instantânea</p>
                    <p>✓ Seguro e prático</p>
                    <p>✓ Disponível 24/7</p>
                  </div>
                </div>
              )}

              {metodoPagamento === "pix" && pixData && (
                <div className="pix-resultado">
                  <div className="pix-qrcode">
                    <h3>✅ PIX Gerado com Sucesso!</h3>
                    <p>Escaneie o QR Code abaixo:</p>
                    <img 
                      src={`data:image/png;base64,${pixData.qr_code_base64}`} 
                      alt="QR Code PIX" 
                      style={{ width: "250px", margin: "20px auto", display: "block" }}
                    />
                    <button 
                      type="button" 
                      className="btn-copiar-pix"
                      onClick={copiarCodigoPix}
                    >
                      📋 Copiar Código PIX
                    </button>
                    <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
                      O pagamento será confirmado automaticamente após a aprovação
                    </p>
                  </div>
                </div>
              )}

              {metodoPagamento === "boleto" && (
                <div className="form-boleto">
                  <div className="boleto-info">
                    <div className="boleto-icon">📄</div>
                    <h3>Pagamento via Boleto</h3>
                    <p>O boleto será gerado e enviado para seu e-mail</p>
                  </div>

                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      value={dadosBoleto.nome}
                      onChange={handleChangeBoleto}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={dadosBoleto.email}
                      onChange={handleChangeBoleto}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={dadosBoleto.cpf}
                      onChange={handleChangeBoleto}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div className="boleto-aviso">
                    <p>⚠️ O boleto leva até 3 dias úteis para compensar</p>
                    <p>📧 Você receberá o boleto por e-mail</p>
                  </div>
                </div>
              )}

              {!pixData && (
                <button 
                  type="submit" 
                  className="btn-finalizar"
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Confirmar Pagamento"}
                </button>
              )}

              <p className="pagamento-seguro">
                🔒 Seus dados estão protegidos com criptografia SSL
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;