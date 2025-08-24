const mongoose = require('mongoose');
const DesignToken = require('./models/DesignToken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designsystem';

// Pink tokens for Primary-light theme
const pinkLight = {
  pink1: "#fffcfe",
  pink2: "#fef7fb",
  pink3: "#fee9f5",
  pink4: "#fbdcef",
  pink5: "#f6cee7",
  pink6: "#efbfdd",
  pink7: "#e7acd0",
  pink8: "#dd93c2",
  pink9: "#d6409f",
  pink10: "#cf3897",
  pink11: "#c2298a",
  pink12: "#651249",
};

// Pink tokens for Primary-dark theme
const pinkDark = {
  pink1: "#191117",
  pink2: "#21121d",
  pink3: "#37172f",
  pink4: "#4b143d",
  pink5: "#591c47",
  pink6: "#692955",
  pink7: "#833669",
  pink8: "#a84885",
  pink9: "#d6409f",
  pink10: "#de51a8",
  pink11: "#ff8dcc",
  pink12: "#fdd1ea",
};

async function addPinkTokens() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Add light theme tokens
    console.log('Adding pink light theme tokens...');
    for (const [name, value] of Object.entries(pinkLight)) {
      const token = new DesignToken({
        name: `pink-light-${name}`,
        value: value,
        category: 'color',
        description: `Pink light theme - ${name}`,
        theme: 'light'
      });
      await token.save();
      console.log(`Added: ${token.name} = ${token.value}`);
    }

    // Add dark theme tokens
    console.log('Adding pink dark theme tokens...');
    for (const [name, value] of Object.entries(pinkDark)) {
      const token = new DesignToken({
        name: `pink-dark-${name}`,
        value: value,
        category: 'color',
        description: `Pink dark theme - ${name}`,
        theme: 'dark'
      });
      await token.save();
      console.log(`Added: ${token.name} = ${token.value}`);
    }

    console.log('All pink tokens added successfully!');
    
    // Count total color tokens
    const colorCount = await DesignToken.countDocuments({ category: 'color' });
    console.log(`Total color tokens in database: ${colorCount}`);
    
  } catch (error) {
    console.error('Error adding tokens:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

addPinkTokens();
