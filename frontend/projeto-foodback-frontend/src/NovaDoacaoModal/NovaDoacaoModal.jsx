import React, { useState } from "react";

function NovaDoacaoModal({ mostrarModal, setMostrarModal, onDoacaoCadastrada }) {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [etapa, setEtapa] = useState(1); // 1: Dados básicos, 2: Itens detalhados
  
  const [dadosDoacao, setDadosDoacao] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    quantidade: "",
    validade: ""
  });

  const [itensDoacao, setItensDoacao] = useState([
    { nome_item: "", quantidade: "", unidade_medida: "kg" }
  ]);

  const categorias = [
    "Alimentos Perecíveis",
    "Alimentos Não Perecíveis",
    "Frutas e Verduras",
    "Carnes",
    "Laticínios",
    "Panificados",
    "Refeições Prontas",
    "Bebidas",
    "Outros"
  ];

  const unidades = ["kg", "g", "L", "mL", "unidade(s)", "caixa(s)", "pacote(s)"];

  const handleChangeDadosDoacao = (e) => {
    const { name, value } = e.target;
    setDadosDoacao({
      ...dadosDoacao,
      [name]: value
    });
  };

  const handleChangeItem = (index, field, value) => {
    const novosItens = [...itensDoacao];
    novosItens[index][field] = value;
    setItensDoacao(novosItens);
  };

  const adicionarItem = () => {
    setItensDoacao([
      ...itensDoacao,
      { nome_item: "", quantidade: "", unidade_medida: "kg" }
    ]);
  };

  const removerItem = (index) => {
    if (itensDoacao.length > 1) {
      const novosItens = itensDoacao.filter((_, i) => i !== index);
      setItensDoacao(novosItens);
    }
  };

  const validarEtapa1 = () => {
    if (!dadosDoacao.titulo || !dadosDoacao.categoria || !dadosDoacao.validade) {
      setMensagem("⚠️ Preencha todos os campos obrigatórios da etapa 1");
      return false;
    }

    const dataValidade = new Date(dadosDoacao.validade);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataValidade < hoje) {
      setMensagem("⚠️ A data de validade deve ser futura");
      return false;
    }

    return true;
  };

  const avancarEtapa = () => {
    if (validarEtapa1()) {
      setEtapa(2);
      setMensagem("");
    }
  };

  const voltarEtapa = () => {
    setEtapa(1);
    setMensagem("");
  };

  const handleSubmit = async () => {
    // Validação final
    if (!validarEtapa1()) return;

    // Validar se há pelo menos um item preenchido
    const itensValidos = itensDoacao.filter(
      item => item.nome_item && item.quantidade
    );

    if (itensValidos.length === 0) {
      setMensagem("⚠️ Adicione pelo menos um item à doação");
      return;
    }

    setLoading(true);
    setMensagem("⏳ Cadastrando doação...");

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      
      // Cadastrar doação principal
      const responseDoacoes = await fetch("http://127.0.0.1:3001/doacoes/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_empresa: usuario.id_usuario,
          titulo: dadosDoacao.titulo,
          descricao: dadosDoacao.descricao,
          categoria: dadosDoacao.categoria,
          quantidade: dadosDoacao.quantidade,
          validade: dadosDoacao.validade,
          status: "disponivel"
        })
      });

      const resultadoDoacoes = await responseDoacoes.json();

      if (responseDoacoes.ok && resultadoDoacoes.id_doacao) {
        // Cadastrar itens da doação
        const promessasItens = itensValidos.map(item =>
          fetch("http://127.0.0.1:3001/itens-doacao/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_doacao: resultadoDoacoes.id_doacao,
              nome_item: item.nome_item,
              quantidade: item.quantidade,
              unidade_medida: item.unidade_medida
            })
          })
        );

        await Promise.all(promessasItens);

        setMensagem("✅ Doação cadastrada com sucesso!");
        setTimeout(() => {
          fecharModal();
          if (onDoacaoCadastrada) {
            onDoacaoCadastrada();
          }
        }, 2000);
      } else {
        setMensagem(resultadoDoacoes.error || "❌ Erro ao cadastrar doação");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMensagem("❌ Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setEtapa(1);
    setDadosDoacao({
      titulo: "",
      descricao: "",
      categoria: "",
      quantidade: "",
      validade: ""
    });
    setItensDoacao([{ nome_item: "", quantidade: "", unidade_medida: "kg" }]);
    setMensagem("");
    setLoading(false);
  };

  if (!mostrarModal) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
        padding: "20px"
      }}
      onClick={() => !loading && fecharModal()}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "36px",
          maxWidth: "750px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.4s ease"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com indicador de etapas */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: 0, color: "#2c3e50", fontSize: "28px", fontWeight: "700", display: "flex", alignItems: "center", gap: "12px" }}>
              <span>🎁</span> Nova Doação
            </h2>
            <button
              onClick={() => !loading && fecharModal()}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                fontSize: "32px",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#7f8c8d",
                lineHeight: 1,
                opacity: loading ? 0.5 : 1
              }}
            >
              ×
            </button>
          </div>

          {/* Indicador de progresso */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              flex: 1,
              height: "4px",
              backgroundColor: etapa >= 1 ? "#28a745" : "#e0e0e0",
              borderRadius: "2px",
              transition: "all 0.3s"
            }} />
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: etapa >= 1 ? "#28a745" : "#7f8c8d"
            }}>
              Dados Básicos
            </span>
            <div style={{
              flex: 1,
              height: "4px",
              backgroundColor: etapa >= 2 ? "#28a745" : "#e0e0e0",
              borderRadius: "2px",
              transition: "all 0.3s"
            }} />
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: etapa >= 2 ? "#28a745" : "#7f8c8d"
            }}>
              Itens Detalhados
            </span>
          </div>
        </div>

        {/* ETAPA 1: Dados Básicos */}
        {etapa === 1 && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e", fontSize: "14px" }}>
                Título da Doação <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={dadosDoacao.titulo}
                onChange={handleChangeDadosDoacao}
                placeholder="Ex: Alimentos próximos ao vencimento"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                  transition: "all 0.3s",
                  backgroundColor: loading ? "#f5f5f5" : "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e", fontSize: "14px" }}>
                Descrição
              </label>
              <textarea
                name="descricao"
                value={dadosDoacao.descricao}
                onChange={handleChangeDadosDoacao}
                placeholder="Descreva os itens disponíveis para doação, condições de armazenamento, origem, etc..."
                rows="4"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  backgroundColor: loading ? "#f5f5f5" : "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e", fontSize: "14px" }}>
                  Categoria <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <select
                  name="categoria"
                  value={dadosDoacao.categoria}
                  onChange={handleChangeDadosDoacao}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    cursor: loading ? "not-allowed" : "pointer",
                    backgroundColor: loading ? "#f5f5f5" : "white"
                  }}
                >
                  <option value="">Selecione...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e", fontSize: "14px" }}>
                  Quantidade Total (opcional)
                </label>
                <input
                  type="text"
                  name="quantidade"
                  value={dadosDoacao.quantidade}
                  onChange={handleChangeDadosDoacao}
                  placeholder="Ex: 50kg, 100 unidades"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    backgroundColor: loading ? "#f5f5f5" : "white"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e", fontSize: "14px" }}>
                Data de Validade <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="date"
                name="validade"
                value={dadosDoacao.validade}
                onChange={handleChangeDadosDoacao}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                  cursor: loading ? "not-allowed" : "pointer",
                  backgroundColor: loading ? "#f5f5f5" : "white"
                }}
              />
            </div>
          </div>
        )}

        {/* ETAPA 2: Itens Detalhados */}
        {etapa === 2 && (
          <div>
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #e0e0e0"
            }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#5a6c7d", lineHeight: "1.6" }}>
                💡 <strong>Dica:</strong> Detalhe os itens específicos da sua doação para melhor controle e rastreabilidade.
                Você pode adicionar quantos itens forem necessários.
              </p>
            </div>

            <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>
              📦 Itens da Doação
            </h3>

            {itensDoacao.map((item, index) => (
              <div key={index} style={{
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                backgroundColor: "#fafbfc"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h4 style={{ margin: 0, color: "#34495e", fontSize: "16px", fontWeight: "600" }}>
                    Item {index + 1}
                  </h4>
                  {itensDoacao.length > 1 && (
                    <button
                      onClick={() => removerItem(index)}
                      disabled={loading}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        opacity: loading ? 0.5 : 1
                      }}
                    >
                      🗑️ Remover
                    </button>
                  )}
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#34495e", fontSize: "13px" }}>
                    Nome do Item
                  </label>
                  <input
                    type="text"
                    value={item.nome_item}
                    onChange={(e) => handleChangeItem(index, "nome_item", e.target.value)}
                    placeholder="Ex: Arroz Integral, Feijão Preto, Leite UHT..."
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d0d7de",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      backgroundColor: loading ? "#f5f5f5" : "white"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#34495e", fontSize: "13px" }}>
                      Quantidade
                    </label>
                    <input
                      type="text"
                      value={item.quantidade}
                      onChange={(e) => handleChangeItem(index, "quantidade", e.target.value)}
                      placeholder="Ex: 25, 100, 5.5"
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #d0d7de",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        backgroundColor: loading ? "#f5f5f5" : "white"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#34495e", fontSize: "13px" }}>
                      Unidade
                    </label>
                    <select
                      value={item.unidade_medida}
                      onChange={(e) => handleChangeItem(index, "unidade_medida", e.target.value)}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #d0d7de",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        cursor: loading ? "not-allowed" : "pointer",
                        backgroundColor: loading ? "#f5f5f5" : "white"
                      }}
                    >
                      {unidades.map(unidade => (
                        <option key={unidade} value={unidade}>{unidade}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={adicionarItem}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "white",
                color: "#28a745",
                border: "2px dashed #28a745",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s",
                marginBottom: "24px",
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#f0f8f4")}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "white")}
            >
              <span style={{ fontSize: "20px" }}>➕</span>
              Adicionar Mais um Item
            </button>
          </div>
        )}

        {/* Botões de ação */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
          <div>
            {etapa === 2 && (
              <button
                onClick={voltarEtapa}
                disabled={loading}
                style={{
                  padding: "14px 28px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  backgroundColor: "white",
                  color: "#5a6c7d",
                  transition: "all 0.3s",
                  opacity: loading ? 0.5 : 1
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#f8f9fa")}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "white")}
              >
                ← Voltar
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={fecharModal}
              disabled={loading}
              style={{
                padding: "14px 28px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "white",
                color: "#7f8c8d",
                transition: "all 0.3s",
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#f8f9fa")}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "white")}
            >
              Cancelar
            </button>

            {etapa === 1 ? (
              <button
                onClick={avancarEtapa}
                disabled={loading}
                style={{
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  backgroundColor: "#3498db",
                  color: "white",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)"
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#2980b9")}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#3498db")}
              >
                Próximo →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  backgroundColor: loading ? "#95a5a6" : "#28a745",
                  color: "white",
                  transition: "all 0.3s",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: loading ? "none" : "0 4px 12px rgba(40, 167, 69, 0.3)"
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#218838")}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#28a745")}
              >
                {loading ? "⏳ Cadastrando..." : "✓ Cadastrar Doação"}
              </button>
            )}
          </div>
        </div>

        {/* Mensagem de feedback */}
        {mensagem && (
          <div style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: mensagem.includes("✅") ? "#d4edda" : mensagem.includes("⚠️") ? "#fff3cd" : mensagem.includes("⏳") ? "#d1ecf1" : "#f8d7da",
            color: mensagem.includes("✅") ? "#155724" : mensagem.includes("⚠️") ? "#856404" : mensagem.includes("⏳") ? "#0c5460" : "#721c24",
            border: `2px solid ${mensagem.includes("✅") ? "#c3e6cb" : mensagem.includes("⚠️") ? "#ffeaa7" : mensagem.includes("⏳") ? "#bee5eb" : "#f5c6cb"}`,
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {mensagem}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default NovaDoacaoModal;