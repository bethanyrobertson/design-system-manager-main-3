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

// Theme design tokens
const themeTokens = [
  // Light theme tokens
  {
    name: 'bg-primary-light',
    value: '#Fafafa',
    category: 'color',
    description: 'Primary background color for light theme',
    theme: 'light'
  },
  {
    name: 'bg-secondary-light',
    value: '#ffffff',
    category: 'color',
    description: 'Secondary background color for light theme',
    theme: 'light'
  },
  {
    name: 'text-primary-light',
    value: '#333',
    category: 'color',
    description: 'Primary text color for light theme',
    theme: 'light'
  },
  {
    name: 'text-secondary-light',
    value: '#666',
    category: 'color',
    description: 'Secondary text color for light theme',
    theme: 'light'
  },
  {
    name: 'accent-color-light',
    value: '#7e22ce',
    category: 'color',
    description: 'Primary accent color for light theme',
    theme: 'light'
  },
  {
    name: 'accent-hover-light',
    value: '#581c87',
    category: 'color',
    description: 'Accent hover color for light theme',
    theme: 'light'
  },
  {
    name: 'card-bg-light',
    value: '#ffffff',
    category: 'color',
    description: 'Card background color for light theme',
    theme: 'light'
  },
  {
    name: 'border-color-light',
    value: '#e1e5e9',
    category: 'color',
    description: 'Border color for light theme',
    theme: 'light'
  },
  {
    name: 'shadow-light',
    value: '0 2px 10px rgba(0, 0, 0, 0.1)',
    category: 'elevation',
    description: 'Shadow for light theme',
    theme: 'light'
  },

  // Dark theme tokens
  {
    name: 'bg-primary-dark',
    value: '#1a1a1a',
    category: 'color',
    description: 'Primary background color for dark theme',
    theme: 'dark'
  },
  {
    name: 'bg-secondary-dark',
    value: '#2d2d2d',
    category: 'color',
    description: 'Secondary background color for dark theme',
    theme: 'dark'
  },
  {
    name: 'text-primary-dark',
    value: '#ffffff',
    category: 'color',
    description: 'Primary text color for dark theme',
    theme: 'dark'
  },
  {
    name: 'text-secondary-dark',
    value: '#b0b0b0',
    category: 'color',
    description: 'Secondary text color for dark theme',
    theme: 'dark'
  },
  {
    name: 'accent-color-dark',
    value: '#c084fc',
    category: 'color',
    description: 'Primary accent color for dark theme',
    theme: 'dark'
  },
  {
    name: 'accent-hover-dark',
    value: '#d8b4fe',
    category: 'color',
    description: 'Accent hover color for dark theme',
    theme: 'dark'
  },
  {
    name: 'card-bg-dark',
    value: '#2d2d2d',
    category: 'color',
    description: 'Card background color for dark theme',
    theme: 'dark'
  },
  {
    name: 'border-color-dark',
    value: '#404040',
    category: 'color',
    description: 'Border color for dark theme',
    theme: 'dark'
  },
  {
    name: 'shadow-dark',
    value: '0 2px 10px rgba(0, 0, 0, 0.3)',
    category: 'elevation',
    description: 'Shadow for dark theme',
    theme: 'dark'
  },

  // Additional utility tokens
  {
    name: 'input-bg-light',
    value: '#ffffff',
    category: 'color',
    description: 'Input background color for light theme',
    theme: 'light'
  },
  {
    name: 'input-bg-dark',
    value: '#404040',
    category: 'color',
    description: 'Input background color for dark theme',
    theme: 'dark'
  },
  {
    name: 'code-bg-light',
    value: '#f8f9fa',
    category: 'color',
    description: 'Code background color for light theme',
    theme: 'light'
  },
  {
    name: 'code-bg-dark',
    value: '#2a2a2a',
    category: 'color',
    description: 'Code background color for dark theme',
    theme: 'dark'
  },
  {
    name: 'danger-color-light',
    value: '#dc3545',
    category: 'color',
    description: 'Danger color for light theme',
    theme: 'light'
  },
  {
    name: 'danger-color-dark',
    value: '#ef4444',
    category: 'color',
    description: 'Danger color for dark theme',
    theme: 'dark'
  },
  {
    name: 'danger-hover-light',
    value: '#c82333',
    category: 'color',
    description: 'Danger hover color for light theme',
    theme: 'light'
  },
  {
    name: 'danger-hover-dark',
    value: '#dc2626',
    category: 'color',
    description: 'Danger hover color for dark theme',
    theme: 'dark'
  }
];

async function getOrCreateSystemUser() {
  // Try to find an existing admin user
  let systemUser = await User.findOne({ role: 'admin' });
  
  if (!systemUser) {
    // Create a system user if none exists
    systemUser = new User({
      username: 'system',
      email: 'system@designsystem.com',
      password: 'system123',
      role: 'admin'
    });
    await systemUser.save();
    console.log('Created system user for theme tokens');
  }
  
  return systemUser._id;
}

async function addThemeTokens() {
  try {
    await connectDB();

    console.log('Adding theme design tokens...');

    // Get or create a system user
    const systemUserId = await getOrCreateSystemUser();

    for (const tokenData of themeTokens) {
      // Check if token already exists
      const existingToken = await DesignToken.findOne({ 
        name: tokenData.name,
        theme: tokenData.theme 
      });

      if (existingToken) {
        console.log(`Token ${tokenData.name} (${tokenData.theme}) already exists, updating...`);
        await DesignToken.findOneAndUpdate(
          { name: tokenData.name, theme: tokenData.theme },
          { ...tokenData, createdBy: systemUserId },
          { new: true }
        );
      } else {
        console.log(`Adding token: ${tokenData.name} (${tokenData.theme})`);
        const token = new DesignToken({ ...tokenData, createdBy: systemUserId });
        await token.save();
      }
    }

    console.log('Theme tokens added successfully!');
    
    // Display summary
    const lightTokens = await DesignToken.countDocuments({ theme: 'light' });
    const darkTokens = await DesignToken.countDocuments({ theme: 'dark' });
    const totalTokens = await DesignToken.countDocuments();
    
    console.log(`\nSummary:`);
    console.log(`- Light theme tokens: ${lightTokens}`);
    console.log(`- Dark theme tokens: ${darkTokens}`);
    console.log(`- Total tokens: ${totalTokens}`);

  } catch (error) {
    console.error('Error adding theme tokens:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
addThemeTokens(); 