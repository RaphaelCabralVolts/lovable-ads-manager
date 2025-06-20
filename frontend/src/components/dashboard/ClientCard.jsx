import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Target,
  Users,
  BarChart3
} from "lucide-react";

const ClientCard = ({ client, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'warning': return 'Atenção';
      case 'inactive': return 'Inativo';
      default: return 'Pendente';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const budgetPercentage = client.monthlyBudget > 0 
    ? Math.round((client.currentSpend / client.monthlyBudget) * 100)
    : 0;

  const isOverBudget = budgetPercentage > 100;
  const isNearLimit = budgetPercentage >= 80;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick?.(client.id || client._id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={client.logo} alt={client.name} />
              <AvatarFallback>
                {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {client.contactEmail}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(client.status)} text-white`}
            >
              {getStatusText(client.status)}
            </Badge>
            {client.alerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {client.alerts}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              Taxa Mensal
            </div>
            <p className="text-lg font-semibold">
              {formatCurrency(client.monthlyFee)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Target className="w-4 h-4 mr-1" />
              ROAS
            </div>
            <div className="flex items-center">
              <p className={`text-lg font-semibold ${
                client.roas >= 3 ? 'text-green-600' : 'text-red-600'
              }`}>
                {client.roas.toFixed(1)}x
              </p>
              {client.roas >= 3 ? (
                <TrendingUp className="w-4 h-4 ml-1 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 ml-1 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Orçamento */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Orçamento do Mês</span>
            <span className="text-sm font-medium">
              {formatCurrency(client.currentSpend || client.adSpent)} / {formatCurrency(client.monthlyBudget || client.adBudget)}
            </span>
          </div>
          <Progress 
            value={budgetPercentage} 
            className={`h-2 ${
              isOverBudget ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-green-100'
            }`}
          />
          <div className="flex justify-between items-center text-xs">
            <span className={`${
              isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {budgetPercentage}% utilizado
            </span>
            <span className="text-muted-foreground">
              {client.lastUpdate}
            </span>
          </div>
        </div>

        {/* Campanhas por Plataforma */}
        {client.campaigns && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Google Ads</div>
              <div className="flex items-center justify-center space-x-1">
                <BarChart3 className="w-3 h-3 text-blue-600" />
                <span className="text-sm font-medium">
                  {client.campaigns.google?.active || 0}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                ROAS: {client.campaigns.google?.roas?.toFixed(1) || '0.0'}x
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Meta Ads</div>
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-3 h-3 text-blue-800" />
                <span className="text-sm font-medium">
                  {client.campaigns.meta?.active || 0}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                ROAS: {client.campaigns.meta?.roas?.toFixed(1) || '0.0'}x
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // Implementar ação de visualizar relatórios
            }}
          >
            Relatórios
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // Implementar ação de configurações
            }}
          >
            Configurar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

