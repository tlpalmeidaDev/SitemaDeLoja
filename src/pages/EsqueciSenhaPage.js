import React, { useState } from 'react';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Página de recuperação de senha
function EsqueciSenhaPage() {
  // Estados locais para o formulário
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica do e-mail
    if (!email.trim() || !email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }

    setEnviando(true);
    setErro('');

    // Simulação de envio (mock - futuramente será integrado ao backend)
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock: sempre sucesso para demonstração
      // Futuramente: integração com backend para envio real de e-mail
      setEnviado(true);
      setEnviando(false);
    } catch (error) {
      setErro('Erro ao enviar e-mail. Tente novamente.');
      setEnviando(false);
    }
  };

  // Função para voltar ao login
  const handleVoltar = (e) => {
    e && e.preventDefault();
    navigate('/login');
  };

  // Função para tentar novamente
  const handleTentarNovamente = () => {
    setEnviado(false);
    setEmail('');
    setErro('');
  };

  return (
    <div className="page-center">
      <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)', maxWidth: 420 }}>
        {/* Título da página */}
        <div className="card-title" style={{ color: '#4B0082', fontSize: 22, marginBottom: 18, fontWeight: 600, letterSpacing: 0.5, textAlign: 'center' }}>
          Recuperar Senha
        </div>

        {!enviado ? (
          <>
            {/* Descrição */}
            <div style={{ color: '#7B3FBF', fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 1.4 }}>
              Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
            </div>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {/* Campo de e-mail */}
              <div className="input-wrapper">
                <label htmlFor="email" className="label" style={{ color: '#4B0082' }}>E-mail</label>
                <FaEnvelope className="input-icon" style={{ color: '#7B3FBF' }} />
                <input
                  id="email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                  required
                  disabled={enviando}
                />
              </div>

              {/* Feedback de erro */}
              {erro && (
                <div style={{ color: '#d32f2f', background: '#ffebee', borderRadius: 8, padding: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaExclamationTriangle size={16} />
                  {erro}
                </div>
              )}

              {/* Botão de envio */}
              <button 
                type="submit" 
                className="button" 
                style={{ 
                  background: '#4B0082', 
                  color: '#fff', 
                  fontWeight: 600, 
                  fontSize: 18, 
                  margin: '10px 0 8px 0',
                  opacity: enviando ? 0.7 : 1,
                  cursor: enviando ? 'not-allowed' : 'pointer'
                }}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>

            {/* Link para voltar ao login */}
            <div style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
              <a href="/login" className="link" style={{ color: '#7B3FBF', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handleVoltar}>
                <FaArrowLeft size={14} />
                Voltar para login
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Mensagem de sucesso */}
            <div style={{ color: '#2d5a2d', background: '#e8f5e8', borderRadius: 8, padding: 20, textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <FaCheckCircle size={32} color="#2d5a2d" />
              <div style={{ fontWeight: 600, fontSize: 18 }}>E-mail enviado!</div>
              <div style={{ fontSize: 15, lineHeight: 1.4 }}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </div>
            </div>

            {/* Botões após sucesso */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                className="button" 
                style={{ background: '#7B3FBF', color: '#fff', fontWeight: 600, fontSize: 16 }} 
                onClick={handleTentarNovamente}
              >
                Enviar para outro e-mail
              </button>
              <button 
                className="button" 
                style={{ background: '#4B0082', color: '#fff', fontWeight: 600, fontSize: 16 }} 
                onClick={handleVoltar}
              >
                Voltar para login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - O formulário valida e-mail básico antes do envio
// - Simulação de delay de rede para experiência realista
// - Feedback visual para sucesso e erro
// - Integração futura: conectar com backend para envio real de e-mail
// - Layout responsivo e visual roxo seguindo padrão do sistema
// - Estados de loading e sucesso bem definidos

export default EsqueciSenhaPage; 