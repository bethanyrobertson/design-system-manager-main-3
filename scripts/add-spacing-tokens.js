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

// Spacing tokens based on 8px scale
const spacingTokens = [
  { name: 'spacing-1', value: '8px', category: 'spacing', description: 'Smallest spacing unit (8px)', theme: 'both' },
  { name: 'spacing-2', value: '16px', category: 'spacing', description: 'Small spacing unit (16px)', theme: 'both' },
  { name: 'spacing-3', value: '24px', category: 'spacing', description: 'Medium-small spacing unit (24px)', theme: 'both' },
  { name: 'spacing-4', value: '32px', category: 'spacing', description: 'Medium spacing unit (32px)', theme: 'both' },
  { name: 'spacing-5', value: '40px', category: 'spacing', description: 'Medium-large spacing unit (40px)', theme: 'both' },
  { name: 'spacing-6', value: '48px', category: 'spacing', description: 'Large spacing unit (48px)', theme: 'both' },
  { name: 'spacing-7', value: '56px', category: 'spacing', description: 'Extra large spacing unit (56px)', theme: 'both' },
  { name: 'spacing-8', value: '64px', category: 'spacing', description: '2x large spacing unit (64px)', theme: 'both' },
  { name: 'spacing-9', value: '72px', category: 'spacing', description: '3x large spacing unit (72px)', theme: 'both' },
  { name: 'spacing-10', value: '80px', category: 'spacing', description: '4x large spacing unit (80px)', theme: 'both' },
  { name: 'spacing-11', value: '88px', category: 'spacing', description: '5x large spacing unit (88px)', theme: 'both' },
  { name: 'spacing-12', value: '96px', category: 'spacing', description: '6x large spacing unit (96px)', theme: 'both' },
  { name: 'spacing-13', value: '104px', category: 'spacing', description: '7x large spacing unit (104px)', theme: 'both' },
  { name: 'spacing-14', value: '112px', category: 'spacing', description: '8x large spacing unit (112px)', theme: 'both' },
  { name: 'spacing-15', value: '120px', category: 'spacing', description: '9x large spacing unit (120px)', theme: 'both' },
  { name: 'spacing-16', value: '128px', category: 'spacing', description: '10x large spacing unit (128px)', theme: 'both' },
  { name: 'spacing-17', value: '136px', category: 'spacing', description: '11x large spacing unit (136px)', theme: 'both' },
  { name: 'spacing-18', value: '144px', category: 'spacing', description: '12x large spacing unit (144px)', theme: 'both' },
  { name: 'spacing-19', value: '152px', category: 'spacing', description: '13x large spacing unit (152px)', theme: 'both' },
  { name: 'spacing-20', value: '160px', category: 'spacing', description: '14x large spacing unit (160px)', theme: 'both' }
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
    console.log('Created system user for spacing tokens');
  }
  return systemUser._id;
}

async function addSpacingTokens() {
  try {
    await connectDB();
    console.log('Adding spacing tokens...');
    const systemUserId = await getOrCreateSystemUser();

    for (const tokenData of spacingTokens) {
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
    console.log('Spacing tokens added successfully!');
    
    const spacingTokensCount = await DesignToken.countDocuments({ category: 'spacing' });
    const totalTokens = await DesignToken.countDocuments();
    
    console.log(`\nSummary:`);
    console.log(`- Spacing tokens: ${spacingTokensCount}`);
    console.log(`- Total tokens: ${totalTokens}`);

  } catch (error) {
    console.error('Error adding spacing tokens:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

addSpacingTokens(); 