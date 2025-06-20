const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this token'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user owns resource or is admin
const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Super admin can access everything
      if (req.user.role === 'super_admin') {
        req.resource = resource;
        return next();
      }

      // Manager can access their own resources and their clients' resources
      if (req.user.role === 'manager') {
        if (resource.managerId && resource.managerId.toString() === req.user._id.toString()) {
          req.resource = resource;
          return next();
        }
        
        // If resource belongs to a client, check if client belongs to manager
        if (resource.clientId) {
          const Client = require('../models/Client');
          const client = await Client.findById(resource.clientId);
          if (client && client.managerId.toString() === req.user._id.toString()) {
            req.resource = resource;
            return next();
          }
        }
      }

      // Client can only access their own resources
      if (req.user.role === 'client') {
        if (resource.clientId && resource.clientId.toString() === req.user._id.toString()) {
          req.resource = resource;
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error while checking ownership'
      });
    }
  };
};

// Check if user can access client data
const checkClientAccess = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.params.id;
    
    // Super admin can access everything
    if (req.user.role === 'super_admin') {
      return next();
    }

    const Client = require('../models/Client');
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Manager can access their clients
    if (req.user.role === 'manager' && client.managerId.toString() === req.user._id.toString()) {
      req.client = client;
      return next();
    }

    // Client can access their own data
    if (req.user.role === 'client' && client._id.toString() === req.user._id.toString()) {
      req.client = client;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this client'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while checking client access'
    });
  }
};

module.exports = {
  protect,
  authorize,
  checkOwnership,
  checkClientAccess
};

