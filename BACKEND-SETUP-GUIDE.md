# Backend API Setup Guide

## ✅ **What's Been Created**

### **Backend Structure:**
```
backend/
├── package.json              # Dependencies
├── server.js                 # Main server file
├── env.example              # Environment variables template
└── api/
    └── routes/
        ├── stripe.js        # Stripe API endpoints
        └── webhooks.js      # Stripe webhook handlers
```

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Environment Variables**
Create a `.env` file in the `backend` folder with:

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### **3. Get Your Stripe Price IDs**

From your Stripe dashboard:
1. Go to **Products** → Select each product
2. Copy the **Price ID** (starts with `price_`)
3. Update the `priceId` values in `src/pages/SignupPage.tsx`:

```typescript
const pricingPlans = [
  {
    id: 'monthly',
    name: 'Monthly Subscription',
    price: '$10.00',
    period: 'month',
    features: ['Access to all recipes', 'Meal planning tools', 'Grocery list generator', 'Basic support'],
    priceId: 'price_1234567890' // Replace with your actual Monthly price ID
  },
  {
    id: 'quarterly',
    name: 'Quarterly Subscription',
    price: '$25.00',
    period: '3 months',
    features: ['Everything in Monthly', 'Advanced meal planning', 'Nutrition tracking', 'Priority support'],
    priceId: 'price_0987654321', // Replace with your actual Quarterly price ID
    popular: true
  },
  {
    id: 'yearly',
    name: 'Yearly Subscription',
    price: '$80.00',
    period: 'year',
    features: ['Everything in Quarterly', 'Premium features', '1-on-1 consultation', 'Early access to new features'],
    priceId: 'price_1122334455' // Replace with your actual Yearly price ID
  }
]
```

### **4. Start the Backend Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### **5. Update Frontend API Calls**

Update `src/api/stripe.ts` to use your backend:

```typescript
// Change from mock API to real backend
const response = await fetch('http://localhost:3001/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId,
    userId,
  }),
})
```

## 🔗 **Stripe Webhook Setup**

### **1. Create Webhook Endpoint**
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://yourdomain.com/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### **2. Get Webhook Secret**
1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add it to your backend `.env` file

## 📱 **API Endpoints**

### **Stripe Endpoints:**
- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/stripe/create-portal-session` - Create customer portal
- `GET /api/stripe/subscription-status` - Get subscription status

### **Webhook Endpoints:**
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## 🚀 **Deployment**

### **For Production:**
1. **Deploy backend** to a service like:
   - Railway
   - Render
   - Heroku
   - DigitalOcean

2. **Update webhook URL** in Stripe dashboard to your production URL

3. **Update frontend** to use production API URL

## ✅ **What You Need to Provide:**

1. **Supabase Service Role Key** (not the anon key)
2. **Stripe Secret Key** (starts with `sk_`)
3. **Stripe Price IDs** for your 3 products
4. **Webhook Secret** (after creating webhook)

The backend is ready to handle all your Stripe payments and webhooks! 🎉
