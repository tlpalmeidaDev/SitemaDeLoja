import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importação das páginas
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import VendaPage from '../pages/VendaPage';
import FinanceiroPage from '../pages/FinanceiroPage';
import EstoquePage from '../pages/EstoquePage';
import AdminPage from '../pages/AdminPage';
import MonitorPage from '../pages/MonitorPage';
import RelatoriosPage from '../pages/RelatoriosPage';
import NotificacoesPage from '../pages/NotificacoesPage';
import PerfilPage from '../pages/PerfilPage';
import CadastroDonoPage from '../pages/CadastroDonoPage';
import CadastroFuncionarioPage from '../pages/CadastroFuncionarioPage';
import CadastrarLojaPage from '../pages/CadastrarLojaPage';
import EscolhaCadastroPage from '../pages/EscolhaCadastroPage';
import EsqueciSenhaPage from '../pages/EsqueciSenhaPage';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedRoles = ['administrador', 'funcionario'] }) => {
  const { isAuthenticated, tipoUsuario, hasPermission } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar se o usuário tem permissão para acessar a rota
  if (!hasPermission(window.location.pathname)) {
    // Funcionários só podem acessar a tela de venda
    if (tipoUsuario === 'funcionario') {
      return <Navigate to="/venda" replace />;
    }
    // Administradores podem acessar tudo
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente para rotas de administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/venda" replace />;
  }
  
  return children;
};

// Componente para rotas públicas (login, cadastro, etc.)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente principal de rotas
function AppRoutes() {
  const { isAuthenticated, tipoUsuario } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rota raiz - redireciona baseado no status de autenticação */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              (tipoUsuario === 'funcionario' ? <Navigate to="/venda" replace /> : <Navigate to="/dashboard" replace />) 
              : <Navigate to="/login" replace />
          } 
        />

        {/* Rotas públicas */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/esqueci-senha" 
          element={
            <PublicRoute>
              <EsqueciSenhaPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/escolha-cadastro" 
          element={
            <PublicRoute>
              <EscolhaCadastroPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/cadastro-dono" 
          element={
            <PublicRoute>
              <CadastroDonoPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/cadastro-funcionario" 
          element={
            <PublicRoute>
              <CadastroFuncionarioPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/cadastrar-loja" 
          element={
            <PublicRoute>
              <CadastrarLojaPage />
            </PublicRoute>
          } 
        />

        {/* Rotas protegidas - Apenas Administradores */}
        <Route 
          path="/dashboard" 
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/financeiro" 
          element={
            <AdminRoute>
              <FinanceiroPage />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/estoque" 
          element={
            <AdminRoute>
              <EstoquePage />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/monitor" 
          element={
            <AdminRoute>
              <MonitorPage />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/relatorios" 
          element={
            <AdminRoute>
              <RelatoriosPage />
            </AdminRoute>
          } 
        />

        {/* Rotas protegidas - Administradores e Funcionários */}
        <Route 
          path="/venda" 
          element={
            <ProtectedRoute>
              <VendaPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notificacoes" 
          element={
            <ProtectedRoute>
              <NotificacoesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          } 
        />

        {/* Rota para páginas não encontradas */}
        <Route 
          path="*" 
          element={
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes; 