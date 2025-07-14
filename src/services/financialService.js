import api from './api';

// Serviço de gestão financeira
export const financialService = {
  // Listar movimentações
  async getTransactions(filters = {}) {
    try {
      const response = await api.get('/financeiro/movimentacoes', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar movimentações');
    }
  },

  // Criar movimentação
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/financeiro/movimentacoes', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar movimentação');
    }
  },

  // Atualizar movimentação
  async updateTransaction(id, transactionData) {
    try {
      const response = await api.put(`/financeiro/movimentacoes/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar movimentação');
    }
  },

  // Deletar movimentação
  async deleteTransaction(id) {
    try {
      const response = await api.delete(`/financeiro/movimentacoes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar movimentação');
    }
  },

  // Obter saldo atual
  async getCurrentBalance() {
    try {
      const response = await api.get('/financeiro/saldo');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar saldo');
    }
  },

  // Listar contas a pagar
  async getPayables(filters = {}) {
    try {
      const response = await api.get('/financeiro/contas-pagar', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a pagar');
    }
  },

  // Criar conta a pagar
  async createPayable(payableData) {
    try {
      const response = await api.post('/financeiro/contas-pagar', payableData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta a pagar');
    }
  },

  // Atualizar conta a pagar
  async updatePayable(id, payableData) {
    try {
      const response = await api.put(`/financeiro/contas-pagar/${id}`, payableData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar conta a pagar');
    }
  },

  // Marcar conta como paga
  async markPayableAsPaid(id, paymentData) {
    try {
      const response = await api.patch(`/financeiro/contas-pagar/${id}/pagar`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar conta como paga');
    }
  },

  // Listar contas a receber
  async getReceivables(filters = {}) {
    try {
      const response = await api.get('/financeiro/contas-receber', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a receber');
    }
  },

  // Criar conta a receber
  async createReceivable(receivableData) {
    try {
      const response = await api.post('/financeiro/contas-receber', receivableData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta a receber');
    }
  },

  // Atualizar conta a receber
  async updateReceivable(id, receivableData) {
    try {
      const response = await api.put(`/financeiro/contas-receber/${id}`, receivableData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar conta a receber');
    }
  },

  // Marcar conta como recebida
  async markReceivableAsReceived(id, receiptData) {
    try {
      const response = await api.patch(`/financeiro/contas-receber/${id}/receber`, receiptData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar conta como recebida');
    }
  },

  // Obter relatório financeiro
  async getFinancialReport(filters = {}) {
    try {
      const response = await api.get('/financeiro/relatorio', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar relatório financeiro');
    }
  },

  // Exportar dados financeiros
  async exportFinancialData(filters = {}, format = 'pdf') {
    try {
      const response = await api.get('/financeiro/exportar', { 
        params: { ...filters, formato: format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar dados financeiros');
    }
  },

  // Obter KPIs financeiros
  async getFinancialKPIs() {
    try {
      const response = await api.get('/financeiro/kpis');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar KPIs financeiros');
    }
  }
}; 