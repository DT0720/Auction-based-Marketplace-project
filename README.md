## README

## Setup Instructions
Follow these steps to get the development environment up and running:

1. Clone the Repository
Clone this repository to your local machine using Git:

```bash
git clone https://github.com/<your-username>/<your-repository-name>.git
```

2. Install Dependencies
Navigate to the project directory and run the following command to install the necessary dependencies:

```bash
cd <your-repository-name>
npm install
```


3. Set up the Database
To sync the Prisma schema with your database, run:

```bash 
npx prisma db pull
```

4. Generate Prisma Client
Generate the Prisma client by running:

```bash
npx prisma generate
```

5. Run the Development Server
Start the development server with:

```bash
npm run dev
```

6. Access the Application
After running the development server, open your browser and go to:

```bash
http://localhost:3000
```

7. Deployed Version
The deployed version of the application is available at:

```bash
https://sundarban-marketplace-n2k9.vercel.app/login
```


Important 

Ensure you have Node.js installed on your system.
If you face any issues with Prisma or the database, check the Prisma Documentation for troubleshooting.
