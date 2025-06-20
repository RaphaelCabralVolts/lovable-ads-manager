#!/bin/bash

# =============================================================================
# LOVABLE ADS MANAGER - SCRIPT DE INSTALAÇÃO AUTOMATIZADA
# =============================================================================
# 
# Este script instala automaticamente o sistema Lovable Ads Manager
# em servidores Linux (Ubuntu/Debian/CentOS) via SSH.
# 
# Compatível com:
# - VPS Linux (Ubuntu 20.04+, Debian 10+, CentOS 7+)
# - Hospedagem compartilhada com acesso SSH
# - Hostinger hPanel com SSH habilitado
# 
# Autor: Manus AI
# Versão: 1.0.0
# Data: $(date +%Y-%m-%d)
# =============================================================================

set -e  # Exit on any error

# Cores para output (mantidas para log_info/success/error, mas removidas de read -p)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variáveis globais
SCRIPT_VERSION="1.0.0"
PROJECT_NAME="lovable-ads-manager"
GITHUB_REPO="https://github.com/RaphaelCabralVolts/lovable-ads-manager.git"
INSTALL_DIR=""
DOMAIN=""
SUBDOMAIN="gestor"
MONGODB_URI=""
SMTP_HOST=""
SMTP_USER=""
SMTP_PASS=""
GATEWAY_TYPE=""
GATEWAY_CREDENTIALS=""
NODE_VERSION="18"
NGINX_INSTALLED=false
PM2_INSTALLED=false
MONGODB_INSTALLED=false

# =============================================================================
# FUNÇÕES UTILITÁRIAS
# =============================================================================

# Função para logging com cores
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "\n${PURPLE}[STEP]${NC} $1"
    echo -e "${CYAN}===============================================================================${NC}"
}

# Função para detectar o sistema operacional
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    elif [[ -f /etc/redhat-release ]]; then
        OS="CentOS"
        VER=$(cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+')
    else
        log_error "Sistema operacional não suportado"
        exit 1
    fi
    
    log_info "Sistema detectado: $OS $VER"
}

# Função para verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar se o usuário tem privilégios sudo
check_sudo() {
    if ! sudo -n true 2>/dev/null; then
        log_error "Este script requer privilégios sudo. Execute com 'sudo' ou como root."
        exit 1
    fi
}

# Função para verificar conectividade com a internet
check_internet() {
    log_info "Verificando conectividade com a internet..."
    if ! ping -c 1 google.com >/dev/null 2>&1; then
        log_error "Sem conexão com a internet. Verifique sua conexão e tente novamente."
        exit 1
    fi
    log_success "Conexão com a internet OK"
}

# Função para verificar espaço em disco
check_disk_space() {
    log_info "Verificando espaço em disco..."
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    REQUIRED_SPACE=2097152  # 2GB em KB
    
    if [[ $AVAILABLE_SPACE -lt $REQUIRED_SPACE ]]; then
        log_error "Espaço insuficiente em disco. Necessário: 2GB, Disponível: $(($AVAILABLE_SPACE/1024/1024))GB"
        exit 1
    fi
    log_success "Espaço em disco suficiente: $(($AVAILABLE_SPACE/1024/1024))GB disponível"
}

# =============================================================================
# FUNÇÕES DE CONFIGURAÇÃO INTERATIVA
# =============================================================================

# Função para coletar informações do usuário
collect_user_input() {
    log_step "CONFIGURAÇÃO INICIAL - Coletando informações necessárias"
    
    echo -e "${WHITE}Bem-vindo ao instalador do Lovable Ads Manager!${NC}"
    echo -e "Este assistente irá guiá-lo através da configuração completa do sistema.\n"
    
    # Domínio principal
    while [[ -z "$DOMAIN" ]]; do
        read -p "Digite seu domínio principal (ex: dcraft.com.br): " DOMAIN
        # Regex corrigida para permitir múltiplos subdomínios e TLDs como .com.br
        if [[ ! "$DOMAIN" =~ ^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$ ]]; then
            log_warning "Formato de domínio inválido. Tente novamente."
            DOMAIN=""
        fi
    done
    
    # Subdomínio (padrão: gestor)
    read -p "Digite o subdomínio desejado [gestor]: " input_subdomain
    SUBDOMAIN=${input_subdomain:-gestor}
    
    # Diretório de instalação
    DEFAULT_INSTALL_DIR="/var/www/$SUBDOMAIN"
    read -p "Diretório de instalação [$DEFAULT_INSTALL_DIR]: " input_dir
    INSTALL_DIR=${input_dir:-$DEFAULT_INSTALL_DIR}
    
    log_info "Sistema será instalado em: $SUBDOMAIN.$DOMAIN -> $INSTALL_DIR"
    
    # Configuração do MongoDB
    echo -e "\n${WHITE}=== CONFIGURAÇÃO DO BANCO DE DADOS (MongoDB) ===${NC}"
    echo "1) Instalar MongoDB localmente (recomendado para VPS)"
    echo "2) Usar MongoDB Atlas (cloud)"
    echo "3) Usar MongoDB existente (informar URI)"
    
    while true; do
        read -p "Escolha uma opção [1-3]: " mongodb_choice
        case $mongodb_choice in
            1)
                MONGODB_CHOICE="local"
                MONGODB_URI="mongodb://localhost:27017/$PROJECT_NAME"
                break
                ;;
            2)
                MONGODB_CHOICE="atlas"
                while [[ -z "$MONGODB_URI" ]]; do
                    read -p "Digite a URI do MongoDB Atlas: " MONGODB_URI
                done
                break
                ;;
            3)
                MONGODB_CHOICE="existing"
                while [[ -z "$MONGODB_URI" ]]; do
                    read -p "Digite a URI do MongoDB: " MONGODB_URI
                done
                break
                ;;
            *)
                log_warning "Opção inválida. Escolha 1, 2 ou 3."
                ;;
        esac
    done
    
    # Configuração SMTP
    echo -e "\n${WHITE}=== CONFIGURAÇÃO DE EMAIL (SMTP) ===${NC}"
    echo "Configure o SMTP para envio de emails (relatórios, notificações, etc.)"
    
    while [[ -z "$SMTP_HOST" ]]; do
        read -p "Servidor SMTP (ex: smtp.gmail.com): " SMTP_HOST
    done
    
    read -p "Porta SMTP [587]: " smtp_port
    SMTP_PORT=${smtp_port:-587}
    
    while [[ -z "$SMTP_USER" ]]; do
        read -p "Usuário SMTP (email): " SMTP_USER
    done
    
    while [[ -z "$SMTP_PASS" ]]; do
        read -s -p "Senha SMTP: " SMTP_PASS
        echo
    done
    
    # Configuração do Gateway de Pagamento
    echo -e "\n${WHITE}=== CONFIGURAÇÃO DO GATEWAY DE PAGAMENTO ===${NC}"
    echo "1) Stripe (Internacional)"
    echo "2) PagSeguro (Brasil)"
    echo "3) Mercado Pago (América Latina)"
    echo "4) Configurar depois"
    
    while true; do
        read -p "Escolha o gateway de pagamento [1-4]: " gateway_choice
        case $gateway_choice in
            1)
                GATEWAY_TYPE="stripe"
                collect_stripe_credentials
                break
                ;;
            2)
                GATEWAY_TYPE="pagseguro"
                collect_pagseguro_credentials
                break
                ;;
            3)
                GATEWAY_TYPE="mercadopago"
                collect_mercadopago_credentials
                break
                ;;
            4)
                GATEWAY_TYPE="none"
                log_info "Gateway de pagamento será configurado posteriormente"
                break
                ;;
            *)
                log_warning "Opção inválida. Escolha 1, 2, 3 ou 4."
                ;;
        esac
    done
    
    # Confirmação final
    echo -e "\n${WHITE}=== RESUMO DA CONFIGURAÇÃO ===${NC}"
    echo -e "Domínio: ${GREEN}$SUBDOMAIN.$DOMAIN${NC}"
    echo -e "Diretório: ${GREEN}$INSTALL_DIR${NC}"
    echo -e "MongoDB: ${GREEN}$MONGODB_CHOICE${NC}"
    echo -e "SMTP: ${GREEN}$SMTP_HOST:$SMTP_PORT${NC}"
    echo -e "Gateway: ${GREEN}$GATEWAY_TYPE${NC}"
    
    echo
    read -p "Confirma a instalação com essas configurações? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Instalação cancelada pelo usuário."
        exit 0
    fi
}

# Função para coletar credenciais do Stripe
collect_stripe_credentials() {
    echo -e "\n${WHITE}=== CREDENCIAIS DO STRIPE ===${NC}"
    read -p "Chave pública do Stripe: " STRIPE_PUBLIC_KEY
    read -s -p "Chave secreta do Stripe: " STRIPE_SECRET_KEY
    echo
    read -s -p "Webhook secret do Stripe: " STRIPE_WEBHOOK_SECRET
    echo
}

# Função para coletar credenciais do PagSeguro
collect_pagseguro_credentials() {
    echo -e "\n${WHITE}=== CREDENCIAIS DO PAGSEGURO ===${NC}"
    read -p "Email do PagSeguro: " PAGSEGURO_EMAIL
    read -s -p "Token do PagSeguro: " PAGSEGURO_TOKEN
    echo
    read -p "Usar sandbox? [y/N]: " pagseguro_sandbox
    PAGSEGURO_SANDBOX=${pagseguro_sandbox:-n}
}

# Função para coletar credenciais do Mercado Pago
collect_mercadopago_credentials() {
    echo -e "\n${WHITE}=== CREDENCIAIS DO MERCADO PAGO ===${NC}"
    read -s -p "Access Token do Mercado Pago: " MERCADOPAGO_ACCESS_TOKEN
    echo
    read -p "Chave pública do Mercado Pago: " MERCADOPAGO_PUBLIC_KEY
}

# =============================================================================
# FUNÇÕES DE INSTALAÇÃO DE DEPENDÊNCIAS
# =============================================================================

# Função para atualizar o sistema
update_system() {
    log_step "ATUALIZANDO O SISTEMA"
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        log_info "Atualizando pacotes do sistema (apt)..."
        sudo apt update -y
        sudo apt upgrade -y
        sudo apt install -y curl wget git unzip software-properties-common
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        log_info "Atualizando pacotes do sistema (yum/dnf)..."
        if command_exists dnf; then
            sudo dnf update -y
            sudo dnf install -y curl wget git unzip
        else
            sudo yum update -y
            sudo yum install -y curl wget git unzip
        fi
    fi
    
    log_success "Sistema atualizado com sucesso"
}

# Função para instalar Node.js
install_nodejs() {
    log_step "INSTALANDO NODE.JS"
    
    if command_exists node; then
        CURRENT_NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $CURRENT_NODE_VERSION -ge $NODE_VERSION ]]; then
            log_success "Node.js já está instalado (versão $(node --version))"
            return
        fi
    fi
    
    log_info "Instalando Node.js $NODE_VERSION via NodeSource..."
    
    # Instalar NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        if command_exists dnf; then
            sudo dnf install -y nodejs npm
        else
            sudo yum install -y nodejs npm
        fi
    fi
    
    # Verificar instalação
    if command_exists node && command_exists npm; then
        log_success "Node.js $(node --version) e npm $(npm --version) instalados com sucesso"
    else
        log_error "Falha na instalação do Node.js"
        exit 1
    fi
}

# Função para instalar PM2
install_pm2() {
    log_step "INSTALANDO PM2 (GERENCIADOR DE PROCESSOS)"
    
    if command_exists pm2; then
        log_success "PM2 já está instalado"
        PM2_INSTALLED=true
        return
    fi
    
    log_info "Instalando PM2 globalmente..."
    sudo npm install -g pm2
    
    # Configurar PM2 para iniciar com o sistema
    sudo pm2 startup
    
    if command_exists pm2; then
        log_success "PM2 instalado com sucesso"
        PM2_INSTALLED=true
    else
        log_error "Falha na instalação do PM2"
        exit 1
    fi
}

# Função para instalar MongoDB
install_mongodb() {
    if [[ "$MONGODB_CHOICE" != "local" ]]; then
        log_info "Pulando instalação do MongoDB (usando $MONGODB_CHOICE)"
        return
    fi
    
    log_step "INSTALANDO MONGODB"
    
    if command_exists mongod; then
        log_success "MongoDB já está instalado"
        MONGODB_INSTALLED=true
        return
    fi
    
    log_info "Instalando MongoDB Community Edition..."
    
    if [[ "$OS" == *"Ubuntu"* ]]; then
        # Importar chave pública do MongoDB
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        
        # Adicionar repositório do MongoDB
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        # Atualizar e instalar
        sudo apt update
        sudo apt install -y mongodb-org
        
    elif [[ "$OS" == *"Debian"* ]]; then
        # Importar chave pública do MongoDB
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        
        # Adicionar repositório do MongoDB
        echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        # Atualizar e instalar
        sudo apt update
        sudo apt install -y mongodb-org
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        # Criar arquivo de repositório do MongoDB
        sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo > /dev/null <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
        
        # Instalar MongoDB
        if command_exists dnf; then
            sudo dnf install -y mongodb-org
        else
            sudo yum install -y mongodb-org
        fi
    fi
    
    # Iniciar e habilitar MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    # Verificar instalação
    if command_exists mongod && sudo systemctl is-active --quiet mongod; then
        log_success "MongoDB instalado e iniciado com sucesso"
        MONGODB_INSTALLED=true
    else
        log_error "Falha na instalação ou inicialização do MongoDB"
        exit 1
    fi
}

# Função para instalar Nginx
install_nginx() {
    log_step "INSTALANDO NGINX"
    
    if command_exists nginx; then
        log_success "Nginx já está instalado"
        NGINX_INSTALLED=true
        return
    fi
    
    log_info "Instalando Nginx..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt install -y nginx
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        if command_exists dnf; then
            sudo dnf install -y nginx
        else
            sudo yum install -y nginx
        fi
    fi
    
    # Iniciar e habilitar Nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Verificar instalação
    if command_exists nginx && sudo systemctl is-active --quiet nginx; then
        log_success "Nginx instalado e iniciado com sucesso"
        NGINX_INSTALLED=true
    else
        log_error "Falha na instalação ou inicialização do Nginx"
        exit 1
    fi
}

# =============================================================================
# FUNÇÕES DE INSTALAÇÃO DA APLICAÇÃO
# =============================================================================

# Função para clonar o repositório
clone_repository() {
    log_step "CLONANDO REPOSITÓRIO DO GITHUB"
    
    # Criar diretório de instalação
    sudo mkdir -p "$INSTALL_DIR"
    sudo chown $USER:$USER "$INSTALL_DIR"
    
    log_info "Clonando repositório de $GITHUB_REPO..."
    
    if [[ -d "$INSTALL_DIR/.git" ]]; then
        log_info "Repositório já existe. Atualizando..."
        cd "$INSTALL_DIR"
        git pull origin main
    else
        git clone "$GITHUB_REPO" "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi
    
    log_success "Repositório clonado/atualizado com sucesso"
}

# Função para instalar dependências do backend
install_backend_dependencies() {
    log_step "INSTALANDO DEPENDÊNCIAS DO BACKEND"
    
    cd "$INSTALL_DIR/backend"
    
    log_info "Instalando dependências do Node.js..."
    npm install --production
    
    log_success "Dependências do backend instaladas com sucesso"
}

# Função para instalar dependências do frontend
install_frontend_dependencies() {
    log_step "INSTALANDO DEPENDÊNCIAS DO FRONTEND"
    
    cd "$INSTALL_DIR/frontend"
    
    log_info "Instalando dependências do React..."
    npm install
    
    log_info "Construindo aplicação para produção..."
    npm run build
    
    log_success "Frontend construído com sucesso"
}

# Função para configurar variáveis de ambiente
configure_environment() {
    log_step "CONFIGURANDO VARIÁVEIS DE AMBIENTE"
    
    # Configurar backend
    cd "$INSTALL_DIR/backend"
    
    log_info "Criando arquivo .env do backend..."
    
    # Gerar JWT secrets
    JWT_SECRET=$(openssl rand -base64 64)
    JWT_REFRESH_SECRET=$(openssl rand -base64 64)
    WEBHOOK_SECRET=$(openssl rand -base64 32)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Configurações do Banco de Dados
MONGODB_URI=$MONGODB_URI

# Configurações JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRE=7d

# Configurações do Servidor
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Configurações de CORS
CORS_ORIGIN=https://$SUBDOMAIN.$DOMAIN,http://$SUBDOMAIN.$DOMAIN

# Configurações de Email (SMTP)
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_SECURE=false
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
FROM_EMAIL=noreply@$DOMAIN
FROM_NAME=Lovable Ads Manager

EOF

    # Adicionar configurações do gateway de pagamento
    case $GATEWAY_TYPE in
        "stripe")
            cat >> .env << EOF
# Configurações do Stripe
STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

EOF
            ;;
        "pagseguro")
            cat >> .env << EOF
# Configurações do PagSeguro
PAGSEGURO_EMAIL=$PAGSEGURO_EMAIL
PAGSEGURO_TOKEN=$PAGSEGURO_TOKEN
PAGSEGURO_SANDBOX=$([[ "$PAGSEGURO_SANDBOX" =~ ^[Yy]$ ]] && echo "true" || echo "false")

EOF
            ;;
        "mercadopago")
            cat >> .env << EOF
# Configurações do Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=$MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_PUBLIC_KEY=$MERCADOPAGO_PUBLIC_KEY

EOF
            ;;
    esac

    # Adicionar configurações restantes
    cat >> .env << EOF
# Configurações de Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,application/pdf

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configurações de Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Configurações de Webhook
WEBHOOK_SECRET=$WEBHOOK_SECRET

# Configurações de Cron Jobs
ENABLE_CRON_JOBS=true
METRICS_SYNC_INTERVAL=0 */15 * * * *
AUTOMATION_CHECK_INTERVAL=0 */5 * * * *

# Configurações de Segurança
BCRYPT_ROUNDS=12
SESSION_SECRET=$WEBHOOK_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# URL Base da Aplicação
APP_URL=https://$SUBDOMAIN.$DOMAIN
FRONTEND_URL=https://$SUBDOMAIN.$DOMAIN
EOF

    # Configurar frontend
    cd "$INSTALL_DIR/frontend"
    
    log_info "Criando arquivo .env do frontend..."
    
    cat > .env << EOF
VITE_API_URL=https://$SUBDOMAIN.$DOMAIN/api/v1
VITE_APP_NAME=Lovable Ads Manager
VITE_APP_VERSION=1.0.0
EOF

    # Criar diretórios necessários
    mkdir -p "$INSTALL_DIR/backend/logs"
    mkdir -p "$INSTALL_DIR/backend/uploads"
    
    # Definir permissões
    chmod 600 "$INSTALL_DIR/backend/.env"
    chmod 755 "$INSTALL_DIR/backend/logs"
    chmod 755 "$INSTALL_DIR/backend/uploads"
    
    log_success "Variáveis de ambiente configuradas com sucesso"
}

# =============================================================================
# FUNÇÕES DE CONFIGURAÇÃO DO SERVIDOR WEB
# =============================================================================

# Função para configurar Nginx
configure_nginx() {
    log_step "CONFIGURANDO NGINX"
    
    log_info "Criando configuração do Nginx para $SUBDOMAIN.$DOMAIN..."
    
    # Criar configuração do site
    sudo tee /etc/nginx/sites-available/$SUBDOMAIN.$DOMAIN > /dev/null << EOF
server {
    listen 80;
    server_name $SUBDOMAIN.$DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $SUBDOMAIN.$DOMAIN;
    
    # SSL Configuration (será configurado com Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/$SUBDOMAIN.$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$SUBDOMAIN.$DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Root directory for frontend
    root $INSTALL_DIR/frontend/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend routes (React Router)
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API routes (proxy to backend)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
    
    # Uploads
    location /uploads/ {
        alias $INSTALL_DIR/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|conf)$ {
        deny all;
    }
}
EOF

    # Habilitar site
    sudo ln -sf /etc/nginx/sites-available/$SUBDOMAIN.$DOMAIN /etc/nginx/sites-enabled/
    
    # Remover configuração padrão se existir
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    if sudo nginx -t; then
        log_success "Configuração do Nginx criada com sucesso"
    else
        log_error "Erro na configuração do Nginx"
        exit 1
    fi
}

# Função para instalar SSL com Let's Encrypt
install_ssl() {
    log_step "CONFIGURANDO SSL COM LET'S ENCRYPT"
    
    # Instalar Certbot
    if ! command_exists certbot; then
        log_info "Instalando Certbot..."
        
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            sudo apt install -y certbot python3-certbot-nginx
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            if command_exists dnf; then
                sudo dnf install -y certbot python3-certbot-nginx
            else
                sudo yum install -y certbot python3-certbot-nginx
            fi
        fi
    fi
    
    # Configuração temporária do Nginx sem SSL
    sudo tee /etc/nginx/sites-available/$SUBDOMAIN.$DOMAIN > /dev/null << EOF
server {
    listen 80;
    server_name $SUBDOMAIN.$DOMAIN;
    
    root $INSTALL_DIR/frontend/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Recarregar Nginx
    sudo systemctl reload nginx
    
    # Obter certificado SSL
    log_info "Obtendo certificado SSL para $SUBDOMAIN.$DOMAIN..."
    
    if sudo certbot --nginx -d $SUBDOMAIN.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
        log_success "Certificado SSL instalado com sucesso"
        
        # Configurar renovação automática
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
        
    else
        log_warning "Falha ao obter certificado SSL. Continuando sem HTTPS..."
        
        # Manter configuração HTTP
        sudo tee /etc/nginx/sites-available/$SUBDOMAIN.$DOMAIN > /dev/null << EOF
server {
    listen 80;
    server_name $SUBDOMAIN.$DOMAIN;
    
    root $INSTALL_DIR/frontend/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    fi
    
    # Recarregar Nginx
    sudo systemctl reload nginx
}

# =============================================================================
# FUNÇÕES DE INICIALIZAÇÃO DA APLICAÇÃO
# =============================================================================

# Função para configurar PM2
configure_pm2() {
    log_step "CONFIGURANDO PM2 PARA O BACKEND"
    
    cd "$INSTALL_DIR/backend"
    
    # Criar arquivo de configuração do PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME-backend',
    script: 'server.js',
    cwd: '$INSTALL_DIR/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$INSTALL_DIR/backend/logs/pm2-error.log',
    out_file: '$INSTALL_DIR/backend/logs/pm2-out.log',
    log_file: '$INSTALL_DIR/backend/logs/pm2-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

    # Parar aplicação se estiver rodando
    pm2 delete $PROJECT_NAME-backend 2>/dev/null || true
    
    # Iniciar aplicação
    log_info "Iniciando aplicação com PM2..."
    pm2 start ecosystem.config.js
    
    # Salvar configuração do PM2
    pm2 save
    
    # Verificar se a aplicação está rodando
    sleep 5
    if pm2 list | grep -q $PROJECT_NAME-backend; then
        log_success "Aplicação iniciada com sucesso via PM2"
    else
        log_error "Falha ao iniciar aplicação com PM2"
        pm2 logs $PROJECT_NAME-backend --lines 20
        exit 1
    fi
}

# =============================================================================
# FUNÇÕES DE VERIFICAÇÃO E TESTES
# =============================================================================

# Função para testar a instalação
test_installation() {
    log_step "TESTANDO A INSTALAÇÃO"
    
    # Testar backend
    log_info "Testando backend..."
    sleep 10  # Aguardar inicialização completa
    
    if curl -f -s http://localhost:3000/health > /dev/null; then
        log_success "Backend respondendo corretamente"
    else
        log_error "Backend não está respondendo"
        pm2 logs $PROJECT_NAME-backend --lines 20
        exit 1
    fi
    
    # Testar Nginx
    log_info "Testando Nginx..."
    if sudo systemctl is-active --quiet nginx; then
        log_success "Nginx está ativo"
    else
        log_error "Nginx não está ativo"
        sudo systemctl status nginx
        exit 1
    fi
    
    # Testar MongoDB (se local)
    if [[ "$MONGODB_CHOICE" == "local" ]]; then
        log_info "Testando MongoDB..."
        if sudo systemctl is-active --quiet mongod; then
            log_success "MongoDB está ativo"
        else
            log_error "MongoDB não está ativo"
            sudo systemctl status mongod
            exit 1
        fi
    fi
    
    # Testar acesso web
    log_info "Testando acesso web..."
    PROTOCOL="http"
    if [[ -f "/etc/letsencrypt/live/$SUBDOMAIN.$DOMAIN/fullchain.pem" ]]; then
        PROTOCOL="https"
    fi
    
    if curl -f -s -I $PROTOCOL://$SUBDOMAIN.$DOMAIN > /dev/null; then
        log_success "Site acessível em $PROTOCOL://$SUBDOMAIN.$DOMAIN"
    else
        log_warning "Site pode não estar acessível externamente. Verifique DNS e firewall."
    fi
}

# =============================================================================
# FUNÇÃO PRINCIPAL
# =============================================================================

main() {
    echo -e "${CYAN}"
    echo "==============================================================================="
    echo "                    LOVABLE ADS MANAGER - INSTALADOR v$SCRIPT_VERSION"
    echo "==============================================================================="
    echo -e "${NC}"
    echo -e "${WHITE}Sistema completo de gestão de campanhas digitais${NC}"
    echo -e "${WHITE}Instalação automatizada para servidores Linux${NC}"
    echo
    
    # Verificações iniciais
    detect_os # Mantida, mas se der erro, você pode comentar esta linha manualmente no seu server
    check_sudo
    check_internet
    check_disk_space
    
    # Coletar informações do usuário
    collect_user_input
    
    # Instalação das dependências
    update_system
    install_nodejs
    install_pm2
    install_mongodb
    install_nginx
    
    # Instalação da aplicação
    clone_repository
    install_backend_dependencies
    install_frontend_dependencies
    configure_environment
    
    # Configuração do servidor web
    configure_nginx
    install_ssl
    
    # Inicialização da aplicação
    configure_pm2
    
    # Testes finais
    test_installation
    
    # Mensagem final
    log_step "INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    
    echo -e "${GREEN}"
    echo "==============================================================================="
    echo "                           INSTALAÇÃO FINALIZADA!"
    echo "==============================================================================="
    echo -e "${NC}"
    echo
    echo -e "${WHITE}🎉 O Lovable Ads Manager foi instalado com sucesso!${NC}"
    echo
    echo -e "${CYAN}📍 Informações de Acesso:${NC}"
    
    PROTOCOL="http"
    if [[ -f "/etc/letsencrypt/live/$SUBDOMAIN.$DOMAIN/fullchain.pem" ]]; then
        PROTOCOL="https"
    fi
    
    echo -e "   🌐 URL: ${GREEN}$PROTOCOL://$SUBDOMAIN.$DOMAIN${NC}"
    echo -e "   📁 Diretório: ${GREEN}$INSTALL_DIR${NC}"
    echo -e "   🗄️  Banco: ${GREEN}$MONGODB_CHOICE${NC}"
    echo
    echo -e "${CYAN}🔧 Comandos Úteis:${NC}"
    echo -e "   • Ver logs: ${YELLOW}pm2 logs $PROJECT_NAME-backend${NC}"
    echo -e "   • Reiniciar: ${YELLOW}pm2 restart $PROJECT_NAME-backend${NC}"
    echo -e "   • Status: ${YELLOW}pm2 status${NC}"
    echo -e "   • Nginx: ${YELLOW}sudo systemctl status nginx${NC}"
    echo
    echo -e "${CYAN}📚 Próximos Passos:${NC}"
    echo -e "   1. Acesse $PROTOCOL://$SUBDOMAIN.$DOMAIN"
    echo -e "   2. Crie sua conta de administrador"
    echo -e "   3. Configure as integrações com Google Ads e Meta"
    echo -e "   4. Adicione seus primeiros clientes"
    echo
    echo -e "${YELLOW}⚠️  Importante:${NC}"
    echo -e "   • Mantenha suas credenciais seguras"
    echo -e "   • Configure backups regulares"
    echo -e "   • Monitore os logs regularmente"
    echo
    echo -e "${GREEN}✅ Instalação concluída em $(date)${NC}"
    echo
}

# Executar função principal
main "$@"
