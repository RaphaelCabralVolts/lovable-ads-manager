
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Settings,
  Plus
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  platform: 'google' | 'meta';
  status: 'active' | 'paused' | 'ended';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpc: number;
  ctr: number;
}

interface CampaignManagerProps {
  clientId: number;
  campaigns: Campaign[];
}

export const CampaignManager = ({ clientId, campaigns }: CampaignManagerProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const handleToggleCampaign = (campaignId: string, currentStatus: string) => {
    console.log(`Toggling campaign ${campaignId} from ${currentStatus}`);
    // Aqui será implementada a integração com as APIs
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === "all") return true;
    if (activeTab === "google") return campaign.platform === "google";
    if (activeTab === "meta") return campaign.platform === "meta";
    if (activeTab === "active") return campaign.status === "active";
    return true;
  });

  const platformStats = {
    google: campaigns.filter(c => c.platform === 'google'),
    meta: campaigns.filter(c => c.platform === 'meta')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campanhas</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              Google Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Campanhas Ativas</span>
                <span className="font-medium">{platformStats.google.filter(c => c.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Gasto Total</span>
                <span className="font-medium">R$ {platformStats.google.reduce((acc, c) => acc + c.spent, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROAS Médio</span>
                <span className="font-medium">{(platformStats.google.reduce((acc, c) => acc + c.roas, 0) / platformStats.google.length || 0).toFixed(2)}x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
              Meta Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Campanhas Ativas</span>
                <span className="font-medium">{platformStats.meta.filter(c => c.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Gasto Total</span>
                <span className="font-medium">R$ {platformStats.meta.reduce((acc, c) => acc + c.spent, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROAS Médio</span>
                <span className="font-medium">{(platformStats.meta.reduce((acc, c) => acc + c.roas, 0) / platformStats.meta.length || 0).toFixed(2)}x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      campaign.platform === 'google' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {campaign.platform} • {campaign.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status === 'active' ? 'Ativa' : 'Pausada'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'active' ? 
                        <Pause className="w-4 h-4" /> : 
                        <Play className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Orçamento</p>
                    <p className="font-medium">R$ {campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gasto</p>
                    <p className="font-medium">R$ {campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Impressões</p>
                    <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cliques</p>
                    <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROAS</p>
                    <p className={`font-medium flex items-center ${
                      campaign.roas >= 3 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {campaign.roas >= 3 ? 
                        <TrendingUp className="w-3 h-3 mr-1" /> : 
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      {campaign.roas}x
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTR</p>
                    <p className="font-medium">{campaign.ctr}%</p>
                  </div>
                </div>

                <div className="flex justify-end mt-3 space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Métricas
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
