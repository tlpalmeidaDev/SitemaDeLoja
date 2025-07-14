# 📋 Documentação Completa - Sistema de Gestão Frontend

## 🛣️ ROTAS CRIADAS NO FRONTEND

| Caminho da Rota | Descrição | Status |
|-----------------|-----------|--------|
| `/` | Redirecionamento automático para `/login` | ✅ Implementado |
| `/login` | Página de login com seleção de loja | ✅ Implementado |
| `/escolha-cadastro` | Tela de escolha entre cadastro de dono ou funcionário | ✅ Implementado |
| `/cadastro-dono` | Cadastro de proprietário/dono da loja | ✅ Implementado |
| `/cadastro-funcionario` | Cadastro de funcionário com foto via webcam | ✅ Implementado |
| `/cadastrar-loja` | Cadastro de nova loja | ✅ Implementado |
| `/dashboard` | Painel principal com KPIs e atalhos | ✅ Implementado |
| `/esqueci-senha` | Recuperação de senha por e-mail | ✅ Implementado |
| `/perfil` | Perfil do usuário com edição de dados | ✅ Implementado |
| `/notificacoes` | Lista de notificações com filtros | ✅ Implementado |
| `/venda` | Nova venda com captura de foto e reconhecimento IA | ✅ Implementado |
| `/financeiro` | Dashboard financeiro com gráficos e movimentações | ✅ Implementado |
| `/estoque` | Gestão de estoque com alertas e ajustes | ✅ Implementado |
| `/admin` | Área administrativa com gestão de usuários e lojas | ✅ Implementado |
| `/monitoramento` | Monitoramento com câmeras e alertas IA | ✅ Implementado |
| `/relatorios` | Relatórios exportáveis com gráficos interativos | ✅ Implementado |

---

## 🔌 ENDPOINTS DE API MOCKADOS OU PREVISTOS

### 🔐 Autenticação e Usuários

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/auth/login` | POST | Login de usuário | `/login` | 🔄 Mock |
| `/api/auth/logout` | POST | Logout do usuário | Todas as páginas | 🔄 Mock |
| `/api/auth/forgot-password` | POST | Recuperação de senha | `/esqueci-senha` | 🔄 Mock |
| `/api/auth/reset-password` | POST | Redefinir senha | `/esqueci-senha` | 🔄 Mock |
| `/api/usuarios` | GET | Listar usuários | `/admin` | 🔄 Mock |
| `/api/usuarios` | POST | Criar usuário | `/cadastro-dono`, `/cadastro-funcionario` | 🔄 Mock |
| `/api/usuarios/:id` | PUT | Atualizar usuário | `/perfil`, `/admin` | 🔄 Mock |
| `/api/usuarios/:id` | DELETE | Deletar usuário | `/admin` | 🔄 Mock |
| `/api/usuarios/perfil` | GET | Obter perfil do usuário | `/perfil` | 🔄 Mock |
| `/api/usuarios/perfil` | PUT | Atualizar perfil | `/perfil` | 🔄 Mock |

**Exemplo de Payload - Login:**
```json
{
  "usuario": "admin",
  "senha": "123456",
  "tipo": "administrador",
  "lojaId": "loja1"
}
```

**Exemplo de Response - Login:**
```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "administrador",
    "lojaId": "loja1"
  }
}
```

### 🏪 Lojas

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/lojas` | GET | Listar lojas | `/login`, `/admin` | 🔄 Mock |
| `/api/lojas` | POST | Criar loja | `/cadastrar-loja` | 🔄 Mock |
| `/api/lojas/:id` | PUT | Atualizar loja | `/admin` | 🔄 Mock |
| `/api/lojas/:id` | DELETE | Deletar loja | `/admin` | 🔄 Mock |

**Exemplo de Payload - Criar Loja:**
```json
{
  "nome": "Loja Centro",
  "endereco": "Rua das Flores, 123",
  "telefone": "11999999999"
}
```

### 🛒 Vendas

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/vendas` | GET | Listar vendas | `/dashboard`, `/financeiro` | 🔄 Mock |
| `/api/vendas` | POST | Criar venda | `/venda` | 🔄 Mock |
| `/api/vendas/:id` | GET | Obter venda específica | `/venda` | 🔄 Mock |
| `/api/vendas/relatorio` | GET | Relatório de vendas | `/relatorios` | 🔄 Mock |
| `/api/ia/reconhecer-produto` | POST | Reconhecimento de produto via IA | `/venda` | 🔄 Mock |

**Exemplo de Payload - Nova Venda:**
```json
{
  "produtoId": 1,
  "quantidade": 1,
  "valor": 8.50,
  "formaPagamento": "pix",
  "descricao": "Arroz Integral",
  "observacoes": "Cliente preferiu PIX",
  "fotoProduto": "data:image/png;base64,..."
}
```

### 📦 Estoque

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/produtos` | GET | Listar produtos | `/estoque` | 🔄 Mock |
| `/api/produtos` | POST | Criar produto | `/estoque` | 🔄 Mock |
| `/api/produtos/:id` | PUT | Atualizar produto | `/estoque` | 🔄 Mock |
| `/api/produtos/:id` | DELETE | Deletar produto | `/estoque` | 🔄 Mock |
| `/api/produtos/:id/estoque` | PUT | Ajustar estoque | `/estoque` | 🔄 Mock |
| `/api/produtos/estoque-baixo` | GET | Produtos com estoque baixo | `/estoque`, `/dashboard` | 🔄 Mock |

**Exemplo de Payload - Ajustar Estoque:**
```json
{
  "quantidade": 10,
  "tipo": "entrada",
  "motivo": "Compra de fornecedor",
  "observacoes": "Produto chegou no prazo"
}
```

### 💰 Financeiro

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/financeiro/movimentacoes` | GET | Listar movimentações | `/financeiro` | 🔄 Mock |
| `/api/financeiro/movimentacoes` | POST | Criar movimentação | `/financeiro` | 🔄 Mock |
| `/api/financeiro/saldo` | GET | Obter saldo atual | `/dashboard`, `/financeiro` | 🔄 Mock |
| `/api/financeiro/relatorio` | GET | Relatório financeiro | `/relatorios` | 🔄 Mock |
| `/api/financeiro/exportar` | GET | Exportar dados | `/financeiro` | 🔄 Mock |

### 🔔 Notificações

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/notificacoes` | GET | Listar notificações | `/notificacoes` | 🔄 Mock |
| `/api/notificacoes/:id/ler` | PUT | Marcar como lida | `/notificacoes` | 🔄 Mock |
| `/api/notificacoes/ler-todas` | PUT | Marcar todas como lidas | `/notificacoes` | 🔄 Mock |
| `/api/notificacoes/nao-lidas` | GET | Contar não lidas | `/dashboard` | 🔄 Mock |

### 📊 Relatórios

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/relatorios/vendas` | GET | Relatório de vendas | `/relatorios` | 🔄 Mock |
| `/api/relatorios/financeiro` | GET | Relatório financeiro | `/relatorios` | 🔄 Mock |
| `/api/relatorios/estoque` | GET | Relatório de estoque | `/relatorios` | 🔄 Mock |
| `/api/relatorios/exportar` | GET | Exportar relatório | `/relatorios` | 🔄 Mock |

### 📹 Monitoramento

| Endpoint | Método | Descrição | Página/Fluxo | Status |
|----------|--------|-----------|--------------|--------|
| `/api/monitoramento/cameras` | GET | Listar câmeras | `/monitoramento` | 🔄 Mock |
| `/api/monitoramento/stream/:id` | GET | Stream de câmera | `/monitoramento` | 🔄 Mock |
| `/api/monitoramento/alertas` | GET | Listar alertas | `/monitoramento` | 🔄 Mock |
| `/api/monitoramento/eventos` | GET | Eventos detectados | `/monitoramento` | 🔄 Mock |

---

## 🧩 COMPONENTES PRINCIPAIS REUTILIZÁVEIS

| Nome do Componente | Localização | Descrição | Status |
|-------------------|-------------|-----------|--------|
| `AuthContext` | `/src/contexts/AuthContext.js` | Contexto de autenticação e lojas | ✅ Implementado |
| `AppRoutes` | `/src/routes/AppRoutes.js` | Configuração de rotas | ✅ Implementado |
| `api` | `/src/services/api.js` | Configuração do Axios | ✅ Implementado |

### 📝 Observações sobre Componentes:

- **AuthContext**: Gerencia estado de autenticação, tipo de usuário e lista de lojas
- **AppRoutes**: Centraliza todas as rotas do sistema com redirecionamentos
- **api**: Configuração base do Axios com interceptadores para JWT (preparado para backend)

---

## 🚀 ENDPOINTS PRONTOS PARA BACKEND REAL

### ✅ Configuração Base Pronta:
- **Axios configurado** em `/src/services/api.js`
- **Interceptadores** para JWT preparados
- **Base URL** configurada: `http://localhost:8080/api`
- **Tratamento de erros** estruturado

### 🔄 Endpoints Mockados (Prontos para Integração):
1. **Autenticação**: Login, logout, recuperação de senha
2. **Usuários**: CRUD completo com perfis
3. **Lojas**: Gestão de lojas
4. **Vendas**: Processamento com IA
5. **Estoque**: Controle de produtos
6. **Financeiro**: Movimentações e relatórios
7. **Notificações**: Sistema de alertas
8. **Monitoramento**: Câmeras e eventos IA

---

## ⚠️ PONTOS QUE PRECISAM ATENÇÃO FUTURA

### 🔐 Segurança:
- **JWT Token**: Implementar armazenamento seguro
- **Refresh Token**: Sistema de renovação automática
- **Validação**: Validação de dados no frontend
- **CORS**: Configuração adequada no backend

### 🔄 Integração:
- **WebSocket**: Para notificações em tempo real
- **Upload de Imagens**: Para fotos de produtos e usuários
- **Stream de Vídeo**: Para monitoramento em tempo real
- **IA Integration**: Para reconhecimento de produtos

### 📱 UX/UI:
- **Loading States**: Estados de carregamento consistentes
- **Error Handling**: Tratamento de erros amigável
- **Offline Mode**: Funcionalidade offline básica
- **Responsividade**: Testes em diferentes dispositivos

### 🧪 Testes:
- **Unit Tests**: Testes unitários para componentes
- **Integration Tests**: Testes de integração com API
- **E2E Tests**: Testes end-to-end

---

## 📋 LEGENDA DE STATUS

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado e funcionando |
| 🔄 | Mock implementado, pronto para backend |
| 🚧 | Em desenvolvimento |
| ❌ | Não implementado |

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **Implementar backend** seguindo a estrutura de endpoints documentada
2. **Configurar autenticação JWT** no backend
3. **Implementar upload de imagens** para fotos
4. **Configurar WebSocket** para notificações em tempo real
5. **Integrar IA** para reconhecimento de produtos
6. **Implementar testes** automatizados
7. **Configurar CI/CD** para deploy automático

---

*Documentação criada em: $(date)*
*Versão do Frontend: 1.0.0*
*Pronto para integração com backend* 