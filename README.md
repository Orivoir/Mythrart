# Mythrart

Mythrart is an all-in-one platform for ebook owners and creators.

Our goal is to build the best writing and publishing workspace for the European market, with modern UX, strong collaboration, and multilingual support.

## Product Vision

Mythrart helps authors and ebook businesses manage their full workflow in one place:

- Writing and editing
- Team collaboration
- Translation and multilingual publishing
- Cloud-first usage (no required download)
- Modern rich-text editing powered by a customized TipTap experience

## Core Features (MVP v1)

The current MVP v1 targets the features below:

- **Collaborative workspace** for teams
- **Ebook translation workflows**
- **Online-only platform** (no desktop install required)
- **Rich text editor** with custom TipTap extensions
- **Free trial period** for onboarding and product discovery
- **Freemium account model** to reduce entry friction

## Market Focus

- Primary target: **European authors, publishers, and ebook owners**
- Product principles:
	- Internationalized experience
	- Better compatibility for European user devices and habits
	- Simpler, modern UX for non-technical users

## Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma
- NextAuth

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run the worker server:

```bash
cd worker && npm run dev
```

Run docker services:

```bash
docker compose up -d
```

Run tests:

> Unit tests

```bash
npm test
```

> Integration tests

```bash
npm run test:integration
```

> Worker test

```bash
cd worker && npm run test
```

## Status

Mythrart is currently in **MVP v1** development.
