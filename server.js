// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  console.log('Requested ID:', req.params.id);
  console.log('Available products:', products.map(p => p.id));

  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: (products.length + 1).toString(),
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(index, 1);
  res.json({ message: 'Product deleted', deletedProduct });
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Task 3: Middleware Implementation
//Create a custom logger middleware that logs the request method, URL, and timestamp
const logger = (req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};
app.use(logger);

//Implement a middleware to parse JSON request bodies
app.use(express.json());

//Create an authentication middleware that checks for an API key in the request headers
const authenticate = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validKey = 'mysecretkey123Simon'; 

  if (apiKey !== validKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
  next();
};

//Add validation middleware for the product creation and update routes

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return res.status(400).json({ message: 'All fields are required: name, description, price, category, inStock' });
  }

  if (typeof price !== 'number' || typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'Invalid data types for price or inStock' });
  }

  next(); 
};

//Task 4: Error Handling 
//Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Invalid input data') {
    super(message, 400);
  }
}
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
});
// Add proper error responses with appropriate HTTP status codes

// GET product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST new product
app.post('/api/products', auth, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: (products.length + 1).toString(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    next(err);
  }
});

// PUT (update)
app.put('/api/products/:id', auth, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    products[index] = { ...products[index], ...req.body };
    res.json({ message: 'Product updated successfully', product: products[index] });
  } catch (err) {
    next(err);
  }
});

// DELETE (remove)
app.delete('/api/products/:id', auth, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted successfully', deleted });
  } catch (err) {
    next(err);
  }
});


// Handle asynchronous errors using try/catch blocks or a wrapper function

function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return next(new ValidationError('All fields (name, description, price, category, inStock) are required'));
  }

  if (typeof price !== 'number') {
    return next(new ValidationError('Price must be a number'));
  }

  if (typeof inStock !== 'boolean') {
    return next(new ValidationError('inStock must be a boolean (true/false)'));
  }

  next();
}

//Task 5
// Implement filtering and pagination for GET /api/products
app.get('/api/products', (req, res, next) => {
  try {
    let { category, page = 1, limit = 5 } = req.query;
    let results = products;

    // Filter by category
    if (category) {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedResults = results.slice(startIndex, endIndex);

    res.json({
      totalProducts: results.length,
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      products: paginatedResults
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?name=keyword - Search products by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a search term (name)' });
  }

  const results = products.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({
    query: name,
    total: results.length,
    results
  });
});


// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', (req, res) => {
  const stats = {};

  products.forEach(product => {
    const category = product.category.toLowerCase();
    if (!stats[category]) {
      stats[category] = 1;
    } else {
      stats[category]++;
    }
  });

  res.json({
    totalProducts: products.length,
    countByCategory: stats
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 