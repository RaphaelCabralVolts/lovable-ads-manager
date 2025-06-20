const Client = require('../models/Client');
const Campaign = require('../models/Campaign');
const { logger } = require('../utils/logger');

// @desc    Get all clients for manager
// @route   GET /api/v1/clients
// @access  Private (Manager, Super Admin)
const getClients = async (req, res) => {
  try {
    let query = {};

    // If user is manager, only show their clients
    if (req.user.role === 'manager') {
      query.managerId = req.user._id;
    }

    // If user is super admin, show all clients
    // If user is client, they shouldn't access this endpoint

    const clients = await Client.find(query)
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    logger.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

// @desc    Get single client
// @route   GET /api/v1/clients/:id
// @access  Private
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('managerId', 'name email');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    logger.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

// @desc    Create new client
// @route   POST /api/v1/clients
// @access  Private (Manager, Super Admin)
const createClient = async (req, res) => {
  try {
    // Set managerId to current user if not provided (for managers)
    if (req.user.role === 'manager') {
      req.body.managerId = req.user._id;
    }

    const client = await Client.create(req.body);

    logger.info(`New client created: ${client.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    logger.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

// @desc    Update client
// @route   PUT /api/v1/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Update client
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    logger.info(`Client updated: ${client.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    logger.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/v1/clients/:id
// @access  Private (Manager, Super Admin)
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check if client has active campaigns
    const activeCampaigns = await Campaign.countDocuments({
      clientId: req.params.id,
      status: { $in: ['active', 'pending_approval'] }
    });

    if (activeCampaigns > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete client with active campaigns. Please pause or end campaigns first.'
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    logger.info(`Client deleted: ${client.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    logger.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

// @desc    Get client metrics
// @route   GET /api/v1/clients/:id/metrics
// @access  Private
const getClientMetrics = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Get campaigns for this client
    const campaigns = await Campaign.find({ clientId: req.params.id });

    // Calculate aggregated metrics
    const metrics = campaigns.reduce((acc, campaign) => {
      acc.totalSpend += campaign.metrics.cost || 0;
      acc.totalImpressions += campaign.metrics.impressions || 0;
      acc.totalClicks += campaign.metrics.clicks || 0;
      acc.totalConversions += campaign.metrics.conversions || 0;
      acc.totalConversionValue += campaign.metrics.conversionValue || 0;
      return acc;
    }, {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalConversionValue: 0
    });

    // Calculate derived metrics
    metrics.averageCTR = metrics.totalImpressions > 0 ? (metrics.totalClicks / metrics.totalImpressions) * 100 : 0;
    metrics.averageCPC = metrics.totalClicks > 0 ? metrics.totalSpend / metrics.totalClicks : 0;
    metrics.averageROAS = metrics.totalSpend > 0 ? metrics.totalConversionValue / metrics.totalSpend : 0;
    metrics.conversionRate = metrics.totalClicks > 0 ? (metrics.totalConversions / metrics.totalClicks) * 100 : 0;

    // Budget information
    metrics.budgetUsage = {
      monthly: client.monthlyBudget,
      spent: client.currentSpend,
      remaining: client.monthlyBudget - client.currentSpend,
      percentage: client.budgetUsagePercentage
    };

    res.status(200).json({
      success: true,
      data: {
        client: {
          id: client._id,
          name: client.name,
          status: client.status
        },
        metrics,
        campaigns: {
          total: campaigns.length,
          active: campaigns.filter(c => c.status === 'active').length,
          paused: campaigns.filter(c => c.status === 'paused').length
        }
      }
    });
  } catch (error) {
    logger.error('Get client metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client metrics',
      error: error.message
    });
  }
};

// @desc    Add note to client
// @route   POST /api/v1/clients/:id/notes
// @access  Private
const addClientNote = async (req, res) => {
  try {
    const { content } = req.body;
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await client.addNote(content, req.user._id);

    logger.info(`Note added to client ${client.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: client
    });
  } catch (error) {
    logger.error('Add client note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientMetrics,
  addClientNote
};

