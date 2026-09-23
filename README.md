# Student Records CRUD

Full-stack CRUD application using:

- Next.js (App Router)
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- React Hook Form + Zod validation
- shadcn-style UI component structure
- Vercel-ready deployment flow

## Student fields

- id
- student number
- first name
- last name
- middle name
- age
- address
- grade level

## Windows 11 prerequisites

Install these on Windows 11 before running the project:

- Node.js 20.x or later (LTS recommended)
- npm 10.x or later (included with Node.js)
- PostgreSQL 15.x or later (Server + Command Line Tools)
- Git for Windows (optional, for cloning/version control)
- PowerShell 7+ or Windows PowerShell 5.1

During PostgreSQL installation on Windows:

- Remember the password you set for the postgres superuser.
- Keep default port 5432 unless you need a custom port.
- Ensure Command Line Tools are selected so psql is installed.

If psql is not recognized in terminal, add PostgreSQL bin to PATH and reopen terminal.
Typical path:

- C:\\Program Files\\PostgreSQL\\15\\bin

## PostgreSQL setup on Windows 11

1. Open SQL Shell (psql) from Start Menu, or run this in PowerShell/cmd:

```powershell
psql -U postgres -h localhost -p 5432
```

2. Create an application user with username and password:

```sql
CREATE ROLE student_app_user WITH LOGIN PASSWORD 'StrongPassword123!';
```

3. Create the database and assign ownership to that user:

```sql
CREATE DATABASE student_crud OWNER student_app_user;
```

4. Grant privileges (recommended):

```sql
GRANT ALL PRIVILEGES ON DATABASE student_crud TO student_app_user;
```

5. Exit psql:

```sql
\q
```

6. Add this to .env:

```env
DATABASE_URL="postgresql://student_app_user:StrongPassword123!@localhost:5432/student_crud?schema=public"
```

If your password contains special characters like @, :, /, or #, URL-encode them.
Example: @ becomes %40

```env
DATABASE_URL="postgresql://student_app_user:StrongPassword%40123!@localhost:5432/student_crud?schema=public"
```

## Local setup

1. Open PowerShell in the project folder and install dependencies

```powershell
npm install
```

2. Create environment file (PowerShell)

```powershell
Copy-Item .env.example .env
```

Or in Command Prompt (cmd):

```cmd
copy .env.example .env
```

3. Put your PostgreSQL connection string in .env

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_crud?schema=public"
```

4. Create migration and generate Prisma client

```powershell
npm run prisma:migrate -- --name init
npm run prisma:generate
```

5. Run the app

```powershell
npm run dev
```

Open http://localhost:3000

## Available scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run prisma:migrate
- npm run prisma:generate
- npm run prisma:studio
