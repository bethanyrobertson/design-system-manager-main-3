const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    console.log('Testing API directly...');
    
    // First, let's get a token by logging in
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'tokenadmin@example.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.token) {
      console.log('✅ Got auth token');
      
      // Now test the tokens API
      const tokensResponse = await fetch('http://localhost:3000/api/tokens?limit=200', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      console.log('Tokens API status:', tokensResponse.status);
      const tokensData = await tokensResponse.json();
      
      console.log('✅ Tokens API response:');
      console.log(`   Total tokens: ${tokensData.tokens.length}`);
      console.log(`   Sample tokens:`, tokensData.tokens.slice(0, 5).map(t => ({ name: t.name, value: t.value })));
      
      // Look for test-color specifically
      const testToken = tokensData.tokens.find(t => t.name === 'test-color');
      if (testToken) {
        console.log('🎯 Found test-color token:');
        console.log(`   Value: ${testToken.value}`);
        console.log(`   Description: ${testToken.description}`);
      } else {
        console.log('❌ test-color token not found in API response');
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPI(); 