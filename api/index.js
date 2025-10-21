// Single API handler for all routes
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
  
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  
  // Route handling
  if (pathname === '/api/health') {
    res.status(200).json({
      status: 'OK',
      message: 'Starflix API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } else if (pathname === '/api/user' && req.method === 'POST') {
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
  } else if (pathname.startsWith('/api/favourites/')) {
    res.status(200).json({ success: true, favourites: [] });
  } else if (pathname.startsWith('/api/watchlist/')) {
    res.status(200).json({ success: true, watchlist: [] });
  } else if (pathname.startsWith('/api/reviews/')) {
    res.status(200).json({ success: true, reviews: [] });
  } else {
    res.status(404).json({ error: 'API endpoint not found', pathname });
  }
}
