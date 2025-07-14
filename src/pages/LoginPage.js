import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Página de Login com sistema de autenticação completo
function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Função para fazer login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const resultado = login(email, senha);
      
      if (resultado.sucesso) {
        setSucesso(resultado.mensagem);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setErro(resultado.mensagem);
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar mensagens
  const limparMensagens = () => {
    setErro('');
    setSucesso('');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        background: '#fff',
        borderRadius: 16,
        padding: '40px',
        boxShadow: '0 8px 32px rgba(75,0,130,0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <FaUser size={32} color="#fff" />
          </div>
          <h1 style={{ 
            color: '#4B0082', 
            fontSize: '28px', 
            fontWeight: '600', 
            margin: '0 0 8px 0' 
          }}>
            Login
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            margin: 0 
          }}>
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Mensagens de feedback */}
        {erro && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '12px', 
            borderRadius: 8,
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '14px'
          }}>
            <FaSignInAlt size={14} />
            {erro}
          </div>
        )}

        {sucesso && (
          <div style={{ 
            background: '#e8f5e8', 
            color: '#2e7d32', 
            padding: '12px', 
            borderRadius: 8,
            marginBottom: '20px',
            border: '1px solid #c8e6c9',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '14px'
          }}>
            <FaSignInAlt size={14} />
            {sucesso}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          {/* Campo Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#4B0082', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  limparMensagens();
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 40px 12px 12px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: 8, 
                  fontSize: '16px',
                  color: '#4B0082',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
                placeholder="Digite seu email"
                disabled={loading}
              />
              <FaUser size={16} color="#7B3FBF" style={{ 
                position: 'absolute', 
                right: 12, 
                top: '50%', 
                transform: 'translateY(-50%)' 
              }} />
            </div>
          </div>

          {/* Campo Senha */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#4B0082', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  limparMensagens();
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 40px 12px 12px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: 8, 
                  fontSize: '16px',
                  color: '#4B0082',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
                placeholder="Digite sua senha"
                disabled={loading}
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
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              background: '#4B0082', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '14px', 
              fontSize: '16px', 
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {loading ? (
              <>
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  border: '2px solid #fff', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Entrando...
              </>
            ) : (
              <>
                <FaSignInAlt size={18} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Informações de teste */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#F3F0FA', 
          borderRadius: 8,
          fontSize: '12px',
          color: '#666'
        }}>
          <strong style={{ color: '#4B0082' }}>Usuários de Teste:</strong>
          <br />
          <strong>Administrador:</strong> joao@email.com / 123456
          <br />
          <strong>Funcionário:</strong> maria@email.com / 123456
          <br />
          <strong>Usuário Inativo:</strong> pedro@email.com / 123456
        </div>

        {/* CSS para animações */}
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default LoginPage; 