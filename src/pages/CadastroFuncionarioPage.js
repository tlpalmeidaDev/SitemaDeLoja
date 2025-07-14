import React, { useState, useContext } from 'react';
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCheck, FaTimes, FaUndo, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

// Página de Cadastro de Funcionário com Foto Obrigatória
function CadastroFuncionarioPage() {
  const navigate = useNavigate();
  const { tipoUsuario } = useAuth();

  // Estados para dados do funcionário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cargo, setCargo] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Estados para foto
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [tirandoFoto, setTirandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState('');

  // Estados para validação e feedback
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState('');
  const [processando, setProcessando] = useState(false);

  // Refs para webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cargos disponíveis
  const cargos = [
    'Vendedor',
    'Caixa',
    'Estoquista',
    'Gerente',
    'Auxiliar',
    'Atendente',
    'Supervisor',
    'Administrativo'
  ];

  // Função para ativar webcam (compatível com mobile e desktop)
  const handleTirarFoto = async () => {
    setErroFoto('');
    setTirandoFoto(true);
    setFoto(null);
    setFotoPreview(null);
    
    try {
      // Configuração otimizada para mobile e desktop
      const constraints = {
        video: { 
          facingMode: 'user', // Usa câmera frontal para foto de perfil
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setErroFoto('Não foi possível acessar a câmera. Verifique as permissões ou tente outro dispositivo.');
      setTirandoFoto(false);
      
      // Fallback para upload de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Função para capturar foto
  const handleCapturar = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setFotoPreview(dataUrl);
      setTirandoFoto(false);
      
      // Parar webcam
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Função para confirmar foto
  const handleConfirmarFoto = () => {
    setFoto(fotoPreview);
    setFotoPreview(null);
    setErroFoto('');
  };

  // Função para refazer foto
  const handleRefazerFoto = () => {
    setFoto(null);
    setFotoPreview(null);
    setErroFoto('');
    handleTirarFoto();
  };

  // Função para upload de arquivo (fallback)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFoto(e.target.result);
        setErroFoto('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para validar CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpf.charAt(9)) === dv1 && parseInt(cpf.charAt(10)) === dv2;
  };

  // Função para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar telefone
  const validarTelefone = (telefone) => {
    const limpo = telefone.replace(/\D/g, '');
    return limpo.length >= 10 && limpo.length <= 11;
  };

  // Função para validar formulário
  const validarFormulario = () => {
    const novosErros = {};

    // Validar foto (OBRIGATÓRIA)
    if (!foto) {
      novosErros.foto = 'Foto do funcionário é obrigatória para cadastro e IA';
    }

    // Validar nome
    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar email
    if (!email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar telefone
    if (!telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!validarTelefone(telefone)) {
      novosErros.telefone = 'Telefone inválido';
    }

    // Validar endereço
    if (!endereco.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }

    // Validar cargo
    if (!cargo) {
      novosErros.cargo = 'Cargo é obrigatório';
    }

    // Validar CPF
    if (!cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    // Validar senha
    if (!senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (!confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme a senha';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'Senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para formatar CPF
  const formatarCPF = (value) => {
    const cpfLimpo = value.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatarTelefone = (value) => {
    const telefoneLimpo = value.replace(/\D/g, '');
    if (telefoneLimpo.length <= 10) {
      return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Função para submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      // Scroll para o primeiro erro
      const primeiroErro = document.querySelector('.erro-mensagem');
      if (primeiroErro) {
        primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setProcessando(true);
    setSucesso('');
    setErros({});

    try {
      // Simulação de cadastro (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSucesso('Funcionário cadastrado com sucesso! Redirecionando...');
      
      // Limpar formulário
      setTimeout(() => {
        setNome('');
        setEmail('');
        setTelefone('');
        setEndereco('');
        setCargo('');
        setCpf('');
        setSenha('');
        setConfirmarSenha('');
        setFoto(null);
        setFotoPreview(null);
        setSucesso('');
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setErros({ geral: 'Erro ao cadastrar funcionário. Tente novamente.' });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center" style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <div className="card" style={{ 
          background: '#fff', 
          color: '#4B0082', 
          boxShadow: '0 4px 24px rgba(75,0,130,0.10)', 
          maxWidth: '90%',
          width: '100%',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: 16
        }}>
          {/* Header da página */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 24, 
            padding: '24px 24px 16px 24px', 
            borderBottom: '1px solid #F3F0FA',
            flexWrap: 'wrap'
          }}>
            <FaUser size={28} color="#7B3FBF" />
            <h1 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: 0 }}>Cadastro de Funcionário</h1>
          </div>

          {/* Feedback de sucesso/erro */}
          {sucesso && (
            <div style={{ 
              background: '#e8f5e8', 
              color: '#2e7d32', 
              padding: '12px 24px', 
              margin: '0 24px 16px 24px',
              borderRadius: 8,
              border: '1px solid #c8e6c9',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaCheck size={16} />
              {sucesso}
            </div>
          )}

          {erros.geral && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '12px 24px', 
              margin: '0 24px 16px 24px',
              borderRadius: 8,
              border: '1px solid #ffcdd2',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaTimes size={16} />
              {erros.geral}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              
              {/* Coluna 1: Foto e Dados Pessoais */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Seção de Foto */}
                <div style={{ 
                  background: '#F3F0FA', 
                  borderRadius: 16, 
                  padding: 24,
                  border: erros.foto ? '2px solid #f44336' : '1px solid #e0e0e0'
                }}>
                  <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                    Foto do Funcionário <span style={{ color: '#f44336' }}>*</span>
                  </h3>
                  
                  <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                    Tire uma foto do rosto do funcionário para cadastro e reconhecimento IA
                  </p>

                  {!foto && !tirandoFoto && !fotoPreview ? (
                    <div style={{ textAlign: 'center' }}>
                      <button 
                        type="button"
                        onClick={handleTirarFoto}
                        style={{ 
                          background: '#7B3FBF', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 12, 
                          padding: '16px 32px', 
                          cursor: 'pointer', 
                          fontSize: 16,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          margin: '0 auto'
                        }}
                      >
                        <FaCamera size={20} />
                        Tirar Foto
                      </button>
                      
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      
                      <p style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
                        Ou clique aqui para selecionar arquivo
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {tirandoFoto && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <video 
                            ref={videoRef} 
                            style={{ 
                              width: '100%', 
                              maxWidth: 400, 
                              borderRadius: 12,
                              aspectRatio: '4/3'
                            }} 
                            autoPlay 
                            muted
                            playsInline
                          />
                          <button 
                            type="button"
                            onClick={handleCapturar}
                            style={{ 
                              background: '#4caf50', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: 12, 
                              padding: '12px 20px', 
                              fontSize: 16, 
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              margin: '0 auto'
                            }}
                          >
                            <FaCamera size={16} />
                            Capturar Foto
                          </button>
                        </div>
                      )}
                      
                      {fotoPreview && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <img 
                            src={fotoPreview} 
                            alt="Preview da foto" 
                            style={{ 
                              width: '100%', 
                              maxWidth: 400, 
                              borderRadius: 12,
                              aspectRatio: '4/3',
                              objectFit: 'cover',
                              border: '3px solid #7B3FBF'
                            }} 
                          />
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button 
                              type="button"
                              onClick={handleConfirmarFoto}
                              style={{ 
                                background: '#4caf50', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: 8, 
                                padding: '8px 16px', 
                                fontSize: 14, 
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <FaCheck size={14} />
                              Confirmar
                            </button>
                            <button 
                              type="button"
                              onClick={handleRefazerFoto}
                              style={{ 
                                background: '#f44336', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: 8, 
                                padding: '8px 16px', 
                                fontSize: 14, 
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <FaUndo size={14} />
                              Refazer
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {foto && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <img 
                            src={foto} 
                            alt="Foto do funcionário" 
                            style={{ 
                              width: '100%', 
                              maxWidth: 400, 
                              borderRadius: 12,
                              aspectRatio: '4/3',
                              objectFit: 'cover',
                              border: '3px solid #4caf50'
                            }} 
                          />
                          <button 
                            type="button"
                            onClick={handleRefazerFoto}
                            style={{ 
                              background: '#ff9800', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: 8, 
                              padding: '8px 16px', 
                              fontSize: 14, 
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              margin: '0 auto'
                            }}
                          >
                            <FaUndo size={14} />
                            Nova Foto
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {erroFoto && (
                    <div style={{ 
                      color: '#f44336', 
                      background: '#ffebee', 
                      borderRadius: 8, 
                      padding: 12, 
                      marginTop: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      fontSize: 14
                    }}>
                      <FaTimes size={14} />
                      {erroFoto}
                    </div>
                  )}
                  
                  {erros.foto && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 14, 
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <FaTimes size={12} />
                      {erros.foto}
                    </div>
                  )}
                </div>

                {/* Nome */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Nome Completo <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: erros.nome ? '2px solid #f44336' : '2px solid #e0e0e0', 
                      borderRadius: 8, 
                      fontSize: 16,
                      color: '#4B0082',
                      background: '#fff'
                    }}
                    placeholder="Digite o nome completo"
                  />
                  {erros.nome && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.nome}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Email <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.email ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="email@exemplo.com"
                    />
                    <FaEnvelope size={16} color="#7B3FBF" style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} />
                  </div>
                  {erros.email && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.email}
                    </div>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Telefone <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.telefone ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="(11) 99999-9999"
                    />
                    <FaPhone size={16} color="#7B3FBF" style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} />
                  </div>
                  {erros.telefone && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.telefone}
                    </div>
                  )}
                </div>

                {/* Endereço */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Endereço <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.endereco ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="Rua, número, bairro, cidade"
                    />
                    <FaMapMarkerAlt size={16} color="#7B3FBF" style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} />
                  </div>
                  {erros.endereco && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.endereco}
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna 2: Dados Profissionais e Senha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Cargo */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Cargo <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: erros.cargo ? '2px solid #f44336' : '2px solid #e0e0e0', 
                      borderRadius: 8, 
                      fontSize: 16,
                      color: '#4B0082',
                      background: '#fff'
                    }}
                  >
                    <option value="">Selecione um cargo</option>
                    {cargos.map(cargoOption => (
                      <option key={cargoOption} value={cargoOption}>{cargoOption}</option>
                    ))}
                  </select>
                  {erros.cargo && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.cargo}
                    </div>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    CPF <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(formatarCPF(e.target.value))}
                      maxLength="14"
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.cpf ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="000.000.000-00"
                    />
                    <FaIdCard size={16} color="#7B3FBF" style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} />
                  </div>
                  {erros.cpf && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.cpf}
                    </div>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Senha <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.senha ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      style={{ 
                        position: 'absolute', 
                        right: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#7B3FBF'
                      }}
                    >
                      {mostrarSenha ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {erros.senha && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.senha}
                    </div>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label style={{ display: 'block', color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Confirmar Senha <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 12px', 
                        border: erros.confirmarSenha ? '2px solid #f44336' : '2px solid #e0e0e0', 
                        borderRadius: 8, 
                        fontSize: 16,
                        color: '#4B0082',
                        background: '#fff'
                      }}
                      placeholder="Confirme a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      style={{ 
                        position: 'absolute', 
                        right: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#7B3FBF'
                      }}
                    >
                      {mostrarConfirmarSenha ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {erros.confirmarSenha && (
                    <div className="erro-mensagem" style={{ 
                      color: '#f44336', 
                      fontSize: 12, 
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FaTimes size={10} />
                      {erros.confirmarSenha}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Cadastrar */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button 
                type="submit"
                disabled={processando}
                style={{ 
                  background: '#4B0082', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 12, 
                  padding: '16px 32px', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  cursor: processando ? 'not-allowed' : 'pointer',
                  opacity: processando ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: '0 auto'
                }}
              >
                {processando ? (
                  <>
                    <div style={{ 
                      width: 20, 
                      height: 20, 
                      border: '2px solid #fff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <FaUser size={20} />
                    Cadastrar Funcionário
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Elementos ocultos para webcam */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* CSS para animações */}
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Foto obrigatória via webcam ou upload de arquivo
// - Validação completa de todos os campos obrigatórios
// - Formatação automática de CPF e telefone
// - Validação de CPF com algoritmo real
// - Validação de email com regex
// - Feedback visual claro para erros e sucesso
// - Layout responsivo com grid system
// - Compatibilidade mobile/desktop para webcam
// - Integração futura: conectar com backend para cadastro real
// - IA: implementar reconhecimento facial real
// - Segurança: implementar hash de senha no backend
// - Validação: adicionar validação de CPF único no backend

export default CadastroFuncionarioPage; 