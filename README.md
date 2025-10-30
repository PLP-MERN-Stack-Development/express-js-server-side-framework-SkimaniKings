# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 


## Endpoints Overview
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/products` | List all products (supports filtering & pagination) |
| GET | `/api/products/:id` | Get a specific product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update an existing product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/products/search?name=keyword` | Search products by name |
| GET | `/api/products/stats` | Get product statistics (count by category) |

## 1. GET `/api/products`
**Description:** List all products with optional filtering by category and pagination.  
**Query Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `category` | string | Filter by category |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
**Example Request:**
```
GET http://localhost:3000/api/products?category=electronics&page=1&limit=2
```
**Example Response:**
```json
{
  "page": 1,
  "total": 2,
  "results": 2,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

## 2. GET `/api/products/:id`
**Description:** Fetch a single product by ID.  
**Example Request:**
```
GET http://localhost:3000/api/products/1
```
**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

## 3. POST `/api/products`
**Description:** Create a new product. Requires authentication using an API key in headers.  
**Headers:**
```
x-api-key: mysecretkey123Simon
```
**Example Request Body:**
```json
{
  "name": "Microwave",
  "description": "Compact kitchen microwave",
  "price": 300,
  "category": "kitchen",
  "inStock": true
}
```
**Example Response:**
```json
{
  "id": "4",
  "name": "Microwave",
  "description": "Compact kitchen microwave",
  "price": 300,
  "category": "kitchen",
  "inStock": true
}
```

## 4. PUT `/api/products/:id`
**Description:** Update an existing product (authenticated).  
**Headers:**
```
x-api-key: mysecretkey123Simon
```
**Example Request:**
```
PUT http://localhost:3000/api/products/1
```
**Example Request Body:**
```json
{
  "price": 1000,
  "inStock": false
}
```
**Example Response:**
```json
{
  "message": "Product updated successfully",
  "updatedProduct": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1000,
    "category": "electronics",
    "inStock": false
  }
}
```

## 5. DELETE `/api/products/:id`
**Description:** Delete a product (authenticated).  
**Headers:**
```
x-api-key: mysecretkey123Simon
```
**Example Request:**
```
DELETE http://localhost:3000/api/products/3
```
**Example Response:**
```json
{
  "message": "Product deleted",
  "deletedProduct": [
    {
      "id": "3",
      "name": "Coffee Maker",
      "description": "Programmable coffee maker with timer",
      "price": 50,
      "category": "kitchen",
      "inStock": false
    }
  ]
}
```

## 6. GET `/api/products/search?name=keyword`
**Description:** Search products by name (case-insensitive).  
**Example Request:**
```
GET http://localhost:3000/api/products/search?name=coffee
```
**Example Response:**
```json
{
  "query": "coffee",
  "total": 1,
  "results": [
    {
      "id": "3",
      "name": "Coffee Maker",
      "description": "Programmable coffee maker with timer",
      "price": 50,
      "category": "kitchen",
      "inStock": false
    }
  ]
}
```

## 7. GET `/api/products/stats`
**Description:** Returns statistics showing product counts by category.  
**Example Request:**
```
GET http://localhost:3000/api/products/stats
```
**Example Response:**
```json
{
  "totalProducts": 3,
  "countByCategory": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

## Error Handling
The API uses a global error handler that returns consistent error responses.  
**Example Response:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

## Authentication
Certain routes (`POST`, `PUT`, `DELETE`) require an API key.  
**Header:**
```
x-api-key: mysecretkey123Simon
```
If the key is missing or invalid:  
```json
{
  "success": false,
  "error": "Unauthorized: Invalid API key"
}
```


