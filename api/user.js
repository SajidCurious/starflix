// Simple user endpoint for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    const { firebaseId, email, name, avatar } = req.body;
    
    // Mock user response
    const user = {
      _id: 'mock_' + Date.now(),
      firebaseId: firebaseId || 'mock_firebase_id',
      email: email || 'temp@example.com',
      name: name || 'User',
      avatar: avatar || 'https://ui-avatars.com/api/?name=User&background=random',
      createdAt: new Date()
    };
    
    res.status(200).json({ success: true, user });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
