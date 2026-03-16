# Deployment Checklist for Security 360

## 1. Build Verification
- [x] Local build (`npm run build`) passed successfully.

## 2. Environment Variables
You must configure the following Environment Variables in your Vercel Project Settings (Settings > Environment Variables):

### Database (PostgreSQL)
- `DATABASE_URL`: Connection string to your cloud PostgreSQL database (e.g., Neon, Supabase, Vercel Postgres).

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key.
- `CLERK_SECRET_KEY`: Your Clerk Secret Key.

### Payments (Stripe)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe Publishable Key.
- `STRIPE_SECRET_KEY`: Stripe Secret Key.
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhooks.

### Services
- `NEXT_PUBLIC_APP_URL`: The URL of your deployed app (e.g., `https://your-project.vercel.app`).
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`: API Key for Google Maps.
- `RESEND_API_KEY`: API Key for Resend (Email service).
- `SENTRY_AUTH_TOKEN`: (Optional) Required if you want to upload source maps to Sentry during build.

## 3. Deployment Steps

### Option A: Vercel CLI (Quickest for manual deploy)
1. Run the following command in your terminal:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts:
   - Log in if requested.
   - Set up and link to a project (default settings are usually fine).
   - **Important:** When asked "Want to modify these settings?", answer **No** unless you have a specific override.
   - When asked to override Environment Variables, you can say **Yes** to paste them in, or configure them in the Vercel Dashboard later (redeployment required).

### Option B: Git Integration (Recommended for CI/CD)
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Import your repository.
4. Add the Environment Variables listed above.
5. Click **Deploy**.

## 4. Post-Deployment
- **Database Migration:** Ensure your production database schema is up to date.
  - You may need to run `npx prisma db push` locally pointing to your PROD `DATABASE_URL`, or configure a build command hook.
  - *Recommendation:* Connect to your production DB locally and run:
    ```bash
    export DATABASE_URL="your_prod_connection_string"
    npx prisma db push
    ```
