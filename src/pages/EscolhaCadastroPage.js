import React, { useContext } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserTie } from 'react-icons/fa';

// Página de escolha do tipo de cadastro (Administrador ou Funcionário)
function EscolhaCadastroPage() {
  const navigate = useNavigate();
  const { tipoUsuario } = useAuth();

  // Função para navegar para cadastro de Administrador
  const handleAdministrador = () => {
    navigate('/cadastro-dono');
  };

  // Função para navegar para cadastro de Funcionário
  const handleFuncionario = () => {
    navigate('/cadastro-funcionario');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {tipoUsuario === 'administrador' && <Navigation />}
      <div className="page-center">
        <div className="card" style={{ background: '#fff', color: '#4B0082', boxShadow: '0 4px 24px rgba(75,0,130,0.10)', maxWidth: 420 }}>
          {/* Título */}
          <div className="card-title" style={{ color: '#4B0082', fontSize: 22, marginBottom: 24, fontWeight: 600, letterSpacing: 0.5, textAlign: 'center' }}>
            Como você deseja se cadastrar?
          </div>
          {/* Botão grande para Administrador */}
          <button
            className="button"
            style={{ background: '#4B0082', color: '#fff', fontWeight: 600, fontSize: 20, margin: '10px 0 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            onClick={handleAdministrador}
          >
            <FaUserShield size={24} /> Sou Administrador
          </button>
          {/* Botão grande para Funcionário */}
          <button
            className="button"
            style={{ background: '#7B3FBF', color: '#fff', fontWeight: 600, fontSize: 20, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            onClick={handleFuncionario}
          >
            <FaUserTie size={24} /> Sou Funcionário
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscolhaCadastroPage; 