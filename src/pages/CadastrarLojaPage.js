import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

// Página de cadastro de nova loja
function CadastrarLojaPage() {
  // Estados locais para os campos do formulário
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Contexto para adicionar loja
  const { adicionarLoja } = useContext(AuthContext);
  const navigate = useNavigate();
  const { tipoUsuario } = useAuth();

  // Validação simples e cadastro mock
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !endereco.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    // Adiciona nova loja ao contexto (mock, integração futura com backend)
    adicionarLoja({ value: `loja${Date.now()}`, label: nome });
    setSucesso(true);
    setErro('');
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
        <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)', maxWidth: 420 }}>
          <div className="card-title" style={{ color: '#4B0082', fontSize: 22, marginBottom: 18, fontWeight: 600, letterSpacing: 0.5 }}>Cadastrar Nova Loja</div>
          {!sucesso ? (
            <>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                {/* Campo nome da loja */}
                <div className="input-wrapper">
                  <label htmlFor="nome" className="label" style={{ color: '#4B0082' }}>Nome da loja</label>
                  <FaStore className="input-icon" style={{ color: '#7B3FBF' }} />
                  <input
                    id="nome"
                    className="input"
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Ex: Loja Centro"
                    style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                    required
                  />
                </div>
                {/* Campo endereço completo */}
                <div className="input-wrapper">
                  <label htmlFor="endereco" className="label" style={{ color: '#4B0082' }}>Endereço completo</label>
                  <FaMapMarkerAlt className="input-icon" style={{ color: '#A080FF' }} />
                  <input
                    id="endereco"
                    className="input"
                    type="text"
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro, cidade, UF"
                    style={{ background: '#F3F0FA', color: '#4B0082', borderRadius: '18px' }}
                    required
                  />
                </div>
                {/* Feedback de erro */}
                {erro && <div style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{erro}</div>}
                {/* Botão cadastrar loja */}
                <button type="submit" className="button" style={{ background: '#4B0082', color: '#fff', fontWeight: 600, fontSize: 18, margin: '10px 0 8px 0' }}>
                  Cadastrar loja
                </button>
              </form>
              {/* Botão/Link para voltar ao login (antes do sucesso) */}
              <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                <a href="/login" className="link" style={{ color: '#7B3FBF', fontWeight: 600 }} onClick={handleVoltar}>
                  Voltar para login
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Mensagem de sucesso */}
              <div style={{ color: '#2d5a2d', background: '#e8f5e8', borderRadius: 8, padding: 16, textAlign: 'center', marginBottom: 16 }}>
                Loja cadastrada com sucesso!
              </div>
              {/* Botão voltar ao login após sucesso */}
              <button className="button" style={{ background: '#7B3FBF', color: '#fff', fontWeight: 600, fontSize: 18 }} onClick={handleVoltar}>
                Voltar ao login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CadastrarLojaPage; 