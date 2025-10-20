# Starflix Backend Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Starflix backend API separately to AWS EC2 or Render.

## Prerequisites
- GitHub repository with your backend code
- MongoDB Atlas database (already configured)
- Environment variables ready

---

## Option 1: Deploy to Render (Recommended - Easier)

### Step 1: Prepare Your Repository

1. **Create a separate backend branch or folder:**
   ```bash
   # Create a backend-specific folder
   mkdir starflix-backend
   cd starflix-backend
   
   # Copy essential files
   cp ../server.js .
   cp ../backend-package.json ./package.json
   cp ../import.env ./.env
   ```

2. **Create a simple package.json for backend only:**
   ```json
   {
     "name": "starflix-backend",
     "version": "1.0.0",
     "description": "Starflix Backend API Server",
     "main": "server.js",
     "type": "module",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     },
     "dependencies": {
       "express": "^5.1.0",
       "mongoose": "^8.19.1",
       "cors": "^2.8.5",
       "dotenv": "^16.3.1"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **Update server.js for production:**
   ```javascript
   // Add at the top
   import dotenv from 'dotenv';
   dotenv.config();
   
   // Update CORS for production
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'http://localhost:5173',
       'https://your-frontend-domain.com', // Replace with your frontend URL
       'https://starflix-frontend.vercel.app'
     ],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   };
   
   app.use(cors(corsOptions));
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)**
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"

2. **Connect Repository:**
   - Select your GitHub repository
   - Choose the branch with backend code

3. **Configure Service:**
   ```
   Name: starflix-backend-api
   Environment: Node
   Region: Oregon (US West) or closest to your users
   Branch: main
   Root Directory: starflix-backend (if you used a subfolder)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
   NODE_ENV=production
   PORT=10000
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your API will be available at: `https://starflix-backend-api.onrender.com`

### Step 3: Test Deployment

```bash
# Test health endpoint
curl https://starflix-backend-api.onrender.com/api/health

# Expected response:
{
  "status": "OK",
  "message": "Starflix API is running!",
  "environment": "production"
}
```

---

## Option 2: Deploy to AWS EC2 (More Control)

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2**
   - Click "Launch Instance"
   - Choose "Ubuntu Server 22.04 LTS"
   - Select "t3.micro" (free tier eligible)
   - Configure security group:
     ```
     SSH (22) - Your IP
     HTTP (80) - 0.0.0.0/0
     HTTPS (443) - 0.0.0.0/0
     Custom TCP (5000) - 0.0.0.0/0
     ```
   - Launch instance and download key pair

### Step 2: Connect and Setup Server

1. **Connect to EC2:**
   ```bash
   # Make key file secure
   chmod 400 your-key.pem
   
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Update system and install Node.js:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

3. **Install PM2 for process management:**
   ```bash
   sudo npm install -g pm2
   ```

### Step 3: Deploy Application

1. **Clone your repository:**
   ```bash
   # Install git
   sudo apt install git -y
   
   # Clone repository
   git clone https://github.com/yourusername/starflix.git
   cd starflix
   ```

2. **Install dependencies:**
   ```bash
   # Install only backend dependencies
   npm install express mongoose cors dotenv
   ```

3. **Create environment file:**
   ```bash
   # Create .env file
   nano .env
   
   # Add environment variables:
   MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
   NODE_ENV=production
   PORT=5000
   ```

4. **Update server.js for production:**
   ```bash
   nano server.js
   
   # Add at the top:
   import dotenv from 'dotenv';
   dotenv.config();
   
   # Update CORS:
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'http://localhost:5173',
       'https://your-frontend-domain.com'
     ],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
   };
   app.use(cors(corsOptions));
   ```

### Step 4: Start Application with PM2

1. **Start with PM2:**
   ```bash
   # Start application
   pm2 start server.js --name "starflix-api"
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   # Follow the instructions it provides
   ```

2. **Configure Nginx (Optional but recommended):**
   ```bash
   # Install Nginx
   sudo apt install nginx -y
   
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/starflix-api
   
   # Add configuration:
   server {
       listen 80;
       server_name your-domain.com; # Replace with your domain
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/starflix-api /etc/nginx/sites-enabled/
   
   # Test and restart Nginx
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 5: Test Deployment

```bash
# Test locally on server
curl http://localhost:5000/api/health

# Test from external
curl http://your-ec2-ip/api/health
```

---

## Environment Variables for Both Platforms

### Required Variables:
```bash
MONGODB_URI=mongodb+srv://starflix-user:Sajid911055@starflix-cluster.gzuicbu.mongodb.net/starflix?retryWrites=true&w=majority&appName=Starflix-cluster
NODE_ENV=production
PORT=5000
```

### Optional Variables:
```bash
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
```

---

## Monitoring and Maintenance

### Render:
- Automatic deployments on git push
- Built-in monitoring dashboard
- Automatic SSL certificates
- Easy environment variable management

### AWS EC2:
```bash
# Check application status
pm2 status

# View logs
pm2 logs starflix-api

# Restart application
pm2 restart starflix-api

# Monitor resources
htop
```

---

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update CORS origins in server.js
   - Ensure frontend URL is included

2. **Database Connection Issues:**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format

3. **Port Issues:**
   - Ensure security groups allow port 5000
   - Check if PORT environment variable is set

4. **Memory Issues (AWS):**
   - Monitor with `htop`
   - Consider upgrading instance type

---

## URLs After Deployment

### Current Production (Vercel):
- **Frontend URL:** `https://starflix9.vercel.app`
- **API URL:** `https://starflix9.vercel.app/api`
- **Health Check:** `https://starflix9.vercel.app/api/health`

### Render (Alternative Backend):
- **API URL:** `https://starflix-backend-api.onrender.com`
- **Health Check:** `https://starflix-backend-api.onrender.com/api/health`

### AWS EC2 (Alternative Backend):
- **API URL:** `http://your-ec2-ip:5000` or `http://your-domain.com`
- **Health Check:** `http://your-ec2-ip:5000/api/health`

---

## Next Steps

1. **Update Frontend:**
   - Change API base URL in your frontend
   - Update CORS settings if needed

2. **Set up Domain (AWS only):**
   - Purchase domain
   - Configure DNS to point to EC2 IP
   - Set up SSL certificate with Let's Encrypt

3. **Monitoring:**
   - Set up uptime monitoring
   - Configure error logging
   - Set up performance monitoring

Choose Render for simplicity or AWS EC2 for more control and customization!
