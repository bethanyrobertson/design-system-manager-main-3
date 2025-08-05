const mongoose = require('mongoose');
const Component = require('../models/Component');
const User = require('../models/User');
const sampleComponents = require('../examples/sample-components');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designsystem';

async function seedComponents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find or create a default user for the components
    let defaultUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!defaultUser) {
      console.log('Creating default user...');
      defaultUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123'
      });
      await defaultUser.save();
      console.log('Default user created');
    }

    // Clear existing components
    console.log('Clearing existing components...');
    await Component.deleteMany({});
    console.log('Existing components cleared');

    // Add sample components
    console.log('Adding sample components...');
    const componentsWithUser = sampleComponents.map(component => ({
      ...component,
      createdBy: defaultUser._id
    }));

    const savedComponents = await Component.insertMany(componentsWithUser);
    console.log(`Successfully added ${savedComponents.length} components`);

    // Display summary
    console.log('\n=== Component Summary ===');
    const componentTypes = await Component.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    componentTypes.forEach(type => {
      console.log(`${type._id}: ${type.count} components`);
    });

    console.log('\nSample components seeded successfully!');
    console.log('You can now test the API endpoints:');
    console.log('- GET /api/components');
    console.log('- GET /api/components/type/button');
    console.log('- GET /api/components/search/button');

  } catch (error) {
    console.error('Error seeding components:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedComponents();
}

module.exports = seedComponents; 