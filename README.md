# 🎣 HookedIn

**Get HookedIn.** The fastest way to test LinkedIn webhooks. Spin up endpoints, receive events, validate integrations—all in one place.

## Features

- 🚀 **Instant Webhook Creation** - Generate unique webhook URLs for LinkedIn apps
- 🔒 **Secure Storage** - Client secrets are encrypted before storage
- 📊 **Event Monitoring** - View all incoming events (challenges & notifications)
- ✅ **Auto-Validation** - Automatically responds to LinkedIn challenge requests
- 🔄 **Real-time Updates** - Auto-refresh events every 5 seconds (optional)
- 🗑️ **Auto-Cleanup** - Unused webhooks expire after 30 days
- 📝 **JSON Formatting** - Beautiful display of headers and payloads

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account (for deployment)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hookedin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** > **API**
3. Copy your project URL and anon key
4. Go to **SQL Editor** and run the migration:

```bash
# Copy the SQL from supabase/migrations/001_initial_schema.sql
# and execute it in your Supabase SQL editor
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Encryption Key (generate a random 32-character string)
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Base URL (use localhost for dev, your Vercel URL for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cron Secret (for securing cron endpoints - any random string)
CRON_SECRET=your_random_cron_secret_here
```

**Generate encryption key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ENCRYPTION_KEY`
   - `NEXT_PUBLIC_BASE_URL` (use your Vercel URL: `https://your-app.vercel.app`)
   - `CRON_SECRET`
5. Click **"Deploy"**

### 3. Update Base URL

After deployment, update the `NEXT_PUBLIC_BASE_URL` in Vercel:
1. Go to **Project Settings** > **Environment Variables**
2. Update `NEXT_PUBLIC_BASE_URL` to your deployed URL
3. Redeploy the application

### 4. Verify Cron Job

The cron job is configured in `vercel.json` to run daily at midnight. Verify it's working:
1. Go to your Vercel project dashboard
2. Click on **"Cron Jobs"** tab
3. You should see the cleanup job listed

## Usage

### Creating a Webhook

1. Enter your LinkedIn App **Client ID** and **Client Secret**
2. Optionally specify a custom webhook path (or let it auto-generate)
3. Click **"Create Webhook"**
4. Copy the generated webhook URL

### Configuring LinkedIn

1. Go to your [LinkedIn Developer Application](https://www.linkedin.com/developers/apps)
2. Navigate to **Products** > **Share on LinkedIn** (or relevant product)
3. Go to **Webhooks** section
4. Paste your HookedIn webhook URL
5. Save changes

LinkedIn will send a challenge request to validate the webhook. HookedIn automatically responds to keep your webhook active.

### Viewing Events

1. Enter your **Client ID** in the "View Your Webhooks" section
2. Click **"Retrieve"**
3. Click **"View Events"** on any webhook to see incoming events
4. Enable **"Auto-refresh"** to automatically update events every 5 seconds

### Deleting Webhooks

Click the **"Delete"** button next to any webhook to remove it (this also deletes all associated events).

## How It Works

### Webhook Validation

When LinkedIn sends a challenge request:
1. HookedIn receives the `challenge` parameter
2. Stores it as a "challenge" event
3. Returns the challenge code to LinkedIn
4. LinkedIn marks the webhook as validated

### Event Storage

- Maximum **50 events** per webhook (FIFO - oldest deleted first)
- Events include headers, payload, and timestamp
- Signature verification for all notifications

### Auto-Cleanup

A daily cron job deletes:
- Webhooks not accessed for **30+ days**
- All events associated with expired webhooks

## API Endpoints

### Webhook Management

- `POST /api/webhooks/create` - Create a new webhook
- `GET /api/webhooks/retrieve?clientId={id}` - Get webhooks by client ID
- `DELETE /api/webhooks/delete/[id]` - Delete a webhook

### LinkedIn Webhook Handler

- `POST /api/linkedin-webhook/[path]` - Receive LinkedIn events
- `GET /api/linkedin-webhook/[path]` - Handle GET-based challenges

### Events

- `GET /api/events/[webhookId]` - Get events for a webhook

### Cron

- `GET /api/cron/cleanup` - Daily cleanup job (protected by CRON_SECRET)

## Database Schema

### webhooks
- `id` - UUID primary key
- `client_id` - LinkedIn client ID
- `encrypted_secret` - Encrypted client secret
- `webhook_path` - Unique path segment
- `created_at` - Creation timestamp
- `last_accessed_at` - Last retrieval timestamp

### events
- `id` - UUID primary key
- `webhook_id` - Foreign key to webhooks
- `event_type` - 'challenge' or 'notification'
- `headers` - JSON of request headers
- `payload` - JSON of request body
- `received_at` - Event timestamp

## Security Features

- ✅ Client secrets encrypted with AES-256
- ✅ LinkedIn signature verification
- ✅ Cron endpoint protected with secret
- ✅ No authentication required (public tool)
- ✅ Automatic cleanup of old data

## Limitations

- Maximum **3 webhooks** per client ID
- Maximum **50 events** per webhook
- Webhooks expire after **30 days** of inactivity
- Public access (no user authentication)

## Troubleshooting

### Events not appearing?
- Check that auto-refresh is enabled
- Click the manual refresh button
- Verify the webhook URL is correctly configured in LinkedIn

### Webhook creation fails?
- Ensure client ID and secret are correct
- Check that you haven't reached the 3 webhook limit
- Try a different custom path if it's already taken

### Challenge validation fails?
- Check Supabase logs for errors
- Verify the webhook URL is publicly accessible
- Ensure no firewall is blocking LinkedIn's IP ranges

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for the LinkedIn developer community
