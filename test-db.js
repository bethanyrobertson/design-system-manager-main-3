const mongoose = require('mongoose');
const DesignToken = require('./models/DesignToken');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/designsystem');
    console.log('✅ Connected to MongoDB');
    
    // Check if tokens exist
    const tokenCount = await DesignToken.countDocuments();
    console.log(`📊 Found ${tokenCount} tokens in database`);
    
    if (tokenCount > 0) {
      const sampleToken = await DesignToken.findOne();
      console.log('📝 Sample token:', {
        id: sampleToken._id,
        name: sampleToken.name,
        category: sampleToken.category,
        value: sampleToken.value
      });
    }
    
    // Test creating a token
    console.log('🧪 Testing token creation...');
    const testToken = new DesignToken({
      name: 'test-token-' + Date.now(),
      category: 'color',
      value: '#ff0000',
      description: 'Test token',
      createdBy: '68853e76c3e0abcf5cfc90a6' // Use the user ID from your logs
    });
    
    await testToken.save();
    console.log('✅ Test token created successfully');
    
    // Test updating the token
    console.log('🧪 Testing token update...');
    testToken.value = '#00ff00';
    await testToken.save();
    console.log('✅ Test token updated successfully');
    
    // Clean up
    await DesignToken.findByIdAndDelete(testToken._id);
    console.log('✅ Test token cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase(); 