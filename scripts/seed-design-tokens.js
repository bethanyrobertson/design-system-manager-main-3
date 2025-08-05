const mongoose = require('mongoose');
const DesignToken = require('../models/DesignToken');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designsystem';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Original design tokens
const originalTokens = [
  // Color tokens
  { name: 'primary-color', value: '#02514E', category: 'color', description: 'Primary brand color', theme: 'both' },
  { name: 'secondary-color', value: '#4ade80', category: 'color', description: 'Secondary brand color', theme: 'both' },
  { name: 'accent-color', value: '#7e22ce', category: 'color', description: 'Primary accent color (purple)', theme: 'all' },
  { name: 'text-primary', value: '#222.2 84% 4.9%', category: 'color', description: 'Primary text color for light theme', theme: 'all' },
  { name: 'text-secondary', value: '#666666', category: 'color', description: 'Secondary text color', theme: 'both' },
  { name: 'background-primary', value: '#FBFAF4', category: 'color', description: 'Primary background color for light theme', theme: 'all' },
  { name: 'background-secondary', value: '#f8f9fa', category: 'color', description: 'Secondary background color', theme: 'both' },
  { name: 'border-color', value: '#e1e5e9', category: 'color', description: 'Border color', theme: 'both' },
  { name: 'success-color', value: '#10b981', category: 'color', description: 'Success state color', theme: 'both' },
  { name: 'warning-color', value: '#f59e0b', category: 'color', description: 'Warning state color', theme: 'both' },
  { name: 'error-color', value: '#ef4444', category: 'color', description: 'Error state color', theme: 'both' },
  { name: 'info-color', value: '#3b82f6', category: 'color', description: 'Info state color', theme: 'both' },

  // Typography tokens
  { name: 'font-family-primary', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', category: 'typography', description: 'Primary font family', theme: 'both' },
  { name: 'font-family-mono', value: '"JetBrains Mono", monospace', category: 'typography', description: 'Monospace font family', theme: 'both' },
  { name: 'font-size-xs', value: '0.75rem', category: 'typography', description: 'Extra small font size', theme: 'both' },
  { name: 'font-size-sm', value: '0.875rem', category: 'typography', description: 'Small font size', theme: 'both' },
  { name: 'font-size-base', value: '1rem', category: 'typography', description: 'Base font size', theme: 'both' },
  { name: 'font-size-lg', value: '1.125rem', category: 'typography', description: 'Large font size', theme: 'both' },
  { name: 'font-size-xl', value: '1.25rem', category: 'typography', description: 'Extra large font size', theme: 'both' },
  { name: 'font-size-2xl', value: '1.5rem', category: 'typography', description: '2x large font size', theme: 'both' },
  { name: 'font-size-3xl', value: '1.875rem', category: 'typography', description: '3x large font size', theme: 'both' },
  { name: 'font-size-4xl', value: '2.25rem', category: 'typography', description: '4x large font size', theme: 'both' },
  { name: 'font-weight-normal', value: '400', category: 'typography', description: 'Normal font weight', theme: 'both' },
  { name: 'font-weight-medium', value: '500', category: 'typography', description: 'Medium font weight', theme: 'both' },
  { name: 'font-weight-semibold', value: '600', category: 'typography', description: 'Semibold font weight', theme: 'both' },
  { name: 'font-weight-bold', value: '700', category: 'typography', description: 'Bold font weight', theme: 'both' },
  { name: 'line-height-tight', value: '1.25', category: 'typography', description: 'Tight line height', theme: 'both' },
  { name: 'line-height-normal', value: '1.5', category: 'typography', description: 'Normal line height', theme: 'both' },
  { name: 'line-height-relaxed', value: '1.75', category: 'typography', description: 'Relaxed line height', theme: 'both' },

  // Elevation tokens
  { name: 'shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', category: 'elevation', description: 'Small shadow', theme: 'both' },
  { name: 'shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', category: 'elevation', description: 'Medium shadow', theme: 'both' },
  { name: 'shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', category: 'elevation', description: 'Large shadow', theme: 'both' },
  { name: 'shadow-xl', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', category: 'elevation', description: 'Extra large shadow', theme: 'both' },

  // Corner radius tokens
  { name: 'radius-sm', value: '4px', category: 'corners', description: 'Small border radius', theme: 'both' },
  { name: 'radius-md', value: '8px', category: 'corners', description: 'Medium border radius', theme: 'both' },
  { name: 'radius-lg', value: '12px', category: 'corners', description: 'Large border radius', theme: 'both' },
  { name: 'radius-xl', value: '16px', category: 'corners', description: 'Extra large border radius', theme: 'both' },
  { name: 'radius-full', value: '9999px', category: 'corners', description: 'Full border radius for circles', theme: 'both' }
];

async function getOrCreateSystemUser() {
  let systemUser = await User.findOne({ role: 'admin' });
  if (!systemUser) {
    systemUser = new User({
      username: 'system',
      email: 'system@designsystem.com',
      password: 'system123',
      role: 'admin'
    });
    await systemUser.save();
    console.log('Created system user for original design tokens');
  }
  return systemUser._id;
}

async function seedOriginalTokens() {
  try {
    await connectDB();
    console.log('Seeding original design tokens...');
    const systemUserId = await getOrCreateSystemUser();

    for (const tokenData of originalTokens) {
      const existingToken = await DesignToken.findOne({ name: tokenData.name });
      if (existingToken) {
        console.log(`Token ${tokenData.name} already exists, updating...`);
        await DesignToken.findOneAndUpdate(
          { name: tokenData.name },
          { ...tokenData, createdBy: systemUserId },
          { new: true }
        );
      } else {
        console.log(`Adding token: ${tokenData.name}`);
        const token = new DesignToken({ ...tokenData, createdBy: systemUserId });
        await token.save();
      }
    }
    console.log('Original design tokens seeded successfully!');
    
    const colorTokens = await DesignToken.countDocuments({ category: 'color' });
    const typographyTokens = await DesignToken.countDocuments({ category: 'typography' });
    const elevationTokens = await DesignToken.countDocuments({ category: 'elevation' });
    const cornerTokens = await DesignToken.countDocuments({ category: 'corners' });
    const spacingTokens = await DesignToken.countDocuments({ category: 'spacing' });
    const totalTokens = await DesignToken.countDocuments();
    
    console.log(`\nSummary:`);
    console.log(`- Color tokens: ${colorTokens}`);
    console.log(`- Typography tokens: ${typographyTokens}`);
    console.log(`- Elevation tokens: ${elevationTokens}`);
    console.log(`- Corner tokens: ${cornerTokens}`);
    console.log(`- Spacing tokens: ${spacingTokens}`);
    console.log(`- Total tokens: ${totalTokens}`);

  } catch (error) {
    console.error('Error seeding original tokens:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedOriginalTokens(); 