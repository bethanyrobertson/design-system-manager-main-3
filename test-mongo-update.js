const mongoose = require('mongoose');
const DesignToken = require('./models/DesignToken');

async function testMongoUpdate() {
  try {
    console.log('Testing direct MongoDB update...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/designsystem');
    console.log('✅ Connected to MongoDB');
    
    // Find a token to update
    const token = await DesignToken.findOne({ name: 'test-color' });
    if (!token) {
      console.log('❌ No test-color token found, creating one...');
      const newToken = new DesignToken({
        name: 'test-color',
        category: 'color',
        value: '#ff0000',
        description: 'Test token for MongoDB update',
        createdBy: '68853e76c3e0abcf5cfc90a6'
      });
      await newToken.save();
      console.log('✅ Created test token');
    }
    
    // Update the token directly in MongoDB
    const updateResult = await DesignToken.updateOne(
      { name: 'test-color' },
      { 
        value: '#00ff00',
        description: 'Updated via MongoDB - ' + new Date().toISOString()
      }
    );
    
    console.log('✅ MongoDB update result:', updateResult);
    
    // Verify the update
    const updatedToken = await DesignToken.findOne({ name: 'test-color' });
    console.log('✅ Updated token:', {
      name: updatedToken.name,
      value: updatedToken.value,
      description: updatedToken.description
    });
    
    console.log('\n🎯 Now check the browser:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Refresh the page');
    console.log('3. Look for the "test-color" token');
    console.log('4. It should show value: #00ff00');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMongoUpdate(); 