const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Manager ID é obrigatório']
  },
  name: {
    type: String,
    required: [true, 'Nome do cliente é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  logo: {
    type: String,
    default: null
  },
  contactEmail: {
    type: String,
    required: [true, 'Email de contato é obrigatório'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  contactPhone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused', 'pending'],
    default: 'active'
  },
  monthlyBudget: {
    type: Number,
    required: [true, 'Orçamento mensal é obrigatório'],
    min: [0, 'Orçamento não pode ser negativo']
  },
  currentSpend: {
    type: Number,
    default: 0,
    min: [0, 'Gasto atual não pode ser negativo']
  },
  paymentStatus: {
    type: String,
    enum: ['current', 'overdue', 'pending', 'suspended'],
    default: 'current'
  },
  billingInfo: {
    companyName: String,
    taxId: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'BR'
      }
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'pix', 'boleto'],
      default: 'credit_card'
    }
  },
  settings: {
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    },
    currency: {
      type: String,
      default: 'BRL'
    },
    reportFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    autoApproval: {
      type: Boolean,
      default: false
    }
  },
  integrations: {
    googleAds: {
      accountId: String,
      isConnected: {
        type: Boolean,
        default: false
      },
      lastSync: Date
    },
    metaAds: {
      accountId: String,
      isConnected: {
        type: Boolean,
        default: false
      },
      lastSync: Date
    },
    analytics: {
      propertyId: String,
      isConnected: {
        type: Boolean,
        default: false
      },
      lastSync: Date
    }
  },
  metrics: {
    totalSpend: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageROAS: {
      type: Number,
      default: 0
    },
    totalConversions: {
      type: Number,
      default: 0
    },
    lastUpdated: Date
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
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
clientSchema.index({ managerId: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ paymentStatus: 1 });
clientSchema.index({ 'integrations.googleAds.accountId': 1 });
clientSchema.index({ 'integrations.metaAds.accountId': 1 });

// Virtual para calcular porcentagem do orçamento gasto
clientSchema.virtual('budgetUsagePercentage').get(function() {
  if (this.monthlyBudget === 0) return 0;
  return Math.round((this.currentSpend / this.monthlyBudget) * 100);
});

// Virtual para verificar se está próximo do limite do orçamento
clientSchema.virtual('isNearBudgetLimit').get(function() {
  return this.budgetUsagePercentage >= 80;
});

// Virtual para verificar se excedeu o orçamento
clientSchema.virtual('isOverBudget').get(function() {
  return this.currentSpend > this.monthlyBudget;
});

// Middleware para atualizar métricas antes de salvar
clientSchema.pre('save', function(next) {
  if (this.isModified('currentSpend') || this.isModified('monthlyBudget')) {
    this.metrics.lastUpdated = new Date();
  }
  next();
});

// Método para adicionar nota
clientSchema.methods.addNote = function(content, userId) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date()
  });
  return this.save();
};

// Método para atualizar métricas
clientSchema.methods.updateMetrics = function(metrics) {
  this.metrics = {
    ...this.metrics,
    ...metrics,
    lastUpdated: new Date()
  };
  return this.save();
};

module.exports = mongoose.model('Client', clientSchema);

