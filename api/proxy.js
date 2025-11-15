export default async function handler(req, res) {
  console.log('🔥 Function called! Method:', req.method);
  
  // CORS headers - חובה!
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request - returning 200');
    return res.status(200).end();
  }
  
  // רק POST
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('📨 POST request received, body:', req.body);
    
    // שליחה ל-Make
    const makeResponse = await fetch('https://hook.eu2.make.com/mnlmqnrelehv5i7bdba7sj7m5oe7art4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    console.log('📥 Make response status:', makeResponse.status);
    
    const contentType = makeResponse.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await makeResponse.json();
      console.log('✅ JSON response from Make:', responseData);
    } else {
      const textResponse = await makeResponse.text();
      console.log('✅ Text response from Make:', textResponse);
      responseData = { 
        reply: textResponse || 'ההודעה התקבלה בהצלחה!',
        success: true 
      };
    }
    
    console.log('🚀 Sending response to client');
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ 
      error: 'שגיאה בשרת',
      details: error.message,
      reply: 'מצטער, יש בעיה. נסה שוב.'
    });
  }
}
