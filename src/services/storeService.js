import api from './api';

// Serviço de gestão de lojas
export const storeService = {
  // Listar todas as lojas
  async getStores() {
    try {
      const response = await api.get('/lojas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar lojas');
    }
  },

  // Buscar loja por ID
  async getStoreById(id) {
    try {
      const response = await api.get(`/lojas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar loja');
    }
  },

  // Criar nova loja
  async createStore(storeData) {
    try {
      const response = await api.post('/lojas', storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar loja');
    }
  },

  // Atualizar loja
  async updateStore(id, storeData) {
    try {
      const response = await api.put(`/lojas/${id}`, storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar loja');
    }
  },

  // Deletar loja
  async deleteStore(id) {
    try {
      const response = await api.delete(`/lojas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar loja');
    }
  },

  // Ativar/desativar loja
  async toggleStoreStatus(id, ativa) {
    try {
      const response = await api.patch(`/lojas/${id}/status`, { ativa });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao alterar status da loja');
    }
  },

  // Obter estatísticas da loja
  async getStoreStats(id) {
    try {
      const response = await api.get(`/lojas/${id}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas da loja');
    }
  },

  // Obter funcionários da loja
  async getStoreEmployees(id) {
    try {
      const response = await api.get(`/lojas/${id}/funcionarios`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar funcionários da loja');
    }
  }
}; 