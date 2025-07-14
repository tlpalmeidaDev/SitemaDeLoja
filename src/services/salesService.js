import api from './api';

// Serviço de vendas com integração IA
export const salesService = {
  // Listar vendas
  async getSales(filters = {}) {
    try {
      const response = await api.get('/vendas', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar vendas');
    }
  },

  // Buscar venda por ID
  async getSaleById(id) {
    try {
      const response = await api.get(`/vendas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar venda');
    }
  },

  // Criar nova venda
  async createSale(saleData) {
    try {
      const response = await api.post('/vendas', saleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar venda');
    }
  },

  // Atualizar venda
  async updateSale(id, saleData) {
    try {
      const response = await api.put(`/vendas/${id}`, saleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar venda');
    }
  },

  // Deletar venda
  async deleteSale(id) {
    try {
      const response = await api.delete(`/vendas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar venda');
    }
  },

  // Reconhecimento de produto via IA
  async recognizeProduct(imageFile) {
    try {
      const formData = new FormData();
      formData.append('imagem', imageFile);
      
      const response = await api.post('/ia/reconhecer-produto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro no reconhecimento de produto');
    }
  },

  // Processar pagamento
  async processPayment(saleId, paymentData) {
    try {
      const response = await api.post(`/vendas/${saleId}/pagamento`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao processar pagamento');
    }
  },

  // Gerar QR Code PIX
  async generatePixQRCode(value) {
    try {
      const response = await api.post('/pagamentos/pix/qrcode', { valor: value });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar QR Code PIX');
    }
  },

  // Verificar status do pagamento PIX
  async checkPixStatus(pixId) {
    try {
      const response = await api.get(`/pagamentos/pix/${pixId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao verificar status do PIX');
    }
  },

  // Obter relatório de vendas
  async getSalesReport(filters = {}) {
    try {
      const response = await api.get('/vendas/relatorio', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar relatório de vendas');
    }
  },

  // Exportar vendas
  async exportSales(filters = {}, format = 'pdf') {
    try {
      const response = await api.get('/vendas/exportar', { 
        params: { ...filters, formato: format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar vendas');
    }
  },

  // Sincronizar vendas offline
  async syncOfflineSales(offlineSales) {
    try {
      const response = await api.post('/vendas/sincronizar', { vendas: offlineSales });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao sincronizar vendas offline');
    }
  }
}; 