/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./AgendarRetiradaModal.css";

function AgendarRetiradaModal({ solicitacao, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    responsavel_retirada: "",
    tipo_transporte: "",
    data_retirada: "",
    horario_retirada: "",
    observacoes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (!formData.responsavel_retirada.trim()) {
      alert("Por favor, informe o nome do responsável pela retirada.");
      return;
    }

    if (!formData.tipo_transporte) {
      alert("Por favor, selecione o tipo de transporte.");
      return;
    }

    if (!formData.data_retirada) {
      alert("Por favor, informe a data da retirada.");
      return;
    }

    if (!formData.horario_retirada) {
      alert("Por favor, informe o horário da retirada.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3001/retiradas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_solicitacao: solicitacao.id_solicitacao,
          responsavel_retirada: formData.responsavel_retirada,
          tipo_transporte: formData.tipo_transporte,
          data_retirada: formData.data_retirada,
          horario_retirada: formData.horario_retirada,
          observacoes: formData.observacoes || null
        })
      });

      if (response.ok) {
        alert("Retirada agendada com sucesso!");
        onSuccess();
        onClose();
      } else {
        const erro = await response.json();
        alert(erro.error || "Erro ao agendar retirada.");
      }
    } catch (error) {
      console.error("Erro ao agendar retirada:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Data mínima: hoje
  const dataMinima = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚚 Agendar Retirada</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-info-solicitacao">
          <div className="info-item">
            <span className="info-label">Solicitação:</span>
            <span className="info-value">#{solicitacao.id_solicitacao}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Doação:</span>
            <span className="info-value">{solicitacao.Doacao?.titulo || "Não informado"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Empresa:</span>
            <span className="info-value">{solicitacao.Doacao?.Empresa?.Usuario?.nome || "Não informado"}</span>
          </div>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="responsavel_retirada">
              👤 Responsável pela Retirada *
            </label>
            <input
              type="text"
              id="responsavel_retirada"
              name="responsavel_retirada"
              value={formData.responsavel_retirada}
              onChange={handleChange}
              placeholder="Nome completo do responsável"
              required
              maxLength={120}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="data_retirada">
                📅 Data da Retirada *
              </label>
              <input
                type="date"
                id="data_retirada"
                name="data_retirada"
                value={formData.data_retirada}
                onChange={handleChange}
                min={dataMinima}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horario_retirada">
                🕐 Horário da Retirada *
              </label>
              <input
                type="time"
                id="horario_retirada"
                name="horario_retirada"
                value={formData.horario_retirada}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tipo_transporte">
              🚗 Tipo de Transporte *
            </label>
            <select
              id="tipo_transporte"
              name="tipo_transporte"
              value={formData.tipo_transporte}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo de transporte</option>
              <option value="Carro">🚗 Carro</option>
              <option value="Moto">🏍️ Moto</option>
              <option value="Van">🚐 Van</option>
              <option value="Caminhão">🚚 Caminhão</option>
              <option value="Bicicleta">🚲 Bicicleta</option>
              <option value="A pé">🚶 A pé</option>
              <option value="Outro">📦 Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">
              💬 Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais sobre a retirada (opcional)"
              rows={4}
            />
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancelar-modal"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-confirmar-modal"
              disabled={loading}
            >
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgendarRetiradaModal;