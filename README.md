This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technical Assignment
Dashboard Application with Upload Functionality.

## Prerequisites

Before you can run this project locally, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/) if you prefer)

## Getting Started

## Steps to Run the Project Locally

1. **Clone the Repository**

   Clone the project from GitHub using the following command in your terminal:

   ```bash
   git clone https://github.com/oussema1990/Technical-Assignmentt

```bash With npm:

cd project-name
npm install
```

```bash With yarn:
cd project-name
yarn install
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Run tests

```bash
npm run test
npx jest -t "login"
```

## Project Structure

src/app/          # Contains the pages of the application
  dashboard/page.tsx     # dashboard page
  dashboard/page.tsx     # login page
  uploads/page.tsx       # uploads page
  locales        # Contains translation files (e.g., en.json)
  locale/en.json # Example translation file for English
/styles         # CSS files
  /globals.css  # Global styles


## explanation of decisions

 A role is randomly assigned to each user

## list users

    email: "oussema_admin@gmail.com", password: "123456", role: "admin"
    email: "oussema_viewer@gmail.com", password: "123456", role: "viewer"
    email: "oussema_uploader@gmail.com", password: "123456", role: "uploader"
