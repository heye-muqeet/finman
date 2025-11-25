# MongoDB Setup Guide for FinMan

This guide will help you set up MongoDB for the FinMan application.

## The Error

If you see this error:
```
connect ECONNREFUSED 127.0.0.1:27017
```

It means MongoDB is not running on your local machine or is not accessible at `localhost:27017`.

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the MSI installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool, optional but helpful)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # MongoDB service should start automatically after installation
   # If not, start it manually:
   net start MongoDB
   ```

5. **Test Connection**
   ```powershell
   mongosh
   # or if mongosh is not installed:
   mongo
   ```

### macOS

1. **Install using Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify**
   ```bash
   mongosh
   ```

### Linux (Ubuntu/Debian)

1. **Install MongoDB**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Verify**
   ```bash
   mongosh
   ```

## Option 2: Use MongoDB Atlas (Cloud - Recommended for Production)

MongoDB Atlas is a cloud-hosted MongoDB service (free tier available).

### Setup Steps

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Name your cluster (e.g., "finman-dev")

3. **Configure Database Access**
   - Go to "Database Access"
   - Add a new database user
   - Username: `finman-user` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: Read and write to any database

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://finman-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/finman?retryWrites=true&w=majority
   ```

## Option 3: Use Docker (Alternative)

If you have Docker installed:

1. **Run MongoDB Container**
   ```bash
   docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_DATABASE=finman mongo:latest
   ```

2. **Verify**
   ```bash
   docker ps
   ```

## Verify Connection

After setting up MongoDB, verify the connection:

1. **Test Connection String**
   ```bash
   mongosh "mongodb://localhost:27017/finman"
   # or for Atlas:
   mongosh "mongodb+srv://your-connection-string"
   ```

2. **Test from Application**
   - Make sure your `.env` file has the correct `MONGODB_URI`
   - Run: `npm run dev`
   - Check the console for: "✅ MongoDB connected successfully"
   - Test the endpoint: `GET http://localhost:3000/api/v1/test/db`

## Environment Configuration

Update your `.env` file (create from `.env.example`):

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/finman

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finman?retryWrites=true&w=majority

# For Development
MONGODB_URI_DEV=mongodb://localhost:27017/finman_dev

# For Testing
MONGODB_URI_TEST=mongodb://localhost:27017/finman_test
```

## Troubleshooting

### MongoDB Service Not Starting (Windows)

```powershell
# Check if service exists
Get-Service -Name MongoDB

# Start the service
net start MongoDB

# If service doesn't exist, install it:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db"
```

### Port Already in Use

If port 27017 is already in use:

1. **Find what's using the port**
   ```powershell
   # Windows
   netstat -ano | findstr :27017
   
   # Linux/Mac
   lsof -i :27017
   ```

2. **Change MongoDB port** (or stop the conflicting service)
   - Edit MongoDB config file
   - Or use a different port: `mongodb://localhost:27018/finman`

### Connection Timeout

- Check firewall settings
- Verify MongoDB is actually running
- Check if IP address is whitelisted (for Atlas)
- Verify connection string is correct

### Authentication Failed

- Verify username and password are correct
- Check database user permissions
- Ensure network access is configured (for Atlas)

## Recommended Setup

- **Development**: Local MongoDB or Docker
- **Testing**: Local MongoDB with separate database
- **Production**: MongoDB Atlas (paid tier)

## Next Steps

Once MongoDB is running:

1. Verify connection: `GET /api/v1/test/db`
2. Test registration: `POST /api/v1/auth/register`
3. Test login: `POST /api/v1/auth/login`

## Useful MongoDB Commands

```javascript
// Connect to MongoDB
mongosh

// List databases
show dbs

// Use database
use finman

// List collections
show collections

// Find users
db.users.find().pretty()

// Clear database (development only!)
db.dropDatabase()
```

## Additional Resources

- MongoDB Official Docs: https://docs.mongodb.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Compass (GUI): https://www.mongodb.com/products/compass

