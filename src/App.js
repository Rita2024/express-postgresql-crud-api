const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Express PostgreSQL API", version: "3.0.0" }
  },
  apis: ['./src/routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public route
app.use('/auth', authRouter);

// Protected routes
app.use('/users', authMiddleware, usersRouter);

app.use(errorHandler);

module.exports = app;