# PrimaDemo Documentation

This directory contains comprehensive Domain-Driven Design (DDD) and Behavior-Driven Development (BDD) documentation for PrimaDemo, built with Docusaurus.

## What's Inside

### DDD Documentation (`/ddd/`)
Complete domain model documentation:
- Domain Overview
- Bounded Contexts
- Ubiquitous Language
- Aggregates & Entities
- Value Objects
- Domain Events
- Use Cases
- Context Map
- Architecture Decisions

### BDD Documentation (`/bdd/`)
Behavior-Driven Development guides and references:
- BDD Overview - Our testing philosophy and approach
- Gherkin Syntax - Complete syntax reference
- Feature Index - All feature files organized by domain
- DDD-BDD Mapping - How domain concepts map to tests

## Development

### Prerequisites

- [Bun](https://bun.sh) installed

### Commands

```bash
# Install dependencies
bun install

# Start development server
bun start

# Build for production
bun run build

# Serve production build
bun run serve
```

## Site Structure

```
docs/
├── ddd/                    # DDD documentation markdown files
├── src/
│   ├── css/               # Custom styles
│   ├── pages/             # Custom pages (homepage)
│   └── components/        # React components
├── static/
│   └── img/               # Static assets (logo, favicon)
├── docusaurus.config.ts   # Docusaurus configuration
├── sidebars.ts            # Sidebar navigation
└── package.json           # Dependencies
```

## Deployment

The site can be deployed to:
- Vercel (recommended with Next.js)
- GitHub Pages
- Netlify
- Any static hosting

To build for production:

```bash
bun run build
```

The built site will be in the `build/` directory.
