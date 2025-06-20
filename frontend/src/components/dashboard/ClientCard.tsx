
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Client {
  id: number;
  name: string;
  avatar: string;
  status: 'active' | 'warning' | 'paused';
  monthlyFee: number;
  adBudget: number;
  adSpent: number;
  roas: number;
  lastUpdate: string;
  alerts: number;
  campaigns: {
    google: { active: number; spend: number; roas: number };
    meta: { active: number; spend: number; roas: number };
  };
}

interface ClientCardProps {
  client: Client;
  onClick: (clientId: number) => void;
}

export const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const budgetUsagePercent = (client.adSpent / client.adBudget) * 100;
  const isHighRoas = client.roas >= 3;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(client.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
              {client.status === 'active' ? 
                <CheckCircle className="w-3 h-3 mr-1" /> : 
                <AlertTriangle className="w-3 h-3 mr-1" />
              }
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
          <Progress value={budgetUsagePercent} className="h-2" />
          {budgetUsagePercent > 90 && (
            <p className="text-xs text-red-600 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Orçamento quase esgotado
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Taxa Mensal</p>
            <p className="font-semibold">R$ {client.monthlyFee.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ROAS</p>
            <p className={`font-semibold flex items-center ${isHighRoas ? 'text-green-600' : 'text-red-600'}`}>
              {isHighRoas ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {client.roas}x
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-blue-600 font-medium">Google Ads</p>
            <p>{client.campaigns.google.active} campanhas</p>
            <p>ROAS: {client.campaigns.google.roas}x</p>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <p className="text-purple-600 font-medium">Meta Ads</p>
            <p>{client.campaigns.meta.active} campanhas</p>
            <p>ROAS: {client.campaigns.meta.roas}x</p>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onClick(client.id); }}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
