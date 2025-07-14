import React, { useState, useEffect } from 'react';
import { FaChartLine, FaChartPie, FaDownload, FaFilter, FaCalendarAlt, FaStore, FaArrowUp, FaArrowDown, FaDollarSign, FaFilePdf, FaFileExcel, FaFileCsv, FaSync, FaEye, FaWifi, FaTimesCircle, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Navigation from '../components/Navigation';

// Dashboard Financeiro Profissional - Layout responsivo e completo
function FinanceiroPage() {
  // Estados para filtros e dados
  const [filtroData, setFiltroData] = useState('mes');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroLoja, setFiltroLoja] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusOnline, setStatusOnline] = useState(true);

  // Estados para modais de formulários
  const [modalDespesa, setModalDespesa] = useState(false);
  const [modalContaPagar, setModalContaPagar] = useState(false);
  const [modalContaReceber, setModalContaReceber] = useState(false);
  const [modalLembretes, setModalLembretes] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  // Novo estado para modal de detalhes
  const [modalDetalheConta, setModalDetalheConta] = useState(false);
  const [contaDetalhe, setContaDetalhe] = useState(null);

  // Estados para formulários
  const [formDespesa, setFormDespesa] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    data: '',
    loja: '',
    observacoes: ''
  });

  const [formContaPagar, setFormContaPagar] = useState({
    descricao: '',
    valor: '',
    dataVencimento: '',
    fornecedor: '',
    categoria: '',
    status: 'pendente',
    observacoes: ''
  });

  const [formContaReceber, setFormContaReceber] = useState({
    descricao: '',
    valor: '',
    dataVencimento: '',
    cliente: '',
    categoria: '',
    status: 'pendente',
    observacoes: ''
  });

  // Dados mockados de movimentações financeiras
  const [movimentacoesMock, setMovimentacoesMock] = useState([
    { id: 1, tipo: 'receita', descricao: 'Venda #1234', valor: 89.50, data: '2024-01-15T10:30:00', loja: 'Loja Centro', categoria: 'Vendas' },
    { id: 2, tipo: 'despesa', descricao: 'Compra de estoque', valor: -45.20, data: '2024-01-15T09:15:00', loja: 'Loja Centro', categoria: 'Compras' },
    { id: 3, tipo: 'receita', descricao: 'Venda #1235', valor: 125.80, data: '2024-01-15T08:45:00', loja: 'Loja Bairro', categoria: 'Vendas' },
    { id: 4, tipo: 'despesa', descricao: 'Aluguel', valor: -1200.00, data: '2024-01-15T08:00:00', loja: 'Todas', categoria: 'Operacional' },
    { id: 5, tipo: 'receita', descricao: 'Venda #1236', valor: 67.30, data: '2024-01-14T16:30:00', loja: 'Loja Shopping', categoria: 'Vendas' },
    { id: 6, tipo: 'despesa', descricao: 'Energia elétrica', valor: -350.00, data: '2024-01-14T15:20:00', loja: 'Todas', categoria: 'Operacional' },
    { id: 7, tipo: 'receita', descricao: 'Venda #1237', valor: 234.90, data: '2024-01-14T14:15:00', loja: 'Loja Centro', categoria: 'Vendas' },
    { id: 8, tipo: 'despesa', descricao: 'Internet', valor: -89.90, data: '2024-01-14T13:00:00', loja: 'Todas', categoria: 'Operacional' },
  ]);

  // Dados mockados para contas a pagar e receber
  const [contasPagar, setContasPagar] = useState([
    { id: 1, descricao: 'Aluguel Janeiro', valor: 1200.00, dataVencimento: '2024-01-31', fornecedor: 'Imobiliária Silva', categoria: 'Operacional', status: 'pendente', observacoes: 'Aluguel da loja principal' },
    { id: 2, descricao: 'Fornecedor ABC', valor: 800.00, dataVencimento: '2024-01-25', fornecedor: 'Fornecedor ABC Ltda', categoria: 'Compras', status: 'pendente', observacoes: 'Mercadorias para estoque' },
    { id: 3, descricao: 'Conta de Luz', valor: 500.00, dataVencimento: '2024-01-20', fornecedor: 'Companhia Elétrica', categoria: 'Operacional', status: 'pago', observacoes: 'Energia elétrica - todas as lojas' },
    // Contas próximas do vencimento para testar lembretes
    { id: 4, descricao: 'Internet e Telefone', valor: 150.00, dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fornecedor: 'Provedor de Internet', categoria: 'Operacional', status: 'pendente', observacoes: 'Serviços de internet e telefone' },
    { id: 5, descricao: 'Seguro da Loja', valor: 350.00, dataVencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fornecedor: 'Seguradora XYZ', categoria: 'Operacional', status: 'pendente', observacoes: 'Seguro patrimonial' },
    // Conta vencida para testar
    { id: 6, descricao: 'Manutenção Ar Condicionado', valor: 280.00, dataVencimento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fornecedor: 'Técnico João', categoria: 'Manutenção', status: 'pendente', observacoes: 'Manutenção preventiva' },
  ]);

  const [contasReceber, setContasReceber] = useState([
    { id: 1, descricao: 'Venda a prazo #1238', valor: 450.00, dataVencimento: '2024-01-30', cliente: 'João Silva', categoria: 'Vendas', status: 'pendente', observacoes: 'Venda com pagamento em 30 dias' },
    { id: 2, descricao: 'Serviço de consultoria', valor: 800.00, dataVencimento: '2024-01-28', cliente: 'Empresa XYZ', categoria: 'Serviços', status: 'pendente', observacoes: 'Consultoria técnica prestada' },
    { id: 3, descricao: 'Venda a prazo #1239', valor: 320.00, dataVencimento: '2024-01-25', cliente: 'Maria Santos', categoria: 'Vendas', status: 'recebido', observacoes: 'Venda com pagamento em 15 dias' },
    // Contas próximas do vencimento para testar lembretes
    { id: 4, descricao: 'Venda a prazo #1240', valor: 680.00, dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cliente: 'Carlos Oliveira', categoria: 'Vendas', status: 'pendente', observacoes: 'Venda de produtos eletrônicos' },
    { id: 5, descricao: 'Serviço de instalação', valor: 420.00, dataVencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cliente: 'Restaurante Sabor & Arte', categoria: 'Serviços', status: 'pendente', observacoes: 'Instalação de equipamentos' },
    // Conta vencida para testar
    { id: 6, descricao: 'Venda a prazo #1237', valor: 290.00, dataVencimento: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cliente: 'Ana Costa', categoria: 'Vendas', status: 'pendente', observacoes: 'Venda de roupas' },
  ]);

  // Dados para gráficos
  const dadosFluxoCaixa = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas (R$)',
        data: [45000, 52000, 48000, 61000, 58000, 72000],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Despesas (R$)',
        data: [32000, 38000, 35000, 42000, 41000, 48000],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const dadosDespesasCategoria = {
    labels: ['Operacional', 'Compras', 'Marketing', 'Manutenção', 'Outros'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: ['#7B3FBF', '#4B0082', '#ff9800', '#4caf50', '#2196f3'],
        borderWidth: 1,
      },
    ],
  };

  const dadosVendasLoja = {
    labels: ['Loja Centro', 'Loja Bairro', 'Loja Shopping'],
    datasets: [
      {
        label: 'Vendas por Loja (R$)',
        data: [25000, 18000, 22000],
        backgroundColor: ['rgba(123, 63, 191, 0.8)', 'rgba(75, 0, 130, 0.8)', 'rgba(160, 128, 255, 0.8)'],
        borderColor: ['#7B3FBF', '#4B0082', '#A080FF'],
        borderWidth: 2,
      },
    ],
  };

  const dadosLucroTempo = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Lucro Líquido (R$)',
        data: [13000, 14000, 13000, 19000, 17000, 24000],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  // Calcular KPIs financeiros completos
  const calcularKPIs = () => {
    const receitas = movimentacoesMock.filter(m => m.tipo === 'receita').reduce((sum, m) => sum + m.valor, 0);
    const despesas = Math.abs(movimentacoesMock.filter(m => m.tipo === 'despesa').reduce((sum, m) => sum + Math.abs(m.valor), 0));
    const lucroLiquido = receitas - despesas;
    const margemLucro = receitas > 0 ? ((lucroLiquido / receitas) * 100) : 0;
    
    const vendasHoje = movimentacoesMock.filter(m => 
      m.tipo === 'receita' && 
      new Date(m.data).toDateString() === new Date().toDateString()
    );
    
    const vendasHojeValor = vendasHoje.reduce((sum, m) => sum + m.valor, 0);
    const ticketMedio = vendasHoje.length > 0 ? vendasHojeValor / vendasHoje.length : 0;
    
    const totalContasPagar = contasPagar.reduce((sum, c) => sum + c.valor, 0);
    const totalContasReceber = contasReceber.reduce((sum, c) => sum + c.valor, 0);
    const saldoAtual = 15000; // Mock - futuramente integração com backend
    const compras = Math.abs(movimentacoesMock.filter(m => m.tipo === 'despesa' && m.categoria === 'Compras').reduce((sum, m) => sum + Math.abs(m.valor), 0));
    const entradas = receitas;
    const saidas = despesas;

    return {
      saldoAtual,
      vendasDia: vendasHojeValor,
      ticketMedio,
      despesas,
      contasPagar: totalContasPagar,
      contasReceber: totalContasReceber,
      lucroLiquido,
      compras,
      entradas,
      saidas,
      margemLucro,
      quantidadeVendas: vendasHoje.length
    };
  };

  const kpis = calcularKPIs();

  // Filtrar movimentações
  const movimentacoesFiltradas = movimentacoesMock.filter(mov => {
    const matchTipo = filtroTipo === 'todas' || mov.tipo === filtroTipo;
    const matchLoja = filtroLoja === 'todas' || mov.loja === filtroLoja;
    
    // Filtro por período (mock - futuramente implementar lógica real)
    const matchData = true; // Por enquanto mostra todas
    
    return matchTipo && matchLoja && matchData;
  });

  // Função para exportar relatório
  const handleExportar = async (formato) => {
    setExportando(true);
    setLoading(true);
    try {
      // Simulação de exportação (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Relatório financeiro exportado em ${formato.toUpperCase()} com sucesso! (mock)`);
    } catch (error) {
      alert('Erro ao exportar relatório.');
    } finally {
      setExportando(false);
      setLoading(false);
    }
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar status online
  useEffect(() => {
    const checkOnlineStatus = () => {
      setStatusOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    checkOnlineStatus();

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  // Verificar contas a vencer e mostrar lembretes
  useEffect(() => {
    const verificarContasVencer = () => {
      const hoje = new Date();
      const proximos7Dias = new Date();
      proximos7Dias.setDate(hoje.getDate() + 7);

      // Contas a pagar vencendo em 7 dias
      const contasPagarVencendo = contasPagar.filter(conta => {
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
      });

      // Contas a receber vencendo em 7 dias
      const contasReceberVencendo = contasReceber.filter(conta => {
        const dataVencimento = new Date(conta.dataVencimento);
        return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
      });

      // Contas vencidas
      const contasVencidas = [
        ...contasPagar.filter(conta => {
          const dataVencimento = new Date(conta.dataVencimento);
          return dataVencimento < hoje && conta.status === 'pendente';
        }),
        ...contasReceber.filter(conta => {
          const dataVencimento = new Date(conta.dataVencimento);
          return dataVencimento < hoje && conta.status === 'pendente';
        })
      ];

      // Se há contas vencendo ou vencidas, mostrar modal de lembretes
      if (contasPagarVencendo.length > 0 || contasReceberVencendo.length > 0 || contasVencidas.length > 0) {
        setModalLembretes(true);
      }
    };

    // Verificar após 1 segundo para garantir que os dados foram carregados
    const timer = setTimeout(verificarContasVencer, 1000);
    return () => clearTimeout(timer);
  }, [contasPagar, contasReceber]);

  // Função para abrir modal de detalhes
  const abrirDetalheConta = (conta, tipo) => {
    setContaDetalhe({ ...conta, tipo });
    setModalDetalheConta(true);
  };

  // Função para marcar como paga/recebida
  const marcarComoPagaRecebida = () => {
    if (!contaDetalhe) return;
    if (contaDetalhe.tipo === 'pagar') {
      setContasPagar(prev => prev.map(c => c.id === contaDetalhe.id ? { ...c, status: 'pago' } : c));
    } else {
      setContasReceber(prev => prev.map(c => c.id === contaDetalhe.id ? { ...c, status: 'recebido' } : c));
    }
    setModalDetalheConta(false);
    setContaDetalhe(null);
  };

  // Função para fechar modal sem marcar como paga
  const vouPagarDepois = () => {
    setModalDetalheConta(false);
    setContaDetalhe(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
      <div style={{ 
        background: '#fff', 
        color: '#4B0082', 
        boxShadow: '0 4px 24px rgba(75,0,130,0.10)', 
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: 16
      }}>
        {/* Header da página */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 24, 
          padding: '24px 24px 16px 24px', 
          borderBottom: '1px solid #F3F0FA',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaChartLine size={28} color="#7B3FBF" />
            <h1 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: 0 }}>Dashboard Financeiro</h1>
          </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Online/Offline */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '8px 12px', 
              background: statusOnline ? '#4caf50' : '#f44336',
              color: '#fff',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600
            }}>
              {statusOnline ? (
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: '#fff',
                  animation: 'pulse 2s infinite'
                }} />
              ) : (
                <FaTimesCircle size={8} color="#fff" />
              )}
              {statusOnline ? 'Online' : 'Offline'}
            </div>

            {/* Botão de filtros */}
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              style={{ 
                background: '#F3F0FA', 
                color: '#7B3FBF', 
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 16px', 
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
            
            {/* Botões de exportação */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => handleExportar('pdf')}
                disabled={exportando}
                style={{ 
                  background: '#f44336', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  cursor: exportando ? 'not-allowed' : 'pointer', 
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: exportando ? 0.7 : 1
                }}
                title="Exportar PDF"
              >
                <FaFilePdf size={14} />
                PDF
              </button>
              <button 
                onClick={() => handleExportar('excel')}
                disabled={exportando}
                style={{ 
                  background: '#4caf50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  cursor: exportando ? 'not-allowed' : 'pointer', 
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: exportando ? 0.7 : 1
                }}
                title="Exportar Excel"
              >
                <FaFileExcel size={14} />
                Excel
              </button>
              <button 
                onClick={() => handleExportar('csv')}
                disabled={exportando}
                style={{ 
                  background: '#2196f3', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  cursor: exportando ? 'not-allowed' : 'pointer', 
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: exportando ? 0.7 : 1
                }}
                title="Exportar CSV"
              >
                <FaFileCsv size={14} />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Avançados */}
        {mostrarFiltros && (
          <div style={{ 
            background: '#F3F0FA', 
            borderRadius: 12, 
            padding: 20, 
            margin: '0 24px 24px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            alignItems: 'center'
          }}>
            {/* Filtro por período */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
              <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Período:</label>
              <select
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                style={{ 
                  padding: '12px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: 8, 
                  background: '#fff',
                  color: '#4B0082',
                  fontSize: 14
                }}
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="trimestre">Este Trimestre</option>
                <option value="ano">Este Ano</option>
              </select>
            </div>

            {/* Filtro por tipo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
              <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Tipo:</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{ 
                  padding: '12px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: 8, 
                  background: '#fff',
                  color: '#4B0082',
                  fontSize: 14
                }}
              >
                <option value="todas">Todas as Movimentações</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
            </div>

            {/* Filtro por loja */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
              <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Loja:</label>
              <select
                value={filtroLoja}
                onChange={(e) => setFiltroLoja(e.target.value)}
                style={{ 
                  padding: '12px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: 8, 
                  background: '#fff',
                  color: '#4B0082',
                  fontSize: 14
                }}
              >
                <option value="todas">Todas as Lojas</option>
                <option value="Loja Centro">Loja Centro</option>
                <option value="Loja Bairro">Loja Bairro</option>
                <option value="Loja Shopping">Loja Shopping</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '40px',
            color: '#7B3FBF'
          }}>
            <FaSync size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: 12, fontSize: 16 }}>Carregando dados...</span>
          </div>
        )}

        {/* KPIs Principais */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16, 
          margin: '0 24px 24px 24px'
        }}>
          {/* Saldo Atual */}
          <div style={{ 
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaDollarSign size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Saldo Atual</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.saldoAtual.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Disponível para operações</div>
          </div>

          {/* Vendas do Dia */}
          <div style={{ 
            background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(123, 63, 191, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowUp size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Vendas do Dia</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.vendasDia.toFixed(2)}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>{kpis.quantidadeVendas} vendas realizadas</div>
          </div>

          {/* Ticket Médio */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaChartLine size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Ticket Médio</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.ticketMedio.toFixed(2)}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Valor médio por venda</div>
          </div>

          {/* Despesas */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowDown size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Despesas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.despesas.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Total de gastos</div>
            <button 
              onClick={() => setModalDespesa(true)}
              style={{ 
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
              title="Adicionar Despesa"
            >
              <FaPlus size={12} />
            </button>
          </div>

          {/* Contas a Pagar */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowDown size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Contas a Pagar</span>
              {(() => {
                const hoje = new Date();
                const proximos7Dias = new Date();
                proximos7Dias.setDate(hoje.getDate() + 7);
                const contasVencendo = contasPagar.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
                });
                const contasVencidas = contasPagar.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento < hoje && conta.status === 'pendente';
                });
                return (contasVencendo.length > 0 || contasVencidas.length > 0) ? (
                  <div style={{
                    background: contasVencidas.length > 0 ? '#f44336' : '#ff9800',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }}>
                    {contasVencidas.length > 0 ? contasVencidas.length : contasVencendo.length}
                  </div>
                ) : null;
              })()}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.contasPagar.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Obrigações pendentes</div>
            <button 
              onClick={() => setModalContaPagar(true)}
              style={{ 
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
              title="Adicionar Conta a Pagar"
            >
              <FaPlus size={12} />
            </button>
          </div>

          {/* Contas a Receber */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowUp size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Contas a Receber</span>
              {(() => {
                const hoje = new Date();
                const proximos7Dias = new Date();
                proximos7Dias.setDate(hoje.getDate() + 7);
                const contasVencendo = contasReceber.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
                });
                const contasVencidas = contasReceber.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento < hoje && conta.status === 'pendente';
                });
                return (contasVencendo.length > 0 || contasVencidas.length > 0) ? (
                  <div style={{
                    background: contasVencidas.length > 0 ? '#f44336' : '#ff9800',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }}>
                    {contasVencidas.length > 0 ? contasVencidas.length : contasVencendo.length}
                  </div>
                ) : null;
              })()}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.contasReceber.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Valores a receber</div>
            <button 
              onClick={() => setModalContaReceber(true)}
              style={{ 
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
              title="Adicionar Conta a Receber"
            >
              <FaPlus size={12} />
            </button>
          </div>

          {/* Lucro Líquido */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaChartLine size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Lucro Líquido</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.lucroLiquido.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Resultado final</div>
          </div>

          {/* Compras */}
          <div style={{ 
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaStore size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Compras</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.compras.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Aquisições do período</div>
          </div>

          {/* Entradas */}
          <div style={{ 
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowUp size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Entradas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.entradas.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Total de receitas</div>
          </div>

          {/* Saídas */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaArrowDown size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Saídas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.saidas.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Total de despesas</div>
          </div>

          {/* Margem de Lucro */}
          <div style={{ 
            background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaChartPie size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Margem de Lucro</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.margemLucro.toFixed(1)}%</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Percentual de lucro</div>
          </div>

          {/* Quantidade de Vendas */}
          <div style={{ 
            background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)', 
            color: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8,
            boxShadow: '0 4px 12px rgba(96, 125, 139, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaEye size={18} />
              <span style={{ fontSize: 13, opacity: 0.9 }}>Qtd. de Vendas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.quantidadeVendas}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Vendas realizadas</div>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 20, 
          margin: '0 24px 24px 24px'
        }}>
          {/* Fluxo de Caixa */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #F3F0FA',
            minHeight: '400px'
          }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Fluxo de Caixa</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Line 
                data={dadosFluxoCaixa} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'top',
                      labels: { color: '#4B0082', font: { size: 14 } }
                    } 
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    },
                    x: {
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    }
                  } 
                }} 
              />
            </div>
          </div>

          {/* Despesas por Categoria */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #F3F0FA',
            minHeight: '400px'
          }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Despesas por Categoria</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Doughnut 
                data={dadosDespesasCategoria} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom',
                      labels: { color: '#4B0082', font: { size: 12 } }
                    } 
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Mais Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 20, 
          margin: '0 24px 24px 24px'
        }}>
          {/* Vendas por Loja */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #F3F0FA',
            minHeight: '400px'
          }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Vendas por Loja</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Bar 
                data={dadosVendasLoja} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      display: false
                    } 
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    },
                    x: {
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    }
                  } 
                }} 
              />
            </div>
          </div>

          {/* Lucro ao Longo do Tempo */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #F3F0FA',
            minHeight: '400px'
          }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Lucro ao Longo do Tempo</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Line 
                data={dadosLucroTempo} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'top',
                      labels: { color: '#4B0082', font: { size: 14 } }
                    } 
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    },
                    x: {
                      grid: { color: '#F3F0FA' },
                      ticks: { color: '#4B0082', font: { size: 12 } }
                    }
                  } 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Tabela de Movimentações */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #F3F0FA',
          margin: '0 24px 24px 24px'
        }}>
          <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Movimentações Financeiras</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Data/Hora</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Descrição</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Loja</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#4B0082', fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoesFiltradas.map((mov) => (
                  <tr key={mov.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{formatarData(mov.data)}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{mov.descricao}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{mov.loja}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{mov.categoria}</td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      color: mov.tipo === 'receita' ? '#4caf50' : '#f44336',
                      fontWeight: 600
                    }}>
                      R$ {Math.abs(mov.valor).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        background: mov.tipo === 'receita' ? '#4caf50' : '#f44336',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {mov.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {movimentacoesFiltradas.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#999', 
              fontSize: 16 
            }}>
              Nenhuma movimentação encontrada com os filtros aplicados.
            </div>
          )}
        </div>

        {/* Contas a Pagar */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #F3F0FA',
          margin: '0 24px 24px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600 }}>Contas a Pagar</h3>
            <button 
              onClick={() => setModalContaPagar(true)}
              style={{ 
                background: '#ff5722', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <FaPlus size={14} />
              Nova Conta
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Descrição</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Fornecedor</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Vencimento</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#4B0082', fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contasPagar.map((conta) => (
                  <tr key={conta.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.descricao}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.fornecedor}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.categoria}</td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      color: '#f44336',
                      fontWeight: 600
                    }}>
                      R$ {conta.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        background: conta.status === 'pago' ? '#4caf50' : conta.status === 'vencido' ? '#f44336' : '#ff9800',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {conta.status === 'pago' ? 'Pago' : conta.status === 'vencido' ? 'Vencido' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button 
                          onClick={() => abrirDetalheConta(conta, 'pagar')}
                          style={{ background: '#7B3FBF', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                          title="Detalhes"
                        >
                          <FaEye size={12} />
                        </button>
                        <button 
                          onClick={() => setContasPagar(prev => prev.filter(c => c.id !== conta.id))}
                          style={{ 
                            background: '#f44336', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 4, 
                            padding: '4px 8px', 
                            cursor: 'pointer', 
                            fontSize: 12
                          }}
                          title="Excluir"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {contasPagar.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#999', 
              fontSize: 16 
            }}>
              Nenhuma conta a pagar cadastrada.
            </div>
          )}
        </div>

        {/* Contas a Receber */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #F3F0FA',
          margin: '0 24px 24px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600 }}>Contas a Receber</h3>
            <button 
              onClick={() => setModalContaReceber(true)}
              style={{ 
                background: '#2196f3', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <FaPlus size={14} />
              Nova Conta
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Descrição</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Vencimento</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#4B0082', fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contasReceber.map((conta) => (
                  <tr key={conta.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.descricao}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.cliente}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px', color: '#4B0082' }}>{conta.categoria}</td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      color: '#4caf50',
                      fontWeight: 600
                    }}>
                      R$ {conta.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        background: conta.status === 'recebido' ? '#4caf50' : conta.status === 'vencido' ? '#f44336' : '#ff9800',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {conta.status === 'recebido' ? 'Recebido' : conta.status === 'vencido' ? 'Vencido' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button 
                          onClick={() => abrirDetalheConta(conta, 'receber')}
                          style={{ background: '#7B3FBF', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                          title="Detalhes"
                        >
                          <FaEye size={12} />
                        </button>
                        <button 
                          onClick={() => setContasReceber(prev => prev.filter(c => c.id !== conta.id))}
                          style={{ 
                            background: '#f44336', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 4, 
                            padding: '4px 8px', 
                            cursor: 'pointer', 
                            fontSize: 12
                          }}
                          title="Excluir"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {contasReceber.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#999', 
              fontSize: 16 
            }}>
              Nenhuma conta a receber cadastrada.
            </div>
          )}
        </div>
      </div>

              {/* Modal de Lembretes */}
        {modalLembretes && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80%',
              overflowY: 'auto',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: '#4B0082', fontSize: 22, fontWeight: 600, margin: 0 }}>
                  ⚠️ Lembretes de Contas
                </h2>
                <button 
                  onClick={() => setModalLembretes(false)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#999', 
                    cursor: 'pointer', 
                    fontSize: 20,
                    padding: 0
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {(() => {
                const hoje = new Date();
                const proximos7Dias = new Date();
                proximos7Dias.setDate(hoje.getDate() + 7);

                // Contas vencidas
                const contasVencidas = [
                  ...contasPagar.filter(conta => {
                    const dataVencimento = new Date(conta.dataVencimento);
                    return dataVencimento < hoje && conta.status === 'pendente';
                  }),
                  ...contasReceber.filter(conta => {
                    const dataVencimento = new Date(conta.dataVencimento);
                    return dataVencimento < hoje && conta.status === 'pendente';
                  })
                ];

                // Contas a pagar vencendo em 7 dias
                const contasPagarVencendo = contasPagar.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
                });

                // Contas a receber vencendo em 7 dias
                const contasReceberVencendo = contasReceber.filter(conta => {
                  const dataVencimento = new Date(conta.dataVencimento);
                  return dataVencimento >= hoje && dataVencimento <= proximos7Dias && conta.status === 'pendente';
                });

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Contas Vencidas */}
                    {contasVencidas.length > 0 && (
                      <div style={{ 
                        background: '#ffebee', 
                        border: '1px solid #f44336', 
                        borderRadius: 8, 
                        padding: 16 
                      }}>
                        <h3 style={{ color: '#d32f2f', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                          🔴 Contas Vencidas ({contasVencidas.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {contasVencidas.map((conta, index) => (
                            <div key={index} style={{ 
                              background: '#fff', 
                              padding: 12, 
                              borderRadius: 6, 
                              border: '1px solid #ffcdd2' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#d32f2f' }}>{conta.descricao}</div>
                                  <div style={{ fontSize: 12, color: '#666' }}>
                                    {conta.fornecedor || conta.cliente} • Venceu em {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                                  </div>
                                </div>
                                <div style={{ fontWeight: 600, color: '#d32f2f' }}>
                                  R$ {conta.valor.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contas a Pagar Vencendo */}
                    {contasPagarVencendo.length > 0 && (
                      <div style={{ 
                        background: '#fff3e0', 
                        border: '1px solid #ff9800', 
                        borderRadius: 8, 
                        padding: 16 
                      }}>
                        <h3 style={{ color: '#f57c00', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                          🟠 Contas a Pagar Vencendo ({contasPagarVencendo.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {contasPagarVencendo.map((conta, index) => (
                            <div key={index} style={{ 
                              background: '#fff', 
                              padding: 12, 
                              borderRadius: 6, 
                              border: '1px solid #ffe0b2' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#f57c00' }}>{conta.descricao}</div>
                                  <div style={{ fontSize: 12, color: '#666' }}>
                                    {conta.fornecedor} • Vence em {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                                  </div>
                                </div>
                                <div style={{ fontWeight: 600, color: '#f57c00' }}>
                                  R$ {conta.valor.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contas a Receber Vencendo */}
                    {contasReceberVencendo.length > 0 && (
                      <div style={{ 
                        background: '#e8f5e8', 
                        border: '1px solid #4caf50', 
                        borderRadius: 8, 
                        padding: 16 
                      }}>
                        <h3 style={{ color: '#388e3c', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                          🟢 Contas a Receber Vencendo ({contasReceberVencendo.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {contasReceberVencendo.map((conta, index) => (
                            <div key={index} style={{ 
                              background: '#fff', 
                              padding: 12, 
                              borderRadius: 6, 
                              border: '1px solid #c8e6c9' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#388e3c' }}>{conta.descricao}</div>
                                  <div style={{ fontSize: 12, color: '#666' }}>
                                    {conta.cliente} • Vence em {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                                  </div>
                                </div>
                                <div style={{ fontWeight: 600, color: '#388e3c' }}>
                                  R$ {conta.valor.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resumo */}
                    <div style={{ 
                      background: '#f3f0fa', 
                      borderRadius: 8, 
                      padding: 16, 
                      textAlign: 'center' 
                    }}>
                      <div style={{ fontSize: 14, color: '#4B0082', marginBottom: 8 }}>
                        <strong>Resumo dos Lembretes:</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 12, color: '#666' }}>
                        {contasVencidas.length > 0 && (
                          <span>🔴 {contasVencidas.length} vencidas</span>
                        )}
                        {contasPagarVencendo.length > 0 && (
                          <span>🟠 {contasPagarVencendo.length} a pagar</span>
                        )}
                        {contasReceberVencendo.length > 0 && (
                          <span>🟢 {contasReceberVencendo.length} a receber</span>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                      <button 
                        onClick={() => setModalLembretes(false)}
                        style={{ 
                          background: '#4B0082', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 8, 
                          padding: '12px 24px', 
                          cursor: 'pointer', 
                          fontSize: 14,
                          fontWeight: 600
                        }}
                      >
                        Entendi
                      </button>
                      {(contasPagarVencendo.length > 0 || contasVencidas.filter(c => c.fornecedor).length > 0) && (
                        <button 
                          onClick={() => {
                            setModalLembretes(false);
                            setModalContaPagar(true);
                          }}
                          style={{ 
                            background: '#ff5722', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 8, 
                            padding: '12px 24px', 
                            cursor: 'pointer', 
                            fontSize: 14,
                            fontWeight: 600
                          }}
                        >
                          Gerenciar Contas a Pagar
                        </button>
                      )}
                      {(contasReceberVencendo.length > 0 || contasVencidas.filter(c => c.cliente).length > 0) && (
                        <button 
                          onClick={() => {
                            setModalLembretes(false);
                            setModalContaReceber(true);
                          }}
                          style={{ 
                            background: '#2196f3', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 8, 
                            padding: '12px 24px', 
                            cursor: 'pointer', 
                            fontSize: 14,
                            fontWeight: 600
                          }}
                        >
                          Gerenciar Contas a Receber
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Modais */}
        {modalDespesa && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90%',
            overflowY: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
               <h2 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                 {editandoItem ? 'Editar Despesa' : 'Nova Despesa'}
               </h2>
               <button 
                 onClick={() => {
                   setModalDespesa(false);
                   setEditandoItem(null);
                   setFormDespesa({ descricao: '', valor: '', categoria: '', data: '', loja: '', observacoes: '' });
                 }}
                 style={{ 
                   background: 'none', 
                   border: 'none', 
                   color: '#999', 
                   cursor: 'pointer', 
                   fontSize: 20,
                   padding: 0
                 }}
               >
                 <FaTimes />
               </button>
             </div>
                         <form onSubmit={(e) => {
               e.preventDefault();
               if (!formDespesa.descricao || !formDespesa.valor || !formDespesa.categoria || !formDespesa.data) {
                 alert('Por favor, preencha todos os campos obrigatórios.');
                 return;
               }
               
               const newDespesa = {
                 id: editandoItem ? editandoItem.id : Date.now(),
                 tipo: 'despesa',
                 ...formDespesa,
                 valor: -Math.abs(parseFloat(formDespesa.valor)) // Garante que seja negativo
               };
               
               if (editandoItem) {
                 setMovimentacoesMock(prev => prev.map(m => m.id === editandoItem.id ? newDespesa : m));
               } else {
                 setMovimentacoesMock(prev => [...prev, newDespesa]);
               }
               
               setModalDespesa(false);
               setEditandoItem(null);
               setFormDespesa({ descricao: '', valor: '', categoria: '', data: '', loja: '', observacoes: '' });
             }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Descrição:</label>
                <input
                  type="text"
                  value={formDespesa.descricao}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, descricao: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Valor (R$):</label>
                <input
                  type="number"
                  value={formDespesa.valor}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, valor: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Categoria:</label>
                <select
                  value={formDespesa.categoria}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, categoria: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="">Selecione</option>
                  <option value="Compras">Compras</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Energia">Energia</option>
                  <option value="Internet">Internet</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Data:</label>
                <input
                  type="datetime-local"
                  value={formDespesa.data}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, data: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Loja:</label>
                <select
                  value={formDespesa.loja}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, loja: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="">Selecione</option>
                  <option value="Loja Centro">Loja Centro</option>
                  <option value="Loja Bairro">Loja Bairro</option>
                  <option value="Loja Shopping">Loja Shopping</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Observações:</label>
                <textarea
                  value={formDespesa.observacoes}
                  onChange={(e) => setFormDespesa(prev => ({ ...prev, observacoes: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8, minHeight: 80 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setModalDespesa(false)}
                  style={{ 
                    background: '#f44336', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    background: '#4caf50', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalContaPagar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90%',
            overflowY: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
               <h2 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                 {editandoItem ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
               </h2>
               <button 
                 onClick={() => {
                   setModalContaPagar(false);
                   setEditandoItem(null);
                   setFormContaPagar({ descricao: '', valor: '', dataVencimento: '', fornecedor: '', categoria: '', status: 'pendente', observacoes: '' });
                 }}
                 style={{ 
                   background: 'none', 
                   border: 'none', 
                   color: '#999', 
                   cursor: 'pointer', 
                   fontSize: 20,
                   padding: 0
                 }}
               >
                 <FaTimes />
               </button>
             </div>
                         <form onSubmit={(e) => {
               e.preventDefault();
               if (!formContaPagar.descricao || !formContaPagar.valor || !formContaPagar.dataVencimento || !formContaPagar.fornecedor) {
                 alert('Por favor, preencha todos os campos obrigatórios.');
                 return;
               }
               
               const newContaPagar = {
                 id: editandoItem ? editandoItem.id : Date.now(),
                 ...formContaPagar,
                 valor: parseFloat(formContaPagar.valor)
               };
               
               if (editandoItem) {
                 setContasPagar(prev => prev.map(c => c.id === editandoItem.id ? newContaPagar : c));
               } else {
                 setContasPagar(prev => [...prev, newContaPagar]);
               }
               
               setModalContaPagar(false);
               setEditandoItem(null);
               setFormContaPagar({ descricao: '', valor: '', dataVencimento: '', fornecedor: '', categoria: '', status: 'pendente', observacoes: '' });
             }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Descrição:</label>
                <input
                  type="text"
                  value={formContaPagar.descricao}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, descricao: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Valor (R$):</label>
                <input
                  type="number"
                  value={formContaPagar.valor}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, valor: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Data de Vencimento:</label>
                <input
                  type="date"
                  value={formContaPagar.dataVencimento}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, dataVencimento: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Fornecedor:</label>
                <input
                  type="text"
                  value={formContaPagar.fornecedor}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, fornecedor: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Categoria:</label>
                <select
                  value={formContaPagar.categoria}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, categoria: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="">Selecione</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Compras">Compras</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Status:</label>
                <select
                  value={formContaPagar.status}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, status: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Observações:</label>
                <textarea
                  value={formContaPagar.observacoes}
                  onChange={(e) => setFormContaPagar(prev => ({ ...prev, observacoes: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8, minHeight: 80 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setModalContaPagar(false)}
                  style={{ 
                    background: '#f44336', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    background: '#4caf50', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Salvar Conta a Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalContaReceber && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90%',
            overflowY: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
               <h2 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                 {editandoItem ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
               </h2>
               <button 
                 onClick={() => {
                   setModalContaReceber(false);
                   setEditandoItem(null);
                   setFormContaReceber({ descricao: '', valor: '', dataVencimento: '', cliente: '', categoria: '', status: 'pendente', observacoes: '' });
                 }}
                 style={{ 
                   background: 'none', 
                   border: 'none', 
                   color: '#999', 
                   cursor: 'pointer', 
                   fontSize: 20,
                   padding: 0
                 }}
               >
                 <FaTimes />
               </button>
             </div>
                         <form onSubmit={(e) => {
               e.preventDefault();
               if (!formContaReceber.descricao || !formContaReceber.valor || !formContaReceber.dataVencimento || !formContaReceber.cliente) {
                 alert('Por favor, preencha todos os campos obrigatórios.');
                 return;
               }
               
               const newContaReceber = {
                 id: editandoItem ? editandoItem.id : Date.now(),
                 ...formContaReceber,
                 valor: parseFloat(formContaReceber.valor)
               };
               
               if (editandoItem) {
                 setContasReceber(prev => prev.map(c => c.id === editandoItem.id ? newContaReceber : c));
               } else {
                 setContasReceber(prev => [...prev, newContaReceber]);
               }
               
               setModalContaReceber(false);
               setEditandoItem(null);
               setFormContaReceber({ descricao: '', valor: '', dataVencimento: '', cliente: '', categoria: '', status: 'pendente', observacoes: '' });
             }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Descrição:</label>
                <input
                  type="text"
                  value={formContaReceber.descricao}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, descricao: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Valor (R$):</label>
                <input
                  type="number"
                  value={formContaReceber.valor}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, valor: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Data de Vencimento:</label>
                <input
                  type="date"
                  value={formContaReceber.dataVencimento}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, dataVencimento: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Cliente:</label>
                <input
                  type="text"
                  value={formContaReceber.cliente}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, cliente: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Categoria:</label>
                <select
                  value={formContaReceber.categoria}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, categoria: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="">Selecione</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Status:</label>
                <select
                  value={formContaReceber.status}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, status: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="recebido">Recebido</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#4B0082', fontSize: 14 }}>Observações:</label>
                <textarea
                  value={formContaReceber.observacoes}
                  onChange={(e) => setFormContaReceber(prev => ({ ...prev, observacoes: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 8, minHeight: 80 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setModalContaReceber(false)}
                  style={{ 
                    background: '#f44336', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    background: '#4caf50', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Salvar Conta a Receber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS para animações */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Modal de detalhes da conta */}
      {modalDetalheConta && contaDetalhe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                {contaDetalhe.tipo === 'pagar' ? 'Detalhe da Conta a Pagar' : 'Detalhe da Conta a Receber'}
              </h2>
              <button 
                onClick={vouPagarDepois}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 20, padding: 0 }}
              >
                <FaTimes />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#4B0082', marginBottom: 4 }}>{contaDetalhe.descricao}</div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                {contaDetalhe.tipo === 'pagar' ? `Fornecedor: ${contaDetalhe.fornecedor}` : `Cliente: ${contaDetalhe.cliente}`}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                Categoria: {contaDetalhe.categoria}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                Vencimento: {new Date(contaDetalhe.dataVencimento).toLocaleDateString('pt-BR')}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                Valor: <span style={{ color: '#4caf50', fontWeight: 600 }}>R$ {contaDetalhe.valor.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                Status: <span style={{ color: contaDetalhe.status === 'pago' || contaDetalhe.status === 'recebido' ? '#4caf50' : '#ff9800', fontWeight: 600 }}>{contaDetalhe.status === 'pago' ? 'Pago' : contaDetalhe.status === 'recebido' ? 'Recebido' : 'Pendente'}</span>
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                Observações: {contaDetalhe.observacoes || '-'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button 
                onClick={vouPagarDepois}
                style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
              >
                Vou pagar depois
              </button>
              {contaDetalhe.status !== 'pago' && contaDetalhe.status !== 'recebido' && (
                <button 
                  onClick={marcarComoPagaRecebida}
                  style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                >
                  Marcar como {contaDetalhe.tipo === 'pagar' ? 'paga' : 'recebida'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Layout otimizado para usar 100% da largura disponível
// - Grid system responsivo que se adapta a diferentes tamanhos de tela
// - KPIs compactos com cores diferenciadas por categoria
// - Gráficos com altura fixa e largura responsiva
// - Sistema de filtros avançados por período, tipo e loja
// - Exportação em múltiplos formatos (PDF, Excel, CSV)
// - Status online/offline com indicador visual
// - Loading states e feedback visual para todas as ações
// - Tabelas com scroll horizontal para mobile
// - Eliminação de scroll lateral desnecessário
// - Integração futura: conectar com backend para dados reais
// - Gráficos: implementar dados dinâmicos do backend
// - Exportação: integrar com sistema real de geração de relatórios

export default FinanceiroPage; 