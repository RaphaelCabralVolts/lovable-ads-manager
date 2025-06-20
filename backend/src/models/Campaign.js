const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID é obrigatório']
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Manager ID é obrigatório']
  },
  platform: {
    type: String,
    enum: ['google', 'meta', 'linkedin', 'tiktok', 'twitter'],
    required: [true, 'Plataforma é obrigatória']
  },
  platformCampaignId: {
    type: String,
    required: [true, 'ID da campanha na plataforma é obrigatório']
  },
  name: {
    type: String,
    required: [true, 'Nome da campanha é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome não pode exceder 200 caracteres']
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended', 'draft', 'pending_approval'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['search', 'display', 'shopping', 'video', 'app', 'discovery', 'performance_max'],
    required: [true, 'Tipo de campanha é obrigatório']
  },
  objective: {
    type: String,
    enum: ['awareness', 'consideration', 'conversion', 'retention'],
    required: [true, 'Objetivo da campanha é obrigatório']
  },
  budget: {
    daily: {
      type: Number,
      required: [true, 'Orçamento diário é obrigatório'],
      min: [0, 'Orçamento não pode ser negativo']
    },
    total: {
      type: Number,
      min: [0, 'Orçamento total não pode ser negativo']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Gasto não pode ser negativo']
    }
  },
  bidding: {
    strategy: {
      type: String,
      enum: ['manual_cpc', 'enhanced_cpc', 'target_cpa', 'target_roas', 'maximize_clicks', 'maximize_conversions'],
      required: [true, 'Estratégia de lance é obrigatória']
    },
    targetCPA: Number,
    targetROAS: Number,
    maxCPC: Number
  },
  targeting: {
    locations: [{
      id: String,
      name: String,
      type: {
        type: String,
        enum: ['country', 'region', 'city', 'postal_code']
      }
    }],
    languages: [String],
    demographics: {
      ageRanges: [String],
      genders: [String],
      parentalStatus: [String],
      householdIncome: [String]
    },
    interests: [String],
    keywords: [{
      text: String,
      matchType: {
        type: String,
        enum: ['exact', 'phrase', 'broad']
      },
      bid: Number
    }],
    audiences: [{
      id: String,
      name: String,
      type: String
    }],
    placements: [String],
    devices: [String],
    schedule: {
      dayParting: [{
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        startHour: Number,
        endHour: Number,
        bidModifier: Number
      }],
      startDate: Date,
      endDate: Date
    }
  },
  creatives: [{
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'responsive']
    },
    headlines: [String],
    descriptions: [String],
    images: [String],
    videos: [String],
    finalUrl: String,
    displayUrl: String
  }],
  metrics: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    conversionValue: {
      type: Number,
      default: 0
    },
    cost: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    cpc: {
      type: Number,
      default: 0
    },
    cpa: {
      type: Number,
      default: 0
    },
    roas: {
      type: Number,
      default: 0
    },
    qualityScore: {
      type: Number,
      default: 0
    },
    lastUpdated: Date
  },
  settings: {
    autoOptimization: {
      type: Boolean,
      default: false
    },
    frequencyCap: {
      impressions: Number,
      timeUnit: {
        type: String,
        enum: ['day', 'week', 'month']
      }
    },
    rotationMode: {
      type: String,
      enum: ['optimize', 'rotate_evenly']
    }
  },
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String
  },
  history: [{
    action: String,
    details: mongoose.Schema.Types.Mixed,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
campaignSchema.index({ clientId: 1 });
campaignSchema.index({ managerId: 1 });
campaignSchema.index({ platform: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ platformCampaignId: 1, platform: 1 }, { unique: true });
campaignSchema.index({ 'approval.status': 1 });

// Virtual para calcular CTR
campaignSchema.virtual('calculatedCTR').get(function() {
  if (this.metrics.impressions === 0) return 0;
  return (this.metrics.clicks / this.metrics.impressions) * 100;
});

// Virtual para calcular CPC
campaignSchema.virtual('calculatedCPC').get(function() {
  if (this.metrics.clicks === 0) return 0;
  return this.metrics.cost / this.metrics.clicks;
});

// Virtual para calcular ROAS
campaignSchema.virtual('calculatedROAS').get(function() {
  if (this.metrics.cost === 0) return 0;
  return this.metrics.conversionValue / this.metrics.cost;
});

// Middleware para atualizar métricas calculadas antes de salvar
campaignSchema.pre('save', function(next) {
  if (this.isModified('metrics')) {
    this.metrics.ctr = this.calculatedCTR;
    this.metrics.cpc = this.calculatedCPC;
    this.metrics.roas = this.calculatedROAS;
    this.metrics.lastUpdated = new Date();
  }
  next();
});

// Método para adicionar entrada no histórico
campaignSchema.methods.addHistoryEntry = function(action, details, userId) {
  this.history.push({
    action,
    details,
    performedBy: userId,
    timestamp: new Date()
  });
  return this.save();
};

// Método para pausar campanha
campaignSchema.methods.pause = function(userId, reason) {
  this.status = 'paused';
  return this.addHistoryEntry('paused', { reason }, userId);
};

// Método para reativar campanha
campaignSchema.methods.resume = function(userId) {
  this.status = 'active';
  return this.addHistoryEntry('resumed', {}, userId);
};

// Método para aprovar campanha
campaignSchema.methods.approve = function(userId) {
  this.approval.status = 'approved';
  this.approval.approvedBy = userId;
  this.approval.approvedAt = new Date();
  this.status = 'active';
  return this.addHistoryEntry('approved', {}, userId);
};

// Método para rejeitar campanha
campaignSchema.methods.reject = function(userId, reason) {
  this.approval.status = 'rejected';
  this.approval.rejectionReason = reason;
  return this.addHistoryEntry('rejected', { reason }, userId);
};

module.exports = mongoose.model('Campaign', campaignSchema);

