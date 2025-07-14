import React, { createContext, useState, useContext } from 'react';

// Contexto de autenticação e controle de acesso
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para armazenar informações completas do usuário
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [offline, setOffline] = useState(false);

  // Estado para lista de lojas mockadas
  const [lojas, setLojas] = useState([
    { id: 1, nome: 'Loja Centro', endereco: 'Rua das Flores, 123', telefone: '11999999999', ativa: true },
    { id: 2, nome: 'Loja Bairro', endereco: 'Av. Principal, 456', telefone: '11888888888', ativa: true },
    { id: 3, nome: 'Loja Shopping', endereco: 'Shopping Center, Loja 15', telefone: '11777777777', ativa: true },
  ]);

  // Função de login
  const login = (email, senha) => {
    // Simulação de login (mock - futuramente integração com backend)
    const usuariosMock = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', senha: '123456', tipo: 'administrador', loja: 'Loja Centro', ativo: true, foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', senha: '123456', tipo: 'funcionario', loja: 'Loja Bairro', ativo: true, foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', senha: '123456', tipo: 'funcionario', loja: 'Loja Shopping', ativo: false, foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', senha: '123456', tipo: 'administrador', loja: 'Loja Centro', ativo: true, foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { id: 5, nome: 'Carlos Lima', email: 'carlos@email.com', senha: '123456', tipo: 'funcionario', loja: 'Loja Bairro', ativo: true, foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    ];

    const usuarioEncontrado = usuariosMock.find(u => u.email === email && u.senha === senha);
    
    if (usuarioEncontrado && usuarioEncontrado.ativo) {
      const { senha, ...usuarioSemSenha } = usuarioEncontrado;
      setUsuario(usuarioSemSenha);
      setTipoUsuario(usuarioEncontrado.tipo);
      localStorage.setItem('usuario', JSON.stringify(usuarioSemSenha));
      localStorage.setItem('tipoUsuario', usuarioEncontrado.tipo);
      return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
    } else if (usuarioEncontrado && !usuarioEncontrado.ativo) {
      return { sucesso: false, mensagem: 'Usuário inativo. Entre em contato com o administrador.' };
    } else {
      return { sucesso: false, mensagem: 'Email ou senha incorretos.' };
    }
  };

  // Função de logout
  const logout = () => {
    setUsuario(null);
    setTipoUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
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

  // Função para adicionar nova loja
  const adicionarLoja = (novaLoja) => {
    const lojaComId = {
      ...novaLoja,
      id: Math.max(...lojas.map(l => l.id)) + 1,
      ativa: true
    };
    setLojas((prev) => [...prev, lojaComId]);
  };

  // Função para editar loja
  const editarLoja = (id, dadosAtualizados) => {
    setLojas((prev) => prev.map(loja => 
      loja.id === id ? { ...loja, ...dadosAtualizados } : loja
    ));
  };

  // Função para excluir loja
  const excluirLoja = (id) => {
    setLojas((prev) => prev.filter(loja => loja.id !== id));
  };

  // Função para adicionar usuário
  const adicionarUsuario = (novoUsuario) => {
    const usuarioComId = {
      ...novoUsuario,
      id: Date.now(),
      ativo: true
    };
    // Aqui você adicionaria à lista de usuários (mock)
    console.log('Novo usuário adicionado:', usuarioComId);
  };

  // Função para editar usuário
  const editarUsuario = (id, dadosAtualizados) => {
    // Aqui você atualizaria o usuário na lista (mock)
    console.log('Usuário editado:', id, dadosAtualizados);
  };

  // Função para excluir usuário
  const excluirUsuario = (id) => {
    // Aqui você removeria o usuário da lista (mock)
    console.log('Usuário excluído:', id);
  };

  // Carregar dados do localStorage ao inicializar
  React.useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    const tipoSalvo = localStorage.getItem('tipoUsuario');
    
    if (usuarioSalvo && tipoSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setTipoUsuario(tipoSalvo);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      tipoUsuario, 
      offline, 
      setOffline, 
      lojas, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      isFuncionario, 
      hasPermission,
      adicionarLoja,
      editarLoja,
      excluirLoja,
      adicionarUsuario,
      editarUsuario,
      excluirUsuario
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