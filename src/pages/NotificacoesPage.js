import React, { useState, useEffect, useContext } from 'react';
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

// Página de Notificações
function NotificacoesPage() {
  const navigate = useNavigate();
  const { tipoUsuario } = useAuth();

  // Estados para notificações e filtros
  const [notificacoes, setNotificacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Dados mockados de notificações (futuramente virá do backend)
  const notificacoesMock = [
    {
      id: 1,
      tipo: 'alerta',
      titulo: 'Estoque Baixo',
      descricao: 'Produto "Arroz Integral" está com estoque baixo (5 unidades restantes)',
      data: '2024-01-15T10:30:00',
      lida: false,
      icone: <FaExclamationTriangle size={20} color="#ff9800" />
    },
    {
      id: 2,
      tipo: 'info',
      titulo: 'Nova Funcionalidade',
      descricao: 'Sistema de relatórios foi atualizado com novos gráficos e métricas',
      data: '2024-01-15T09:15:00',
      lida: false,
      icone: <FaInfoCircle size={20} color="#2196f3" />
    },
    {
      id: 3,
      tipo: 'sucesso',
      titulo: 'Venda Concluída',
      descricao: 'Venda #1234 foi finalizada com sucesso. Total: R$ 89,50',
      data: '2024-01-15T08:45:00',
      lida: true,
      icone: <FaCheckCircle size={20} color="#4caf50" />
    },
    {
      id: 4,
      tipo: 'alerta',
      titulo: 'Backup Automático',
      descricao: 'Backup do sistema foi realizado automaticamente às 02:00',
      data: '2024-01-14T02:00:00',
      lida: true,
      icone: <FaBell size={20} color="#ff9800" />
    },
    {
      id: 5,
      tipo: 'info',
      titulo: 'Manutenção Programada',
      descricao: 'Sistema ficará indisponível das 23:00 às 01:00 para manutenção',
      data: '2024-01-14T18:30:00',
      lida: false,
      icone: <FaInfoCircle size={20} color="#2196f3" />
    },
    {
      id: 6,
      tipo: 'sucesso',
      titulo: 'Funcionário Cadastrado',
      descricao: 'Maria Silva foi cadastrada com sucesso no sistema',
      data: '2024-01-14T14:20:00',
      lida: true,
      icone: <FaCheckCircle size={20} color="#4caf50" />
    }
  ];

  // Carregar notificações mockadas
  useEffect(() => {
    setNotificacoes(notificacoesMock);
  }, []);

  // Função para marcar notificação como lida
  const marcarComoLida = (id) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  // Função para marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHora = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDia = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return 'Agora mesmo';
    if (diffMin < 60) return `${diffMin} min atrás`;
    if (diffHora < 24) return `${diffHora}h atrás`;
    if (diffDia < 7) return `${diffDia} dias atrás`;
    
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para filtrar notificações
  const notificacoesFiltradas = notificacoes.filter(notif => {
    const hoje = new Date();
    const dataNotif = new Date(notif.data);
    const diffDias = Math.floor((hoje - dataNotif) / (1000 * 60 * 60 * 24));

    // Filtro por tipo
    if (filtroTipo !== 'todas' && notif.tipo !== filtroTipo) return false;

    // Filtro por data
    if (filtroData === 'hoje' && diffDias > 0) return false;
    if (filtroData === 'semana' && diffDias > 7) return false;
    if (filtroData === 'mes' && diffDias > 30) return false;

    return true;
  });

  // Contar notificações não lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center" style={{ padding: '20px', background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', minHeight: '100vh' }}>
        <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)', maxWidth: 800, width: '100%' }}>
          {/* Header da página */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F3F0FA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaBell size={28} color="#7B3FBF" />
              <h1 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: 0 }}>
                Notificações
                {naoLidas > 0 && (
                  <span style={{ 
                    background: '#ff5722', 
                    color: '#fff', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 12, 
                    fontWeight: 600, 
                    marginLeft: 8 
                  }}>
                    {naoLidas}
                  </span>
                )}
              </h1>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Botão de filtros */}
              <button 
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{ 
                  background: '#F3F0FA', 
                  color: '#7B3FBF', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '8px 12px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                <FaFilter size={14} />
                Filtros
              </button>
              
              {/* Botão marcar todas como lidas */}
              {naoLidas > 0 && (
                <button 
                  onClick={marcarTodasComoLidas}
                  style={{ 
                    background: '#4B0082', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Filtros */}
          {mostrarFiltros && (
            <div style={{ 
              background: '#F3F0FA', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center'
            }}>
              {/* Filtro por tipo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Tipo:</label>
                <select 
                  value={filtroTipo} 
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  style={{ 
                    background: '#fff', 
                    border: '1px solid #7B3FBF', 
                    borderRadius: 6, 
                    padding: '6px 10px', 
                    color: '#4B0082',
                    fontSize: 14
                  }}
                >
                  <option value="todas">Todas</option>
                  <option value="alerta">Alertas</option>
                  <option value="info">Informações</option>
                  <option value="sucesso">Sucessos</option>
                </select>
              </div>

              {/* Filtro por data */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Período:</label>
                <select 
                  value={filtroData} 
                  onChange={(e) => setFiltroData(e.target.value)}
                  style={{ 
                    background: '#fff', 
                    border: '1px solid #7B3FBF', 
                    borderRadius: 6, 
                    padding: '6px 10px', 
                    color: '#4B0082',
                    fontSize: 14
                  }}
                >
                  <option value="todas">Todas</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mês</option>
                </select>
              </div>
            </div>
          )}

          {/* Lista de notificações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notificacoesFiltradas.length > 0 ? (
              notificacoesFiltradas.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => !notif.lida && marcarComoLida(notif.id)}
                  style={{ 
                    background: notif.lida ? '#f8f8f8' : '#fff', 
                    border: `2px solid ${notif.lida ? '#e0e0e0' : '#7B3FBF'}`, 
                    borderRadius: 12, 
                    padding: 16, 
                    cursor: notif.lida ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    opacity: notif.lida ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!notif.lida) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(123,63,191,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notif.lida) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Indicador de não lida */}
                  {!notif.lida && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12, 
                      width: 8, 
                      height: 8, 
                      background: '#ff5722', 
                      borderRadius: '50%' 
                    }} />
                  )}

                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    {/* Ícone */}
                    <div style={{ 
                      background: notif.lida ? '#f0f0f0' : '#F3F0FA', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {notif.icone}
                    </div>

                    {/* Conteúdo */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: '#4B0082', 
                        fontSize: 16, 
                        fontWeight: 600, 
                        margin: '0 0 4px 0',
                        opacity: notif.lida ? 0.7 : 1
                      }}>
                        {notif.titulo}
                      </h3>
                      <p style={{ 
                        color: '#7B3FBF', 
                        fontSize: 14, 
                        margin: '0 0 8px 0',
                        lineHeight: 1.4,
                        opacity: notif.lida ? 0.6 : 0.8
                      }}>
                        {notif.descricao}
                      </p>
                      <span style={{ 
                        color: '#A080FF', 
                        fontSize: 12, 
                        fontWeight: 500,
                        opacity: 0.7
                      }}>
                        {formatarData(notif.data)}
                      </span>
                    </div>

                    {/* Botão marcar como lida */}
                    {!notif.lida && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoLida(notif.id);
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#7B3FBF', 
                          cursor: 'pointer',
                          padding: 4,
                          borderRadius: 4,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#F3F0FA'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                      >
                        <FaTimes size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: '#7B3FBF',
                opacity: 0.7
              }}>
                <FaBell size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Nenhuma notificação</h3>
                <p style={{ margin: 0, fontSize: 14 }}>Não há notificações para exibir com os filtros atuais.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Notificações mockadas com diferentes tipos (alerta, info, sucesso)
// - Sistema de filtros por tipo e período
// - Indicador visual para notificações não lidas
// - Transições suaves e feedback visual
// - Formatação inteligente de datas (agora, X min atrás, etc.)
// - Integração futura: conectar com backend para notificações reais
// - Push notifications: implementar WebSocket/Server-Sent Events
// - Badge no menu: componente reutilizável para mostrar contagem
// - Layout responsivo e visual roxo seguindo padrão do sistema

export default NotificacoesPage; 