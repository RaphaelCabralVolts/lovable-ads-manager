
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Target,
  Zap,
  Activity
} from "lucide-react";

interface MetricsOverviewProps {
  stats: {
    totalClients: number;
    monthlyRevenue: number;
    totalAdSpend: number;
    averageROAS: number;
  };
}

export const MetricsOverview = ({ stats }: MetricsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
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
              <p className="text-3xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</p>
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
              <p className="text-3xl font-bold">R$ {stats.totalAdSpend.toLocaleString()}</p>
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
              <p className="text-3xl font-bold">{stats.averageROAS}x</p>
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
  );
};
