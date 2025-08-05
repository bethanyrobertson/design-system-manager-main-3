const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { authenticateToken } = require('../middleware/auth');

// Get all components with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      status, 
      search, 
      tags, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Build search query
    let query = Component.find(filter);
    
    if (search) {
      query = Component.find({
        $and: [
          filter,
          { $text: { $search: search } }
        ]
      });
    }

    // Apply sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortOptions);

    // Apply pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    // Execute query
    const components = await query.exec();
    const total = await Component.countDocuments(filter);

    res.json({
      components,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Get component by ID
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    console.error('Error fetching component:', error);
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

// Create new component (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      styles,
      code,
      examples,
      tags,
      status,
      version,
      dependencies
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    // Check if component with same name already exists
    const existingComponent = await Component.findOne({ name });
    if (existingComponent) {
      return res.status(400).json({ error: 'Component with this name already exists' });
    }

    const component = new Component({
      name,
      type,
      description,

      styles: styles || {},
      code: code || {},
      examples: examples || [],
      tags: tags || [],
      status: status || 'draft',
      version: version || '1.0.0',
      dependencies: dependencies || [],
      createdBy: req.user.id
    });

    await component.save();
    res.status(201).json(component);
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ error: 'Failed to create component' });
  }
});

// Update component (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Check if user is the creator or has admin rights
    if (component.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this component' });
    }

    const updatedComponent = await Component.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json(updatedComponent);
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// Delete component (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Check if user is the creator or has admin rights
    if (component.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this component' });
    }

    await Component.findByIdAndDelete(req.params.id);
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

// Get components by type
router.get('/type/:type', async (req, res) => {
  try {
    const components = await Component.find({ 
      type: req.params.type,
      status: 'active'
    }).sort({ createdAt: -1 });
    
    res.json(components);
  } catch (error) {
    console.error('Error fetching components by type:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Search components
router.get('/search/:query', async (req, res) => {
  try {
    const components = await Component.find({
      $text: { $search: req.params.query }
    }).sort({ score: { $meta: 'textScore' } });
    
    res.json(components);
  } catch (error) {
    console.error('Error searching components:', error);
    res.status(500).json({ error: 'Failed to search components' });
  }
});

// Get component statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Component.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: { $push: '$type' },
          byStatus: { $push: '$status' }
        }
      },
      {
        $project: {
          total: 1,
          typeCounts: {
            $reduce: {
              input: '$byType',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  { $literal: { '$$this': { $add: [{ $ifNull: [{ $arrayElemAt: ['$$value.$$this', 0] }, 0] }, 1] } } }
                ]
              }
            }
          },
          statusCounts: {
            $reduce: {
              input: '$byStatus',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  { $literal: { '$$this': { $add: [{ $ifNull: [{ $arrayElemAt: ['$$value.$$this', 0] }, 0] }, 1] } } }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json(stats[0] || { total: 0, typeCounts: {}, statusCounts: {} });
  } catch (error) {
    console.error('Error fetching component stats:', error);
    res.status(500).json({ error: 'Failed to fetch component statistics' });
  }
});

module.exports = router; 