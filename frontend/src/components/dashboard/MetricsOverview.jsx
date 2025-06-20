import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  AlertTriangle
} from "lucide-react";

const MetricsOverview = ({ stats, loading = false }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const metrics = [
    {
      title: "Total de Clientes",
      value: formatNumber(stats?.totalClients || 0),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(stats?.monthlyRevenue || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Investimento Total",
      value: formatCurrency(stats?.totalAdSpend || 0),
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+15.3%",
      changeType: "positive"
    },
    {
      title: "ROAS Médio",
      value: `${(stats?.averageROAS || 0).toFixed(1)}x`,
      icon: Target,
      color: stats?.averageROAS >= 3 ? "text-green-600" : "text-red-600",
      bgColor: stats?.averageROAS >= 3 ? "bg-green-100" : "bg-red-100",
      change: stats?.averageROAS >= 3 ? "+0.3x" : "-0.2x",
      changeType: stats?.averageROAS >= 3 ? "positive" : "negative"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas Importantes */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    )}
                    <span className={`${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Clientes Ativos</span>
                <span className="font-medium">
                  {stats?.activeClients || 0}/{stats?.totalClients || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Campanhas Ativas</span>
                <span className="font-medium">{stats?.activeCampaigns || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                <span className="font-medium">{(stats?.conversionRate || 0).toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Plataformas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Google Ads</span>
                </div>
                <span className="font-medium">{formatCurrency(stats?.googleAdsSpend || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-800 rounded-full mr-2"></div>
                  <span className="text-sm">Meta Ads</span>
                </div>
                <span className="font-medium">{formatCurrency(stats?.metaAdsSpend || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-sm">Outras</span>
                </div>
                <span className="font-medium">{formatCurrency(stats?.otherPlatformsSpend || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Relatórios Pendentes</div>
                <div className="text-muted-foreground">{stats?.pendingReports || 0} relatórios</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Aprovações Necessárias</div>
                <div className="text-muted-foreground">{stats?.pendingApprovals || 0} campanhas</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Orçamentos Próximos do Limite</div>
                <div className="text-muted-foreground">{stats?.budgetWarnings || 0} clientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsOverview;

