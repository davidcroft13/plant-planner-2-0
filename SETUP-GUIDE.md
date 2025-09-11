# Plant Planner 2.0 - Setup Guide

## Step-by-Step Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized (this can take a few minutes)

### 2. Run the Database Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. **IMPORTANT**: Remove or comment out the sample data section at the bottom (lines 224-229) for now
5. Run the SQL to create all tables and policies

### 3. Create Your First Users
You need to create users through Supabase Auth, not directly in the database. Here are two ways:

#### Option A: Through Supabase Dashboard
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user" and create:
   - **Admin user**: `admin@plantplanner.com` (or your email)
   - **Test user**: `test@plantplanner.com`
3. Set passwords for both users
4. Note down the User IDs that are generated

#### Option B: Through the App (Recommended)
1. Start your development server: `npm run dev`
2. Go to the signup page
3. Create accounts through the app interface
4. The `users` table will be automatically populated via the AuthContext

### 4. Update Sample Data (Optional)
If you want to add sample recipes, you can do this after creating users:

1. Get the user ID from the `users` table:
   ```sql
   SELECT id, email FROM users;
   ```

2. Update the sample recipes with the actual user ID:
   ```sql
   UPDATE recipes SET created_by = 'your-actual-user-id-here' WHERE created_by IS NULL;
   ```

### 5. Set Up Storage Buckets
1. Go to Storage in your Supabase dashboard
2. Create these buckets:
   - `recipe-images` (public)
   - `workout-videos` (public)
   - `course-content` (public)
   - `user-uploads` (private)

### 6. Configure Row Level Security (RLS)
The schema includes basic RLS policies, but you may want to review and adjust them:

1. Go to Authentication > Policies in your Supabase dashboard
2. Review the policies for each table
3. Test that users can only access their own data

### 7. Set Up Environment Variables
Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_INTERCOM_APP_ID=your-intercom-app-id
```

### 8. Test the Setup
1. Start the development server: `npm run dev`
2. Try signing up with a new account
3. Check that the user appears in the `users` table
4. Test the different pages and features

## Common Issues and Solutions

### Issue: "User doesn't exist" error
**Solution**: Create users through Supabase Auth first, not directly in the database.

### Issue: RLS policies blocking access
**Solution**: Check that your RLS policies are correctly configured and that users have the right permissions.

### Issue: Images not loading
**Solution**: Make sure your storage buckets are created and have the right permissions.

### Issue: Authentication not working
**Solution**: Double-check your environment variables and make sure they match your Supabase project.

## Next Steps After Setup

1. **Test Authentication**: Sign up, sign in, sign out
2. **Test Content Creation**: Try creating recipes, meal plans, etc.
3. **Test Admin Features**: Make sure admin users can access the admin portal
4. **Set Up Stripe**: Configure your Stripe account for payments
5. **Set Up Intercom**: Add your Intercom app ID for support

## Need Help?

If you run into any issues:
1. Check the Supabase logs in your dashboard
2. Check the browser console for errors
3. Verify your environment variables are correct
4. Make sure all tables and policies were created successfully
