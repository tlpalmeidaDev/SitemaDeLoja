import React, { useContext, useMemo } from 'react';
import { 
  FaCashRegister, 
  FaBoxes, 
  FaChartPie, 
  FaChartLine, 
  FaBell, 
  FaCogs, 
  FaStore, 
  FaUser,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaArrowRight,
  FaHome,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClipboardList
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Navigation from '../components/Navigation';
import { AuthContext } from '../contexts/AuthContext';

// Componente de Card KPI melhorado
const KPICard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => (
  <div 
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #e9ecef',
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'all 0.3s ease',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }}
  >
    {/* Indicador de cor no topo */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: color
    }} />
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        background: `${color}15`,
        color: color,
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={20} />
      </div>
      
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color: trend > 0 ? '#28a745' : '#dc3545'
        }}>
          {trend > 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#212529', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, color: '#6c757d', fontWeight: 500 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: '#adb5bd', marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  </div>
);

// Componente de card de atalho
const AtalhoCard = ({ title, icon: Icon, path, color, description }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      style={{
        background: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => navigate(path)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        background: `${color}15`,
        color: color,
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start'
      }}>
        <Icon size={24} />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#495057', marginBottom: 4 }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: '#6c757d' }}>
            {description}
          </div>
        )}
      </div>
      
      <div style={{
        color: color,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        fontWeight: 600
      }}>
        Acessar
        <FaArrowRight size={10} />
      </div>
    </div>
  );
};

// Componente de gráfico com design melhorado
const ChartCard = ({ title, children, height = 300, subtitle }) => (
  <div style={{
    background: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }}
  >
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ 
        color: '#495057', 
        fontSize: 18, 
        fontWeight: 600, 
        margin: 0,
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <FaChartLine size={16} color="#7B3FBF" />
        {title}
      </h3>
      {subtitle && (
        <p style={{ 
          color: '#6c757d', 
          fontSize: 14, 
          margin: 0 
        }}>
          {subtitle}
        </p>
      )}
    </div>
    <div style={{ height }}>
      {children}
    </div>
  </div>
);

// Componente de notificação
const NotificationCard = ({ count, onClick }) => (
  <div 
    style={{
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: 16,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease'
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
  >
    <div style={{
      background: '#ffc107',
      color: '#fff',
      borderRadius: '50%',
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaBell size={20} />
    </div>
    
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#856404', marginBottom: 4 }}>
        {count} novas notificações
      </div>
      <div style={{ fontSize: 14, color: '#856404' }}>
        Clique para visualizar as notificações pendentes
      </div>
    </div>
    
    <FaArrowRight size={16} color="#856404" />
  </div>
);

// Página principal do Dashboard
function DashboardPage() {
  const { usuario, tipoUsuario, lojas } = useContext(AuthContext);
  const navigate = useNavigate();

  // Obter informações do usuário logado
  const nomeUsuario = usuario?.nome || 'Usuário';
  const lojaAtual = usuario?.loja || 'Loja não definida';
  const fotoUsuario = usuario?.foto;

  // Dados mockados para KPIs com tendências
  const kpis = useMemo(() => [
    { 
      title: 'Vendas do Dia', 
      value: 'R$ 1.250,00', 
      icon: FaCashRegister, 
      color: '#28a745',
      trend: 12.5,
      subtitle: 'vs. ontem'
    },
    { 
      title: 'Saldo Atual', 
      value: 'R$ 8.900,00', 
      icon: FaChartPie, 
      color: '#7B3FBF',
      trend: 8.2,
      subtitle: 'disponível'
    },
    { 
      title: 'Estoque Baixo', 
      value: '5 produtos', 
      icon: FaBoxes, 
      color: '#ffc107',
      trend: -15.3,
      subtitle: 'precisam reposição'
    },
    { 
      title: 'Pedidos Pendentes', 
      value: '12', 
      icon: FaClipboardList, 
      color: '#dc3545',
      trend: 25.0,
      subtitle: 'aguardando'
    }
  ], []);

  // Dados para gráficos com cores mais suaves
  const dadosFluxoCaixa = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [1200, 900, 1500, 800, 1700, 2100, 1300],
        borderColor: '#7B3FBF',
        backgroundColor: 'rgba(123, 63, 191, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#7B3FBF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
    ],
  };

  const dadosResumoFinanceiro = {
    labels: ['Entradas', 'Saídas', 'Saldo'],
    datasets: [
      {
        data: [3500, 2100, 8900],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(123, 63, 191, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  const dadosVendasCategoria = {
    labels: ['Alimentos', 'Limpeza', 'Higiene', 'Bebidas', 'Outros'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(123, 63, 191, 0.8)',
          'rgba(64, 0, 130, 0.8)',
          'rgba(160, 128, 255, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(76, 175, 80, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  // Atalhos para áreas do sistema
  const atalhos = useMemo(() => [
    { 
      title: 'Nova Venda', 
      icon: FaShoppingCart, 
      path: '/venda', 
      color: '#28a745',
      description: 'Iniciar uma nova venda'
    },
    { 
      title: 'Gerenciar Estoque', 
      icon: FaBoxes, 
      path: '/estoque', 
      color: '#ffc107',
      description: 'Verificar e atualizar estoque'
    },
    { 
      title: 'Financeiro', 
      icon: FaMoneyBillWave, 
      path: '/financeiro', 
      color: '#7B3FBF',
      description: 'Análise financeira completa'
    },
    { 
      title: 'Relatórios', 
      icon: FaChartPie, 
      path: '/relatorios', 
      color: '#17a2b8',
      description: 'Gerar relatórios detalhados'
    },
    { 
      title: 'Monitoramento', 
      icon: FaChartLine, 
      path: '/monitoramento', 
      color: '#6f42c1',
      description: 'Monitorar atividades do sistema'
    },
    { 
      title: 'Administração', 
      icon: FaCogs, 
      path: '/admin', 
      color: '#6c757d',
      description: 'Configurações do sistema'
    }
  ], []);

  // Opções comuns para gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'top',
        labels: { 
          color: '#495057',
          font: { size: 12 },
          usePointStyle: true,
          padding: 20
        } 
      } 
    },
    scales: { 
      y: { 
        beginAtZero: true,
        grid: { color: '#e9ecef' },
        ticks: { color: '#6c757d' }
      },
      x: {
        grid: { color: '#e9ecef' },
        ticks: { color: '#6c757d' }
      }
    } 
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      
      <div style={{ 
        padding: '32px', 
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header da página */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)',
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaHome size={24} color="#fff" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <h1 style={{ 
                  color: '#495057', 
                  fontSize: 28, 
                  fontWeight: 700, 
                  margin: 0,
                  marginBottom: 4
                }}>
                  Olá, {nomeUsuario}!
                </h1>
                <p style={{ 
                  color: '#6c757d', 
                  fontSize: 16, 
                  margin: 0 
                }}>
                  Bem-vindo ao painel de controle - {lojaAtual}
                </p>
              </div>
              
              {/* Avatar do usuário */}
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #7B3FBF',
                boxShadow: '0 4px 12px rgba(123, 63, 191, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa'
              }}>
                {fotoUsuario ? (
                  <img 
                    src={fotoUsuario} 
                    alt={nomeUsuario}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  display: fotoUsuario ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 600
                }}>
                  {nomeUsuario.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/notificacoes')}
              style={{ 
                background: '#fff', 
                color: '#7B3FBF', 
                border: '1px solid #7B3FBF', 
                borderRadius: 10, 
                padding: '12px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#7B3FBF';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#7B3FBF';
              }}
            >
              <FaBell size={14} />
              Notificações
              <span style={{ 
                position: 'absolute', 
                top: -4, 
                right: -4, 
                background: '#dc3545', 
                color: '#fff', 
                borderRadius: '50%', 
                width: 20, 
                height: 20, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 10, 
                fontWeight: 600 
              }}>
                3
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/perfil')}
              style={{ 
                background: '#7B3FBF', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 10, 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6a3599'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B3FBF'}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.1)'
              }}>
                {fotoUsuario ? (
                  <img 
                    src={fotoUsuario} 
                    alt={nomeUsuario}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <FaUser 
                  size={16} 
                  style={{
                    display: fotoUsuario ? 'none' : 'block'
                  }}
                />
              </div>
              <span>Perfil</span>
            </button>
          </div>
            </div>

        {/* KPIs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 24, 
          marginBottom: 32 
        }}>
          {kpis.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
              trend={kpi.trend}
              subtitle={kpi.subtitle}
            />
          ))}
        </div>

        {/* Notificação */}
        <div style={{ marginBottom: 32 }}>
          <NotificationCard 
            count={3} 
            onClick={() => navigate('/notificacoes')}
          />
        </div>

        {/* Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: 24, 
          marginBottom: 32 
        }}>
          <ChartCard title="Fluxo de Caixa Semanal" subtitle="Vendas dos últimos 7 dias">
            <Line 
              data={dadosFluxoCaixa} 
              options={{
                ...chartOptions,
                plugins: { 
                  ...chartOptions.plugins,
                  legend: { 
                    display: false
                  } 
                }
              }}
            />
          </ChartCard>

          <ChartCard title="Resumo Financeiro" subtitle="Distribuição de receitas e despesas">
            <Pie 
              data={dadosResumoFinanceiro} 
              options={{
                ...chartOptions,
                plugins: { 
                  ...chartOptions.plugins,
                  legend: { 
                    position: 'bottom',
                    labels: { 
                      color: '#495057', 
                      font: { size: 12 },
                      usePointStyle: true,
                      padding: 20
                    } 
                  } 
                }
              }}
            />
          </ChartCard>
        </div>

        {/* Gráfico adicional */}
        <div style={{ marginBottom: 32 }}>
          <ChartCard title="Vendas por Categoria" subtitle="Distribuição percentual das vendas">
            <Doughnut 
              data={dadosVendasCategoria} 
              options={{
                ...chartOptions,
                plugins: { 
                  ...chartOptions.plugins,
                  legend: { 
                    position: 'bottom',
                    labels: { 
                      color: '#495057', 
                      font: { size: 12 },
                      usePointStyle: true,
                      padding: 20
                    } 
                  } 
                }
              }}
            />
          </ChartCard>
        </div>

        {/* Atalhos rápidos */}
        <div>
          <h2 style={{ 
            color: '#495057', 
            fontSize: 20, 
            fontWeight: 600, 
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <FaCogs size={16} color="#7B3FBF" />
            Acesso Rápido
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 20 
          }}>
            {atalhos.map((atalho, index) => (
              <AtalhoCard
                key={index}
                title={atalho.title}
                icon={atalho.icon}
                path={atalho.path}
                color={atalho.color}
                description={atalho.description}
              />
            ))}
          </div>
          </div>
      </div>
    </div>
  );
}

export default DashboardPage; 