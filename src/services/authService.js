import api from './api';

// Serviço de autenticação
export const authService = {
  // Login de usuário
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('tipoUsuario', response.data.usuario.tipo);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('tipoUsuario');
    }
  },

  // Recuperar senha
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar email de recuperação');
    }
  },

  // Redefinir senha
  async resetPassword(token, novaSenha) {
    try {
      const response = await api.post('/auth/reset-password', { token, novaSenha });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error('Erro ao renovar token');
    }
  }
}; 