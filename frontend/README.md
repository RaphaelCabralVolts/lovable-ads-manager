# Lovable Ads Manager - Frontend

Interface moderna e responsiva para o sistema de gestão de campanhas digitais.

## 🚀 Características

- **React 18** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **Integração completa** com backend via API REST

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ Instalação

1. Navegue para o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com a URL da sua API
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Lovable Ads Manager
```

### Integração com Backend

O frontend se conecta automaticamente com o backend através da API REST. Certifique-se de que:

1. O backend esteja rodando na porta 3000
2. As variáveis de ambiente estejam configuradas corretamente
3. O CORS esteja habilitado no backend

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── campaigns/      # Componentes de campanhas
│   └── financial/      # Componentes financeiros
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── lib/                # Utilitários
└── styles/             # Estilos globais
```

## 🎨 Componentes Principais

### Autenticação
- `LoginForm` - Formulário de login com suporte a 2FA
- `useAuth` - Hook para gerenciamento de autenticação

### Dashboard
- `MetricsOverview` - Visão geral das métricas
- `ClientCard` - Card de cliente com informações resumidas

### Hooks Customizados
- `useAuth` - Gerenciamento de autenticação
- `useClients` - Gerenciamento de clientes
- `useCampaigns` - Gerenciamento de campanhas

### Serviços
- `apiService` - Serviço principal para comunicação com a API

## 🚀 Build e Deploy

### Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 🔐 Autenticação

O sistema suporta:
- Login com email/senha
- Autenticação de dois fatores (2FA)
- Refresh tokens automático
- Proteção de rotas baseada em roles

### Roles Suportados
- **super_admin**: Acesso total
- **manager**: Gestão de clientes e campanhas
- **client**: Visualização dos próprios dados
- **viewer**: Apenas visualização

## 📱 Responsividade

O frontend é totalmente responsivo e otimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Funcionalidades Implementadas

### ✅ Concluído
- Sistema de autenticação completo
- Dashboard principal com métricas
- Listagem e visualização de clientes
- Integração com API do backend
- Design responsivo
- Componentes UI modernos

### 🚧 Em Desenvolvimento
- Gestão completa de campanhas
- Editor de relatórios drag & drop
- Sistema financeiro
- Analytics avançado
- Automações
- Client Portal

## 🔧 Desenvolvimento

### Adicionando Novos Componentes
```bash
# Usando shadcn/ui
npx shadcn-ui@latest add [component-name]
```

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
style: ajustes de estilo
refactor: refatoração
docs: documentação
```

## 📞 Suporte

Para suporte técnico, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.

