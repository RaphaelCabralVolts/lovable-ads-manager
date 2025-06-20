import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Users, 
  Target,
  Plus,
  CheckCircle,
  Settings,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../hooks/useAuth';
import { useClients } from '../hooks/useClients';
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import ClientCard from "@/components/dashboard/ClientCard";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { clients, loading: clientsLoading, fetchClients } = useClients();

  // Mock data para demonstração - será substituído por dados reais da API
  const managerStats = {
    totalClients: clients.length,
    monthlyRevenue: 85600,
    totalAdSpend: 342000,
    averageROAS: 3.8,
    activeClients: clients.filter(c => c.status === 'active').length,
    activeCampaigns: 24,
    conversionRate: 3.2,
    googleAdsSpend: 200000,
    metaAdsSpend: 142000,
    otherPlatformsSpend: 0,
    pendingReports: 3,
    pendingApprovals: 2,
    budgetWarnings: 1,
    alerts: [
      {
        type: 'Orçamento',
        message: 'Fashion Forward está próximo do limite mensal (95%)'
      }
    ]
  };

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    setActiveTab("client-detail");
  };

  const handleSyncData = async () => {
    try {
      await fetchClients();
      toast({
        title: "Dados sincronizados!",
        description: "Métricas atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Digital Marketing</h1>
          <p className="text-gray-600 mt-2">Gestão completa de campanhas digitais</p>
        </div>
        <LoginForm onSuccess={() => {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao CRM Digital Marketing",
          });
        }} />
      </div>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      <MetricsOverview stats={managerStats} loading={clientsLoading} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Seus Clientes</h2>
          <div className="flex space-x-2">
            <Button onClick={handleSyncData} variant="outline" disabled={clientsLoading}>
              <Zap className="w-4 h-4 mr-2" />
              {clientsLoading ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {clientsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : clients.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard
                key={client._id || client.id}
                client={client}
                onClick={handleClientSelect}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro cliente para gerenciar suas campanhas.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Cliente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const ClientDetailView = () => {
    const selectedClient = clients.find(c => (c._id || c.id) === selectedClientId);
    if (!selectedClient) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cliente não encontrado</p>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab("overview")}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setActiveTab("overview")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedClient.name}</h1>
              <p className="text-muted-foreground">Detalhes e campanhas do cliente</p>
            </div>
          </div>
          <Badge variant={selectedClient.status === 'active' ? 'default' : 'secondary'}>
            {selectedClient.status === 'active' ? 'Ativo' : 'Atenção'}
          </Badge>
        </div>

        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Detalhes do Cliente</h3>
          <p className="text-muted-foreground mb-4">
            Visualização detalhada do cliente em desenvolvimento
          </p>
        </div>
      </div>
    );
  };

  const MainDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CRM Digital Marketing</h1>
              <p className="text-sm text-muted-foreground">Gestão Avançada de Campanhas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              APIs Conectadas
            </Badge>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="client-detail">
            <ClientDetailView />
          </TabsContent>
          <TabsContent value="clients">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="campaigns">
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestão de Campanhas</h3>
              <p className="text-muted-foreground mb-4">Integração completa com Google Ads e Meta em desenvolvimento</p>
            </div>
          </TabsContent>
          <TabsContent value="financial">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Módulo Financeiro</h3>
              <p className="text-muted-foreground mb-4">Sistema de faturamento e propostas em desenvolvimento</p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Relatórios Avançados</h3>
              <p className="text-muted-foreground mb-4">Editor de relatórios drag & drop em desenvolvimento</p>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics Avançado</h3>
              <p className="text-muted-foreground mb-4">Sistema de BI e insights de IA em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainDashboard />;
};

export default Index;

