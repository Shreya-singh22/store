# Multi-Tenant Store Architecture

## Overview

This application uses a multi-tenant architecture with subdomain-based store routing. The same codebase serves multiple stores based on the subdomain in the URL.

## Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     INCOMING REQUEST                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │  Is it localhost/127.0.0.1?        │
              └───────────────────────────────────┘
                     │                    │
                    YES                   NO
                     │                    │
                     ▼                    ▼
           ┌─────────────────┐   ┌─────────────────┐
           │ Use env var      │   │ Is *.evoclabs.com?│
           │ NEXT_PUBLIC_SUB │   └─────────────────┘
           │ DOMAIN          │          │            │
           └─────────────────┘         YES           NO
                                        │            │
                                        ▼            ▼
                              ┌─────────────────┐  /store-error
                              │ Call API        │
                              │ Validate store  │
                              │ Render          │
                              └─────────────────┘
```

## Environment Behavior

| Environment | URL Pattern | Store Source | Validation |
|-------------|-------------|--------------|------------|
| **Local Dev** | `localhost:*` or `127.0.0.1:*` | `NEXT_PUBLIC_SUBDOMAIN` env var | None |
| **Production** | `*.evoclabs.com` | Extracted from URL subdomain | API call to validate store exists |
| **Production** | Any other domain | ❌ | ❌ Redirect to `/store-error` |

## Local Development

During local development, the app uses the `NEXT_PUBLIC_SUBDOMAIN` environment variable to determine which store to load.

```bash
# .env file
NEXT_PUBLIC_SUBDOMAIN=moonstruck
```

This allows developers to test with a specific store's data without needing a subdomain setup locally.

## Production Deployment

In production, the subdomain is extracted from the URL and validated against the API.

```
URL: somename.evoclabs.com
         │
         ▼
    Extract subdomain "somename"
         │
         ▼
    API Call: /storefront/public/somename/frontend
         │
         ├── Store exists? → Render store
         │
         └── Store not found? → Redirect to /store-error
```

## Key Files

| File | Purpose |
|------|---------|
| `src/proxy.ts` | Middleware that validates subdomains and routes requests |
| `src/lib/config.ts` | Configuration functions for subdomain detection |
| `src/lib/api.ts` | API functions for fetching store data |

## Backend for Frontend (BFF) Pattern

This app follows the BFF pattern where:

1. **Single API Call**: The frontend makes one call to `fetchStorefront()` which returns all necessary data
2. **Aggregated Data**: Store info, products, categories, customization, announcements, and legal pages are all included in one response
3. **Subdomain-Based**: The API call includes the subdomain to fetch store-specific data

```typescript
// Example: fetchStorefront() returns:
{
  store: { id, name, subdomain, ... },
  products: [...],
  categories: [...],
  customization: { brandColors, typography, ... },
  announcements: [...],
  legalPages: [...],
  settings: { currency, contactEmail, ... }
}
```

## Security

- Only `*.evoclabs.com` subdomains are validated via API in production
- Invalid domains (not localhost, not evoclabs subdomain) are redirected to `/store-error`
- No unnecessary API calls are made for invalid domains