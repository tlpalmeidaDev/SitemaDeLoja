import React, { useState, useRef, useContext } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaStore, FaCamera, FaRedo, FaEdit, FaLock, FaSave, FaTimes } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Página de Perfil do Usuário
function PerfilPage() {
  // Contexto de autenticação para obter dados do usuário
  const { tipoUsuario, lojas } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para dados do usuário (mock - futuramente virá do contexto/backend)
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    tipo: tipoUsuario || 'funcionario',
    loja: lojas[0]?.label || 'Loja Centro',
    foto: null, // Foto em base64
  });

  // Estados para controle de edição
  const [editando, setEditando] = useState(false);
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [trocandoFoto, setTrocandoFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  // Estados para campos de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Refs para webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Função para ativar webcam
  const handleTirarFoto = async () => {
    setErro('');
    setTrocandoFoto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setErro('Não foi possível acessar a câmera. Permita o acesso ou tente outro dispositivo.');
      setTrocandoFoto(false);
    }
  };

  // Função para capturar foto
  const handleCapturar = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setDadosUsuario(prev => ({ ...prev, foto: dataUrl }));
      setTrocandoFoto(false);
      // Parar webcam
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Função para refazer foto
  const handleRefazerFoto = () => {
    setDadosUsuario(prev => ({ ...prev, foto: null }));
    setTrocandoFoto(false);
    handleTirarFoto();
  };

  // Função para salvar alterações
  const handleSalvar = async () => {
    setSalvando(true);
    setErro('');
    setSucesso('');

    // Validações
    if (!dadosUsuario.nome.trim()) {
      setErro('Nome é obrigatório.');
      setSalvando(false);
      return;
    }

    if (!dadosUsuario.email.includes('@')) {
      setErro('E-mail inválido.');
      setSalvando(false);
      return;
    }

    if (trocandoSenha) {
      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        setErro('Preencha todos os campos de senha.');
        setSalvando(false);
        return;
      }
      if (novaSenha !== confirmarSenha) {
        setErro('Nova senha e confirmação não coincidem.');
        setSalvando(false);
        return;
      }
      if (novaSenha.length < 6) {
        setErro('Nova senha deve ter pelo menos 6 caracteres.');
        setSalvando(false);
        return;
      }
    }

    try {
      // Simulação de salvamento (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSucesso('Perfil atualizado com sucesso!');
      setEditando(false);
      setTrocandoSenha(false);
      setTrocandoFoto(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      
      // Limpar sucesso após 3 segundos
      setTimeout(() => setSucesso(''), 3000);
    } catch (error) {
      setErro('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Função para cancelar edição
  const handleCancelar = () => {
    setEditando(false);
    setTrocandoSenha(false);
    setTrocandoFoto(false);
    setErro('');
    setSucesso('');
    // Resetar dados para valores originais (mock)
    setDadosUsuario({
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      tipo: tipoUsuario || 'funcionario',
      loja: lojas[0]?.label || 'Loja Centro',
      foto: dadosUsuario.foto, // Manter foto atual
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center" style={{ padding: '20px' }}>
        <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)', maxWidth: 600, width: '100%' }}>
          {/* Header do perfil */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid #F3F0FA' }}>
            {/* Foto de perfil */}
            <div style={{ position: 'relative' }}>
              {dadosUsuario.foto ? (
                <img 
                  src={dadosUsuario.foto} 
                  alt="Foto de perfil" 
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7B3FBF' }}
                />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F3F0FA', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #7B3FBF' }}>
                  <FaUser size={32} color="#7B3FBF" />
                </div>
              )}
              {/* Botão para trocar foto */}
              <button 
                onClick={() => setTrocandoFoto(!trocandoFoto)}
                style={{ position: 'absolute', bottom: 0, right: 0, background: '#7B3FBF', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <FaCamera size={12} color="#fff" />
              </button>
            </div>
            
            {/* Informações básicas */}
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: '0 0 4px 0' }}>
                {dadosUsuario.nome}
              </h2>
              <p style={{ color: '#7B3FBF', fontSize: 16, margin: '0 0 4px 0' }}>
                {dadosUsuario.tipo === 'administrador' ? 'Administrador' : 'Funcionário'}
              </p>
              <p style={{ color: '#A080FF', fontSize: 14, margin: 0 }}>
                {dadosUsuario.loja}
              </p>
            </div>

            {/* Botão editar */}
            {!editando && (
              <button 
                onClick={() => setEditando(true)}
                style={{ background: '#4B0082', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <FaEdit size={16} />
                Editar
              </button>
            )}
          </div>

          {/* Feedback de sucesso/erro */}
          {sucesso && (
            <div style={{ color: '#2d5a2d', background: '#e8f5e8', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaSave size={16} />
              {sucesso}
            </div>
          )}
          {erro && (
            <div style={{ color: '#d32f2f', background: '#ffebee', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaTimes size={16} />
              {erro}
            </div>
          )}

          {/* Área de troca de foto */}
          {trocandoFoto && (
            <div style={{ background: '#F3F0FA', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <h3 style={{ color: '#4B0082', fontSize: 18, marginBottom: 16 }}>Trocar Foto de Perfil</h3>
              {!dadosUsuario.foto && !trocandoFoto ? (
                <button 
                  onClick={handleTirarFoto}
                  style={{ background: '#7B3FBF', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <FaCamera size={16} />
                  Tirar Foto
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {trocandoFoto && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <video 
                        ref={videoRef} 
                        style={{ width: '100%', maxWidth: 300, borderRadius: 8 }}
                        autoPlay 
                        muted
                      />
                      <button 
                        onClick={handleCapturar}
                        style={{ background: '#4B0082', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Capturar Foto
                      </button>
                    </div>
                  )}
                  {dadosUsuario.foto && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <img 
                        src={dadosUsuario.foto} 
                        alt="Nova foto" 
                        style={{ width: '100%', maxWidth: 300, borderRadius: 8 }}
                      />
                      <button 
                        onClick={handleRefazerFoto}
                        style={{ background: '#7B3FBF', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      >
                        <FaRedo size={16} />
                        Refazer Foto
                      </button>
                    </div>
                  )}
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}

          {/* Formulário de dados */}
          <form onSubmit={(e) => { e.preventDefault(); handleSalvar(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Nome */}
            <div className="input-wrapper">
              <label htmlFor="nome" className="label" style={{ color: '#4B0082' }}>Nome Completo</label>
              <FaUser className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="nome"
                className="input"
                type="text"
                value={dadosUsuario.nome}
                onChange={e => setDadosUsuario(prev => ({ ...prev, nome: e.target.value }))}
                disabled={!editando}
                style={{ background: editando ? '#F3F0FA' : '#f8f8f8', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>

            {/* Email */}
            <div className="input-wrapper">
              <label htmlFor="email" className="label" style={{ color: '#4B0082' }}>E-mail</label>
              <FaEnvelope className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="email"
                className="input"
                type="email"
                value={dadosUsuario.email}
                onChange={e => setDadosUsuario(prev => ({ ...prev, email: e.target.value }))}
                disabled={!editando}
                style={{ background: editando ? '#F3F0FA' : '#f8f8f8', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>

            {/* Telefone */}
            <div className="input-wrapper">
              <label htmlFor="telefone" className="label" style={{ color: '#4B0082' }}>Telefone</label>
              <FaPhone className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="telefone"
                className="input"
                type="tel"
                value={dadosUsuario.telefone}
                onChange={e => setDadosUsuario(prev => ({ ...prev, telefone: e.target.value }))}
                disabled={!editando}
                style={{ background: editando ? '#F3F0FA' : '#f8f8f8', color: '#4B0082', borderRadius: '18px' }}
              />
            </div>

            {/* Loja (somente leitura) */}
            <div className="input-wrapper">
              <label htmlFor="loja" className="label" style={{ color: '#4B0082' }}>Loja Vinculada</label>
              <FaStore className="input-icon" style={{ color: '#A080FF' }} />
              <input
                id="loja"
                className="input"
                type="text"
                value={dadosUsuario.loja}
                disabled
                style={{ background: '#f8f8f8', color: '#7B3FBF', borderRadius: '18px' }}
              />
            </div>

            {/* Toggle para trocar senha */}
            {editando && (
              <div style={{ background: '#F3F0FA', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: trocandoSenha ? 16 : 0 }}>
                  <h3 style={{ color: '#4B0082', fontSize: 18, margin: 0 }}>Alterar Senha</h3>
                  <button 
                    type="button"
                    onClick={() => setTrocandoSenha(!trocandoSenha)}
                    style={{ background: 'none', border: 'none', color: '#7B3FBF', cursor: 'pointer', fontSize: 16, fontWeight: 600 }}
                  >
                    {trocandoSenha ? 'Cancelar' : 'Trocar Senha'}
                  </button>
                </div>
                
                {trocandoSenha && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="input-wrapper">
                      <label htmlFor="senhaAtual" className="label" style={{ color: '#4B0082' }}>Senha Atual</label>
                      <FaLock className="input-icon" style={{ color: '#7B3FBF' }} />
                      <input
                        id="senhaAtual"
                        className="input"
                        type="password"
                        value={senhaAtual}
                        onChange={e => setSenhaAtual(e.target.value)}
                        style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                        required={trocandoSenha}
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="novaSenha" className="label" style={{ color: '#4B0082' }}>Nova Senha</label>
                      <FaLock className="input-icon" style={{ color: '#7B3FBF' }} />
                      <input
                        id="novaSenha"
                        className="input"
                        type="password"
                        value={novaSenha}
                        onChange={e => setNovaSenha(e.target.value)}
                        style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                        required={trocandoSenha}
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="confirmarSenha" className="label" style={{ color: '#4B0082' }}>Confirmar Nova Senha</label>
                      <FaLock className="input-icon" style={{ color: '#A080FF' }} />
                      <input
                        id="confirmarSenha"
                        className="input"
                        type="password"
                        value={confirmarSenha}
                        onChange={e => setConfirmarSenha(e.target.value)}
                        style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                        required={trocandoSenha}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de ação */}
            {editando && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button 
                  type="button"
                  onClick={handleCancelar}
                  style={{ flex: 1, background: '#f8f8f8', color: '#4B0082', border: '2px solid #7B3FBF', borderRadius: 12, padding: '14px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={salvando}
                  style={{ 
                    flex: 1, 
                    background: '#4B0082', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '14px 20px', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    cursor: salvando ? 'not-allowed' : 'pointer',
                    opacity: salvando ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  {salvando ? 'Salvando...' : (
                    <>
                      <FaSave size={16} />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Dados do usuário são mockados, prontos para integração com AuthContext/backend
// - Validações completas antes de salvar (nome, email, senhas)
// - Captura de foto via webcam igual ao cadastro de funcionário
// - Estados de loading, sucesso e erro bem definidos
// - Layout responsivo e visual roxo seguindo padrão do sistema
// - Integração futura: conectar com backend para persistir alterações
// - Foto em base64 pronta para envio ao backend/IA

export default PerfilPage; 