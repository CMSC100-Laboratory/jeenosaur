## Project Features

### Customer Features
- Customer account registration and login
- Role-based customer navigation for products, cart, and orders
- Product catalog showing available crops and poultry items
- Product search by name or description
- Product sorting by name, price, stock quantity, or category
- Stock indicators for available, low-stock, and out-of-stock products
- Add-to-cart functionality with persistent MongoDB cart storage
- Cart page with item list, quantity display, subtotal, delivery fee, and total price
- Customer order history page for viewing previous transactions and order statuses

### Administrator Features
- Default administrator account is automatically created on backend startup
- Admin dashboard for managing products and users
- Add, edit, and delete product listings
- Product fields include name, description, type, quantity, and price
- Product categorization for crops and poultry
- View registered users and remove non-admin customer accounts
- Dashboard summary cards for total products, registered users, low-stock items, and inventory value
- Order management page for reviewing pending, confirmed, cancelled, or all orders
- Admin order confirmation that updates order status and deducts inventory stock
- Admin order disapproval/cancellation for pending transactions
- Sales report page with weekly, monthly, and annual reporting periods
- Sales breakdown by product, category, quantity sold, revenue, and sales share

### Backend/API Features
- Node.js and Express backend server
- MongoDB database connection using Mongoose
- User, product, cart, and order data models
- Public authentication routes for sign-up and login
- Admin-protected routes for user management, product management, order fulfillment, and sales reports
- Customer-protected routes for cart management and order history
- Product API supports retrieving all products, retrieving one product by ID, sorting, adding, updating, and deleting
- Cart API supports adding items, retrieving cart details, removing items, and updating item quantity
- Order API supports creating orders, cancelling pending orders, confirming orders, disapproving orders, andgenerating sales reports
- CORS headers configured for frontend-backend communication

### User Interface Features
- React frontend built with Vite
- Separate interfaces for customers and administrators
- Local session persistence using `localStorage`
- Time-based visual themes for morning, noon, sunset, and night
- Branded AniWay farm-to-table interface
- Responsive product grid and dashboard-style admin pages

---

## Usage Guidelines

### Administrator Workflow
1. Launch the application and log in using the default admin credentials: `admin@da.gov.ph` / `admin123`.
2. Navigate to the **Product Listings** to populate the store with crops and poultry items. Set the initial stock quantities.
3. Once customers place orders, go to **Order Fulfillment** to review pending transactions. Confirming an order will finalize it and permanently deduct the items from the active inventory.
4. Check the **Sales Reports** tab to monitor overall revenue and item performance.

### Customer Workflow
1. Click on **Sign Up** to create a new customer account.
2. Log in with your new credentials to access the marketplace.
3. Browse the catalog and use the "Add to Cart" functionality for desired items. 
4. Open the shopping cart to review your total price.
5. Click "Checkout" to place your Cash-on-Delivery order.
6. You can cancel your order from the "My Orders" tab as long as the DA administrator has not yet confirmed it.

---

## How to Run Locally

### Prerequisites
Ensure you have the following installed on your machine:
* [Node.js]
* [MongoDB] (Ensure the MongoDB service is running locally on port `27017`)

### 1. Database Setup
The backend is configured to automatically connect to `mongodb://localhost:27017/FARM-TO-TABLE`. Ensure your local MongoDB compass or service is active. The database and the default Admin account will be generated automatically upon starting the server.

### 2. Start the Backend Server
Open a terminal and navigate to the backend directory of the project.
```bash
# Install backend dependencies
npm install

# Start the Express server
node index.js
```

### 3. Start the Frontend Client
Open a second, separate terminal window and navigate to the frontend directory.
```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

