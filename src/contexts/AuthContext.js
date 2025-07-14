import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { storeService } from '../services/storeService';

// Contexto de autenticação e controle de acesso
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para armazenar informações completas do usuário
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado para lista de lojas
  const [lojas, setLojas] = useState([]);

  // Função de login
  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await authService.login(email, senha);
      
      if (response.sucesso) {
        setUsuario(response.usuario);
        setTipoUsuario(response.usuario.tipo);
        return { sucesso: true, mensagem: response.mensagem || 'Login realizado com sucesso!' };
      } else {
        return { sucesso: false, mensagem: response.mensagem || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { sucesso: false, mensagem: error.message || 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUsuario(null);
      setTipoUsuario(null);
    }
  };

  // Função para verificar se usuário está logado
  const isAuthenticated = () => {
    return usuario !== null;
  };

  // Função para verificar se usuário é administrador
  const isAdmin = () => {
    return tipoUsuario === 'administrador';
  };

  // Função para verificar se usuário é funcionário
  const isFuncionario = () => {
    return tipoUsuario === 'funcionario';
  };

  // Função para verificar permissão de acesso a uma rota
  const hasPermission = (route) => {
    if (!isAuthenticated()) return false;
    
    // Funcionários só podem acessar a tela de venda
    if (isFuncionario()) {
      return route === '/venda';
    }
    
    // Administradores podem acessar tudo
    if (isAdmin()) {
      return true;
    }
    
    return false;
  };

  // Função para carregar lojas
  const carregarLojas = async () => {
    try {
      const response = await storeService.getStores();
      setLojas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      setLojas([]);
    }
  };

  // Função para adicionar nova loja
  const adicionarLoja = async (novaLoja) => {
    try {
      const response = await storeService.createStore(novaLoja);
      setLojas(prev => [...prev, response.data]);
      return { sucesso: true, mensagem: 'Loja criada com sucesso!' };
    } catch (error) {
      console.error('Erro ao criar loja:', error);
      return { sucesso: false, mensagem: error.message };
    }
  };

  // Função para editar loja
  const editarLoja = async (id, dadosAtualizados) => {
    try {
      const response = await storeService.updateStore(id, dadosAtualizados);
      setLojas(prev => prev.map(loja => 
        loja.id === id ? response.data : loja
      ));
      return { sucesso: true, mensagem: 'Loja atualizada com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      return { sucesso: false, mensagem: error.message };
    }
  };

  // Função para excluir loja
  const excluirLoja = async (id) => {
    try {
      await storeService.deleteStore(id);
      setLojas(prev => prev.filter(loja => loja.id !== id));
      return { sucesso: true, mensagem: 'Loja excluída com sucesso!' };
    } catch (error) {
      console.error('Erro ao excluir loja:', error);
      return { sucesso: false, mensagem: error.message };
    }
  };

  // Função para verificar token ao inicializar
  const verificarToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.verifyToken();
        setUsuario(response.usuario);
        setTipoUsuario(response.usuario.tipo);
      }
    } catch (error) {
      console.error('Token inválido:', error);
      // Limpar dados inválidos
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('tipoUsuario');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao inicializar
  useEffect(() => {
    verificarToken();
    carregarLojas();
  }, []);

  // Verificar conectividade
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      tipoUsuario, 
      offline, 
      setOffline, 
      lojas, 
      loading,
      login, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      isFuncionario, 
      hasPermission,
      adicionarLoja,
      editarLoja,
      excluirLoja,
      carregarLojas
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 