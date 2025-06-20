
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Plus
} from "lucide-react";
import { useFinancialManager } from "@/hooks/useFinancialManager";

export const FinancialDashboard = () => {
  const { 
    budgets, 
    invoices, 
    getBudgetStatus, 
    getTotalRevenue, 
    getPendingAmount,
    processPayment 
  } = useFinancialManager();

  const totalRevenue = getTotalRevenue();
  const pendingAmount = getPendingAmount();

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{invoices.filter(i => i.status === 'pending').length} faturas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Comissão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5%</div>
            <p className="text-xs text-muted-foreground">Sobre investimento gerenciado</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status dos Orçamentos</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Proposta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const usage = (budget.spent / budget.adBudget) * 100;
              const status = getBudgetStatus(budget);
              
              return (
                <div key={budget.clientId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cliente {budget.clientId}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {budget.spent.toLocaleString()} / R$ {budget.adBudget.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      status === 'critical' ? 'destructive' : 
                      status === 'warning' ? 'secondary' : 'default'
                    }>
                      {usage.toFixed(1)}% usado
                    </Badge>
                  </div>
                  <Progress value={usage} className="h-2" />
                  {status === 'critical' && (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Orçamento quase esgotado
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>Cliente {invoice.clientId}</TableCell>
                  <TableCell>R$ {invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' : 'secondary'
                    }>
                      {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {invoice.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {invoice.status === 'paid' ? 'Pago' : 
                       invoice.status === 'overdue' ? 'Vencido' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => processPayment(invoice.id)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cobrar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
