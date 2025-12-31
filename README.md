#  PHP Technical Test - Symfony E-Commerce App (Symfony + React)

A full-stack e-commerce application featuring a Symfony 7 REST API backend and a React frontend integrated via Vite. This project demonstrates the use of Natural/Business Keys (e.g., user_code, cod_product) to ensure data integrity and system robustness independently of database auto-incremental IDs.

## Prerequisites
Ensure you have the following installed:

PHP 8.2 or higher

Composer

Node.js (v18+) & npm

Symfony CLI (optional but recommended)

MySQL or MariaDB

## Installation & Setup

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
##  Quick Start

1. **Build and Start:**
   ```bash
      docker-compose up -d hiberus
   ```
2. **run vite from visual studio code terminal backend/:**   
    ```bash
   npm run dev
   ```

**Environment Variables:** Create or edit your .env.local file and configure your database connection:
```bash
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0"
```
## Project Architecture

- src/Entity/: Domain objects (User, Product, Order) mapping database tables to PHP.
- src/Controller/Api/: REST API Endpoints for products, orders, and payments.
- assets/js/: React components and state management logic.
- src/DataFixtures/: Scripts for consistent database seeding.


## License

[MIT](https://choosealicense.com/licenses/mit/)
