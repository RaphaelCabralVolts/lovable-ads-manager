
import { useState, useEffect } from 'react';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  maxClients: number;
  features: string[];
}

interface ClientBudget {
  clientId: number;
  monthlyFee: number;
  adBudget: number;
  spent: number;
  approved: boolean;
  dueDate: Date;
  status: 'pending' | 'approved' | 'overdue' | 'paid';
}

interface Invoice {
  id: string;
  clientId: number;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  createdAt: Date;
}

export const useFinancialManager = () => {
  const [plans] = useState<PaymentPlan[]>([
    {
      id: 'starter',
      name: 'Starter',
      price: 297,
      maxClients: 5,
      features: ['Dashboard básico', 'Até 5 clientes', 'Relatórios mensais']
    },
    {
      id: 'professional',
      name: 'Professional', 
      price: 597,
      maxClients: 20,
      features: ['Dashboard avançado', 'Até 20 clientes', 'Relatórios semanais', 'Automações']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 997,
      maxClients: -1,
      features: ['Clientes ilimitados', 'White-label', 'API personalizada', 'Suporte prioritário']
    }
  ]);

  const [budgets, setBudgets] = useState<ClientBudget[]>([
    {
      clientId: 1,
      monthlyFee: 2500,
      adBudget: 15000,
      spent: 12800,
      approved: true,
      dueDate: new Date('2024-07-15'),
      status: 'paid'
    },
    {
      clientId: 2,
      monthlyFee: 1800,
      adBudget: 8000,
      spent: 7600,
      approved: true,
      dueDate: new Date('2024-07-20'),
      status: 'pending'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      clientId: 1,
      amount: 2500,
      description: 'Taxa de gestão - Junho 2024',
      status: 'paid',
      dueDate: new Date('2024-06-15'),
      createdAt: new Date('2024-06-01')
    }
  ]);

  const createProposal = async (clientId: number, services: string[], totalAmount: number) => {
    console.log(`Creating proposal for client ${clientId}`);
    // Aqui será integrado com Asaas API
    return {
      proposalId: `PROP-${Date.now()}`,
      status: 'sent',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  };

  const processPayment = async (invoiceId: string) => {
    console.log(`Processing payment for invoice ${invoiceId}`);
    // Integração com Asaas
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: 'paid' as const }
          : inv
      )
    );
  };

  const getBudgetStatus = (budget: ClientBudget) => {
    const usage = (budget.spent / budget.adBudget) * 100;
    if (usage >= 90) return 'critical';
    if (usage >= 75) return 'warning';
    return 'healthy';
  };

  const getTotalRevenue = () => {
    return budgets.reduce((total, budget) => total + budget.monthlyFee, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(inv => inv.status === 'pending')
      .reduce((total, inv) => total + inv.amount, 0);
  };

  return {
    plans,
    budgets,
    invoices,
    createProposal,
    processPayment,
    getBudgetStatus,
    getTotalRevenue,
    getPendingAmount
  };
};
