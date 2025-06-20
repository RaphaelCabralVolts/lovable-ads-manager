# Lovable Ads Manager - Backend

Sistema completo de gestão de campanhas digitais (Google Ads + Meta Ads) para gestores de tráfego.

## 🚀 Características

- **Multi-tenant**: Suporte para múltiplos gestores e clientes
- **Autenticação robusta**: JWT + 2FA opcional
- **APIs RESTful**: Endpoints completos para todas as funcionalidades
- **Segurança**: Rate limiting, validação, logs de auditoria
- **Escalabilidade**: Arquitetura modular e otimizada

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd lovable-ads-manager/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente Obrigatórias

```env
MONGODB_URI=mongodb://localhost:27017/lovable-ads-manager
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Configuração do Gateway de Pagamento

Escolha um dos gateways e configure as credenciais:

**Stripe:**
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**PagSeguro:**
```env
PAGSEGURO_EMAIL=your-pagseguro-email@example.com
PAGSEGURO_TOKEN=your-pagseguro-token
```

**Mercado Pago:**
```env
MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-access-token
```

## 📚 API Endpoints

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Dados do usuário logado
- `POST /api/v1/auth/refresh-token` - Renovar token
- `POST /api/v1/auth/logout` - Logout

### 2FA
- `POST /api/v1/auth/2fa/enable` - Habilitar 2FA
- `POST /api/v1/auth/2fa/verify` - Verificar 2FA
- `POST /api/v1/auth/2fa/disable` - Desabilitar 2FA

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Criar cliente
- `GET /api/v1/clients/:id` - Obter cliente
- `PUT /api/v1/clients/:id` - Atualizar cliente
- `DELETE /api/v1/clients/:id` - Deletar cliente
- `GET /api/v1/clients/:id/metrics` - Métricas do cliente

## 🔐 Autenticação e Autorização

### Roles (Papéis)
- **super_admin**: Acesso total ao sistema
- **manager**: Acesso aos próprios clientes e campanhas
- **client**: Acesso apenas aos próprios dados
- **viewer**: Apenas visualização

### Proteção de Rotas
Todas as rotas (exceto auth) requerem token JWT válido:

```javascript
Authorization: Bearer <token>
```

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (DB, Auth, Payment)
├── models/          # Modelos Mongoose
├── routes/          # Rotas da API
├── controllers/     # Lógica de negócio
├── middleware/      # Middlewares (Auth, Validation, Error)
├── services/        # Serviços externos (Email, Payment, AI)
├── utils/           # Utilitários (Logger, Helpers)
└── app.js           # Configuração do Express
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 📊 Logs

Os logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

## 🚀 Deploy

### PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Docker
```bash
docker build -t lovable-ads-manager-backend .
docker run -p 3000:3000 lovable-ads-manager-backend
```

## 🔧 Desenvolvimento

### Scripts Disponíveis
- `npm start` - Iniciar em produção
- `npm run dev` - Iniciar em desenvolvimento (nodemon)
- `npm test` - Executar testes
- `npm run lint` - Verificar código
- `npm run lint:fix` - Corrigir código automaticamente

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para support@lovable-ads-manager.com ou abra uma issue no GitHub.

