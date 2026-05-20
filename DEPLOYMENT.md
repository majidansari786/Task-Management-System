# Deployment Guide

Complete deployment instructions for Task Management System on various platforms.

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployments](#cloud-deployments)
- [Production Checklist](#production-checklist)

## Local Development

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm/yarn

### Setup Steps

```bash
# 1. Clone repository
git clone <repo-url>
cd internshala

# 2. Install backend dependencies
npm install

# 3. Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/internshala
SECRET_TOKEN=dev_secret_key_change_in_production
NODE_ENV=development
EOF

# 4. Start MongoDB
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest

# 5. Start backend
npm run dev

# 6. In another terminal, setup frontend
cd frontend
npm install
npm start
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000 (if running on same port)
- API Docs: http://localhost:3000/api-docs

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# 1. Build and start services
docker-compose up --build

# 2. Access services
# Frontend: http://localhost (port 80)
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

### Docker Compose with Environment Variables

```bash
# 1. Create .env file in root
cat > .env << EOF
MONGODB_URI=mongodb://admin:password123@mongodb:27017/internshala
SECRET_TOKEN=production_secret_key
NODE_ENV=production
PORT=3000
EOF

# 2. Start services
docker-compose up --build -d

# 3. View logs
docker-compose logs -f
```

### Manual Docker Commands

```bash
# Backend
docker build -t internshala-backend .
docker run -d -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017/internshala \
  -e SECRET_TOKEN=secret_key \
  --network internshala \
  --name backend \
  internshala-backend

# Frontend
cd frontend
docker build -t internshala-frontend .
docker run -d -p 80:80 \
  --network internshala \
  --name frontend \
  internshala-frontend

# MongoDB
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  --network internshala \
  --name mongodb \
  mongo:latest
```

## Cloud Deployments

### Heroku Deployment

#### Backend Deployment

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create internshala-backend-api

# 4. Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/internshala
heroku config:set SECRET_TOKEN=production_secret_key
heroku config:set NODE_ENV=production

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs -t
```

#### Frontend Deployment

```bash
# 1. Create app
heroku create internshala-frontend

# 2. Add buildpack for Node.js
heroku buildpacks:add heroku/nodejs

# 3. Create Procfile in frontend directory
echo "web: npm start" > frontend/Procfile

# 4. Set environment variables
heroku config:set -a internshala-frontend REACT_APP_API_URL=https://internshala-backend-api.herokuapp.com/api/v1

# 5. Deploy
git push heroku main
```

### AWS Deployment

#### Using EC2 + RDS

```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# - Instance type: t3.micro (free tier)
# - Security group: Allow ports 80, 443, 3000, 27017

# 2. Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install dependencies
sudo apt update
sudo apt install -y nodejs npm
curl https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
sudo apt-get install -y mongodb

# 4. Clone and setup application
git clone <repo-url>
cd internshala
npm install

# 5. Set environment variables
export MONGODB_URI=mongodb://localhost:27017/internshala
export SECRET_TOKEN=your_secret_key
export NODE_ENV=production

# 6. Start application
npm start
```

#### Using AWS App Runner

```bash
# 1. Push code to GitHub
git push

# 2. Create App Runner service
aws apprunner create-service \
  --service-name internshala-api \
  --source-configuration RepositoryType=GITHUB,ImageRepository=github-url \
  --instance-role-arn arn:aws:iam::ACCOUNT:role/AppRunnerServiceRole

# 3. Configure environment variables in AWS Console
```

#### Using AWS Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB
eb init -p node.js-14 internshala-api --region us-east-1

# 3. Create environment
eb create internshala-production

# 4. Set environment variables
eb setenv MONGODB_URI=your_mongodb_uri SECRET_TOKEN=your_secret

# 5. Deploy
eb deploy
```

### Google Cloud Deployment

#### Using Cloud Run

```bash
# 1. Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/internshala-api .

# 2. Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/internshala-api

# 3. Deploy to Cloud Run
gcloud run deploy internshala-api \
  --image gcr.io/YOUR_PROJECT_ID/internshala-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars MONGODB_URI=your_mongodb_uri,SECRET_TOKEN=your_secret

# 4. Get service URL
gcloud run services list
```

#### Using Compute Engine

```bash
# 1. Create instance
gcloud compute instances create internshala-vm \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --zone=us-central1-a

# 2. SSH into instance
gcloud compute ssh internshala-vm --zone=us-central1-a

# 3. Install dependencies and deploy (same as AWS EC2)
```

### Azure Deployment

#### Using App Service

```bash
# 1. Create resource group
az group create --name internshala-rg --location eastus

# 2. Create App Service plan
az appservice plan create \
  --name internshala-plan \
  --resource-group internshala-rg \
  --sku B1 --is-linux

# 3. Create web app
az webapp create \
  --resource-group internshala-rg \
  --plan internshala-plan \
  --name internshala-api \
  --runtime "NODE|18-lts"

# 4. Configure Git deployment
az webapp deployment source config-local-git \
  --resource-group internshala-rg \
  --name internshala-api

# 5. Set environment variables
az webapp config appsettings set \
  --resource-group internshala-rg \
  --name internshala-api \
  --settings MONGODB_URI=your_uri SECRET_TOKEN=your_secret NODE_ENV=production

# 6. Deploy
git push azure main
```

#### Using Container Instances

```bash
# 1. Push image to ACR
az acr build --registry internshala --image internshala-api:latest .

# 2. Create container group
az container create \
  --resource-group internshala-rg \
  --name internshala-api \
  --image internshala.azurecr.io/internshala-api:latest \
  --ports 3000 \
  --environment-variables MONGODB_URI=your_uri SECRET_TOKEN=your_secret
```

### DigitalOcean App Platform

```bash
# 1. Create app.yaml
cat > app.yaml << EOF
name: internshala
services:
- name: api
  github:
    repo: your-username/internshala
    branch: main
  source_dir: /
  build_command: npm install
  run_command: npm start
  http_port: 3000
  envs:
  - key: MONGODB_URI
    value: ${DB_CONNECTION}
  - key: SECRET_TOKEN
    scope: RUN_AND_BUILD_TIME
    value: ${SECRET_TOKEN}
EOF

# 2. Deploy
doctl apps create --spec app.yaml

# 3. View deployment
doctl apps list
```

## Production Checklist

### Security
- [ ] Use HTTPS/SSL certificates
- [ ] Set strong SECRET_TOKEN
- [ ] Enable CORS only for trusted origins
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] MongoDB authentication enabled
- [ ] Environment variables properly configured
- [ ] Secrets not in version control

### Performance
- [ ] Database indexes created
- [ ] Caching strategy implemented (Redis optional)
- [ ] CDN configured for static assets
- [ ] Compression enabled (gzip)
- [ ] Connection pooling configured
- [ ] Load balancer configured
- [ ] Auto-scaling policies set

### Monitoring & Logging
- [ ] Application logging enabled
- [ ] Error tracking (Sentry/New Relic)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Alert notifications configured
- [ ] Log aggregation setup

### Backup & Recovery
- [ ] Database backups configured
- [ ] Automated backup schedule
- [ ] Backup verification tested
- [ ] Disaster recovery plan
- [ ] Point-in-time recovery possible

### Documentation
- [ ] API documentation up to date
- [ ] Deployment documentation complete
- [ ] Runbook created for operations
- [ ] Incident response plan documented

## Monitoring Setup

### Using PM2 (Node.js Process Manager)

```bash
# 1. Install PM2
npm install -g pm2

# 2. Start application
pm2 start app.js --name "internshala-api"

# 3. Configure startup
pm2 startup
pm2 save

# 4. Monitor
pm2 monit
pm2 logs
```

### Health Checks

```javascript
// Add health check endpoint to app.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});
```

## Troubleshooting

### Issue: CORS Error
```javascript
// Fix: Add CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
```

### Issue: Database Connection Timeout
```javascript
// Fix: Increase connection timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

### Issue: Memory Leak
```javascript
// Monitor memory usage
setInterval(() => {
  console.log('Memory usage:', process.memoryUsage());
}, 60000);
```

## Conclusion

Choose the deployment platform that best fits your needs:
- **Local**: Development and testing
- **Docker**: Easy containerization and portability
- **Heroku**: Quick deployment, suitable for small projects
- **AWS**: Enterprise-grade, highly scalable
- **Google Cloud**: Good integration with Google services
- **Azure**: Best for Microsoft stack integration
- **DigitalOcean**: Simple, affordable, developer-friendly
