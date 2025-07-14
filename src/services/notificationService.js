import api from './api';

// Serviço de notificações
export const notificationService = {
  // Listar notificações
  async getNotifications(filters = {}) {
    try {
      const response = await api.get('/notificacoes', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar notificações');
    }
  },

  // Buscar notificação por ID
  async getNotificationById(id) {
    try {
      const response = await api.get(`/notificacoes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar notificação');
    }
  },

  // Marcar notificação como lida
  async markAsRead(id) {
    try {
      const response = await api.patch(`/notificacoes/${id}/ler`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar notificação como lida');
    }
  },

  // Marcar todas as notificações como lidas
  async markAllAsRead() {
    try {
      const response = await api.patch('/notificacoes/ler-todas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar todas como lidas');
    }
  },

  // Obter contagem de notificações não lidas
  async getUnreadCount() {
    try {
      const response = await api.get('/notificacoes/nao-lidas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contagem de não lidas');
    }
  },

  // Deletar notificação
  async deleteNotification(id) {
    try {
      const response = await api.delete(`/notificacoes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar notificação');
    }
  },

  // Deletar todas as notificações
  async deleteAllNotifications() {
    try {
      const response = await api.delete('/notificacoes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar todas as notificações');
    }
  },

  // Configurar preferências de notificação
  async updateNotificationPreferences(preferences) {
    try {
      const response = await api.put('/notificacoes/preferencias', preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar preferências');
    }
  },

  // Obter preferências de notificação
  async getNotificationPreferences() {
    try {
      const response = await api.get('/notificacoes/preferencias');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar preferências');
    }
  }
}; 