# 🍽️ EL Saraya QR Menu System

A complete digital menu solution for restaurants with QR code integration, bilingual support (Arabic/English), and admin panel for menu management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd saraya-qr-menu
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Setup database:**
   ```bash
   npm run db:setup
   ```

4. **Seed with Arabic data:**
   ```bash
   npm run db:seed:arabic
   ```

## 🎯 Starting the Application

We provide multiple ways to start the application:

### Method 1: Complete Startup Script (Recommended)

**For macOS/Linux:**
```bash
npm run start:app
# OR
./start.sh
```

**For Windows:**
```bash
npm run start:app:win
# OR
start.bat
```

This will start:
- ✅ Backend API Server (Port 3001)
- ✅ Frontend Application (Port 3003) 
- ✅ Database Studio (Port 5555)
- ✅ Automatic dependency checking
- ✅ Port cleanup and monitoring

### Method 2: NPM Scripts

**Development mode (with hot reload):**
```bash
npm run start:dev
```

**Production mode (optimized build):**
```bash
npm run build
npm run start:prod
```

**Individual services:**
```bash
# Backend only
npm run start:backend:dev

# Frontend only  
npm run start:frontend:dev

# Database Studio only
npm run start:db
```

## 📱 Access URLs

Once started, access the application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Public Menu** | http://localhost:3003 | Customer-facing QR menu |
| **Admin Panel** | http://localhost:3003/admin | Restaurant management interface |
| **API Backend** | http://localhost:3001 | REST API endpoints |
| **Database Studio** | http://localhost:5555 | Database management GUI |

## 👤 Default Login Credentials

### Admin Account
- **Email:** `admin@saraya.com`
- **Password:** `admin123`

### Manager Account  
- **Email:** `tahasinger@saraya.com`
- **Password:** `01093463235`

## 🏗️ Project Structure

```
saraya-qr-menu/
├── 📁 backend/          # Node.js API server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, CORS, etc.
│   │   ├── routes/     # API endpoints
│   │   ├── scripts/    # Database seeding
│   │   └── server.ts   # Entry point
│   ├── prisma/         # Database schema
│   └── package.json
├── 📁 frontend/         # Next.js application  
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── store/      # State management
│   │   └── lib/        # Utilities
│   └── package.json
├── 📁 shared/           # Shared TypeScript types
├── start.sh            # Unix startup script
├── start.bat           # Windows startup script
└── package.json        # Root workspace config
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `npm run start` | Start production servers |
| `npm run lint` | Run code linting |
| `npm run test` | Run test suites |
| `npm run clean` | Clean all build artifacts |

## 🗃️ Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Generate Prisma client & run migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed with sample data |
| `npm run db:seed:arabic` | Seed with Arabic menu data |
| `npm run db:studio` | Open database GUI |
| `npm run db:reset` | Reset database |

## 🔧 Utility Commands

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies in all workspaces |
| `npm run kill:ports` | Kill processes on ports 3001, 3003, 5555 |
| `npm run clean` | Remove node_modules and build files |

## 🌐 Features

### 🎨 Frontend Features
- **Bilingual Support:** Complete Arabic/English interface
- **Responsive Design:** Mobile-first QR menu experience
- **Admin Panel:** Product and category management
- **Real-time Updates:** Live menu changes
- **Modern UI:** Clean, professional design

### ⚡ Backend Features  
- **RESTful API:** Complete CRUD operations
- **Authentication:** JWT-based admin authentication
- **File Upload:** Image handling for products
- **CORS Support:** Cross-origin requests
- **Input Validation:** Comprehensive request validation

### 🗄️ Database Features
- **Prisma ORM:** Type-safe database access
- **PostgreSQL:** Production-ready database
- **Migrations:** Version-controlled schema changes
- **Seeding:** Arabic product data included

## 🔒 Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/saraya_menu"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGINS="http://localhost:3000,http://localhost:3003"
```

### Frontend (.env.local)  
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill processes on used ports
npm run kill:ports

# Or manually check what's using the port
lsof -i :3001
lsof -i :3003
```

### Database Connection Issues
```bash
# Reset database and reseed
npm run db:reset
npm run db:seed:arabic
```

### Module Not Found Errors
```bash
# Reinstall all dependencies
npm run clean
npm run install:all
```

### Build Failures
```bash
# Clean and rebuild
npm run clean
npm run install:all  
npm run build
```

## 📄 API Documentation

The API provides the following main endpoints:

- `GET /api/v1/categories` - List all categories
- `GET /api/v1/products` - List all products  
- `POST /api/v1/auth/login` - Admin authentication
- `POST /api/v1/products` - Create new product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review terminal output for error messages
3. Ensure all prerequisites are installed
4. Verify database connection settings

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Ready to serve customers with your digital menu!**