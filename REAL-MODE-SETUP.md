# Real Mode Setup Guide

## ✅ **What's Been Implemented**

### **1. Removed Demo Mode**
- ✅ **Real Supabase authentication** - No more demo accounts
- ✅ **7-day trial system** - New users get 7 days free
- ✅ **Trial expiration handling** - Users lose access after trial
- ✅ **Stripe integration** - Real payment processing

### **2. Trial Management System**
- ✅ **Trial warning** - Shows days remaining in trial
- ✅ **Trial expired modal** - Blocks access when trial ends
- ✅ **Automatic trial setup** - 7 days from signup
- ✅ **Subscription upgrade** - Direct integration with Stripe

## 🔧 **Setup Steps**

### **1. Environment Variables**
Make sure your `.env.local` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### **2. Database Migration**
Run this SQL in your Supabase SQL editor:
```sql
-- Add trial_ends_at column to users table
ALTER TABLE public.users 
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have trial_ends_at set to 7 days from creation
UPDATE public.users 
SET trial_ends_at = created_at + INTERVAL '7 days'
WHERE subscription_status = 'trial' AND trial_ends_at IS NULL;
```

### **3. Start Backend Server**
```bash
cd backend
npm install
npm run dev
```

### **4. Test the Flow**
1. **Sign up** - User gets 7-day trial
2. **Use app** - Trial warning shows days remaining
3. **Trial expires** - Modal blocks access, prompts for payment
4. **Subscribe** - User can choose from 3 plans

## 🎯 **User Experience**

### **New User Flow:**
1. **Sign Up** → Account created with 7-day trial
2. **Trial Warning** → Shows "X days left" warning
3. **Trial Expires** → Modal blocks access, shows subscription options
4. **Subscribe** → Choose plan, redirect to Stripe Checkout
5. **Active Subscription** → Full access to app

### **Trial Management:**
- **Days 1-5:** Blue warning banner
- **Days 6-7:** Yellow warning banner  
- **Day 8+:** Red modal blocking access

### **Subscription Plans:**
- **Monthly:** $10.00/month
- **Quarterly:** $25.00/3 months (Popular)
- **Yearly:** $80.00/year

## 🚀 **Production Deployment**

### **1. Update API URLs**
Change `http://localhost:3001` to your production backend URL in:
- `src/api/stripe.ts`

### **2. Set Up Stripe Webhooks**
1. Go to Stripe Dashboard → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### **3. Environment Variables for Backend**
```env
PORT=3001
FRONTEND_URL=https://yourdomain.com
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## ✅ **Current Status**
**Real mode is fully functional!** 

- ✅ No more demo accounts
- ✅ 7-day trial system working
- ✅ Stripe integration ready
- ✅ Trial expiration handling
- ✅ Subscription management

Your app is now ready for real users with proper trial management! 🎉
