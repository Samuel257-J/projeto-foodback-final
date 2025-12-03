import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function NotificacoesEmpresa({ idUsuario }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
    carregarNotificacoes();
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [idUsuario]);

  const carregarNotificacoes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/notificacoes/${idUsuario}`);
      if (response.ok) {
        const dados = await response.json();
        setNotificacoes(dados);
        setNaoLidas(dados.filter(n => !n.lida).length);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const marcarComoLida = async (id_notificacao) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/notificacoes/${id_notificacao}/ler`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        carregarNotificacoes();
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const promises = notificacoes
        .filter(n => !n.lida)
        .map(n => fetch(`http://127.0.0.1:3001/notificacoes/${n.id_notificacao}/ler`, {
          method: 'PUT'
        }));
      
      await Promise.all(promises);
      carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getIconeNotificacao = (tipo) => {
    const icones = {
      'agendamento_retirada': '📅',
      'solicitacao_recebida': '📥',
      'solicitacao_aprovada': '✅',
      'doacao_cadastrada': '📦'
    };
    return icones[tipo] || '🔔';
  };

  const formatarTempo = (data) => {
    const agora = new Date();
    const dataNotif = new Date(data);
    const diffMs = agora - dataNotif;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;
    return dataNotif.toLocaleDateString('pt-BR');
  };

  const renderizarDetalhesAgendamento = (notif) => {
    if (notif.tipo !== 'agendamento_retirada') return null;

    try {
      const dados = notif.dados_extras ? JSON.parse(notif.dados_extras) : null;
      
      if (!dados) return null;

      return (
        <div style={{
          marginTop: '0.8rem',
          padding: '0.75rem',
          background: 'rgba(45, 84, 47, 0.05)',
          borderRadius: '8px',
          borderLeft: '3px solid #2d542f'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            fontSize: '0.85rem',
            color: '#2d3748'
          }}>
            {/* Data e Horário */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📆</span>
                <span style={{ fontWeight: '600' }}>
                  {dados.data_retirada ? new Date(dados.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não informada'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>⏰</span>
                <span style={{ fontWeight: '600' }}>
                  {dados.horario_retirada || 'Horário não informado'}
                </span>
              </div>
            </div>

            {/* Responsável */}
            {dados.responsavel_retirada && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>👤</span>
                <span><strong>Responsável:</strong> {dados.responsavel_retirada}</span>
              </div>
            )}

            {/* Tipo de Transporte */}
            {dados.tipo_transporte && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🚚</span>
                <span><strong>Transporte:</strong> {dados.tipo_transporte}</span>
              </div>
            )}

            {/* Observações */}
            {dados.observacoes && (
              <div style={{
                marginTop: '0.3rem',
                padding: '0.6rem',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#4a5568'
              }}>
                <strong style={{ color: '#2d3748' }}>💬 Observações:</strong>
                <p style={{ margin: '0.3rem 0 0 0', lineHeight: '1.4' }}>
                  {dados.observacoes}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Erro ao parsear dados_extras:', error);
      return null;
    }
  };

  return (
    <div style={{
      position: 'relative'
    }}>
      <button 
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '1.5rem',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🔔
        {naoLidas > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#e53e3e',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {naoLidas}
          </span>
        )}
      </button>

      {mostrarDropdown && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '0',
          width: '450px',
          maxHeight: '600px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f7fafc'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.1rem',
              color: '#2d3748'
            }}>
              Notificações
            </h3>
            {naoLidas > 0 && (
              <button 
                onClick={marcarTodasComoLidas}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2d542f',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1f3c22';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#2d542f';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div style={{
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {notificacoes.length > 0 ? (
              notificacoes.map((notif) => (
                <div 
                  key={notif.id_notificacao}
                  onClick={() => !notif.lida && marcarComoLida(notif.id_notificacao)}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    cursor: notif.lida ? 'default' : 'pointer',
                    transition: 'background 0.3s',
                    position: 'relative',
                    background: !notif.lida ? '#e6f4ea' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (!notif.lida) e.currentTarget.style.background = '#d4edda';
                    else e.currentTarget.style.background = '#f7fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = !notif.lida ? '#e6f4ea' : 'white';
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0,
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: !notif.lida ? '#c8e6c9' : '#f7fafc',
                    borderRadius: '50%'
                  }}>
                    {getIconeNotificacao(notif.tipo)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: '0 0 0.3rem',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      {notif.titulo}
                    </h4>
                    <p style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.85rem',
                      color: '#4a5568',
                      lineHeight: '1.4'
                    }}>
                      {notif.mensagem}
                    </p>
                    
                    {renderizarDetalhesAgendamento(notif)}
                    
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#718096',
                      marginTop: '0.5rem',
                      display: 'inline-block'
                    }}>
                      {formatarTempo(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.lida && (
                    <div style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '10px',
                      height: '10px',
                      background: '#2d542f',
                      borderRadius: '50%'
                    }} />
                  )}
                </div>
              ))
            ) : (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '3rem',
                  display: 'block',
                  marginBottom: '1rem'
                }}>
                  📭
                </span>
                <p style={{
                  color: '#718096',
                  fontSize: '0.95rem'
                }}>
                  Nenhuma notificação
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

NotificacoesEmpresa.propTypes = {
  idUsuario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default NotificacoesEmpresa;