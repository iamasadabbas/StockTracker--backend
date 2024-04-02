# University Store Inventory Management System

This is the backend of the admin panel for the University Store Inventory Management System. It is designed to manage the inventory of a university store, keeping track of stock levels, purchases, sales, and other relevant information.

## Contributors

- [Asad Abbas](mailto:khanasad92332@gmail.com)
- [Muneeb Ahmed](mailto:muneebabbasi026@gmail.com)
- [Muhammad Khalil](mailto:iammalikkhalil@outlook.com)

## Features

- User authentication and authorization for secure access.
- CRUD (Create, Read, Update, Delete) operations for managing products, categories, suppliers, etc.
- Track inventory levels, purchases, sales, and restocking.
- Generate reports for sales, inventory levels, and more.
- Intuitive and easy-to-use admin panel.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens) for authentication
- Mongoose for MongoDB object modeling
- Other dependencies can be found in the `package.json` file.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iamasadabbas/university-store-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd university-store-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and configure environment variables like database connection URI, JWT secret, etc.

5. Run the application:

   ```bash
   npm start
   ```

6. Access the admin panel:

   Open your web browser and navigate to `http://localhost:3000` (or the port specified in your environment variables) to access the admin panel.

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).