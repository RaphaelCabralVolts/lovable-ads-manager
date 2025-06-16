
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download,
  Share2,
  Calendar,
  TrendingUp,
  Target,
  Users,
  DollarSign
} from "lucide-react";

const performanceData = [
  { month: 'Jan', roas: 3.2, spend: 45000, revenue: 144000 },
  { month: 'Fev', roas: 3.8, spend: 52000, revenue: 197600 },
  { month: 'Mar', roas: 4.1, spend: 48000, revenue: 196800 },
  { month: 'Abr', roas: 3.9, spend: 55000, revenue: 214500 },
  { month: 'Mai', roas: 4.3, spend: 60000, revenue: 258000 },
  { month: 'Jun', roas: 4.6, spend: 58000, revenue: 266800 },
];

const platformData = [
  { name: 'Google Ads', value: 45, color: '#4285F4' },
  { name: 'Meta Ads', value: 35, color: '#1877F2' },
  { name: 'YouTube', value: 12, color: '#FF0000' },
  { name: 'TikTok', value: 8, color: '#000000' }
];

const clientsData = [
  { name: 'TechStart', roas: 4.2, spend: 15000, revenue: 63000 },
  { name: 'Fashion Forward', roas: 2.1, spend: 8000, revenue: 16800 },
  { name: 'Restaurant Chain', roas: 5.1, spend: 20000, revenue: 102000 },
  { name: 'E-commerce Plus', roas: 3.8, spend: 12000, revenue: 45600 }
];

export const AdvancedReports = () => {
  const chartConfig = {
    roas: {
      label: "ROAS",
      color: "#2563eb",
    },
    spend: {
      label: "Investimento",
      color: "#dc2626",
    },
    revenue: {
      label: "Receita",
      color: "#16a34a",
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Avançados</h2>
          <p className="text-muted-foreground">Análise detalhada de performance e ROI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clients">Por Cliente</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROAS Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2x</div>
                <Badge variant="default" className="mt-1">+8% vs anterior</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 318K</div>
                <Badge variant="secondary" className="mt-1">Este mês</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 1.3M</div>
                <Badge variant="default" className="mt-1">+15% vs anterior</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <Badge variant="default" className="mt-1">+2 novos</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="roas" 
                      stroke="var(--color-roas)" 
                      strokeWidth={3}
                      name="ROAS"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="var(--color-spend)" 
                      strokeWidth={2}
                      name="Investimento"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" name="Receita" />
                    <Bar dataKey="spend" fill="var(--color-spend)" name="Investimento" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientsData.map((client) => (
                  <div key={client.name} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ROAS: {client.roas}x | Investimento: R$ {client.spend.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R$ {client.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Receita gerada</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[300px] w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-sm">{platform.name}: {platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
