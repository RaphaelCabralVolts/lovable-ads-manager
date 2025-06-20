# Lovable Ads Manager - Sistema Completo

Sistema completo de gestão de campanhas digitais (Google Ads + Meta Ads) para gestores de tráfego.

## 🚀 Características Principais

- **Multi-tenant**: Suporte para múltiplos gestores e clientes
- **Integração completa**: Google Ads + Meta Ads APIs
- **Dashboard avançado**: Métricas em tempo real e insights
- **Sistema financeiro**: Propostas, faturamento e controle de orçamento
- **Relatórios personalizáveis**: Editor drag & drop
- **Automações inteligentes**: Otimização automática de campanhas
- **Client Portal**: Área exclusiva para clientes
- **PWA**: Funciona como app nativo

## 📋 Requisitos do Sistema

### VPS Recomendada (Configuração Mínima)
- **vCPUs**: 2 cores
- **RAM**: 4 GB
- **Armazenamento**: 80 GB SSD
- **OS**: Ubuntu Server 22.04 LTS
- **Largura de banda**: Ilimitada

### Hospedagem Compartilhada
- **Hostinger**: Business ou superior com SSH
- **Outras**: Qualquer hospedagem com Node.js e SSH

## 🛠️ Instalação Rápida

### Método 1: Script Automatizado (Recomendado)

```bash
# 1. Conecte via SSH ao seu servidor
ssh usuario@seu-servidor.com

# 2. Baixe e execute o instalador
curl -fsSL https://raw.githubusercontent.com/RaphaelCabralVolts/lovable-ads-manager/main/install.sh | bash

# 3. Siga as instruções interativas
```

### Método 2: Instalação Manual

```bash
# 1. Clone o repositório
git clone https://github.com/RaphaelCabralVolts/lovable-ads-manager.git
cd lovable-ads-manager

# 2. Execute o script de instalação
chmod +x install.sh
sudo ./install.sh

# 3. Siga as instruções
```

## 🔧 Configuração Inicial

O script de instalação irá solicitar:

### 1. Configurações Básicas
- **Domínio**: Seu domínio principal (ex: dcraft.com.br)
- **Subdomínio**: Subdomínio para o sistema (padrão: gestor)
- **Diretório**: Local de instalação (padrão: /var/www/gestor)

### 2. Banco de Dados (MongoDB)
- **Opção 1**: Instalação local (recomendado para VPS)
- **Opção 2**: MongoDB Atlas (cloud)
- **Opção 3**: MongoDB existente

### 3. Configurações de Email (SMTP)
- **Servidor SMTP**: Ex: smtp.gmail.com
- **Porta**: 587 (padrão)
- **Usuário**: Seu email
- **Senha**: Senha do email ou app password

### 4. Gateway de Pagamento
- **Stripe**: Para pagamentos internacionais
- **PagSeguro**: Para o mercado brasileiro
- **Mercado Pago**: Para América Latina
- **Configurar depois**: Pular configuração inicial

## 🏗️ Arquitetura do Sistema

```
lovable-ads-manager/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── models/         # Modelos MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Serviços externos
│   │   └── utils/          # Utilitários
│   ├── package.json
│   └── server.js
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Serviços de API
│   │   └── styles/         # Estilos
│   ├── package.json
│   └── vite.config.ts
├── install.sh              # Script de instalação
└── README.md
```

## 🔐 Segurança

### Recursos Implementados
- **Autenticação JWT**: Tokens seguros com refresh
- **2FA**: Autenticação de dois fatores opcional
- **Rate Limiting**: Proteção contra ataques
- **CORS**: Configuração adequada de CORS
- **SSL/HTTPS**: Certificados Let's Encrypt automáticos
- **Validação**: Validação rigorosa de dados
- **Logs**: Sistema completo de auditoria

### Boas Práticas
- Senhas criptografadas com bcrypt
- Variáveis de ambiente para credenciais
- Headers de segurança configurados
- Proteção contra XSS e CSRF

## 📊 Funcionalidades

### ✅ Implementadas
- [x] Sistema de autenticação completo
- [x] Dashboard principal com métricas
- [x] Gestão de clientes
- [x] API REST completa
- [x] Interface responsiva
- [x] Sistema de logs
- [x] Configuração via .env

### 🚧 Em Desenvolvimento
- [ ] Integração Google Ads API
- [ ] Integração Meta Ads API
- [ ] Editor de relatórios drag & drop
- [ ] Sistema de automações
- [ ] Analytics avançado
- [ ] Client Portal
- [ ] Sistema de billing completo

## 🚀 Deploy e Produção

### Comandos Úteis

```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs lovable-ads-manager-backend

# Reiniciar aplicação
pm2 restart lovable-ads-manager-backend

# Parar aplicação
pm2 stop lovable-ads-manager-backend

# Verificar Nginx
sudo systemctl status nginx

# Verificar MongoDB (se local)
sudo systemctl status mongod

# Renovar SSL
sudo certbot renew
```

### Monitoramento

```bash
# Verificar uso de recursos
htop

# Verificar espaço em disco
df -h

# Verificar logs do sistema
sudo journalctl -f

# Verificar logs da aplicação
tail -f /var/www/gestor/backend/logs/app.log
```

## 🔧 Desenvolvimento

### Ambiente Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

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

## 📞 Suporte

### Documentação
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)
- [Installation Guide](./docs/installation.md)

### Troubleshooting

**Problema**: Aplicação não inicia
```bash
# Verificar logs
pm2 logs lovable-ads-manager-backend

# Verificar variáveis de ambiente
cat /var/www/gestor/backend/.env

# Reiniciar serviços
sudo systemctl restart nginx
pm2 restart all
```

**Problema**: Erro de conexão com MongoDB
```bash
# Verificar status do MongoDB
sudo systemctl status mongod

# Verificar logs do MongoDB
sudo journalctl -u mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

**Problema**: SSL não funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Verificar configuração do Nginx
sudo nginx -t
```

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ por Manus AI**
