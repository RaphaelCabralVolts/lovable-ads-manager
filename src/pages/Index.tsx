
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  Eye,
  Pause,
  Play,
  MoreHorizontal,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Mock data for demonstration
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
      status: "active",
      monthlyFee: 2500,
      adBudget: 15000,
      adSpent: 12800,
      roas: 4.2,
      lastUpdate: "2h ago",
      alerts: 0
    },
    {
      id: 2,
      name: "Fashion Forward",
      avatar: "/placeholder.svg", 
      status: "warning",
      monthlyFee: 1800,
      adBudget: 8000,
      adSpent: 7600,
      roas: 2.1,
      lastUpdate: "5h ago",
      alerts: 2
    },
    {
      id: 3,
      name: "Local Restaurant Chain",
      avatar: "/placeholder.svg",
      status: "active",
      monthlyFee: 3200,
      adBudget: 20000,
      adSpent: 18200,
      roas: 5.1,
      lastUpdate: "1h ago",
      alerts: 0
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                <p className="text-3xl font-bold">{managerStats.totalClients}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2 este mês
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-3xl font-bold">R$ {managerStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs mês anterior
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investimento Total</p>
                <p className="text-3xl font-bold">R$ {managerStats.totalAdSpend.toLocaleString()}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Este mês
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROAS Médio</p>
                <p className="text-3xl font-bold">{managerStats.averageROAS}x</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.3 vs mês anterior
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Seus Clientes</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {client.alerts > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {client.alerts} alertas
                      </Badge>
                    )}
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                      {client.status === 'active' ? 'Ativo' : 'Atenção'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Orçamento utilizado</span>
                    <span className="font-medium">
                      R$ {client.adSpent.toLocaleString()} / R$ {client.adBudget.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(client.adSpent / client.adBudget) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Taxa Mensal</p>
                    <p className="font-semibold">R$ {client.monthlyFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROAS</p>
                    <p className={`font-semibold ${client.roas >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                      {client.roas}x
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

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
              Sistema Online
            </Badge>
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
          <TabsContent value="clients">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestão de Clientes</h3>
              <p className="text-muted-foreground mb-4">Em desenvolvimento - Funcionalidades avançadas em breve</p>
            </div>
          </TabsContent>
          <TabsContent value="campaigns">
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestão de Campanhas</h3>
              <p className="text-muted-foreground mb-4">Integração com Google Ads e Meta em desenvolvimento</p>
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
