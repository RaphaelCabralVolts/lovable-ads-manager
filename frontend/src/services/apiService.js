// API Service for Lovable Ads Manager
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password, twoFactorCode = null) {
    const body = { email, password };
    if (twoFactorCode) {
      body.twoFactorCode = twoFactorCode;
    }

    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async refreshToken(refreshToken) {
    const response = await this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // 2FA methods
  async enable2FA() {
    return this.request('/auth/2fa/enable', { method: 'POST' });
  }

  async verify2FA(token) {
    return this.request('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async disable2FA(password, token) {
    return this.request('/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });
  }

  // Client methods
  async getClients() {
    return this.request('/clients');
  }

  async getClient(id) {
    return this.request(`/clients/${id}`);
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, { method: 'DELETE' });
  }

  async getClientMetrics(id) {
    return this.request(`/clients/${id}/metrics`);
  }

  async addClientNote(id, content) {
    return this.request(`/clients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Campaign methods
  async getCampaigns(clientId = null) {
    const endpoint = clientId ? `/campaigns?clientId=${clientId}` : '/campaigns';
    return this.request(endpoint);
  }

  async getCampaign(id) {
    return this.request(`/campaigns/${id}`);
  }

  async createCampaign(campaignData) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async updateCampaign(id, campaignData) {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id) {
    return this.request(`/campaigns/${id}`, { method: 'DELETE' });
  }

  async pauseCampaign(id, reason = '') {
    return this.request(`/campaigns/${id}/pause`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async resumeCampaign(id) {
    return this.request(`/campaigns/${id}/resume`, { method: 'POST' });
  }

  async getCampaignMetrics(id) {
    return this.request(`/campaigns/${id}/metrics`);
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Billing methods
  async getInvoices() {
    return this.request('/billing/invoices');
  }

  async createCharge(chargeData) {
    return this.request('/billing/create-charge', {
      method: 'POST',
      body: JSON.stringify(chargeData),
    });
  }

  async getBillingStats() {
    return this.request('/billing/stats');
  }

  async createProposal(proposalData) {
    return this.request('/billing/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }

  async approveProposal(id) {
    return this.request(`/billing/proposals/${id}/approve`, { method: 'POST' });
  }

  // Reports methods
  async getReports() {
    return this.request('/reports');
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updateReport(id, reportData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, { method: 'DELETE' });
  }

  async generateReport(id) {
    return this.request(`/reports/${id}/generate`, { method: 'POST' });
  }

  async sendReport(id, recipients) {
    return this.request(`/reports/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({ recipients }),
    });
  }

  async getReportTemplates() {
    return this.request('/reports/templates');
  }

  // Analytics methods
  async getAnalyticsOverview() {
    return this.request('/analytics/overview');
  }

  async getPerformanceData(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/performance?${queryString}`);
  }

  async getComparisonData(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/comparison?${queryString}`);
  }

  async getPredictions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/predictions?${queryString}`);
  }

  async getCompetitors() {
    return this.request('/analytics/competitors');
  }

  async addCompetitor(competitorData) {
    return this.request('/analytics/competitors', {
      method: 'POST',
      body: JSON.stringify(competitorData),
    });
  }

  async removeCompetitor(id) {
    return this.request(`/analytics/competitors/${id}`, { method: 'DELETE' });
  }

  async getAIInsights() {
    return this.request('/analytics/ai-insights');
  }

  async dismissInsight(id) {
    return this.request(`/analytics/ai-insights/${id}/dismiss`, { method: 'POST' });
  }

  async implementRecommendation(id) {
    return this.request(`/analytics/ai-insights/${id}/implement`, { method: 'POST' });
  }

  // Automation methods
  async getAutomationRules() {
    return this.request('/automations/rules');
  }

  async createAutomationRule(ruleData) {
    return this.request('/automations/rules', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  async updateAutomationRule(id, ruleData) {
    return this.request(`/automations/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData),
    });
  }

  async deleteAutomationRule(id) {
    return this.request(`/automations/rules/${id}`, { method: 'DELETE' });
  }

  async executeAutomationRule(id) {
    return this.request(`/automations/execute`, {
      method: 'POST',
      body: JSON.stringify({ ruleId: id }),
    });
  }

  async getAutomationLogs() {
    return this.request('/automations/logs');
  }

  // Creative methods
  async getCreatives() {
    return this.request('/creatives');
  }

  async getCreative(id) {
    return this.request(`/creatives/${id}`);
  }

  async createCreative(creativeData) {
    return this.request('/creatives', {
      method: 'POST',
      body: JSON.stringify(creativeData),
    });
  }

  async updateCreative(id, creativeData) {
    return this.request(`/creatives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(creativeData),
    });
  }

  async deleteCreative(id) {
    return this.request(`/creatives/${id}`, { method: 'DELETE' });
  }

  async createABTest(creativeId, testData) {
    return this.request(`/creatives/${creativeId}/ab-test`, {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async getCreativePerformance(id) {
    return this.request(`/creatives/${id}/performance`);
  }

  // Notification methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', { method: 'PUT' });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, { method: 'DELETE' });
  }

  async updateNotificationSettings(settings) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Client Portal methods
  async getClientPortalDashboard() {
    return this.request('/client-portal/dashboard');
  }

  async approveCampaign(campaignId) {
    return this.request(`/client-portal/campaigns/${campaignId}/approve`, {
      method: 'POST',
    });
  }

  async rejectCampaign(campaignId, reason) {
    return this.request(`/client-portal/campaigns/${campaignId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getClientInvoices() {
    return this.request('/client-portal/invoices');
  }

  async createSupportTicket(ticketData) {
    return this.request('/client-portal/support-ticket', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async getSupportTicketMessages(ticketId) {
    return this.request(`/client-portal/support-tickets/${ticketId}/messages`);
  }

  async sendSupportTicketMessage(ticketId, message) {
    return this.request(`/client-portal/support-tickets/${ticketId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

