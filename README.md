# solidjs-fe-template 🧊

This is my go-to stack for building admin portals and dashboards. I got tired of setting up the same things over and over so I extracted the patterns that actually worked in production.

## What's in here 🔹

- **SolidJS + Vike** - file-based routing that just works
- **TailwindCSS v4** - styling without the mental overhead
- **TanStack Solid Query** - I always use this for data fetching, caching is a breeze
- **Cognito Auth** - I always use Cognito for auth, it's battle-tested
- **Zod schemas** - I use this for all schema validations, single source of truth
- **API Client** - I usually pair this with a Rust microservices backend

## Getting started 🧿

```bash
bun install
cp .env.example .env
# fill in your env vars
bun dev
```

## Structure 💠

```
├── components/    # your UI components go here
├── context/       # auth, api, query providers (wired up)
├── hooks/         # data fetching patterns
├── lib/           # api client, auth, env validation
├── pages/         # add your routes here
├── schemas/       # zod schemas (single source of truth)
└── styles/        # tailwind entry point
```

## How I use this 🌀

1. Clone or use as template
2. Update `lib/env.ts` with your env vars
3. Update `lib/api-client.ts` with your endpoints
4. Add your schemas in `schemas/`
5. Create hooks in `hooks/` following the pattern
6. Build your pages

The auth flow is ready - just plug in your Cognito pool.

---

Built from patterns I use in production. Feel free to rip it apart.
