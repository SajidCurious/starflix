// Simple test for Vercel deployment
import express from 'express';

const app = express();

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Vercel function is working!',
    timestamp: new Date().toISOString()
  });
});

export default app;
