import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaChartLine, FaBoxes, FaCogs, FaEye, FaChartBar, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Componente de navegação com controle de acesso
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, tipoUsuario, logout } = useAuth();

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Verificar se está na página de login
  if (location.pathname === '/login') {
    return null;
  }

  // Menu para funcionários (apenas venda)
  if (tipoUsuario === 'funcionario') {
    return (
      <nav style={{
        background: '#4B0082',
        color: '#fff',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(75,0,130,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo e título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaShoppingCart size={24} />
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Sistema de Vendas</h1>
          </div>

          {/* Informações do usuário */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{usuario?.nome}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Funcionário</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14
              }}
            >
              <FaSignOutAlt size={14} />
              Sair
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Menu para administradores (todas as funcionalidades)
  return (
    <nav style={{
      background: '#4B0082',
      color: '#fff',
      padding: '16px 24px',
      boxShadow: '0 2px 8px rgba(75,0,130,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo e título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaShoppingCart size={24} />
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Sistema de Gestão</h1>
        </div>

        {/* Menu de navegação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/dashboard' ? 600 : 400
            }}
          >
            <FaHome size={14} />
            Dashboard
          </button>

          <button
            onClick={() => navigate('/venda')}
            style={{
              background: location.pathname === '/venda' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/venda' ? 600 : 400
            }}
          >
            <FaShoppingCart size={14} />
            Vendas
          </button>

          <button
            onClick={() => navigate('/financeiro')}
            style={{
              background: location.pathname === '/financeiro' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/financeiro' ? 600 : 400
            }}
          >
            <FaChartLine size={14} />
            Financeiro
          </button>

          <button
            onClick={() => navigate('/estoque')}
            style={{
              background: location.pathname === '/estoque' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/estoque' ? 600 : 400
            }}
          >
            <FaBoxes size={14} />
            Estoque
          </button>

          <button
            onClick={() => navigate('/admin')}
            style={{
              background: location.pathname === '/admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/admin' ? 600 : 400
            }}
          >
            <FaCogs size={14} />
            Admin
          </button>

          <button
            onClick={() => navigate('/monitor')}
            style={{
              background: location.pathname === '/monitor' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/monitor' ? 600 : 400
            }}
          >
            <FaEye size={14} />
            Monitor
          </button>

          <button
            onClick={() => navigate('/relatorios')}
            style={{
              background: location.pathname === '/relatorios' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/relatorios' ? 600 : 400
            }}
          >
            <FaChartBar size={14} />
            Relatórios
          </button>

          <button
            onClick={() => navigate('/notificacoes')}
            style={{
              background: location.pathname === '/notificacoes' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/notificacoes' ? 600 : 400
            }}
          >
            <FaBell size={14} />
            Notificações
          </button>

          <button
            onClick={() => navigate('/perfil')}
            style={{
              background: location.pathname === '/perfil' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: location.pathname === '/perfil' ? 600 : 400
            }}
          >
            <FaUser size={14} />
            Perfil
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14
            }}
          >
            <FaSignOutAlt size={14} />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 