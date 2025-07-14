import React, { useState, useEffect } from 'react';
import { FaVideo, FaExclamationTriangle, FaPlay, FaPause, FaExpand, FaDownload, FaEye, FaBell, FaCog, FaSync, FaWifi, FaTimesCircle, FaChartLine, FaChartBar, FaStore, FaUser, FaCheckCircle } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import './MonitorPage.css'; // Importando CSS customizado para dark mode

// Página de Monitoramento com visual tech/dark
function MonitorPage() {
  // Estados para monitoramento
  const [cameras, setCameras] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cameraAtiva, setCameraAtiva] = useState(null);
  const [modoTelaCheia, setModoTelaCheia] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);

  // Novo estado para filtro de data/câmera
  const [filtroData, setFiltroData] = useState('');
  const [filtroCamera, setFiltroCamera] = useState('');

  const { tipoUsuario } = useAuth();

  // Dados mockados de câmeras
  const camerasMock = [
    { id: 1, nome: 'Câmera Entrada', localizacao: 'Entrada Principal', status: 'ativa', stream: 'rtsp://camera1.local', ultimaAtividade: '2024-01-15T10:30:00' },
    { id: 2, nome: 'Câmera Caixa', localizacao: 'Área de Caixa', status: 'ativa', stream: 'rtsp://camera2.local', ultimaAtividade: '2024-01-15T10:25:00' },
    { id: 3, nome: 'Câmera Estoque', localizacao: 'Depósito', status: 'inativa', stream: 'rtsp://camera3.local', ultimaAtividade: '2024-01-15T09:45:00' },
    { id: 4, nome: 'Câmera Estacionamento', localizacao: 'Estacionamento', status: 'ativa', stream: 'rtsp://camera4.local', ultimaAtividade: '2024-01-15T10:28:00' },
    { id: 5, nome: 'Câmera Corredor', localizacao: 'Corredor Principal', status: 'ativa', stream: 'rtsp://camera5.local', ultimaAtividade: '2024-01-15T10:32:00' },
    { id: 6, nome: 'Câmera Saída', localizacao: 'Saída de Emergência', status: 'ativa', stream: 'rtsp://camera6.local', ultimaAtividade: '2024-01-15T10:29:00' },
  ];

  // Dados mockados de alertas
  const alertasMock = [
    { id: 1, tipo: 'movimento', camera: 'Câmera Entrada', descricao: 'Movimento detectado na entrada', timestamp: '2024-01-15T10:30:00', prioridade: 'alta', status: 'não lido' },
    { id: 2, tipo: 'face', camera: 'Câmera Caixa', descricao: 'Rosto reconhecido: João Silva', timestamp: '2024-01-15T10:25:00', prioridade: 'média', status: 'lido' },
    { id: 3, tipo: 'objeto', camera: 'Câmera Estoque', descricao: 'Objeto deixado na área', timestamp: '2024-01-15T09:45:00', prioridade: 'baixa', status: 'não lido' },
    { id: 4, tipo: 'movimento', camera: 'Câmera Estacionamento', descricao: 'Veículo detectado', timestamp: '2024-01-15T10:28:00', prioridade: 'média', status: 'lido' },
  ];

  // Dados mockados de eventos
  const eventosMock = [
    { id: 1, tipo: 'login', usuario: 'João Silva', camera: 'Câmera Entrada', timestamp: '2024-01-15T10:30:00', confianca: 95 },
    { id: 2, tipo: 'venda', usuario: 'Maria Santos', camera: 'Câmera Caixa', timestamp: '2024-01-15T10:25:00', confianca: 88 },
    { id: 3, tipo: 'estoque', usuario: 'Pedro Costa', camera: 'Câmera Estoque', timestamp: '2024-01-15T09:45:00', confianca: 92 },
    { id: 4, tipo: 'entrada', usuario: 'Ana Oliveira', camera: 'Câmera Estacionamento', timestamp: '2024-01-15T10:28:00', confianca: 87 },
  ];

  // Calcular KPIs
  const calcularKPIs = () => {
    const totalCameras = camerasMock.length;
    const camerasAtivas = camerasMock.filter(c => c.status === 'ativa').length;
    const alertasNaoLidos = alertasMock.filter(a => a.status === 'não lido').length;
    const eventosHoje = eventosMock.filter(e => 
      new Date(e.timestamp).toDateString() === new Date().toDateString()
    ).length;

    return {
      totalCameras,
      camerasAtivas,
      alertasNaoLidos,
      eventosHoje
    };
  };

  const kpis = calcularKPIs();

  // Filtrar eventos
  const eventosFiltrados = eventosMock.filter(evento => {
    return filtroTipo === 'todos' || evento.tipo === filtroTipo;
  });

  // Função para filtrar alertas por data/câmera
  const alertasFiltrados = alertas.filter(a => {
    const dataOk = !filtroData || a.timestamp.startsWith(filtroData);
    const cameraOk = !filtroCamera || a.camera === filtroCamera;
    return dataOk && cameraOk;
  });

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

  // Função para obter cor da prioridade
  const getCorPrioridade = (prioridade) => {
    switch (prioridade) {
      case 'alta': return '#f44336';
      case 'média': return '#ff9800';
      case 'baixa': return '#4caf50';
      default: return '#999';
    }
  };

  // Função para obter ícone do tipo de evento
  const getIconeEvento = (tipo) => {
    switch (tipo) {
      case 'movimento': return <FaEye size={12} />;
      case 'face': return <FaEye size={12} />;
      case 'objeto': return <FaExclamationTriangle size={12} />;
      case 'login': return <FaEye size={12} />;
      case 'venda': return <FaEye size={12} />;
      case 'estoque': return <FaEye size={12} />;
      case 'entrada': return <FaEye size={12} />;
      default: return <FaEye size={12} />;
    }
  };

  // Carregar dados mockados
  useEffect(() => {
    setCameras(camerasMock);
    setAlertas(alertasMock);
    setEventos(eventosMock);
  }, []);

  return (
    <div className="monitor-root">
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="monitor-container">
        {/* Header */}
        <header className="monitor-header">
          <div className="monitor-title">
            <FaVideo size={28} color="#A259FF" />
            <h1>Monitoramento</h1>
          </div>
          <div className="monitor-actions">
            <button className="monitor-btn monitor-btn-config" onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}>
              <FaCog /> Configurações
            </button>
            <button className="monitor-btn monitor-btn-full" onClick={() => setModoTelaCheia(!modoTelaCheia)}>
              <FaExpand /> {modoTelaCheia ? 'Sair da Tela Cheia' : 'Tela Cheia'}
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section className="monitor-kpis">
          <div className="monitor-kpi-grid">
            <div className="monitor-kpi-card">
              <div className="kpi-icon"><FaVideo size={20} /></div>
              <div className="kpi-value">{kpis.totalCameras}</div>
              <div className="kpi-label">Total de Câmeras</div>
            </div>
            <div className="monitor-kpi-card">
              <div className="kpi-icon"><FaPlay size={20} /></div>
              <div className="kpi-value">{kpis.camerasAtivas}</div>
              <div className="kpi-label">Câmeras Ativas</div>
            </div>
            <div className="monitor-kpi-card">
              <div className="kpi-icon"><FaBell size={20} /></div>
              <div className="kpi-value">{kpis.alertasNaoLidos}</div>
              <div className="kpi-label">Alertas Não Lidos</div>
            </div>
            <div className="monitor-kpi-card">
              <div className="kpi-icon"><FaEye size={20} /></div>
              <div className="kpi-value">{kpis.eventosHoje}</div>
              <div className="kpi-label">Eventos Hoje</div>
            </div>
          </div>
        </section>

        {/* Grid de Câmeras */}
        <section className="monitor-cameras">
          <h3>Câmeras em Tempo Real</h3>
          <div className="monitor-grid">
            {cameras.map((camera) => (
              <div 
                key={camera.id}
                className={`monitor-camera-card ${camera.status === 'ativa' ? 'online' : 'offline'}`}
                onClick={() => setCameraAtiva(camera)}
              >
                <div className="monitor-camera-video">
                  {/* Placeholder animado para vídeo */}
                  <div className="video-placeholder">
                    <FaVideo size={48} />
                    <span className={`status-dot ${camera.status === 'ativa' ? 'dot-online' : 'dot-offline'}`}></span>
                  </div>
                  <div className={`camera-status-badge ${camera.status === 'ativa' ? 'badge-online' : 'badge-offline'}`}>{camera.status === 'ativa' ? 'LIVE' : 'OFFLINE'}</div>
                </div>
                <div className="monitor-camera-info">
                  <div className="camera-nome">{camera.nome}</div>
                  <div className="camera-local">{camera.localizacao}</div>
                  <div className="camera-ultima">Última atividade: {formatarData(camera.ultimaAtividade)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filtros de Alertas */}
        <section className="monitor-filtros">
          <input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)} className="monitor-input" />
          <select value={filtroCamera} onChange={e => setFiltroCamera(e.target.value)} className="monitor-input">
            <option value="">Todas as Câmeras</option>
            {cameras.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
          </select>
        </section>

        {/* Alertas em Tempo Real */}
        <section className="monitor-alertas">
          <h3>Alertas em Tempo Real</h3>
          <div className="alertas-lista">
            {alertasFiltrados.map((alerta) => (
              <div key={alerta.id} className={`alerta-card alerta-${alerta.prioridade} ${alerta.status === 'não lido' ? 'alerta-animado' : ''}`}>
                <div className="alerta-header">
                  <span className="alerta-camera">{alerta.camera}</span>
                  <span className="alerta-badge">{alerta.prioridade.toUpperCase()}</span>
                </div>
                <div className="alerta-desc">{alerta.descricao}</div>
                <div className="alerta-data">{formatarData(alerta.timestamp)}</div>
              </div>
            ))}
            {alertasFiltrados.length === 0 && <div className="alerta-vazio">Nenhum alerta encontrado.</div>}
          </div>
        </section>

        {/* Modal de Câmera Ativa (simulação de gravação) */}
        {cameraAtiva && (
          <div className="monitor-modal-bg" onClick={() => setCameraAtiva(null)}>
            <div className="monitor-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{cameraAtiva.nome} - {cameraAtiva.localizacao}</h3>
                <button className="modal-close" onClick={() => setCameraAtiva(null)}>×</button>
              </div>
              <div className="modal-video">
                <div className="video-placeholder grande">
                  <FaVideo size={64} />
                </div>
                <div className="camera-status-badge badge-online">LIVE</div>
              </div>
              <div className="modal-actions">
                <button className="monitor-btn monitor-btn-play"><FaPlay /> Play</button>
                <button className="monitor-btn monitor-btn-pause"><FaPause /> Pause</button>
                <button className="monitor-btn monitor-btn-download"><FaDownload /> Gravar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Visual tech/dark, responsivo, com animações e feedback visual
// - Grid de câmeras com status e modal de gravação
// - Alertas destacados e filtráveis
// - Pronto para integração futura

export default MonitorPage; 