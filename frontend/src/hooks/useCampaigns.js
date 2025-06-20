import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useToast } from './use-toast';

export const useCampaigns = (clientId = null) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCampaigns(clientId);
      setCampaigns(response.data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar campanhas",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      const response = await apiService.createCampaign(campaignData);
      setCampaigns(prev => [response.data, ...prev]);
      toast({
        title: "Campanha criada com sucesso",
        description: `${response.data.name} foi criada e está aguardando aprovação.`,
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao criar campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCampaign = async (id, campaignData) => {
    try {
      const response = await apiService.updateCampaign(id, campaignData);
      setCampaigns(prev => prev.map(campaign => 
        campaign._id === id ? response.data : campaign
      ));
      toast({
        title: "Campanha atualizada",
        description: "A campanha foi atualizada com sucesso.",
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao atualizar campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await apiService.deleteCampaign(id);
      setCampaigns(prev => prev.filter(campaign => campaign._id !== id));
      toast({
        title: "Campanha removida",
        description: "A campanha foi removida com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro ao remover campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const pauseCampaign = async (id, reason = '') => {
    try {
      const response = await apiService.pauseCampaign(id, reason);
      setCampaigns(prev => prev.map(campaign => 
        campaign._id === id ? { ...campaign, status: 'paused' } : campaign
      ));
      toast({
        title: "Campanha pausada",
        description: "A campanha foi pausada com sucesso.",
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao pausar campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const resumeCampaign = async (id) => {
    try {
      const response = await apiService.resumeCampaign(id);
      setCampaigns(prev => prev.map(campaign => 
        campaign._id === id ? { ...campaign, status: 'active' } : campaign
      ));
      toast({
        title: "Campanha reativada",
        description: "A campanha foi reativada com sucesso.",
      });
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao reativar campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const getCampaignMetrics = async (id) => {
    try {
      const response = await apiService.getCampaignMetrics(id);
      return response.data;
    } catch (err) {
      toast({
        title: "Erro ao carregar métricas da campanha",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [clientId]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    pauseCampaign,
    resumeCampaign,
    getCampaignMetrics
  };
};

