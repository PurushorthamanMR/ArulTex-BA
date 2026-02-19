# Delta POS Backend - Node.js Version

This is a Node.js/Express.js conversion of the Spring Boot POS (Point of Sale) system.

## Project Structure

```
delta_pos_be_nodejs/
├── config/
│   ├── database.js      # Sequelize database configuration
│   └── logger.js        # Winston logger configuration
├── models/              # Sequelize models (database entities)
├── routes/              # Express routes (converted from Spring controllers)
├── services/            # Business logic services
├── middleware/          # Express middleware (auth, etc.)
├── utils/               # Utility functions
├── server.js            # Main application entry point
├── package.json         # Node.js dependencies
└── .env.example        # Environment variables template
```

## Features

- **RESTful API** - Express.js based REST API
- **JWT Authentication** - Token-based authentication
- **MySQL Database** - Using Sequelize ORM
- **Role-based Authorization** - ADMIN, MANAGER, USER roles
- **Email Service** - Nodemailer for sending emails
- **Logging** - Winston logger for application logs

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

3. **Database Setup**
   - Ensure MySQL database is running
   - Update connection details in `.env`
   - The application will connect to the existing database schema

4. **Run the Application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /user/register` - Register a new user
- `POST /user/login` - Login and get JWT token

### User Management
- `GET /user/getAllPage` - Get paginated users
- `GET /user/getById` - Get user by ID
- `POST /user/update` - Update user details
- `PUT /user/updateStatus` - Update user status
- `PUT /user/updatePassword` - Update user password

### Products
- `POST /product/save` - Create product
- `GET /product/getAll` - Get all products
- `GET /product/getByBarcode` - Get product by barcode
- `POST /product/update` - Update product

### Transactions
- `POST /transaction/save` - Create transaction
- `GET /transaction/getAll` - Get all transactions
- `GET /transaction/getByDateRange` - Get transactions by date range
- `GET /transaction/xReport` - Get X report
- `GET /transaction/zReport` - Get Z report

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Status

This is a conversion in progress. The following modules are fully implemented:
- ✅ User authentication and management
- ✅ Database models (all entities)
- ✅ JWT middleware
- ✅ Basic route structure

Other modules have placeholder routes that return 501 (Not Implemented). These can be implemented following the same pattern as the User module.

## Notes

- The application uses the same database schema as the Spring Boot version
- JWT tokens don't expire (matching original implementation)
- Password hashing uses bcryptjs
- All timestamps are handled in JavaScript Date format

## Development

To add a new service:
1. Create service file in `services/`
2. Create route file in `routes/`
3. Add route to `server.js`
4. Implement business logic following the UserService pattern
