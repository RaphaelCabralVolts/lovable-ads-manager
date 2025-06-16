
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { CampaignManager } from "@/components/campaigns/CampaignManager";
import { useIntegrations } from "@/hooks/useIntegrations";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const { toast } = useToast();
  const { integrations, syncData, metrics } = useIntegrations();

  // Mock data expandido
  const managerStats = {
    totalClients: 12,
    monthlyRevenue: 85600,
    totalAdSpend: 342000,
    averageROAS: 3.8
  };

  const clients = [
    {
      id: 1,
      name: "TechStart Solutions",
      avatar: "/placeholder.svg",
      status: "active" as const,
      monthlyFee: 2500,
      adBudget: 15000,
      adSpent: 12800,
      roas: 4.2,
      lastUpdate: "2h ago",
      alerts: 0,
      campaigns: {
        google: { active: 3, spend: 8500, roas: 4.5 },
        meta: { active: 2, spend: 4300, roas: 3.8 }
      }
    },
    {
      id: 2,
      name: "Fashion Forward",
      avatar: "/placeholder.svg", 
      status: "warning" as const,
      monthlyFee: 1800,
      adBudget: 8000,
      adSpent: 7600,
      roas: 2.1,
      lastUpdate: "5h ago",
      alerts: 2,
      campaigns: {
        google: { active: 2, spend: 4200, roas: 2.3 },
        meta: { active: 3, spend: 3400, roas: 1.9 }
      }
    },
    {
      id: 3,
      name: "Local Restaurant Chain",
      avatar: "/placeholder.svg",
      status: "active" as const,
      monthlyFee: 3200,
      adBudget: 20000,
      adSpent: 18200,
      roas: 5.1,
      lastUpdate: "1h ago",
      alerts: 0,
      campaigns: {
        google: { active: 4, spend: 12000, roas: 5.3 },
        meta: { active: 2, spend: 6200, roas: 4.8 }
      }
    }
  ];

  const mockCampaigns = [
    {
      id: "1",
      name: "Black Friday - Produtos Tech",
      platform: "google" as const,
      status: "active" as const,
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1200,
      conversions: 45,
      roas: 4.2,
      cpc: 2.67,
      ctr: 2.67
    },
    {
      id: "2", 
      name: "Remarketing - Carrinho Abandonado",
      platform: "meta" as const,
      status: "active" as const,
      budget: 2000,
      spent: 1800,
      impressions: 89000,
      clicks: 2100,
      conversions: 38,
      roas: 3.8,
      cpc: 0.86,
      ctr: 2.36
    },
    {
      id: "3",
      name: "Awareness - Novos Produtos",
      platform: "google" as const,
      status: "paused" as const,
      budget: 3000,
      spent: 2100,
      impressions: 32000,
      clicks: 890,
      conversions: 12,
      roas: 1.8,
      cpc: 2.36,
      ctr: 2.78
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao CRM Digital Marketing",
    });
  };

  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
    setActiveTab("client-detail");
  };

  const handleSyncData = async () => {
    await syncData();
    toast({
      title: "Dados sincronizados!",
      description: "Métricas atualizadas com sucesso.",
    });
  };

  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CRM Digital Marketing</h1>
            <p className="text-muted-foreground">Gestão completa de campanhas digitais</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Entrar na Plataforma
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Não tem conta? <Button variant="link" className="p-0 h-auto">Solicitar acesso</Button></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      <MetricsOverview stats={managerStats} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Seus Clientes</h2>
          <div className="flex space-x-2">
            <Button onClick={handleSyncData} variant="outline" disabled={metrics.syncStatus === 'syncing'}>
              <Zap className="w-4 h-4 mr-2" />
              {metrics.syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={handleClientSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const ClientDetailView = () => {
    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient) return <div>Cliente não encontrado</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setActiveTab("overview")}>
              ← Voltar
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

        <CampaignManager clientId={selectedClient.id} campaigns={mockCampaigns} />
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
            {metrics.lastSync && (
              <Badge variant="outline">
                Sync: {metrics.lastSync.toLocaleTimeString()}
              </Badge>
            )}
            <Avatar>
              <AvatarFallback>GM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
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
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestão de Clientes</h3>
              <p className="text-muted-foreground mb-4">Sistema completo de CRM em desenvolvimento</p>
            </div>
          </TabsContent>
          <TabsContent value="campaigns">
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestão de Campanhas</h3>
              <p className="text-muted-foreground mb-4">Integração completa com Google Ads e Meta em desenvolvimento</p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sistema de Relatórios</h3>
              <p className="text-muted-foreground mb-4">Editor drag-and-drop em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainDashboard />;
};

export default Index;
