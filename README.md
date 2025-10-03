# Test Project: CMS – Content Management System

Goal
Build a mini-CMS where users can create blog articles. The app should support:

- CRUD operations for articles
- A Table List View to manage articles
- A Text Editor to create and update articles
- - While in the Editor Page, articles should be arranged in a tree structure (e.g., parent
    category → child articles) for navigation.

## Production demo link

https://cms-platform-with-remix.vercel.app

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### .env setup

```bash
DATABASE_URL=XXXXXXXXXX
DIRECT_URL=XXXXXXXXX
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```
