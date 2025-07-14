import React, { useState, useContext } from 'react';
import { FaUsers, FaStore, FaCogs, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye, FaUserShield, FaUserCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

// Página de Administração com layout responsivo
function AdminPage() {
  // Estados para abas e dados
  const [abaAtiva, setAbaAtiva] = useState('usuarios');
  const [pesquisa, setPesquisa] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [exportando, setExportando] = useState(false);

  // Estados para formulários e modais
  const [formUsuario, setFormUsuario] = useState({
    nome: '',
    email: '',
    tipo: 'funcionario',
    loja: '',
    ativo: true
  });
  const [formLoja, setFormLoja] = useState({
    nome: '',
    endereco: '',
    telefone: ''
  });
  const [modalUsuario, setModalUsuario] = useState({ aberto: false, modo: 'adicionar', usuario: null });
  const [modalLoja, setModalLoja] = useState({ aberto: false, modo: 'adicionar', loja: null });
  const [confirmacao, setConfirmacao] = useState({ aberto: false, tipo: '', id: null, nome: '' });

  // Estados para dados (mock - futuramente integração com backend)
  const [usuariosMock, setUsuariosMock] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', tipo: 'administrador', loja: 'Loja Centro', ativo: true, ultimoAcesso: '2024-01-15T10:30:00' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', tipo: 'funcionario', loja: 'Loja Bairro', ativo: true, ultimoAcesso: '2024-01-15T09:15:00' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', tipo: 'funcionario', loja: 'Loja Shopping', ativo: false, ultimoAcesso: '2024-01-14T16:45:00' },
    { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', tipo: 'administrador', loja: 'Loja Centro', ativo: true, ultimoAcesso: '2024-01-15T11:20:00' },
    { id: 5, nome: 'Carlos Lima', email: 'carlos@email.com', tipo: 'funcionario', loja: 'Loja Bairro', ativo: true, ultimoAcesso: '2024-01-15T08:45:00' },
  ]);

  const [lojasMock, setLojasMock] = useState([
    { id: 1, nome: 'Loja Centro', endereco: 'Rua das Flores, 123', telefone: '11999999999', ativa: true, funcionarios: 8 },
    { id: 2, nome: 'Loja Bairro', endereco: 'Av. Principal, 456', telefone: '11888888888', ativa: true, funcionarios: 5 },
    { id: 3, nome: 'Loja Shopping', endereco: 'Shopping Center, Loja 15', telefone: '11777777777', ativa: true, funcionarios: 6 },
    { id: 4, nome: 'Loja Norte', endereco: 'Rua do Norte, 789', telefone: '11666666666', ativa: false, funcionarios: 0 },
  ]);

  // Dados mockados de logs
  const logsMock = [
    { id: 1, usuario: 'João Silva', acao: 'Login no sistema', data: '2024-01-15T10:30:00', ip: '192.168.1.100', status: 'sucesso' },
    { id: 2, usuario: 'Maria Santos', acao: 'Nova venda registrada', data: '2024-01-15T09:15:00', ip: '192.168.1.101', status: 'sucesso' },
    { id: 3, usuario: 'Pedro Costa', acao: 'Tentativa de login', data: '2024-01-14T16:45:00', ip: '192.168.1.102', status: 'falha' },
    { id: 4, usuario: 'Ana Oliveira', acao: 'Produto adicionado ao estoque', data: '2024-01-15T11:20:00', ip: '192.168.1.103', status: 'sucesso' },
    { id: 5, usuario: 'Carlos Lima', acao: 'Relatório exportado', data: '2024-01-15T08:45:00', ip: '192.168.1.104', status: 'sucesso' },
  ];

  // Calcular KPIs
  const calcularKPIs = () => {
    const totalUsuarios = usuariosMock.length;
    const usuariosAtivos = usuariosMock.filter(u => u.ativo).length;
    const totalLojas = lojasMock.length;
    const lojasAtivas = lojasMock.filter(l => l.ativa).length;
    const totalFuncionarios = lojasMock.reduce((sum, l) => sum + l.funcionarios, 0);
    const logsHoje = logsMock.filter(l => 
      new Date(l.data).toDateString() === new Date().toDateString()
    ).length;

    return {
      totalUsuarios,
      usuariosAtivos,
      totalLojas,
      lojasAtivas,
      totalFuncionarios,
      logsHoje
    };
  };

  const kpis = calcularKPIs();

  // Filtrar dados
  const usuariosFiltrados = usuariosMock.filter(usuario => {
    const matchPesquisa = usuario.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(pesquisa.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || usuario.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || 
                       (filtroStatus === 'ativo' && usuario.ativo) ||
                       (filtroStatus === 'inativo' && !usuario.ativo);

    return matchPesquisa && matchTipo && matchStatus;
  });

  // Função para exportar relatório
  const handleExportar = async () => {
    setExportando(true);
    try {
      // Simulação de exportação (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Relatório administrativo exportado com sucesso! (mock)');
    } catch (error) {
      alert('Erro ao exportar relatório.');
    } finally {
      setExportando(false);
    }
  };

  // Funções para manipular usuários
  const abrirModalUsuario = (modo, usuario = null) => {
    if (modo === 'editar' && usuario) {
      setFormUsuario({
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        loja: usuario.loja,
        ativo: usuario.ativo
      });
    } else {
      setFormUsuario({
        nome: '',
        email: '',
        tipo: 'funcionario',
        loja: 'Loja Centro',
        ativo: true
      });
    }
    setModalUsuario({ aberto: true, modo, usuario });
  };

  const fecharModalUsuario = () => {
    setModalUsuario({ aberto: false, modo: 'adicionar', usuario: null });
    setFormUsuario({
      nome: '',
      email: '',
      tipo: 'funcionario',
      loja: 'Loja Centro',
      ativo: true
    });
  };

  const salvarUsuario = () => {
    if (!formUsuario.nome.trim() || !formUsuario.email.trim()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (modalUsuario.modo === 'adicionar') {
      const novoUsuario = {
        id: Date.now(),
        ...formUsuario,
        ultimoAcesso: new Date().toISOString()
      };
      setUsuariosMock(prev => [...prev, novoUsuario]);
    } else {
      setUsuariosMock(prev => prev.map(u => 
        u.id === modalUsuario.usuario.id ? { ...u, ...formUsuario } : u
      ));
    }
    fecharModalUsuario();
  };

  const excluirUsuario = (id) => {
    setUsuariosMock(prev => prev.filter(u => u.id !== id));
    setConfirmacao({ aberto: false, tipo: '', id: null, nome: '' });
  };

  // Funções para manipular lojas
  const abrirModalLoja = (modo, loja = null) => {
    if (modo === 'editar' && loja) {
      setFormLoja({
        nome: loja.nome,
        endereco: loja.endereco,
        telefone: loja.telefone
      });
    } else {
      setFormLoja({
        nome: '',
        endereco: '',
        telefone: ''
      });
    }
    setModalLoja({ aberto: true, modo, loja });
  };

  const fecharModalLoja = () => {
    setModalLoja({ aberto: false, modo: 'adicionar', loja: null });
    setFormLoja({
      nome: '',
      endereco: '',
      telefone: ''
    });
  };

  const salvarLoja = () => {
    if (!formLoja.nome.trim() || !formLoja.endereco.trim() || !formLoja.telefone.trim()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (modalLoja.modo === 'adicionar') {
      const novaLoja = {
        id: Date.now(),
        ...formLoja,
        ativa: true,
        funcionarios: 0
      };
      setLojasMock(prev => [...prev, novaLoja]);
    } else {
      setLojasMock(prev => prev.map(l => 
        l.id === modalLoja.loja.id ? { ...l, ...formLoja } : l
      ));
    }
    fecharModalLoja();
  };

  const excluirLoja = (id) => {
    setLojasMock(prev => prev.filter(l => l.id !== id));
    setConfirmacao({ aberto: false, tipo: '', id: null, nome: '' });
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

  const { tipoUsuario } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center" style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw'
      }}>
        <div className="card" style={{ 
          background: '#fff', 
          color: '#4B0082', 
          boxShadow: '0 4px 24px rgba(75,0,130,0.10)', 
          maxWidth: '100%',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Header da página */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 24, 
            paddingBottom: 16, 
            borderBottom: '1px solid #F3F0FA',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaCogs size={28} color="#7B3FBF" />
              <h1 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: 0 }}>Administração</h1>
            </div>
            
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
              
              {/* Botão exportar */}
              <button 
                onClick={handleExportar}
                disabled={exportando}
                style={{ 
                  background: '#4B0082', 
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
              >
                <FaDownload size={14} />
                {exportando ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>

          {/* Filtros */}
          {mostrarFiltros && (
            <div style={{ 
              background: '#F3F0FA', 
              borderRadius: 12, 
              padding: 20, 
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              alignItems: 'center'
            }}>
              {/* Pesquisa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200, flex: 1 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Pesquisar:</label>
                <div style={{ position: 'relative' }}>
                  <FaSearch size={14} style={{ 
                    position: 'absolute', 
                    left: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#7B3FBF' 
                  }} />
                  <input
                    type="text"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Nome ou e-mail..."
                    style={{ 
                      width: '100%', 
                      padding: '12px 12px 12px 40px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: 8, 
                      background: '#fff',
                      color: '#4B0082',
                      fontSize: 14
                    }}
                  />
                </div>
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
                  <option value="todos">Todos</option>
                  <option value="administrador">Administrador</option>
                  <option value="funcionario">Funcionário</option>
                </select>
              </div>

              {/* Filtro por status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Status:</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  style={{ 
                    padding: '12px', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: 8, 
                    background: '#fff',
                    color: '#4B0082',
                    fontSize: 14
                  }}
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 20, 
            marginBottom: 32 
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaUsers size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Total de Usuários</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.totalUsuarios}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaUserCheck size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Usuários Ativos</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.usuariosAtivos}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaStore size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Lojas Ativas</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.lojasAtivas}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaUserShield size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Logs Hoje</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.logsHoje}</div>
            </div>
          </div>

          {/* Abas */}
          <div style={{ 
            display: 'flex', 
            gap: 0, 
            marginBottom: 24,
            borderBottom: '2px solid #F3F0FA'
          }}>
            {[
              { id: 'usuarios', label: 'Usuários', icon: <FaUsers size={16} /> },
              { id: 'lojas', label: 'Lojas', icon: <FaStore size={16} /> },
              { id: 'logs', label: 'Logs de Atividade', icon: <FaEye size={16} /> }
            ].map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                style={{
                  background: abaAtiva === aba.id ? '#7B3FBF' : 'transparent',
                  color: abaAtiva === aba.id ? '#fff' : '#4B0082',
                  border: 'none',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  borderBottom: `3px solid ${abaAtiva === aba.id ? '#7B3FBF' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}
              >
                {aba.icon}
                {aba.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das Abas */}
          {abaAtiva === 'usuarios' && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #F3F0FA'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, margin: 0 }}>Gestão de Usuários</h3>
                <button 
                  onClick={() => abrirModalUsuario('adicionar')}
                  style={{
                    background: '#4B0082',
                    color: '#fff',
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
                  <FaPlus size={14} />
                  Novo Usuário
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>E-mail</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Tipo</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Loja</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Último Acesso</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                        <td style={{ padding: '12px', color: '#4B0082', fontWeight: 600 }}>{usuario.nome}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{usuario.email}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>
                          <span style={{
                            background: usuario.tipo === 'administrador' ? '#7B3FBF' : '#4caf50',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {usuario.tipo}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{usuario.loja}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            background: usuario.ativo ? '#4caf50' : '#f44336',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{formatarData(usuario.ultimoAcesso)}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button 
                              onClick={() => abrirModalUsuario('editar', usuario)}
                              style={{
                                background: '#7B3FBF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <FaEdit size={10} />
                              Editar
                            </button>
                            <button 
                              onClick={() => setConfirmacao({ 
                                aberto: true, 
                                tipo: 'usuario', 
                                id: usuario.id, 
                                nome: usuario.nome 
                              })}
                              style={{
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <FaTrash size={10} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {abaAtiva === 'lojas' && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #F3F0FA'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, margin: 0 }}>Gestão de Lojas</h3>
                <button 
                  onClick={() => abrirModalLoja('adicionar')}
                  style={{
                    background: '#4B0082',
                    color: '#fff',
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
                  <FaPlus size={14} />
                  Nova Loja
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Endereço</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Telefone</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Funcionários</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lojasMock.map((loja) => (
                      <tr key={loja.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                        <td style={{ padding: '12px', color: '#4B0082', fontWeight: 600 }}>{loja.nome}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{loja.endereco}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{loja.telefone}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            background: loja.ativa ? '#4caf50' : '#f44336',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {loja.ativa ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>
                          {loja.funcionarios}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button 
                              onClick={() => abrirModalLoja('editar', loja)}
                              style={{
                                background: '#7B3FBF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <FaEdit size={10} />
                              Editar
                            </button>
                            <button 
                              onClick={() => setConfirmacao({ 
                                aberto: true, 
                                tipo: 'loja', 
                                id: loja.id, 
                                nome: loja.nome 
                              })}
                              style={{
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <FaTrash size={10} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {abaAtiva === 'logs' && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #F3F0FA'
            }}>
              <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Logs de Atividade</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Data/Hora</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Usuário</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Ação</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>IP</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsMock.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #F3F0FA' }}>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{formatarData(log.data)}</td>
                        <td style={{ padding: '12px', color: '#4B0082', fontWeight: 600 }}>{log.usuario}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{log.acao}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{log.ip}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            background: log.status === 'sucesso' ? '#4caf50' : '#f44336',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de Usuário */}
          {modalUsuario.aberto && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                    {modalUsuario.modo === 'adicionar' ? 'Novo Usuário' : 'Editar Usuário'}
                  </h3>
                  <button 
                    onClick={fecharModalUsuario}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: 20
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formUsuario.nome}
                      onChange={(e) => setFormUsuario(prev => ({ ...prev, nome: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082'
                      }}
                      placeholder="Digite o nome completo"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formUsuario.email}
                      onChange={(e) => setFormUsuario(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082'
                      }}
                      placeholder="Digite o email"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Tipo
                    </label>
                    <select
                      value={formUsuario.tipo}
                      onChange={(e) => setFormUsuario(prev => ({ ...prev, tipo: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                    >
                      <option value="funcionario">Funcionário</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Loja
                    </label>
                    <select
                      value={formUsuario.loja}
                      onChange={(e) => setFormUsuario(prev => ({ ...prev, loja: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                    >
                      {lojasMock.map(loja => (
                        <option key={loja.id} value={loja.nome}>{loja.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      id="ativo"
                      checked={formUsuario.ativo}
                      onChange={(e) => setFormUsuario(prev => ({ ...prev, ativo: e.target.checked }))}
                      style={{ width: 18, height: 18 }}
                    />
                    <label htmlFor="ativo" style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>
                      Usuário Ativo
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={salvarUsuario}
                    style={{
                      flex: 1,
                      background: '#4B0082',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {modalUsuario.modo === 'adicionar' ? 'Adicionar' : 'Salvar'}
                  </button>
                  <button
                    onClick={fecharModalUsuario}
                    style={{
                      flex: 1,
                      background: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Loja */}
          {modalLoja.aberto && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                    {modalLoja.modo === 'adicionar' ? 'Nova Loja' : 'Editar Loja'}
                  </h3>
                  <button 
                    onClick={fecharModalLoja}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: 20
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formLoja.nome}
                      onChange={(e) => setFormLoja(prev => ({ ...prev, nome: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082'
                      }}
                      placeholder="Digite o nome da loja"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Endereço *
                    </label>
                    <input
                      type="text"
                      value={formLoja.endereco}
                      onChange={(e) => setFormLoja(prev => ({ ...prev, endereco: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082'
                      }}
                      placeholder="Digite o endereço completo"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      Telefone *
                    </label>
                    <input
                      type="text"
                      value={formLoja.telefone}
                      onChange={(e) => setFormLoja(prev => ({ ...prev, telefone: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        fontSize: 16,
                        color: '#4B0082'
                      }}
                      placeholder="Digite o telefone"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={salvarLoja}
                    style={{
                      flex: 1,
                      background: '#4B0082',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {modalLoja.modo === 'adicionar' ? 'Adicionar' : 'Salvar'}
                  </button>
                  <button
                    onClick={fecharModalLoja}
                    style={{
                      flex: 1,
                      background: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Confirmação */}
          {confirmacao.aberto && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                  Confirmar Exclusão
                </h3>
                <p style={{ color: '#666', fontSize: 16, marginBottom: 24 }}>
                  Tem certeza que deseja excluir {confirmacao.tipo === 'usuario' ? 'o usuário' : 'a loja'} <strong>{confirmacao.nome}</strong>?
                  <br />
                  Esta ação não pode ser desfeita.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      if (confirmacao.tipo === 'usuario') {
                        excluirUsuario(confirmacao.id);
                      } else {
                        excluirLoja(confirmacao.id);
                      }
                    }}
                    style={{
                      flex: 1,
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => setConfirmacao({ aberto: false, tipo: '', id: null, nome: '' })}
                    style={{
                      flex: 1,
                      background: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Layout responsivo que usa toda a largura disponível
// - Sistema de abas para organizar diferentes seções
// - Grid system para KPIs que se adapta ao tamanho da tela
// - Tabelas com scroll horizontal para mobile
// - Sistema de filtros completo
// - Gestão de usuários, lojas e logs de atividade
// - Integração futura: conectar com backend para dados reais
// - CRUD: implementar operações reais de criação, edição e exclusão
// - Logs: implementar sistema real de auditoria

export default AdminPage; 