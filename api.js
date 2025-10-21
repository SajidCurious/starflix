// Simple API handler for Vercel
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
    if (req.method === 'GET') {
      // Return empty favourites for now (you can implement persistence later)
      res.status(200).json({ success: true, favourites: [] });
    } else if (req.method === 'POST') {
      // Add to favourites
      const { movieData, userData } = req.body;
      console.log('🎬 Adding to favourites:', movieData.title || movieData.name);
      
      // For now, just return success (you can implement persistence later)
      res.status(200).json({ 
        success: true, 
        message: `"${movieData.title || movieData.name}" added to favourites!`,
        movie: movieData
      });
    } else if (req.method === 'DELETE') {
      // Remove from favourites
      const movieId = pathname.split('/').pop();
      console.log('🗑️ Removing from favourites:', movieId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Removed from favourites!',
        movieId: movieId
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else if (pathname.startsWith('/api/watchlist/')) {
    if (req.method === 'GET') {
      res.status(200).json({ success: true, watchlist: [] });
    } else if (req.method === 'POST') {
      const { movieData, userData } = req.body;
      console.log('📺 Adding to watchlist:', movieData.title || movieData.name);
      
      res.status(200).json({ 
        success: true, 
        message: `"${movieData.title || movieData.name}" added to watchlist!`,
        movie: movieData
      });
    } else if (req.method === 'DELETE') {
      const movieId = pathname.split('/').pop();
      console.log('🗑️ Removing from watchlist:', movieId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Removed from watchlist!',
        movieId: movieId
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else if (pathname.startsWith('/api/reviews/')) {
    if (req.method === 'GET') {
      res.status(200).json({ success: true, reviews: [] });
    } else if (req.method === 'POST') {
      const { reviewData, userData } = req.body;
      console.log('📝 Adding review:', reviewData.movieTitle);
      
      res.status(200).json({ 
        success: true, 
        message: 'Review added successfully!',
        review: reviewData
      });
    } else if (req.method === 'PUT') {
      const reviewId = pathname.split('/').pop();
      const { rating, reviewText } = req.body;
      console.log('✏️ Updating review:', reviewId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Review updated successfully!',
        reviewId: reviewId
      });
    } else if (req.method === 'DELETE') {
      const reviewId = pathname.split('/').pop();
      console.log('🗑️ Deleting review:', reviewId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Review deleted successfully!',
        reviewId: reviewId
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else {
    res.status(404).json({ error: 'API endpoint not found', pathname });
  }
}
