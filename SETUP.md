# Tutuca MVP Setup Guide

## 1. Supabase Setup

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project**:
   - Project name: `tutuca-mvp`
   - Database password: Choose a strong password
   - Region: Choose closest to your users

3. **Get your credentials**:
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon public` key

4. **Set up environment variables**:
   Create/update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 2. Database Setup

1. **Go to SQL Editor** in your Supabase dashboard
2. **Run the schema**:
   - Copy the contents of `supabase-schema.sql`
   - Paste and run in the SQL editor

## 3. Create Test Users

After setting up Supabase, you can create test users:

```bash
# Install dependencies (if not already done)
npm install

# Create the "marca" user
node scripts/create-user.js
```

This will create:
- **Email**: marca@tutuca.co
- **Password**: marca123
- **Type**: Brand user
- **Name**: Marca

## 4. Test the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit** http://localhost:3000

3. **Login** with the created user:
   - Email: marca@tutuca.co
   - Password: marca123

## 5. Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Deploy on Vercel**:
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

## Database Tables Created

- **profiles**: User profiles with brand/influencer info
- **campaigns**: Marketing campaigns created by brands
- **applications**: Applications from influencers to campaigns

## Security Features

- Row Level Security (RLS) enabled
- Users can only access their own data
- Automatic profile creation on signup
- Secure authentication with Supabase Auth
