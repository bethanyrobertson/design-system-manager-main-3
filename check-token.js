const mongoose = require('mongoose');
const DesignToken = require('./models/DesignToken');

async function checkTokens() {
  try {
    console.log('Checking tokens in database...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/designsystem');
    console.log('✅ Connected to MongoDB');
    
    // Get all tokens
    const tokens = await DesignToken.find({}).limit(10);
    console.log(`📊 Found ${tokens.length} tokens (showing first 10):`);
    
    tokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name} (${token.category}): ${token.value}`);
    });
    
    // Check specifically for test-color
    const testToken = await DesignToken.findOne({ name: 'test-color' });
    if (testToken) {
      console.log('\n🎯 Test token found:');
      console.log(`   Name: ${testToken.name}`);
      console.log(`   Value: ${testToken.value}`);
      console.log(`   Description: ${testToken.description}`);
      console.log(`   Updated: ${testToken.updatedAt}`);
    } else {
      console.log('\n❌ No test-color token found');
    }
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTokens(); 