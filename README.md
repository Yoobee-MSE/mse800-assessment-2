# Car Inventory Management System

Welcome to the Car Inventory Management System, an efficient and user-friendly platform designed to manage car inventories for both administrators and customers. This system provides functionalities for user management, car inventory management, and reporting, all integrated with a robust authentication system and multi-language support.

## Features

* Customer and Administrator roles
* User registration and login
* Car management (CRUD operations)
* Supplier and Warehouse management
* Reporting and Inventory tracking
* Multi-language support (English and Māori)
* Responsive and intuitive UI
* Secure authentication and authorization
* Data validation and error handling
* Comprehensive documentation and usage guide

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

Before you install and run the Car Inventory Management System, ensure you have the following software installed:

* Node.js (version 14 or later)
* npm (version 6 or later) or yarn (version 1.22 or later)
* PostgreSQL (for database)

### Installation

1. Clone the Repository
```bash
git clone https://github.com/Yoobee-MSE/mse800-assessment-2
cd mse800-assessment-2
```

2. Install Required Packages
```bash
npm install
```

3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```
POSTGRES_PRISMA_URL=your_postgresql_database_url
POSTGRES_URL_NON_POOLING=your_nextauth_secret
```

4. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

5. Seed the Database
(Optional) If you have seed data:
```bash
npx prisma db seed
```

6. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Configuration

* The application uses PostgreSQL for data persistence.
* AWS S3 is used for storing images and other files.
* Prisma is used for database ORM.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## File Structure

```
.
├── node_modules
├── prisma
│   └── schema.prisma
├── public
│   └── favicon.ico
├── src
│   ├── app
│   │   ├── api
│   │   ├── dashboard
│   │   ├── inventory
│   │   ├── login
│   │   ├── orders
│   │   ├── register
│   │   ├── supplier
│   │   ├── users
│   │   ├── warehouses
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   ├── configs
│   ├── context
│   ├── database
│   ├── dictionary
│   ├── hoc
│   └── layouts
├── .env
├── .eslintrc.json
├── .gitignore
├── .prettierrc.js
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── yarn.lock
```

## Usage Guide

### User Roles

#### Administrators

Administrators have access to the following features:

1. User Management:
  * View all users
  * Create, update, and delete users
2. Car Management:
  * View, add, update, and delete cars
3. Supplier Management:
  * View, add, update, and delete suppliers
4. Warehouse Management:
  * View, add, update, and delete warehouses
5. Reporting:
  * Generate and view inventory and sales reports

#### Customers

Customers have access to the following features:

1. View available cars
2. Manage their profile
3. Request assistance or support

### Multi-Language Support

The system supports English and Māori. You can switch languages using the language toggle in the user menu.

### Error Handling

The system includes comprehensive data validation and error handling to ensure smooth operation. User-friendly error messages are displayed for any issues encountered.

## Licensing

The Car Inventory Management System is released under the MIT License. See the LICENSE file for full license text.

## Known Issues

* Performance issues with large datasets due to non-optimized queries.
* Potential race conditions when multiple users attempt to modify the same inventory item simultaneously.
* Security vulnerabilities if user inputs are not properly sanitized.

## Credits

Developed by:

* Jose Abril Jr. - Developer
* Guanghong He - Developer
* Kristiana Ladera - Developer

Feel free to contact the developers for any inquiries or support regarding the system.