# CI/CD Setup Guide for Vercel Deployment

This project supports CI/CD deployment to Vercel via **GitHub Actions**, **GitLab CI**, and **Bitbucket Pipelines**.

## Prerequisites

1. A Vercel account with the project already linked
2. Vercel CLI installed locally (`pnpm add -g vercel`)
3. Run `vercel link` to connect your local project to Vercel

## Required Secrets & Variables

All variables are **prefixed by environment** (`STAGING_*` or `PRODUCTION_*`) to avoid needing separate environment configurations.

### Obtaining Vercel Credentials

1. **VERCEL_TOKEN**: Generate from [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)
2. **VERCEL_ORG_ID**: Found in `.vercel/project.json` after running `vercel link`
3. **VERCEL_PROJECT_ID**: Found in `.vercel/project.json` after running `vercel link`

---

## GitHub Actions Setup

### Secrets (Settings > Secrets and variables > Actions > Secrets)

| Secret Name | Description |
|-------------|-------------|
| `STAGING_VERCEL_TOKEN` | Vercel API token for staging |
| `STAGING_VERCEL_ORG_ID` | Vercel Org ID for staging |
| `STAGING_VERCEL_PROJECT_ID` | Vercel Project ID for staging |
| `PRODUCTION_VERCEL_TOKEN` | Vercel API token for production |
| `PRODUCTION_VERCEL_ORG_ID` | Vercel Org ID for production |
| `PRODUCTION_VERCEL_PROJECT_ID` | Vercel Project ID for production |

### Variables (Settings > Secrets and variables > Actions > Variables)

| Variable Name | Description | Example |
|---------------|-------------|--------|
| `STAGING_NEXT_PUBLIC_API_URL` | API endpoint for staging | `https://staging-api.example.com` |
| `PRODUCTION_NEXT_PUBLIC_API_URL` | API endpoint for production | `https://api.example.com` |

---

## GitLab CI Setup

### CI/CD Variables (Settings > CI/CD > Variables)

| Variable Name | Protected | Masked |
|---------------|-----------|--------|
| `STAGING_VERCEL_TOKEN` | ❌ | ✅ |
| `STAGING_VERCEL_ORG_ID` | ❌ | ❌ |
| `STAGING_VERCEL_PROJECT_ID` | ❌ | ❌ |
| `STAGING_NEXT_PUBLIC_API_URL` | ❌ | ❌ |
| `PRODUCTION_VERCEL_TOKEN` | ✅ | ✅ |
| `PRODUCTION_VERCEL_ORG_ID` | ✅ | ❌ |
| `PRODUCTION_VERCEL_PROJECT_ID` | ✅ | ❌ |
| `PRODUCTION_NEXT_PUBLIC_API_URL` | ✅ | ❌ |

---

## Bitbucket Pipelines Setup

### Repository Variables (Repository settings > Pipelines > Repository variables)

| Variable Name | Secured |
|---------------|--------|
| `STAGING_VERCEL_TOKEN` | ✅ |
| `STAGING_VERCEL_ORG_ID` | ❌ |
| `STAGING_VERCEL_PROJECT_ID` | ❌ |
| `STAGING_NEXT_PUBLIC_API_URL` | ❌ |
| `PRODUCTION_VERCEL_TOKEN` | ✅ |
| `PRODUCTION_VERCEL_ORG_ID` | ❌ |
| `PRODUCTION_VERCEL_PROJECT_ID` | ❌ |
| `PRODUCTION_NEXT_PUBLIC_API_URL` | ❌ |

---

## Pipeline Triggers

| Trigger | GitHub | GitLab | Bitbucket |
|---------|--------|--------|-----------|
| Push to `dev` | Staging deploy | Staging deploy | Staging deploy |
| Push to `main` | Production deploy | Production deploy | Production deploy |

---

## Environment Variables Management

### Naming Convention

All CI/CD variables use environment prefixes:

| Environment | Prefix | Branch |
|-------------|--------|--------|
| Staging | `STAGING_` | `dev` |
| Production | `PRODUCTION_` | `main` |

### Quick Start

1. Copy `.env.example` to `.env.local` for local development
2. Set prefixed CI/CD variables in your platform's settings
3. Set server-side secrets in Vercel Dashboard

### Adding a New Variable

#### Step 1: Update `.env.example`

```bash
# Add for both environments
STAGING_NEXT_PUBLIC_MY_NEW_VAR=
PRODUCTION_NEXT_PUBLIC_MY_NEW_VAR=
```

#### Step 2: Add to CI/CD Platform

Add both `STAGING_*` and `PRODUCTION_*` versions in your platform settings.

#### Step 3: Update CI/CD Config

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
# In deploy-staging job
env:
  NEXT_PUBLIC_MY_NEW_VAR: ${{ vars.STAGING_NEXT_PUBLIC_MY_NEW_VAR }}

# In deploy-production job
env:
  NEXT_PUBLIC_MY_NEW_VAR: ${{ vars.PRODUCTION_NEXT_PUBLIC_MY_NEW_VAR }}
```

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
# In deploy-staging job
variables:
  NEXT_PUBLIC_MY_NEW_VAR: $STAGING_NEXT_PUBLIC_MY_NEW_VAR

# In deploy-production job
variables:
  NEXT_PUBLIC_MY_NEW_VAR: $PRODUCTION_NEXT_PUBLIC_MY_NEW_VAR
```

**Bitbucket** (`bitbucket-pipelines.yml`):
```yaml
# In deploy-staging step
- export NEXT_PUBLIC_MY_NEW_VAR=$STAGING_NEXT_PUBLIC_MY_NEW_VAR

# In deploy-production step
- export NEXT_PUBLIC_MY_NEW_VAR=$PRODUCTION_NEXT_PUBLIC_MY_NEW_VAR
```

#### Step 4: For Server-side Secrets

Go to **Vercel Dashboard > Project > Settings > Environment Variables** and add:
- `DATABASE_URL`
- `API_SECRET_KEY`
- etc.

---

## Troubleshooting

### Common Issues

1. **"VERCEL_ORG_ID is not set"**
   - Ensure secrets are properly configured in your repository settings

2. **"Project not found"**
   - Run `vercel link` locally and verify `VERCEL_PROJECT_ID` matches

3. **Build fails with missing env vars**
   - Check that all `NEXT_PUBLIC_*` variables are defined in both CI/CD config and platform settings

4. **Deployment succeeds but app doesn't work**
   - Server-side env vars must be set in Vercel project settings, not CI/CD

### Debugging

Add this step to debug environment variables (remove in production):
```yaml
- name: Debug env
  run: env | grep -E "VERCEL|NEXT_PUBLIC" | sed 's/=.*/=***/'
```
