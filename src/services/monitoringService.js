import api from './api';

// Serviço de monitoramento com IA
export const monitoringService = {
  // Listar câmeras
  async getCameras() {
    try {
      const response = await api.get('/monitoramento/cameras');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar câmeras');
    }
  },

  // Buscar câmera por ID
  async getCameraById(id) {
    try {
      const response = await api.get(`/monitoramento/cameras/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar câmera');
    }
  },

  // Obter stream de câmera
  async getCameraStream(id) {
    try {
      const response = await api.get(`/monitoramento/cameras/${id}/stream`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao obter stream da câmera');
    }
  },

  // Ativar/desativar câmera
  async toggleCamera(id, ativa) {
    try {
      const response = await api.patch(`/monitoramento/cameras/${id}/status`, { ativa });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao alterar status da câmera');
    }
  },

  // Listar alertas
  async getAlerts(filters = {}) {
    try {
      const response = await api.get('/monitoramento/alertas', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar alertas');
    }
  },

  // Marcar alerta como lido
  async markAlertAsRead(id) {
    try {
      const response = await api.patch(`/monitoramento/alertas/${id}/ler`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar alerta como lido');
    }
  },

  // Marcar todos os alertas como lidos
  async markAllAlertsAsRead() {
    try {
      const response = await api.patch('/monitoramento/alertas/ler-todos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar todos os alertas como lidos');
    }
  },

  // Listar eventos
  async getEvents(filters = {}) {
    try {
      const response = await api.get('/monitoramento/eventos', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar eventos');
    }
  },

  // Buscar evento por ID
  async getEventById(id) {
    try {
      const response = await api.get(`/monitoramento/eventos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar evento');
    }
  },

  // Reconhecimento facial
  async recognizeFace(imageFile) {
    try {
      const formData = new FormData();
      formData.append('imagem', imageFile);
      
      const response = await api.post('/monitoramento/ia/reconhecer-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro no reconhecimento facial');
    }
  },

  // Detecção de movimento
  async detectMovement(cameraId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('imagem', imageFile);
      formData.append('cameraId', cameraId);
      
      const response = await api.post('/monitoramento/ia/detectar-movimento', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro na detecção de movimento');
    }
  },

  // Detecção de objetos
  async detectObjects(imageFile) {
    try {
      const formData = new FormData();
      formData.append('imagem', imageFile);
      
      const response = await api.post('/monitoramento/ia/detectar-objetos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro na detecção de objetos');
    }
  },

  // Obter estatísticas de monitoramento
  async getMonitoringStats() {
    try {
      const response = await api.get('/monitoramento/estatisticas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas de monitoramento');
    }
  },

  // Obter relatório de monitoramento
  async getMonitoringReport(filters = {}) {
    try {
      const response = await api.get('/monitoramento/relatorio', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar relatório de monitoramento');
    }
  },

  // Exportar dados de monitoramento
  async exportMonitoringData(filters = {}, format = 'pdf') {
    try {
      const response = await api.get('/monitoramento/exportar', { 
        params: { ...filters, formato: format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar dados de monitoramento');
    }
  }
}; 