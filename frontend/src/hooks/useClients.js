import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useToast } from './use-toast';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getClients();
      setClients(response.data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar clientes",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData) => {
    try {
      const response = await apiService.createClient(clientData);
      setClients(prev => [response.data, ...prev]);
      toast({
        title: "Cliente criado com sucesso",
        description: `${response.data.name} foi adicionado à sua lista de clientes.`,
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao criar cliente",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const response = await apiService.updateClient(id, clientData);
      setClients(prev => prev.map(client => 
        client._id === id ? response.data : client
      ));
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao atualizar cliente",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      await apiService.deleteClient(id);
      setClients(prev => prev.filter(client => client._id !== id));
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro ao remover cliente",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const getClientMetrics = async (id) => {
    try {
      const response = await apiService.getClientMetrics(id);
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao carregar métricas",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const addClientNote = async (id, content) => {
    try {
      const response = await apiService.addClientNote(id, content);
      setClients(prev => prev.map(client => 
        client._id === id ? response.data : client
      ));
      toast({
        title: "Nota adicionada",
        description: "A nota foi adicionada ao cliente com sucesso.",
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao adicionar nota",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientMetrics,
    addClientNote
  };
};

