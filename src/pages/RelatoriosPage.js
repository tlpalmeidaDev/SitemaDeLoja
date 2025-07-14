import React, { useState, useContext, useMemo } from 'react';
import { 
  FaChartBar, 
  FaDownload, 
  FaFilter, 
  FaCalendarAlt, 
  FaFilePdf, 
  FaFileExcel, 
  FaFileCsv, 
  FaSync, 
  FaEye, 
  FaPrint, 
  FaCog,
  FaTimes,
  FaSearch,
  FaSort,
  FaChevronDown
} from 'react-icons/fa';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

// Componente de Card reutilizável para KPIs
const KPICard = ({ title, value, icon: Icon, color, subtitle }) => (
          <div style={{ 
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: '1px solid #e9ecef',
    borderRadius: 16,
    padding: 24,
            display: 'flex', 
    flexDirection: 'column',
    gap: 12,
    transition: 'all 0.3s ease',
                  cursor: 'pointer', 
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
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
    
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: '#6c757d', fontWeight: 500 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: '#adb5bd', marginTop: 2 }}>{subtitle}</div>
        )}
            </div>
          </div>

    <div style={{ fontSize: 32, fontWeight: 700, color: '#212529' }}>{value}</div>
  </div>
);

// Componente de filtro horizontal
const FilterBar = ({ filtros, onFiltroChange }) => (
            <div style={{ 
    background: '#ffffff',
    border: '1px solid #e9ecef',
              borderRadius: 12, 
              padding: 20, 
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
    gap: 16,
              alignItems: 'center'
            }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <FaFilter size={16} color="#6c757d" />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>Filtros:</span>
              </div>

    {Object.entries(filtros).map(([key, filtro]) => (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
        <label style={{ fontSize: 12, color: '#6c757d', fontWeight: 500 }}>{filtro.label}</label>
                <select
          value={filtro.value}
          onChange={(e) => onFiltroChange(key, e.target.value)}
                  style={{ 
            padding: '8px 12px',
            border: '1px solid #dee2e6',
                    borderRadius: 8, 
                    background: '#fff',
            color: '#495057',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#7B3FBF'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        >
          {filtro.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
                </select>
              </div>
    ))}
              </div>
);

// Componente de gráfico com design melhorado
const ChartCard = ({ title, children, height = 300 }) => (
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
    <h3 style={{ 
      color: '#495057', 
      fontSize: 18, 
      fontWeight: 600, 
      marginBottom: 20,
              display: 'flex', 
      alignItems: 'center',
              gap: 8 
            }}>
      <FaChartBar size={16} color="#7B3FBF" />
      {title}
    </h3>
    <div style={{ height }}>
      {children}
              </div>
            </div>
);

// Componente de tabela melhorada
const RelatoriosTable = ({ relatorios, onVisualizar, onExportar, exportando }) => (
            <div style={{ 
    background: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
            <div style={{ 
      padding: '20px 24px',
      borderBottom: '1px solid #e9ecef',
      background: '#f8f9fa'
    }}>
      <h3 style={{ 
        color: '#495057', 
        fontSize: 18, 
        fontWeight: 600, 
        margin: 0,
              display: 'flex', 
        alignItems: 'center',
              gap: 8 
            }}>
        <FaEye size={16} color="#7B3FBF" />
        Relatórios Disponíveis
      </h3>
          </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ 
              padding: '16px 20px', 
              textAlign: 'left', 
              color: '#495057', 
              fontWeight: 600,
              fontSize: 14,
              borderBottom: '1px solid #e9ecef'
            }}>Nome</th>
            <th style={{ 
              padding: '16px 20px', 
              textAlign: 'left', 
              color: '#495057', 
              fontWeight: 600,
              fontSize: 14,
              borderBottom: '1px solid #e9ecef'
            }}>Tipo</th>
            <th style={{ 
              padding: '16px 20px', 
              textAlign: 'left', 
              color: '#495057', 
              fontWeight: 600,
              fontSize: 14,
              borderBottom: '1px solid #e9ecef'
            }}>Última Geração</th>
            <th style={{ 
              padding: '16px 20px', 
              textAlign: 'center', 
              color: '#495057', 
              fontWeight: 600,
              fontSize: 14,
              borderBottom: '1px solid #e9ecef'
            }}>Tamanho</th>
            <th style={{ 
              padding: '16px 20px', 
              textAlign: 'center', 
              color: '#495057', 
              fontWeight: 600,
              fontSize: 14,
              borderBottom: '1px solid #e9ecef'
            }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
          {relatorios.map((relatorio, index) => (
            <tr key={relatorio.id} style={{ 
              borderBottom: '1px solid #f1f3f4',
              background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
            >
              <td style={{ 
                padding: '16px 20px', 
                color: '#495057', 
                fontWeight: 600,
                fontSize: 14
              }}>{relatorio.nome}</td>
              <td style={{ padding: '16px 20px' }}>
                        <span style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '6px 12px',
                  borderRadius: 20,
                          fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                        }}>
                          {relatorio.tipo}
                        </span>
                      </td>
              <td style={{ 
                padding: '16px 20px', 
                color: '#6c757d',
                fontSize: 14
              }}>{relatorio.ultimaGeracao}</td>
              <td style={{ 
                padding: '16px 20px', 
                textAlign: 'center', 
                color: '#495057', 
                fontWeight: 600,
                fontSize: 14
              }}>
                        {relatorio.tamanho}
                      </td>
              <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <button
                    onClick={() => onVisualizar(relatorio)}
                            style={{
                      background: '#7B3FBF',
                              color: '#fff',
                              border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                      transition: 'all 0.2s ease'
                            }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#6a3599'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#7B3FBF'}
                    title="Visualizar"
                          >
                    <FaEye size={10} />
                    Ver
                          </button>
                          <button
                    onClick={() => onExportar('pdf')}
                            disabled={exportando}
                            style={{
                      background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                              cursor: exportando ? 'not-allowed' : 'pointer',
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                      opacity: exportando ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                            }}
                    onMouseEnter={(e) => !exportando && (e.currentTarget.style.background = '#c82333')}
                    onMouseLeave={(e) => !exportando && (e.currentTarget.style.background = '#dc3545')}
                    title="Exportar PDF"
                          >
                    <FaFilePdf size={10} />
                    PDF
                          </button>
                          <button
                    onClick={() => onExportar('excel')}
                    disabled={exportando}
                            style={{
                      background: '#28a745',
                              color: '#fff',
                              border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: exportando ? 'not-allowed' : 'pointer',
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                      gap: 4,
                      opacity: exportando ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                            }}
                    onMouseEnter={(e) => !exportando && (e.currentTarget.style.background = '#218838')}
                    onMouseLeave={(e) => !exportando && (e.currentTarget.style.background = '#28a745')}
                    title="Exportar Excel"
                          >
                    <FaFileExcel size={10} />
                    Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
    {relatorios.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
        padding: '60px 20px', 
        color: '#6c757d', 
                fontSize: 16 
              }}>
        <FaSearch size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
        <div>Nenhum relatório encontrado com os filtros aplicados.</div>
        <div style={{ fontSize: 14, marginTop: 8, color: '#adb5bd' }}>
          Tente ajustar os filtros ou verificar as configurações.
        </div>
              </div>
            )}
          </div>
);

// Modal melhorado
const RelatorioModal = ({ relatorio, onClose, onExportar, exportando }) => {
  if (!relatorio) return null;

  return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
      background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
            }}>
              <div style={{
                background: '#fff',
        borderRadius: 20,
                maxWidth: '90%',
                maxHeight: '90%',
        width: '800px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'modalSlideIn 0.3s ease'
      }}>
        {/* Header do modal */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e9ecef',
          background: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ 
              color: '#495057', 
              fontSize: 20, 
              fontWeight: 600, 
              margin: 0,
              marginBottom: 4
            }}>
              {relatorio.nome}
                  </h3>
            <p style={{ 
              color: '#6c757d', 
              fontSize: 14, 
              margin: 0 
            }}>
              {relatorio.descricao}
            </p>
          </div>
                  <button
            onClick={onClose}
                    style={{
                      background: 'none',
              color: '#6c757d',
                      border: 'none',
                      fontSize: 24,
                      cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e9ecef';
              e.currentTarget.style.color = '#495057';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#6c757d';
            }}
          >
            <FaTimes />
                  </button>
                </div>
                
        {/* Conteúdo do modal */}
        <div style={{ padding: '32px', maxHeight: '60vh', overflow: 'auto' }}>
          {/* Informações do relatório */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 24,
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: 12
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>Tipo</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>
                {relatorio.tipo}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>Última Geração</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>
                {relatorio.ultimaGeracao}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>Tamanho</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>
                {relatorio.tamanho}
              </div>
                  </div>
                </div>
                
                {/* Placeholder para conteúdo do relatório */}
                <div style={{ 
            background: '#f8f9fa', 
            border: '2px dashed #dee2e6', 
            borderRadius: 12, 
            padding: '80px 20px', 
                  textAlign: 'center',
            color: '#6c757d',
                  fontSize: 16
                }}>
            <FaChartBar size={64} style={{ marginBottom: 20, opacity: 0.4 }} />
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Visualização do Relatório
            </div>
            <div style={{ fontSize: 14, color: '#adb5bd' }}>
              Conteúdo interativo com gráficos, tabelas e análises detalhadas
            </div>
          </div>
                </div>
                
        {/* Footer do modal com ações */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e9ecef',
          background: '#f8f9fa',
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end'
        }}>
                  <button
            onClick={() => onExportar('pdf')}
                    disabled={exportando}
                    style={{
              background: '#dc3545',
                      color: '#fff',
                      border: 'none',
              borderRadius: 10,
                      padding: '12px 20px',
                      cursor: exportando ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
              gap: 8,
                      fontSize: 14,
              fontWeight: 600,
              opacity: exportando ? 0.7 : 1,
              transition: 'all 0.2s ease'
                    }}
            onMouseEnter={(e) => !exportando && (e.currentTarget.style.background = '#c82333')}
            onMouseLeave={(e) => !exportando && (e.currentTarget.style.background = '#dc3545')}
                  >
                    <FaFilePdf size={14} />
                    {exportando ? 'Exportando...' : 'Exportar PDF'}
                  </button>
                  <button
            onClick={() => onExportar('excel')}
                    disabled={exportando}
                    style={{
              background: '#28a745',
                      color: '#fff',
                      border: 'none',
              borderRadius: 10,
                      padding: '12px 20px',
                      cursor: exportando ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
              gap: 8,
                      fontSize: 14,
              fontWeight: 600,
              opacity: exportando ? 0.7 : 1,
              transition: 'all 0.2s ease'
                    }}
            onMouseEnter={(e) => !exportando && (e.currentTarget.style.background = '#218838')}
            onMouseLeave={(e) => !exportando && (e.currentTarget.style.background = '#28a745')}
                  >
                    <FaFileExcel size={14} />
                    {exportando ? 'Exportando...' : 'Exportar Excel'}
                  </button>
                  <button
                    style={{
                      background: '#7B3FBF',
                      color: '#fff',
                      border: 'none',
              borderRadius: 10,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#6a3599'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#7B3FBF'}
                  >
                    <FaPrint size={14} />
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
  );
};

// Página principal de relatórios
function RelatoriosPage() {
  // Estados para filtros e relatórios
  const [filtros, setFiltros] = useState({
    periodo: { value: 'mes', label: 'Período', options: [
      { value: 'hoje', label: 'Hoje' },
      { value: 'semana', label: 'Esta Semana' },
      { value: 'mes', label: 'Este Mês' },
      { value: 'trimestre', label: 'Este Trimestre' },
      { value: 'ano', label: 'Este Ano' }
    ]},
    tipo: { value: 'todos', label: 'Tipo', options: [
      { value: 'todos', label: 'Todos os Tipos' },
      { value: 'vendas', label: 'Vendas' },
      { value: 'estoque', label: 'Estoque' },
      { value: 'financeiro', label: 'Financeiro' },
      { value: 'funcionarios', label: 'Funcionários' },
      { value: 'clientes', label: 'Clientes' },
      { value: 'monitoramento', label: 'Monitoramento' }
    ]},
    loja: { value: 'todas', label: 'Loja', options: [
      { value: 'todas', label: 'Todas as Lojas' },
      { value: 'loja1', label: 'Loja Centro' },
      { value: 'loja2', label: 'Loja Bairro' },
      { value: 'loja3', label: 'Loja Shopping' }
    ]}
  });
  
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [exportando, setExportando] = useState(false);
  const { tipoUsuario } = useAuth();

  // Dados mockados de relatórios
  const relatoriosMock = [
    { id: 1, nome: 'Relatório de Vendas', tipo: 'vendas', descricao: 'Análise completa de vendas por período', ultimaGeracao: '15/01/2024 10:30', tamanho: '2.3 MB' },
    { id: 2, nome: 'Relatório de Estoque', tipo: 'estoque', descricao: 'Status atual do estoque e movimentações', ultimaGeracao: '15/01/2024 09:15', tamanho: '1.8 MB' },
    { id: 3, nome: 'Relatório Financeiro', tipo: 'financeiro', descricao: 'Fluxo de caixa e análise financeira', ultimaGeracao: '15/01/2024 08:45', tamanho: '3.1 MB' },
    { id: 4, nome: 'Relatório de Funcionários', tipo: 'funcionarios', descricao: 'Performance e atividades dos funcionários', ultimaGeracao: '14/01/2024 16:20', tamanho: '1.5 MB' },
    { id: 5, nome: 'Relatório de Clientes', tipo: 'clientes', descricao: 'Análise de comportamento dos clientes', ultimaGeracao: '14/01/2024 14:30', tamanho: '2.7 MB' },
    { id: 6, nome: 'Relatório de Monitoramento', tipo: 'monitoramento', descricao: 'Eventos detectados e alertas de segurança', ultimaGeracao: '14/01/2024 12:15', tamanho: '4.2 MB' },
  ];

  // Dados para gráficos com cores mais suaves
  const dadosVendas = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [12000, 15000, 18000, 14000, 22000, 25000],
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
      }
    ],
  };

  const dadosEstoque = {
    labels: ['Alimentos', 'Limpeza', 'Higiene', 'Bebidas', 'Outros'],
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: [150, 80, 120, 90, 60],
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

  const dadosFinanceiro = {
    labels: ['Receitas', 'Despesas', 'Lucro'],
    datasets: [
      {
        data: [85000, 45000, 40000],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(123, 63, 191, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  const dadosFuncionarios = {
    labels: ['João', 'Maria', 'Pedro', 'Ana', 'Carlos'],
    datasets: [
      {
        label: 'Vendas por Funcionário',
        data: [45, 38, 52, 41, 35],
        backgroundColor: 'rgba(123, 63, 191, 0.8)',
        borderColor: '#7B3FBF',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      },
    ],
  };

  // Calcular KPIs usando useMemo para performance
  const kpis = useMemo(() => {
    const totalRelatorios = relatoriosMock.length;
    const relatoriosHoje = relatoriosMock.filter(r => 
      r.ultimaGeracao.includes('15/01/2024')
    ).length;
    const tamanhoTotal = relatoriosMock.reduce((sum, r) => sum + parseFloat(r.tamanho.split(' ')[0]), 0);
    const tiposUnicos = [...new Set(relatoriosMock.map(r => r.tipo))].length;

    return {
      totalRelatorios,
      relatoriosHoje,
      tamanhoTotal: tamanhoTotal.toFixed(1),
      tiposUnicos
    };
  }, []);

  // Filtrar relatórios usando useMemo
  const relatoriosFiltrados = useMemo(() => {
    return relatoriosMock.filter(relatorio => {
      const matchTipo = filtros.tipo.value === 'todos' || relatorio.tipo === filtros.tipo.value;
      const matchLoja = filtros.loja.value === 'todas'; // Futuramente implementar filtro por loja
      return matchTipo && matchLoja;
    });
  }, [filtros]);

  // Função para atualizar filtros
  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  // Função para exportar relatório
  const handleExportar = async (formato) => {
    setExportando(true);
    try {
      // Simulação de exportação (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Relatório exportado em ${formato.toUpperCase()} com sucesso! (mock)`);
    } catch (error) {
      alert('Erro ao exportar relatório.');
    } finally {
      setExportando(false);
    }
  };

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
              <FaChartBar size={24} color="#fff" />
        </div>
            <div>
              <h1 style={{ 
                color: '#495057', 
                fontSize: 28, 
                fontWeight: 700, 
                margin: 0,
                marginBottom: 4
              }}>
                Relatórios
              </h1>
              <p style={{ 
                color: '#6c757d', 
                fontSize: 16, 
                margin: 0 
              }}>
                Análises e insights do seu negócio
              </p>
      </div>
    </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button 
              style={{ 
                background: '#7B3FBF', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 10, 
                padding: '12px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6a3599'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B3FBF'}
            >
              <FaSync size={14} />
              Atualizar
            </button>
            
            <button 
              style={{ 
                background: '#fff', 
                color: '#7B3FBF', 
                border: '1px solid #7B3FBF', 
                borderRadius: 10, 
                padding: '12px 20px', 
                cursor: 'pointer', 
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
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
              <FaCog size={14} />
              Configurações
            </button>
          </div>
        </div>

        {/* Barra de filtros */}
        <FilterBar filtros={filtros} onFiltroChange={handleFiltroChange} />

        {/* KPIs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 24, 
          marginBottom: 32 
        }}>
          <KPICard
            title="Total de Relatórios"
            value={kpis.totalRelatorios}
            icon={FaChartBar}
            color="#7B3FBF"
            subtitle="Relatórios disponíveis"
          />
          <KPICard
            title="Gerados Hoje"
            value={kpis.relatoriosHoje}
            icon={FaCalendarAlt}
            color="#28a745"
            subtitle="Últimas 24 horas"
          />
          <KPICard
            title="Tamanho Total"
            value={`${kpis.tamanhoTotal} MB`}
            icon={FaDownload}
            color="#ffc107"
            subtitle="Armazenamento usado"
          />
          <KPICard
            title="Tipos de Relatório"
            value={kpis.tiposUnicos}
            icon={FaEye}
            color="#dc3545"
            subtitle="Categorias diferentes"
          />
        </div>

        {/* Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: 24, 
          marginBottom: 32 
        }}>
          <ChartCard title="Evolução de Vendas">
            <Line 
              data={dadosVendas} 
              options={chartOptions}
            />
          </ChartCard>

          <ChartCard title="Distribuição do Estoque">
            <Doughnut 
              data={dadosEstoque} 
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

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: 24, 
          marginBottom: 32 
        }}>
          <ChartCard title="Análise Financeira">
            <Pie 
              data={dadosFinanceiro} 
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

          <ChartCard title="Performance por Funcionário">
            <Bar 
              data={dadosFuncionarios} 
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
        </div>

        {/* Lista de Relatórios */}
        <RelatoriosTable
          relatorios={relatoriosFiltrados}
          onVisualizar={setRelatorioSelecionado}
          onExportar={handleExportar}
          exportando={exportando}
        />

        {/* Modal de Visualização */}
        <RelatorioModal
          relatorio={relatorioSelecionado}
          onClose={() => setRelatorioSelecionado(null)}
          onExportar={handleExportar}
          exportando={exportando}
        />
      </div>

      {/* CSS para animações */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default RelatoriosPage; 