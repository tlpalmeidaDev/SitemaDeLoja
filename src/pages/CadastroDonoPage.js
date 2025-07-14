import React, { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Página de cadastro de Administrador (antigo Dono) com visual roxo moderno
function CadastroDonoPage() {
  const { tipoUsuario } = useAuth();
  // Estados locais para os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const navigate = useNavigate();

  // Função para lidar com o submit (sem lógica de envio ainda)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui futuramente será feito o cadastro do Administrador
  };

  // Voltar ao login
  const handleVoltar = (e) => {
    e && e.preventDefault();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center">
        <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)' }}>
          {/* Título grande */}
          <div className="card-title" style={{ color: '#4B0082', fontSize: 22, marginBottom: 18, fontWeight: 600, letterSpacing: 0.5 }}>Cadastrar Administrador</div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Nome completo */}
            <div className="input-wrapper">
              <label htmlFor="nome" className="label" style={{ color: '#4B0082' }}>Nome Completo</label>
              <FaUser className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="nome"
                className="input"
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome completo"
                style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>
            {/* Email */}
            <div className="input-wrapper">
              <label htmlFor="email" className="label" style={{ color: '#4B0082' }}>Email</label>
              <FaEnvelope className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>
            {/* Senha */}
            <div className="input-wrapper">
              <label htmlFor="senha" className="label" style={{ color: '#4B0082' }}>Senha</label>
              <FaLock className="input-icon" style={{ color: '#7B3FBF' }} />
              <input
                id="senha"
                className="input"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Senha"
                style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>
            {/* Confirmar senha */}
            <div className="input-wrapper">
              <label htmlFor="confirmarSenha" className="label" style={{ color: '#4B0082' }}>Confirmar Senha</label>
              <FaLock className="input-icon" style={{ color: '#A080FF' }} />
              <input
                id="confirmarSenha"
                className="input"
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar senha"
                style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
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
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="Telefone"
                style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                required
              />
            </div>
            {/* Botão cadastrar */}
            <button type="submit" className="button" style={{ background: '#4B0082', color: '#fff', fontWeight: 600, fontSize: 18, margin: '10px 0 8px 0' }}>
              Cadastrar
            </button>
            {/* Link para voltar ao login */}
            <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
              <a href="/login" className="link" style={{ color: '#7B3FBF', fontWeight: 600 }} onClick={handleVoltar}>
                Voltar para login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroDonoPage; 