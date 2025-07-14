import api from './api';

// Serviço de gestão de estoque
export const inventoryService = {
  // Listar produtos
  async getProducts(filters = {}) {
    try {
      const response = await api.get('/produtos', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produtos');
    }
  },

  // Buscar produto por ID
  async getProductById(id) {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produto');
    }
  },

  // Criar novo produto
  async createProduct(productData) {
    try {
      const response = await api.post('/produtos', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar produto');
    }
  },

  // Atualizar produto
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/produtos/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto');
    }
  },

  // Deletar produto
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar produto');
    }
  },

  // Ajustar estoque
  async adjustStock(id, adjustmentData) {
    try {
      const response = await api.post(`/produtos/${id}/estoque`, adjustmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao ajustar estoque');
    }
  },

  // Upload de foto do produto
  async uploadProductPhoto(productId, photoFile) {
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      
      const response = await api.post(`/produtos/${productId}/upload-foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  },

  // Obter produtos com estoque baixo
  async getLowStockProducts() {
    try {
      const response = await api.get('/produtos/estoque-baixo');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produtos com estoque baixo');
    }
  },

  // Obter categorias
  async getCategories() {
    try {
      const response = await api.get('/produtos/categorias');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar categorias');
    }
  },

  // Criar categoria
  async createCategory(categoryData) {
    try {
      const response = await api.post('/produtos/categorias', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar categoria');
    }
  },

  // Obter fornecedores
  async getSuppliers() {
    try {
      const response = await api.get('/fornecedores');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fornecedores');
    }
  },

  // Criar fornecedor
  async createSupplier(supplierData) {
    try {
      const response = await api.post('/fornecedores', supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar fornecedor');
    }
  },

  // Obter relatório de estoque
  async getInventoryReport(filters = {}) {
    try {
      const response = await api.get('/produtos/relatorio', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar relatório de estoque');
    }
  },

  // Exportar estoque
  async exportInventory(filters = {}, format = 'pdf') {
    try {
      const response = await api.get('/produtos/exportar', { 
        params: { ...filters, formato: format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar estoque');
    }
  }
}; 