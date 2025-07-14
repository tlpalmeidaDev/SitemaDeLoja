import axios from 'axios';

// Configuração base do Axios para requisições à API
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base da API
});

// Interceptador de requisições para adicionar JWT (esqueleto)
api.interceptors.request.use(
  (config) => {
    // Aqui futuramente será adicionado o token JWT no header Authorization
    // Exemplo: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de respostas para tratar erros de autenticação (esqueleto)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui futuramente será tratada a lógica de erro de autenticação/expiração de token
    return Promise.reject(error);
  }
);

export default api; 