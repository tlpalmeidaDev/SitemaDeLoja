import api from './api';

// Serviço de gestão de usuários
export const userService = {
  // Listar todos os usuários
  async getUsers() {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuários');
    }
  },

  // Buscar usuário por ID
  async getUserById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
    }
  },

  // Criar novo usuário
  async createUser(userData) {
    try {
      const response = await api.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
    }
  },

  // Atualizar usuário
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  },

  // Deletar usuário
  async deleteUser(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar usuário');
    }
  },

  // Obter perfil do usuário logado
  async getProfile() {
    try {
      const response = await api.get('/usuarios/perfil');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  },

  // Atualizar perfil do usuário logado
  async updateProfile(userData) {
    try {
      const response = await api.put('/usuarios/perfil', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  // Upload de foto do usuário
  async uploadPhoto(photoFile) {
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      
      const response = await api.post('/usuarios/upload-foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  },

  // Ativar/desativar usuário
  async toggleUserStatus(id, ativo) {
    try {
      const response = await api.patch(`/usuarios/${id}/status`, { ativo });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao alterar status do usuário');
    }
  }
}; 