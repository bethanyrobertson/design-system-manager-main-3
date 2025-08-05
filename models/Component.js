const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    index: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['button', 'input', 'card', 'modal', 'navigation', 'form', 'layout', 'typography', 'icon', 'other'],
    index: true 
  },
  description: { 
    type: String 
  },

  styles: {
    css: { type: String },
    scss: { type: String },
    cssInJs: { type: String }
  },
  code: {
    html: { type: String },
    react: { type: String },
    vue: { type: String },
    angular: { type: String }
  },
  examples: [{
    name: { type: String },
    description: { type: String },
    code: { type: String },
    preview: { type: String }
  }],
  tags: [{ 
    type: String, 
    index: true 
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'deprecated'],
    default: 'draft',
    index: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  dependencies: [{
    name: { type: String },
    version: { type: String }
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Text search index
componentSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Compound indexes for performance
componentSchema.index({ type: 1, status: 1 });
componentSchema.index({ status: 1, createdAt: -1 });

// Update the updatedAt field on save
componentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Component', componentSchema); 