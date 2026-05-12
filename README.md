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

